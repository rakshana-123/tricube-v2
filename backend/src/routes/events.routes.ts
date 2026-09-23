import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth.js";
import { sendMail, emailTemplates } from "../config/mailer.js";

const r = Router();

r.get("/", async (_req, res) => {
  const events = await prisma.event.findMany({ where: { published: true }, orderBy: { date: "desc" }, include: { gallery: true } });
  res.json({ events });
});
r.get("/:slug", async (req, res) => {
  const e = await prisma.event.findUnique({ where: { slug: req.params.slug }, include: { gallery: true } });
  if (!e) return res.status(404).json({ error: "Not found" });
  res.json({ event: e });
});
r.post("/:slug/register", async (req: AuthedRequest, res) => {
  const event = await prisma.event.findUnique({ where: { slug: req.params.slug } });
  if (!event) return res.status(404).json({ error: "Not found" });
  const { name, email, phone } = req.body;
  const reg = await prisma.eventRegistration.create({ data: { eventId: event.id, name, email, phone, userId: req.user?.id } });
  await sendMail({ to: email, subject: `Registered — ${event.title}`, html: emailTemplates.eventReg(event.title), template: "eventReg" });
  res.json({ registration: reg });
});

// Admin
r.post("/", requireAuth, requireRole("admin", "super_admin"), async (req, res) => res.json({ event: await prisma.event.create({ data: req.body }) }));
r.put("/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => res.json({ event: await prisma.event.update({ where: { id: Number(req.params.id) }, data: req.body }) }));
r.delete("/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => { await prisma.event.delete({ where: { id: Number(req.params.id) } }); res.json({ ok: true }); });

export default r;
