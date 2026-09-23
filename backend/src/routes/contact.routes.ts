import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();

r.post("/", async (req, res) => {
  const body = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().max(32).optional(),
    subject: z.string().min(2).max(200),
    message: z.string().min(5).max(3000),
  }).parse(req.body);
  const msg = await prisma.contactMessage.create({ data: body });
  res.json({ ok: true, id: msg.id });
});

r.get("/", requireAuth, requireRole("admin", "super_admin"), async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ messages });
});

r.patch("/:id/read", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const m = await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { read: true } });
  res.json({ message: m });
});

export default r;
