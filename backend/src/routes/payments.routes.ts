import { Router } from "express";
import crypto from "node:crypto";
import { prisma } from "../db.js";
import { razorpay } from "../config/razorpay.js";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { sendMail, emailTemplates } from "../config/mailer.js";

const r = Router();

r.post("/create-order", requireAuth, async (req: AuthedRequest, res) => {
  const { courseId, courseSlug } = req.body;
  // Accept either numeric id or slug (frontend uses slug from static catalog).
  const course = courseSlug
    ? await prisma.course.findUnique({ where: { slug: String(courseSlug) } })
    : Number.isFinite(Number(courseId))
      ? await prisma.course.findUnique({ where: { id: Number(courseId) } })
      : await prisma.course.findUnique({ where: { slug: String(courseId) } });
  if (!course) return res.status(404).json({ error: "Course not found" });

  const amountPaise = course.price * 100;
  const rzp = await razorpay.orders.create({ amount: amountPaise, currency: "INR", receipt: `c${course.id}u${req.user!.id}` });
  const order = await prisma.order.create({
    data: { userId: req.user!.id, courseId: course.id, amount: course.price, razorpayOrderId: rzp.id, status: "created" },
  });
  // Response shape matches startPayment() contract used by the frontend:
  // { order: { id, amount, currency }, keyId }
  res.json({
    order: { id: rzp.id, amount: amountPaise, currency: "INR" },
    keyId: process.env.RAZORPAY_KEY_ID,
    // legacy fields kept for backwards-compat with any older caller
    orderId: order.id,
    razorpayOrderId: rzp.id,
    amount: amountPaise,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

r.post("/verify", requireAuth, async (req: AuthedRequest, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ error: "Invalid signature" });

  const order = await prisma.order.findUnique({ where: { razorpayOrderId: razorpay_order_id }, include: { course: true } });
  if (!order) return res.status(404).json({ error: "Order not found" });

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: "paid" } }),
    prisma.payment.create({
      data: { orderId: order.id, userId: order.userId, razorpayPaymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id, razorpaySignature: razorpay_signature, amount: order.amount, status: "paid" },
    }),
  ]);

  const user = await prisma.user.findUnique({ where: { id: order.userId } });
  if (user && order.course) {
    const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
    await sendMail({
      to: user.email,
      subject: `Receipt — ${order.course.title}`,
      template: "course_receipt",
      html: emailTemplates.receipt({
        customerName: user.name,
        itemKind: "course",
        itemTitle: order.course.title,
        amount: order.amount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
        accessUrl: site ? `${site}/courses/${order.course.slug}` : null,
        accessLabel: "Start learning",
        accessNote: "All course recordings and live sessions are now unlocked on your dashboard.",
      }),
    }).catch(() => {});
  }
  res.json({ ok: true });
});

// Public webhook (configure in Razorpay dashboard)
r.post("/webhook", async (req, res) => {
  const sig = req.headers["x-razorpay-signature"] as string;
  // Raw body is delivered as a Buffer (see server.ts express.raw mount).
  // We must HMAC the exact bytes Razorpay signed, not a re-stringified object.
  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");
  if (
    !sig ||
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Parse the verified payload and reconcile order/payment state in MySQL.
  let payload: any;
  try {
    payload = JSON.parse(raw.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const event: string = payload?.event ?? "";
  const paymentEntity = payload?.payload?.payment?.entity;
  const orderEntity = payload?.payload?.order?.entity;
  const rzpOrderId: string | undefined =
    paymentEntity?.order_id ?? orderEntity?.id;

  if (!rzpOrderId) {
    // Nothing actionable — acknowledge so Razorpay stops retrying.
    return res.json({ ok: true, ignored: true });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: rzpOrderId },
    include: { course: true, payment: true },
  });
  if (!order) return res.json({ ok: true, ignored: "unknown order" });

  try {
    if (event === "payment.captured" || event === "order.paid") {
      const paymentId: string = paymentEntity?.id ?? `wh_${rzpOrderId}`;
      const amount: number = Math.round(
        (paymentEntity?.amount ?? orderEntity?.amount_paid ?? order.amount * 100) / 100,
      );
      const signature: string =
        (req.headers["x-razorpay-signature"] as string) || "webhook";

      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "paid" },
        }),
        prisma.payment.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            userId: order.userId,
            razorpayPaymentId: paymentId,
            razorpayOrderId: rzpOrderId,
            razorpaySignature: signature,
            amount,
            status: "paid",
          },
          update: {
            razorpayPaymentId: paymentId,
            status: "paid",
            amount,
          },
        }),
      ]);

      // Fire enrollment email once (only if payment was not already recorded).
      if (!order.payment) {
        const user = await prisma.user.findUnique({ where: { id: order.userId } });
        if (user && order.course) {
          const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
          await sendMail({
            to: user.email,
            subject: `Receipt — ${order.course.title}`,
            template: "course_receipt",
            html: emailTemplates.receipt({
              customerName: user.name,
              itemKind: "course",
              itemTitle: order.course.title,
              amount,
              razorpayOrderId: rzpOrderId,
              razorpayPaymentId: paymentId,
              paidAt: new Date(),
              accessUrl: site ? `${site}/courses/${order.course.slug}` : null,
              accessLabel: "Start learning",
              accessNote: "All course recordings and live sessions are now unlocked on your dashboard.",
            }),
          }).catch(() => {});
        }
      }
    } else if (event === "payment.failed") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "failed" },
      });
      const user = await prisma.user.findUnique({ where: { id: order.userId } });
      if (user && order.course) {
        const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
        await sendMail({
          to: user.email,
          subject: `Payment failed — ${order.course.title}`,
          template: "course_payment_failed",
          html: emailTemplates.paymentFailed({
            customerName: user.name,
            itemKind: "course",
            itemTitle: order.course.title,
            amount: order.amount,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: paymentEntity?.id ?? null,
            reason: paymentEntity?.error_description || paymentEntity?.error_reason || null,
            retryUrl: site ? `${site}/courses/${order.course.slug}` : null,
          }),
        }).catch(() => {});
      }
    } else if (event === "refund.created" || event === "refund.processed") {
      const refund = payload?.payload?.refund?.entity;
      if (refund) {
        const refundedRupees = Math.round(Number(refund.amount ?? 0) / 100);
        const isFull = refundedRupees >= order.amount;
        await prisma.order.update({
          where: { id: order.id },
          data: { status: isFull ? "refunded" : "partially_refunded" },
        });
        const user = await prisma.user.findUnique({ where: { id: order.userId } });
        if (user && order.course) {
          await sendMail({
            to: user.email,
            subject: `Refund ${refund.status === "processed" ? "processed" : "initiated"} — ${order.course.title}`,
            template: "course_refund",
            html: emailTemplates.refund({
              customerName: user.name,
              itemKind: "course",
              itemTitle: order.course.title,
              amount: refundedRupees,
              originalAmount: order.amount,
              razorpayOrderId: rzpOrderId,
              razorpayPaymentId: refund.payment_id || paymentEntity?.id || "",
              refundId: refund.id,
              status: refund.status,
              speed: refund.speed_processed || refund.speed_requested || null,
              accessRevoked: isFull,
            }),
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error("[razorpay webhook] reconcile error", err);
    // Still 200 so Razorpay does not retry indefinitely for a persistent app bug.
  }

  res.json({ ok: true, event, orderId: order.id });
});

export default r;
