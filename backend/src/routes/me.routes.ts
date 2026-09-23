import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { signToken } from "./materials.routes.js";

const r = Router();

/**
 * GET /api/me/orders
 * Unified purchase history for the signed-in student:
 *  - Course orders (matched by userId)
 *  - Material / bundle orders (matched by email, since they don't require login)
 *  - Paid service requests (matched by userId OR email)
 * Returns a flat, timestamp-sorted list the /me/orders page can render.
 */
r.get("/orders", requireAuth, async (req: AuthedRequest, res) => {
  const uid = req.user!.id;
  const email = (req.user!.email || "").toLowerCase();

  const [courseOrders, materialOrders, serviceRequests] = await Promise.all([
    prisma.order.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      include: { course: true, payment: true },
    }),
    (prisma as any).materialOrder.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).serviceRequest.findMany({
      where: { OR: [{ userId: uid }, { email }] },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Materials referenced by bundle orders → resolve title from Bundle table,
  // single-material orders → resolve from Material table. Batch-fetch both.
  const materialSlugs = materialOrders.filter((o: any) => o.kind === "material").map((o: any) => o.slug);
  const bundleSlugs = materialOrders.filter((o: any) => o.kind === "bundle").map((o: any) => o.slug);
  const [materials, bundles] = await Promise.all([
    materialSlugs.length
      ? (prisma as any).material.findMany({ where: { slug: { in: materialSlugs } } })
      : Promise.resolve([]),
    bundleSlugs.length
      ? (prisma as any).bundle.findMany({ where: { slug: { in: bundleSlugs } } })
      : Promise.resolve([]),
  ]);
  const materialBySlug = new Map<string, any>(materials.map((m: any) => [m.slug, m]));
  const bundleBySlug = new Map<string, any>(bundles.map((b: any) => [b.slug, b]));

  const items: Array<{
    id: string;
    kind: "course" | "material" | "bundle" | "service";
    title: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    paidAt: string | null;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    accessUrl: string | null;
    accessLabel: string | null;
  }> = [];

  for (const o of courseOrders) {
    if (!o.course) continue;
    items.push({
      id: `course-${o.id}`,
      kind: "course",
      title: o.course.title,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      paidAt: o.payment?.createdAt?.toISOString() ?? null,
      razorpayOrderId: o.razorpayOrderId,
      razorpayPaymentId: o.payment?.razorpayPaymentId ?? null,
      accessUrl: o.status === "paid" ? `/courses/${o.course.slug}` : null,
      accessLabel: o.status === "paid" ? "Open course" : null,
    });
  }

  for (const o of materialOrders as any[]) {
    const isBundle = o.kind === "bundle";
    const ref = isBundle ? bundleBySlug.get(o.slug) : materialBySlug.get(o.slug);
    const title = ref?.title ?? o.slug;
    items.push({
      id: `${o.kind}-${o.id}`,
      kind: isBundle ? "bundle" : "material",
      title,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt ? new Date(o.paidAt).toISOString() : null,
      razorpayOrderId: o.razorpayOrderId,
      razorpayPaymentId: o.razorpayPaymentId,
      accessUrl: o.status === "paid" ? `/${isBundle ? "bundles" : "materials"}/${o.slug}` : null,
      accessLabel: o.status === "paid" ? (isBundle ? "Open bundle" : "Download PDF") : null,
    });
  }

  for (const s of serviceRequests as any[]) {
    // A service is "paid" once Razorpay confirmed it; downstream statuses
    // (in_review, delivered, etc.) also imply the money moved.
    const paidLike = ["paid", "in_review", "in_progress", "delivered", "completed"].includes(s.status);
    items.push({
      id: `service-${s.id}`,
      kind: "service",
      title: s.serviceTitle,
      amount: s.amount,
      currency: s.currency,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
      paidAt: paidLike ? s.updatedAt.toISOString() : null,
      razorpayOrderId: s.razorpayOrderId,
      razorpayPaymentId: s.razorpayPaymentId,
      accessUrl: s.deliveryFileUrl || (paidLike ? `/services/${s.serviceSlug}` : null),
      accessLabel: s.deliveryFileUrl ? "Download deliverable" : paidLike ? "View service" : null,
    });
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json({ orders: items });
});

/**
 * GET /api/me/materials
 * Returns every PDF the signed-in user has paid for (single + bundle-expanded),
 * each with a fresh 24-hour signed download URL. De-duplicated by slug.
 */
r.get("/materials", requireAuth, async (req: AuthedRequest, res) => {
  const email = (req.user!.email || "").toLowerCase();
  const orders = await (prisma as any).materialOrder.findMany({
    where: { email, status: "paid" },
    orderBy: { paidAt: "desc" },
  });

  const singleSlugs = orders.filter((o: any) => o.kind === "material").map((o: any) => o.slug);
  const bundleSlugs = orders.filter((o: any) => o.kind === "bundle").map((o: any) => o.slug);

  const [singles, bundles] = await Promise.all([
    singleSlugs.length
      ? (prisma as any).material.findMany({ where: { slug: { in: singleSlugs } } })
      : Promise.resolve([]),
    bundleSlugs.length
      ? (prisma as any).bundle.findMany({
          where: { slug: { in: bundleSlugs } },
          include: { items: { include: { material: true } } },
        })
      : Promise.resolve([]),
  ]);

  const singleBySlug = new Map<string, any>(singles.map((m: any) => [m.slug, m]));
  const bundleBySlug = new Map<string, any>(bundles.map((b: any) => [b.slug, b]));

  const seen = new Set<string>();
  const items: Array<{
    slug: string;
    title: string;
    coverUrl: string | null;
    purchasedAt: string;
    orderId: number;
    source: "material" | "bundle";
    bundleSlug?: string;
    downloadUrl: string;
  }> = [];

  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const mkUrl = (slug: string) =>
    `/api/materials/download/${encodeURIComponent(slug)}?token=${signToken({ slug, kind: "pdf", email, exp })}`;

  for (const o of orders as any[]) {
    if (o.kind === "material") {
      const m = singleBySlug.get(o.slug);
      if (!m || seen.has(m.slug)) continue;
      seen.add(m.slug);
      items.push({
        slug: m.slug,
        title: m.title,
        coverUrl: m.coverUrl ?? null,
        purchasedAt: (o.paidAt ?? o.createdAt).toISOString?.() ?? new Date(o.paidAt ?? o.createdAt).toISOString(),
        orderId: o.id,
        source: "material",
        downloadUrl: mkUrl(m.slug),
      });
    } else if (o.kind === "bundle") {
      const b = bundleBySlug.get(o.slug);
      if (!b) continue;
      for (const it of b.items as any[]) {
        const m = it.material;
        if (!m || seen.has(m.slug)) continue;
        seen.add(m.slug);
        items.push({
          slug: m.slug,
          title: m.title,
          coverUrl: m.coverUrl ?? null,
          purchasedAt: (o.paidAt ?? o.createdAt).toISOString?.() ?? new Date(o.paidAt ?? o.createdAt).toISOString(),
          orderId: o.id,
          source: "bundle",
          bundleSlug: b.slug,
          downloadUrl: mkUrl(m.slug),
        });
      }
    }
  }

  res.json({ materials: items });
});

export default r;
