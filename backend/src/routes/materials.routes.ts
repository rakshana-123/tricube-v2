import { Router } from "express";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { prisma } from "../db.js";
import { razorpay } from "../config/razorpay.js";
import { sendMail, emailTemplates } from "../config/mailer.js";
import { uploadMaterial } from "../config/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
const adminOnly = [requireAuth, requireRole("admin", "super_admin")] as const;

const DOWNLOAD_SECRET =
  process.env.MATERIAL_DOWNLOAD_SECRET ||
  process.env.JWT_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  "dev-material-secret";

export function signToken(payload: { slug: string; kind: "pdf" | "preview"; email: string; exp: number }) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", DOWNLOAD_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}
function verifyToken(token: string): { slug: string; kind: "pdf" | "preview"; email: string; exp: number } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", DOWNLOAD_SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

// ---------- Order event timeline helpers ----------

type OrderEvent = { at: string; type: string; message?: string; data?: any };

function parseEvents(raw?: string | null): OrderEvent[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

async function logOrderEvent(
  identifier: { id?: number; razorpayOrderId?: string },
  type: string,
  message?: string,
  data?: any,
) {
  try {
    const where: any = identifier.id ? { id: identifier.id } : { razorpayOrderId: identifier.razorpayOrderId };
    const order = await (prisma as any).materialOrder.findUnique({ where });
    if (!order) return;
    const events = parseEvents(order.eventsLog);
    events.push({ at: new Date().toISOString(), type, message, data });
    await (prisma as any).materialOrder.update({
      where: { id: order.id },
      data: { eventsLog: JSON.stringify(events).slice(0, 60_000) },
    });
  } catch (e) {
    console.error("[materials] logOrderEvent", e);
  }
}

// ---------- Public catalog ----------

// GET /api/materials?category=&q=
r.get("/", async (req, res) => {
  const category = (req.query.category as string) || undefined;
  const q = ((req.query.q as string) || "").trim();
  const where: any = { active: true };
  if (category && category !== "all") where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }
  const materials = await (prisma as any).material.findMany({
    where,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
  res.json({ materials });
});

// GET /api/materials/:slug — must precede the /:slug/preview + /download etc.
r.get("/detail/:slug", async (req, res) => {
  const m = await (prisma as any).material.findUnique({ where: { slug: req.params.slug } });
  if (!m || !m.active) return res.status(404).json({ error: "Not found" });
  res.json({ material: m });
});

// GET /api/materials/preview/:slug — public free-sample stream (no payment)
r.get("/preview/:slug", async (req, res) => {
  const m = await (prisma as any).material.findUnique({ where: { slug: req.params.slug } });
  if (!m || !m.active || !m.previewUrl) return res.status(404).json({ error: "No preview available" });
  const rel = m.previewUrl.replace(/^\/+/, "");
  const abs = path.resolve(process.cwd(), rel.startsWith("uploads/") ? rel : path.join("uploads", rel));
  if (!fs.existsSync(abs)) return res.status(404).json({ error: "Preview file missing" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${m.slug}-preview.pdf"`);
  fs.createReadStream(abs).pipe(res);
});

// ---------- Bundles (public) ----------
r.get("/bundles", async (_req, res) => {
  const bundles = await (prisma as any).bundle.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    include: { items: { include: { material: true } } },
  });
  res.json({ bundles });
});
r.get("/bundles/:slug", async (req, res) => {
  const b = await (prisma as any).bundle.findUnique({
    where: { slug: req.params.slug },
    include: { items: { include: { material: true } } },
  });
  if (!b || !b.active) return res.status(404).json({ error: "Not found" });
  res.json({ bundle: b });
});

// ---------- Admin: materials ----------

r.get("/admin/all", ...adminOnly, async (_req, res) => {
  const materials = await (prisma as any).material.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
  res.json({ materials });
});

function parseMaterialBody(body: any, files?: Record<string, Express.Multer.File[]>) {
  const bool = (v: any, d: boolean) =>
    v === undefined || v === null || v === "" ? d : v === true || v === "true" || v === "1";
  const num = (v: any, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.join("|")
    : typeof body.highlights === "string" ? body.highlights : "";
  const data: any = {
    slug: body.slug?.toString().trim(),
    title: body.title?.toString().trim(),
    description: body.description?.toString() ?? "",
    longDescription: body.longDescription?.toString() || null,
    category: body.category?.toString() || "General",
    pages: num(body.pages, 0),
    price: num(body.price, 0),
    rating: num(body.rating, 4.9),
    highlights,
    active: bool(body.active, true),
    featured: bool(body.featured, false),
  };
  const cover = files?.cover?.[0];
  const pdf = files?.pdf?.[0];
  const preview = files?.preview?.[0];
  if (cover) data.coverUrl = `/uploads/materials/cover/${path.basename(cover.filename)}`;
  if (pdf) data.pdfUrl = `/uploads/materials/pdf/${path.basename(pdf.filename)}`;
  if (preview) data.previewUrl = `/uploads/materials/preview/${path.basename(preview.filename)}`;
  return data;
}

const materialUpload = uploadMaterial.fields([
  { name: "cover", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
  { name: "preview", maxCount: 1 },
]);

r.post("/admin/materials", ...adminOnly, materialUpload, async (req, res) => {
  const data = parseMaterialBody(req.body, req.files as any);
  if (!data.slug || !data.title) return res.status(400).json({ error: "slug and title required" });
  const exists = await (prisma as any).material.findUnique({ where: { slug: data.slug } });
  if (exists) return res.status(409).json({ error: "Slug already exists" });
  const material = await (prisma as any).material.create({ data });
  res.json({ material });
});

r.patch("/admin/materials/:id", ...adminOnly, materialUpload, async (req, res) => {
  const id = Number(req.params.id);
  const data = parseMaterialBody(req.body, req.files as any);
  const patch: any = {};
  const files = req.files as any;
  for (const k of Object.keys(data)) {
    if (req.body[k] !== undefined) patch[k] = data[k];
  }
  if (files?.cover) patch.coverUrl = data.coverUrl;
  if (files?.pdf) patch.pdfUrl = data.pdfUrl;
  if (files?.preview) patch.previewUrl = data.previewUrl;
  const material = await (prisma as any).material.update({ where: { id }, data: patch });
  res.json({ material });
});

r.patch("/admin/materials/:id/toggle", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const cur = await (prisma as any).material.findUnique({ where: { id } });
  if (!cur) return res.status(404).json({ error: "Not found" });
  const material = await (prisma as any).material.update({ where: { id }, data: { active: !cur.active } });
  res.json({ material });
});

r.delete("/admin/materials/:id", ...adminOnly, async (req, res) => {
  await (prisma as any).material.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ---------- Admin: bundles ----------

r.get("/admin/bundles/all", ...adminOnly, async (_req, res) => {
  const bundles = await (prisma as any).bundle.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    include: { items: { include: { material: true } } },
  });
  res.json({ bundles });
});

function parseBundleBody(body: any, file?: Express.Multer.File) {
  const bool = (v: any, d: boolean) =>
    v === undefined || v === null || v === "" ? d : v === true || v === "true" || v === "1";
  const num = (v: any, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const data: any = {
    slug: body.slug?.toString().trim(),
    title: body.title?.toString().trim(),
    description: body.description?.toString() || null,
    price: num(body.price, 0),
    active: bool(body.active, true),
    featured: bool(body.featured, false),
  };
  if (file) data.coverUrl = `/uploads/materials/cover/${path.basename(file.filename)}`;
  let materialIds: number[] = [];
  if (body.materialIds) {
    try {
      const parsed = typeof body.materialIds === "string" ? JSON.parse(body.materialIds) : body.materialIds;
      if (Array.isArray(parsed)) materialIds = parsed.map((x: any) => Number(x)).filter(Number.isFinite);
    } catch {}
  }
  return { data, materialIds };
}

r.post("/admin/bundles", ...adminOnly, uploadMaterial.single("cover"), async (req, res) => {
  const { data, materialIds } = parseBundleBody(req.body, req.file);
  if (!data.slug || !data.title) return res.status(400).json({ error: "slug and title required" });
  if (materialIds.length < 2) return res.status(400).json({ error: "Bundle needs at least 2 materials" });
  const exists = await (prisma as any).bundle.findUnique({ where: { slug: data.slug } });
  if (exists) return res.status(409).json({ error: "Slug already exists" });
  const bundle = await (prisma as any).bundle.create({
    data: { ...data, items: { create: materialIds.map((materialId) => ({ materialId })) } },
    include: { items: { include: { material: true } } },
  });
  res.json({ bundle });
});

r.patch("/admin/bundles/:id", ...adminOnly, uploadMaterial.single("cover"), async (req, res) => {
  const id = Number(req.params.id);
  const { data, materialIds } = parseBundleBody(req.body, req.file);
  const patch: any = {};
  for (const k of Object.keys(data)) {
    if (req.body[k] !== undefined) patch[k] = data[k];
  }
  if (req.file) patch.coverUrl = data.coverUrl;
  if (req.body.materialIds !== undefined) {
    await (prisma as any).bundleItem.deleteMany({ where: { bundleId: id } });
    if (materialIds.length) {
      await (prisma as any).bundleItem.createMany({
        data: materialIds.map((materialId) => ({ bundleId: id, materialId })),
      });
    }
  }
  const bundle = await (prisma as any).bundle.update({
    where: { id },
    data: patch,
    include: { items: { include: { material: true } } },
  });
  res.json({ bundle });
});

r.patch("/admin/bundles/:id/toggle", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const cur = await (prisma as any).bundle.findUnique({ where: { id } });
  if (!cur) return res.status(404).json({ error: "Not found" });
  const bundle = await (prisma as any).bundle.update({ where: { id }, data: { active: !cur.active } });
  res.json({ bundle });
});

r.delete("/admin/bundles/:id", ...adminOnly, async (req, res) => {
  await (prisma as any).bundle.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ---------- Payment: create order (material OR bundle) ----------

r.post("/create-order", async (req, res) => {
  const { materialId, bundleId, email } = req.body || {};
  if (!email || typeof email !== "string") return res.status(400).json({ error: "Email required" });

  let kind: "material" | "bundle";
  let slug: string;
  let price: number;
  let title: string;

  if (bundleId) {
    const b = await (prisma as any).bundle.findUnique({ where: { slug: String(bundleId) } });
    if (!b || !b.active) return res.status(404).json({ error: "Bundle not found" });
    kind = "bundle"; slug = b.slug; price = b.price; title = b.title;
  } else if (materialId) {
    const m = await (prisma as any).material.findUnique({ where: { slug: String(materialId) } });
    if (!m || !m.active) return res.status(404).json({ error: "Material not found" });
    kind = "material"; slug = m.slug; price = m.price; title = m.title;
  } else {
    return res.status(400).json({ error: "materialId or bundleId required" });
  }

  const rzp = await razorpay.orders.create({
    amount: price * 100,
    currency: "INR",
    receipt: `${kind}_${slug}_${Date.now()}`.slice(0, 40),
    notes: { kind, slug, email, title },
  });

  try {
    const created = await (prisma as any).materialOrder.create({
      data: { kind, slug, email, amount: price, currency: "INR", status: "created", razorpayOrderId: rzp.id },
    });
    await logOrderEvent({ id: created.id }, "order.created", `Razorpay order ${rzp.id} created for ${title}`, { amount: price, kind, slug });
  } catch (e) { console.error("[materials] persist order", e); }

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    keyId: process.env.RAZORPAY_KEY_ID,
    order: { id: rzp.id, amount: rzp.amount, currency: rzp.currency },
  });
});

// ---------- Payment: verify ----------

r.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, materialId, bundleId } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment fields" });
  }
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const sigOk = expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  if (!sigOk) return res.status(400).json({ error: "Invalid signature" });

  const order = await (prisma as any).materialOrder.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
  if (!order) return res.status(404).json({ error: "Order not found" });
  const requestedSlug = bundleId || materialId;
  if (requestedSlug && order.slug !== requestedSlug) return res.status(400).json({ error: "Order mismatch" });
  if (order.status === "failed") {
    await logOrderEvent({ id: order.id }, "verify.failed", "Client verify called but order marked failed");
    return res.status(400).json({ error: "Payment failed" });
  }
  if (order.status !== "paid") {
    await logOrderEvent({ id: order.id }, "verify.pending", "Signature OK, awaiting webhook to mark paid");
    return res.status(202).json({ pending: true });
  }

  const buyerEmail = order.email || "";
  const mkUrl = (slug: string) => {
    const token = signToken({ slug, kind: "pdf", email: buyerEmail, exp: Date.now() + 24 * 60 * 60 * 1000 });
    return `/api/materials/download/${encodeURIComponent(slug)}?token=${token}`;
  };

  if (order.kind === "bundle") {
    const b = await (prisma as any).bundle.findUnique({
      where: { slug: order.slug },
      include: { items: { include: { material: true } } },
    });
    if (!b) return res.status(404).json({ error: "Bundle not found" });
    const downloads = b.items.map((it: any) => ({ slug: it.material.slug, title: it.material.title, url: mkUrl(it.material.slug) }));
    await (prisma as any).materialOrder.update({ where: { id: order.id }, data: { downloadTokenIssuedAt: new Date() } });
    await logOrderEvent({ id: order.id }, "download.issued", `Signed 24h URLs issued for ${downloads.length} bundle items`);
    return res.json({ ok: true, kind: "bundle", downloads });
  }
  await (prisma as any).materialOrder.update({ where: { id: order.id }, data: { downloadTokenIssuedAt: new Date() } });
  await logOrderEvent({ id: order.id }, "download.issued", "Signed 24h download URL issued");
  return res.json({ ok: true, kind: "material", downloadUrl: mkUrl(order.slug) });
});

