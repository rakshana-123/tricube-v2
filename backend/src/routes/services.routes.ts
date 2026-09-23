import { Router } from "express";
import path from "node:path";
import { prisma } from "../db.js";
import { upload } from "../config/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();

// -------- Admin --------

const adminOnly = [requireAuth, requireRole("admin", "super_admin")] as const;

// GET /api/services/admin/all — every row, including inactive
r.get("/admin/all", ...adminOnly, async (_req, res) => {
  const services = await prisma.service.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
  res.json({ services });
});

// Coerce a multipart / JSON body into the Service data shape.
function parseServiceBody(body: any, file?: Express.Multer.File) {
  const bool = (v: any, d: boolean) =>
    v === undefined || v === null || v === ""
      ? d
      : v === true || v === "true" || v === "1" || v === 1;
  const num = (v: any, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const features = Array.isArray(body.features)
    ? body.features.join("\n")
    : typeof body.features === "string"
      ? body.features
      : "";
  // sections: accept a JSON string or array; store as compact JSON string
  let sections: string | null = null;
  if (body.sections !== undefined && body.sections !== null && body.sections !== "") {
    try {
      const parsed = typeof body.sections === "string" ? JSON.parse(body.sections) : body.sections;
      if (Array.isArray(parsed)) sections = JSON.stringify(parsed);
    } catch {
      sections = null;
    }
  }
  const data: any = {
    slug: body.slug?.toString().trim(),
    title: body.title?.toString().trim(),
    description: body.description?.toString() ?? "",
    longDescription: body.longDescription?.toString() || null,
    category: body.category?.toString() || null,
    rating: num(body.rating, 4.9),
    price: num(body.price, 0),
    offerPrice: num(body.offerPrice ?? body.offer, 0),
    duration: body.duration?.toString() || "",
    features,
    sections,
    active: bool(body.active, true),
    featured: bool(body.featured, false),
    published: bool(body.published ?? body.active, true),
  };
  if (file) data.imageUrl = `/uploads/${path.basename(file.filename)}`;
  else if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl || null;
  return data;
}

// POST /api/services — create (multipart supports image upload as `image`)
r.post("/", ...adminOnly, upload.single("image"), async (req, res) => {
  const data = parseServiceBody(req.body, req.file);
  if (!data.slug || !data.title) {
    return res.status(400).json({ error: "slug and title are required" });
  }
  const exists = await prisma.service.findUnique({ where: { slug: data.slug } });
  if (exists) return res.status(409).json({ error: "A service with this slug already exists" });
  const service = await prisma.service.create({ data });
  res.json({ service });
});

// PATCH /api/services/:id — partial update
r.patch("/:id", ...adminOnly, upload.single("image"), async (req, res) => {
  const id = Number(req.params.id);
  const data = parseServiceBody(req.body, req.file);
  // Only overwrite fields the client actually sent.
  const patch: any = {};
  for (const k of Object.keys(data)) {
    if (req.body[k] !== undefined || (k === "imageUrl" && req.file)) {
      patch[k] = (data as any)[k];
    }
  }
  const service = await prisma.service.update({ where: { id }, data: patch });
  res.json({ service });
});

// PATCH /api/services/:id/toggle — flip active flag
r.patch("/:id/toggle", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const cur = await prisma.service.findUnique({ where: { id } });
  if (!cur) return res.status(404).json({ error: "Not found" });
  const service = await prisma.service.update({
    where: { id },
    data: { active: !cur.active, published: !cur.active },
  });
  res.json({ service });
});

// DELETE /api/services/:id
r.delete("/:id", ...adminOnly, async (req, res) => {
  await prisma.service.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// -------- Public --------

// GET /api/services — active only, featured first, then newest
r.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { active: true, published: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
  res.json({ services });
});

// GET /api/services/:slug — active only for the public detail page
r.get("/:slug", async (req, res) => {
  const s = await prisma.service.findUnique({ where: { slug: req.params.slug } });
  if (!s || !s.active) return res.status(404).json({ error: "Not found" });
  res.json({ service: s });
});

export default r;
