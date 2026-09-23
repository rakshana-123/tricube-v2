import { Router } from "express";
import { z } from "zod";
import crypto from "node:crypto";
import path from "node:path";
import { prisma } from "../db.js";
import { razorpay } from "../config/razorpay.js";
import { upload } from "../config/upload.js";
import { sendMail, emailTemplates } from "../config/mailer.js";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth.js";

const r = Router();

// Service catalogue (kept in sync with frontend src/lib/site-data.ts SERVICES).
// Amounts are in INR (whole rupees); Razorpay expects paise, so we * 100 when creating orders.
const SERVICE_CATALOG: Record<string, { title: string; amount: number }> = {
  "python-training":    { title: "Python Training",             amount: 7999 },
  "sql-training":       { title: "SQL & Databases",             amount: 4999 },
  "java-fullstack":     { title: "Java Full Stack",             amount: 17999 },
  "mern-stack":         { title: "MERN Stack",                  amount: 16999 },
  "django":             { title: "Django Web Dev",              amount: 9999 },
  "powerbi":            { title: "Power BI",                    amount: 6999 },
  "tableau":            { title: "Tableau",                     amount: 6999 },
  "ai-prompt":          { title: "AI & Prompt Engineering",     amount: 8999 },
  "data-science":       { title: "Data Science",                amount: 19999 },
  "internship":         { title: "Internship Program",          amount: 2999 },
  "final-year-projects":{ title: "Final Year Projects",         amount: 4999 },
  "web-dev":            { title: "Website Development",         amount: 14999 },
  "mobile-dev":         { title: "Mobile App Development",      amount: 24999 },
  "iot-projects":       { title: "IoT Projects",                amount: 7999 },
  "resume-writing":     { title: "Resume Writing",              amount: 999 },
  "resume-review":      { title: "Resume Review by Expert",     amount: 99 },
  "resume-revision":    { title: "Resume Revision",             amount: 799 },
  "portfolio-linkedin": { title: "Portfolio & LinkedIn Setup",  amount: 1799 },
  "placement-training": { title: "Placement Training",          amount: 4999 },
  "soft-skills":        { title: "Soft Skills",                 amount: 2999 },
  "digital-marketing":  { title: "Digital Marketing",           amount: 9999 },
  "custom-request":     { title: "Custom Request",              amount: 999 },
};

/**
 * POST /service-requests/order
 * Creates a Razorpay order for the requested service — user pays FIRST, then submits details.
 */