// ---------- Razorpay webhook ----------

r.post("/webhook", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ error: "Webhook secret not configured" });
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const raw: Buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  if (!signature) return res.status(400).json({ error: "Missing signature" });
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }
  let evt: any;
  try { evt = JSON.parse(raw.toString("utf8")); } catch { return res.status(400).json({ error: "Invalid JSON" }); }

  const eventId = (evt?.id as string) || (req.headers["x-razorpay-event-id"] as string) || "";
  const eventType = evt?.event as string;
  const payment = evt?.payload?.payment?.entity;
  const orderEntity = evt?.payload?.order?.entity;
  const razorpayOrderId = payment?.order_id || orderEntity?.id;
  if (!razorpayOrderId) return res.json({ ok: true, ignored: true });

  const dbOrder = await (prisma as any).materialOrder.findUnique({ where: { razorpayOrderId } });
  if (!dbOrder) return res.json({ ok: true, ignored: "unknown order" });
  if (eventId && dbOrder.webhookEventId === eventId) {
    await logOrderEvent({ id: dbOrder.id }, "webhook.duplicate", `Duplicate webhook ${eventId} ignored`);
    return res.json({ ok: true, duplicate: true });
  }

  // Amount check from DB (source of truth)
  let expectedPaise = 0;
  let title = dbOrder.slug;
  if (dbOrder.kind === "bundle") {
    const b = await (prisma as any).bundle.findUnique({ where: { slug: dbOrder.slug } });
    if (b) { expectedPaise = b.price * 100; title = b.title; }
  } else {
    const m = await (prisma as any).material.findUnique({ where: { slug: dbOrder.slug } });
    if (m) { expectedPaise = m.price * 100; title = m.title; }
  }

  if ((eventType === "payment.captured" || eventType === "order.paid") &&
      payment && payment.status === "captured" && expectedPaise > 0 && Number(payment.amount) === expectedPaise) {
    const alreadyPaid = dbOrder.status === "paid";
    await (prisma as any).materialOrder.update({
      where: { id: dbOrder.id },
      data: {
        status: "paid",
        razorpayPaymentId: payment.id,
        webhookEventId: eventId || dbOrder.webhookEventId,
        paidAt: dbOrder.paidAt ?? new Date(),
      },
    });
    await logOrderEvent(
      { id: dbOrder.id },
      "webhook.paid",
      `Marked paid via ${eventType} (payment ${payment.id}, ${Number(payment.amount) / 100} ${payment.currency || "INR"})`,
      { eventId },
    );
    if (!alreadyPaid && dbOrder.email) {
      const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
      const isBundle = dbOrder.kind === "bundle";
      const accessUrl = site
        ? `${site}/${isBundle ? "bundles" : "materials"}/${dbOrder.slug}`
        : null;
      sendMail({
        to: dbOrder.email,
        subject: `Receipt — ${title}`,
        template: isBundle ? "bundle_receipt" : "material_receipt",
        html: emailTemplates.receipt({
          itemKind: isBundle ? "bundle" : "material",
          itemTitle: title,
          amount: dbOrder.amount,
          razorpayOrderId: dbOrder.razorpayOrderId,
          razorpayPaymentId: payment.id,
          paidAt: new Date(),
          accessUrl,
          accessLabel: isBundle ? "Download your bundle" : "Download your PDF",
          accessNote:
            "Your download link is unlocked on the product page and in “My materials”. Signed links expire — reopen the page any time to fetch a fresh one.",
        }),
      })
        .then(() => logOrderEvent({ id: dbOrder.id }, "email.sent", `Purchase email sent to ${dbOrder.email}`))
        .catch((err) => logOrderEvent({ id: dbOrder.id }, "email.failed", String(err?.message || err)));
    }
    return res.json({ ok: true });
  }

  if (eventType === "payment.failed") {
    await (prisma as any).materialOrder.update({
      where: { id: dbOrder.id },
      data: {
        status: "failed",
        razorpayPaymentId: payment?.id ?? dbOrder.razorpayPaymentId,
        webhookEventId: eventId || dbOrder.webhookEventId,
      },
    });
    await logOrderEvent({ id: dbOrder.id }, "webhook.failed", `payment.failed for ${payment?.id || "?"} — ${payment?.error_description || "no reason"}`);
    if (dbOrder.email) {
      const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
      const isBundle = dbOrder.kind === "bundle";
      const retryUrl = site ? `${site}/${isBundle ? "bundles" : "materials"}/${dbOrder.slug}` : null;
      sendMail({
        to: dbOrder.email,
        subject: `Payment failed — ${title}`,
        template: isBundle ? "bundle_payment_failed" : "material_payment_failed",
        html: emailTemplates.paymentFailed({
          itemKind: isBundle ? "bundle" : "material",
          itemTitle: title,
          amount: dbOrder.amount,
          razorpayOrderId: dbOrder.razorpayOrderId,
          razorpayPaymentId: payment?.id ?? null,
          reason: payment?.error_description || payment?.error_reason || null,
          retryUrl,
        }),
      })
        .then(() => logOrderEvent({ id: dbOrder.id }, "email.sent", `Failure email sent to ${dbOrder.email}`))
        .catch((err) => logOrderEvent({ id: dbOrder.id }, "email.failed", String(err?.message || err)));
    }
    return res.json({ ok: true });
  }

  if (eventType === "refund.created" || eventType === "refund.processed") {
    const refund = evt?.payload?.refund?.entity;
    if (refund) {
      const refundedRupees = Math.round(Number(refund.amount ?? 0) / 100);
      const isFull = refundedRupees >= dbOrder.amount;
      await (prisma as any).materialOrder.update({
        where: { id: dbOrder.id },
        data: {
          status: isFull ? "refunded" : "partially_refunded",
          webhookEventId: eventId || dbOrder.webhookEventId,
        },
      });
      await logOrderEvent(
        { id: dbOrder.id },
        isFull ? "webhook.refunded" : "webhook.refunded.partial",
        `${eventType} — ₹${refundedRupees} refunded (refund ${refund.id})`,
      );
      if (dbOrder.email) {
        const isBundle = dbOrder.kind === "bundle";
        sendMail({
          to: dbOrder.email,
          subject: `Refund ${refund.status === "processed" ? "processed" : "initiated"} — ${title}`,
          template: isBundle ? "bundle_refund" : "material_refund",
          html: emailTemplates.refund({
            itemKind: isBundle ? "bundle" : "material",
            itemTitle: title,
            amount: refundedRupees,
            originalAmount: dbOrder.amount,
            razorpayOrderId: dbOrder.razorpayOrderId,
            razorpayPaymentId: refund.payment_id || payment?.id || dbOrder.razorpayPaymentId || "",
            refundId: refund.id,
            status: refund.status,
            speed: refund.speed_processed || refund.speed_requested || null,
            accessRevoked: isFull,
          }),
        })
          .then(() => logOrderEvent({ id: dbOrder.id }, "email.sent", `Refund email sent to ${dbOrder.email}`))
          .catch((err) => logOrderEvent({ id: dbOrder.id }, "email.failed", String(err?.message || err)));
      }
    }
    return res.json({ ok: true });
  }

  await logOrderEvent({ id: dbOrder.id }, "webhook.ignored", `Unhandled event ${eventType}`);
  return res.json({ ok: true, ignored: eventType });
});

