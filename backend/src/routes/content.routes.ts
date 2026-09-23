import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
const adminOnly = [requireAuth, requireRole("admin", "super_admin")] as const;

// -------- Public --------
r.get("/testimonials", async (_req, res) => res.json({ testimonials: await prisma.testimonial.findMany({ where: { published: true } }) }));
r.get("/faqs", async (_req, res) => res.json({ faqs: await prisma.fAQ.findMany({ orderBy: { position: "asc" } }) }));
r.get("/gallery", async (_req, res) => res.json({ gallery: await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } }) }));
r.get("/blogs", async (_req, res) => res.json({ blogs: await prisma.blog.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }) }));
r.get("/blogs/:slug", async (req, res) => {
  const b = await prisma.blog.findUnique({ where: { slug: req.params.slug } });
  if (!b) return res.status(404).json({ error: "Not found" });
  res.json({ blog: b });
});

// -------- Admin: Gallery --------
r.get("/admin/gallery", ...adminOnly, async (_req, res) =>
  res.json({ gallery: await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } }) }));
r.post("/gallery", ...adminOnly, async (req, res) => {
  const { url, caption, kind } = req.body || {};
  if (!url) return res.status(400).json({ error: "url is required" });
  const item = await prisma.gallery.create({ data: { url, caption: caption || null, kind: kind || "image" } });
  res.json({ item });
});
r.put("/gallery/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { url, caption, kind } = req.body || {};
  const item = await prisma.gallery.update({ where: { id }, data: { url, caption, kind } });
  res.json({ item });
});
r.delete("/gallery/:id", ...adminOnly, async (req, res) => {
  await prisma.gallery.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// -------- Admin: Blogs --------
r.get("/admin/blogs", ...adminOnly, async (_req, res) =>
  res.json({ blogs: await prisma.blog.findMany({ orderBy: { createdAt: "desc" } }) }));
r.post("/blogs", ...adminOnly, async (req, res) => {
  const { slug, title, excerpt, content, coverUrl, category, authorName, published } = req.body || {};
  if (!slug || !title) return res.status(400).json({ error: "slug and title are required" });
  const blog = await prisma.blog.create({
    data: {
      slug, title,
      excerpt: excerpt || "",
      content: content || "",
      coverUrl: coverUrl || null,
      category: category || "General",
      authorName: authorName || "TRI CUBE",
      published: published !== false,
    },
  });
  res.json({ blog });
});
r.put("/blogs/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { slug, title, excerpt, content, coverUrl, category, authorName, published } = req.body || {};
  const blog = await prisma.blog.update({
    where: { id },
    data: { slug, title, excerpt, content, coverUrl, category, authorName, published },
  });
  res.json({ blog });
});
r.delete("/blogs/:id", ...adminOnly, async (req, res) => {
  await prisma.blog.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// -------- Admin: Testimonials --------
r.get("/admin/testimonials", ...adminOnly, async (_req, res) =>
  res.json({ testimonials: await prisma.testimonial.findMany({ orderBy: { id: "desc" } }) }));
r.post("/testimonials", ...adminOnly, async (req, res) => {
  const { name, role, quote, photoUrl, rating, videoUrl, published } = req.body || {};
  if (!name || !quote) return res.status(400).json({ error: "name and quote required" });
  const item = await prisma.testimonial.create({
    data: {
      name, role: role || "", quote,
      photoUrl: photoUrl || null,
      rating: Number(rating || 5),
      videoUrl: videoUrl || null,
      published: published !== false,
    },
  });
  res.json({ item });
});
r.put("/testimonials/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const item = await prisma.testimonial.update({ where: { id }, data: body });
  res.json({ item });
});
r.delete("/testimonials/:id", ...adminOnly, async (req, res) => {
  await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// -------- Admin: FAQs --------
r.get("/admin/faqs", ...adminOnly, async (_req, res) =>
  res.json({ faqs: await prisma.fAQ.findMany({ orderBy: { position: "asc" } }) }));
r.post("/faqs", ...adminOnly, async (req, res) => {
  const { question, answer, category, position } = req.body || {};
  if (!question || !answer) return res.status(400).json({ error: "question and answer required" });
  const item = await prisma.fAQ.create({
    data: { question, answer, category: category || "General", position: Number(position || 0) },
  });
  res.json({ item });
});
r.put("/faqs/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.fAQ.update({ where: { id }, data: req.body || {} });
  res.json({ item });
});
r.delete("/faqs/:id", ...adminOnly, async (req, res) => {
  await prisma.fAQ.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