r.post("/order", async (req, res, next) => {
  try {
    const { serviceSlug } = z.object({ serviceSlug: z.string() }).parse(req.body);
    // Prefer DB row (admin-managed price). Fall back to the hardcoded catalog
    // for legacy slugs that haven't been migrated yet.
    const db = await prisma.service.findUnique({ where: { slug: serviceSlug } });
    const svc =
      db && db.active
        ? { title: db.title, amount: db.offerPrice || db.price }
        : SERVICE_CATALOG[serviceSlug];
    if (!svc) return res.status(404).json({ error: "Unknown service" });

    const order = await razorpay.orders.create({
      amount: svc.amount * 100,
      currency: "INR",
      receipt: `svc_${serviceSlug}_${Date.now()}`,
      notes: { serviceSlug, serviceTitle: svc.title },
    });
    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (e) { next(e); }
});

/**
 * POST /service-requests
 * Called from the Razorpay `handler` after successful payment.
 * Multipart form: fields + optional file. Verifies signature before persisting.
 */
r.post("/", upload.single("file"), async (req: AuthedRequest, res, next) => {
  try {
    const body = z.object({
      serviceSlug: z.string(),
      name: z.string().min(2).max(120),
      email: z.string().email(),
      phone: z.string().max(32).optional().default(""),
      targetRole: z.string().max(200).optional().default(""),
      notes: z.string().max(3000).optional().default(""),
      razorpayOrderId: z.string(),
      razorpayPaymentId: z.string(),
      razorpaySignature: z.string(),
    }).parse(req.body);

    const db = await prisma.service.findUnique({ where: { slug: body.serviceSlug } });
    const svc =
      db && db.active
        ? { title: db.title, amount: db.offerPrice || db.price }
        : SERVICE_CATALOG[body.serviceSlug];
    if (!svc) return res.status(404).json({ error: "Unknown service" });

    // Verify Razorpay signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
      .digest("hex");
    if (expected !== body.razorpaySignature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const fileUrl = req.file ? `/uploads/${path.basename(req.file.filename)}` : null;

    const request = await prisma.serviceRequest.create({
      data: {
        userId: req.user?.id,
        serviceSlug: body.serviceSlug,
        serviceTitle: svc.title,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        targetRole: body.targetRole || null,
        notes: body.notes || null,
        fileUrl,
        amount: svc.amount,
        status: "paid",
        razorpayOrderId: body.razorpayOrderId,
        razorpayPaymentId: body.razorpayPaymentId,
        razorpaySignature: body.razorpaySignature,
      },
    });

    // Confirmation email — best-effort, don't fail the API on mail issues.
    sendMail({
      to: body.email,
      subject: `Request received — ${svc.title}`,
      template: "serviceRequestReceived",
      html: emailTemplates.serviceRequestReceived(svc.title, svc.amount),
    }).catch(() => {});

    // Notify admin so they can review and email the deliverable back.
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (adminEmail) {
      sendMail({
        to: adminEmail,
        subject: `[New paid request] ${svc.title} — ${body.name}`,
        template: "serviceRequestAdmin",
        html: emailTemplates.serviceRequestAdmin({
          serviceTitle: svc.title,
          amount: svc.amount,
          name: body.name,
          email: body.email,
          phone: body.phone || "",
          targetRole: body.targetRole || "",
          notes: body.notes || "",
          fileUrl: fileUrl ? `${process.env.PUBLIC_BASE_URL || ""}${fileUrl}` : null,
          paymentId: body.razorpayPaymentId,
          requestId: request.id,
        }),
      }).catch(() => {});
    }

    res.json({ ok: true, id: request.id });
  } catch (e) { next(e); }
});

/**
 * GET /service-requests/mine
 * Authenticated user's own requests.
 */
r.get("/mine", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.serviceRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

/**
 * GET /service-requests/admin
 * Admin: list all requests.
 */
r.get("/admin", requireAuth, requireRole("admin", "super_admin"), async (_req, res) => {
  const items = await prisma.serviceRequest.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ items });
});

/**
 * PATCH /service-requests/admin/:id
 * Admin: update status / adminNote / attach a delivery file URL.
 * When status transitions to `delivered`, emails the requester.
 */
r.patch("/admin/:id", requireAuth, requireRole("admin", "super_admin"), upload.single("deliveryFile"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = z.object({
      status: z.enum(["pending", "paid", "in_review", "delivered", "cancelled"]).optional(),
      adminNote: z.string().max(3000).optional(),
      deliveryFileUrl: z.string().url().optional(),
    }).parse(req.body);

    const uploadedUrl = (req as any).file ? `/uploads/${path.basename((req as any).file.filename)}` : undefined;

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status: body.status,
        adminNote: body.adminNote,
        deliveryFileUrl: uploadedUrl ?? body.deliveryFileUrl,
      },
    });

    if (body.status === "delivered") {
      sendMail({
        to: updated.email,
        subject: `Your ${updated.serviceTitle} is ready`,
        template: "serviceDelivered",
        html: emailTemplates.serviceDelivered(
          updated.serviceTitle,
          updated.adminNote || "",
          updated.deliveryFileUrl || undefined,
        ),
      }).catch(() => {});
    }

    res.json({ item: updated });
  } catch (e) { next(e); }
});

export default r;