// ---------- Signed PDF download ----------

r.get("/download/:slug", async (req, res) => {
  const token = (req.query.token as string) || "";
  const payload = verifyToken(token);
  if (!payload || payload.slug !== req.params.slug) {
    return res.status(403).json({ error: "Invalid or expired download link" });
  }
  // Re-check that this buyer still has an ACTIVE paid order for this slug
  // (or a paid bundle containing it). Prevents access after refund/failure
  // even if the signed token has not yet expired.
  const paidDirect = await (prisma as any).materialOrder.findFirst({
    where: { email: payload.email, status: "paid", kind: "material", slug: req.params.slug },
  });
  let authorised = !!paidDirect;
  if (!authorised) {
    const paidBundles = await (prisma as any).materialOrder.findMany({
      where: { email: payload.email, status: "paid", kind: "bundle" },
      select: { slug: true },
    });
    if (paidBundles.length) {
      const bundles = await (prisma as any).bundle.findMany({
        where: { slug: { in: paidBundles.map((b: any) => b.slug) } },
        include: { items: { include: { material: true } } },
      });
      authorised = bundles.some((b: any) =>
        b.items.some((it: any) => it.material.slug === req.params.slug),
      );
    }
  }
  if (!authorised) {
    return res.status(403).json({ error: "No active paid order for this material" });
  }
  const m = await (prisma as any).material.findUnique({ where: { slug: req.params.slug } });
  if (!m || !m.pdfUrl) return res.status(404).json({ error: "PDF not uploaded yet" });
  const rel = m.pdfUrl.replace(/^\/+/, "");
  const abs = path.resolve(process.cwd(), rel.startsWith("uploads/") ? rel : path.join("uploads", rel));
  if (!fs.existsSync(abs)) return res.status(404).json({ error: "PDF file missing on server" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${m.slug}.pdf"`);
  fs.createReadStream(abs).pipe(res);
  // Best-effort: log download event on the most recent paid order for this buyer/slug.
  (async () => {
    try {
      const target = await (prisma as any).materialOrder.findFirst({
        where: { email: payload.email, status: "paid", OR: [{ slug: req.params.slug }, { kind: "bundle" }] },
        orderBy: { paidAt: "desc" },
      });
      if (target) await logOrderEvent({ id: target.id }, "download.streamed", `PDF ${req.params.slug} streamed to ${payload.email}`);
    } catch {}
  })();
});

// ---------- Admin: order timeline ----------

r.get("/admin/orders", ...adminOnly, async (req, res) => {
  const q = ((req.query.q as string) || "").trim();
  const status = (req.query.status as string) || "";
  const where: any = {};
  if (status && ["created", "paid", "failed", "refunded"].includes(status)) where.status = status;
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { slug: { contains: q } },
      { razorpayOrderId: { contains: q } },
      { razorpayPaymentId: { contains: q } },
    ];
  }
  const orders = await (prisma as any).materialOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const shaped = orders.map((o: any) => ({
    id: o.id,
    kind: o.kind,
    slug: o.slug,
    email: o.email,
    amount: o.amount,
    currency: o.currency,
    status: o.status,
    razorpayOrderId: o.razorpayOrderId,
    razorpayPaymentId: o.razorpayPaymentId,
    webhookEventId: o.webhookEventId,
    paidAt: o.paidAt,
    downloadTokenIssuedAt: o.downloadTokenIssuedAt,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    events: parseEvents(o.eventsLog),
  }));
  res.json({ orders: shaped });
});

export default r;
