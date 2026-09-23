import { Router } from "express";
import path from "node:path";
import fs from "node:fs";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { prisma } from "../db.js";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";

const r = Router();

r.post("/issue", requireAuth, async (req: AuthedRequest, res) => {
  const { courseId } = req.body;
  const course = await prisma.course.findUnique({ where: { id: Number(courseId) } });
  if (!course) return res.status(404).json({ error: "Course not found" });
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const certNumber = `TC-${Date.now().toString(36).toUpperCase()}-${user.id}`;
  const qrPayload = `${process.env.FRONTEND_URL}/verify/${certNumber}`;
  const dir = path.resolve(process.env.UPLOAD_DIR || "./uploads", "certificates");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${certNumber}.pdf`);

  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  doc.pipe(fs.createWriteStream(filePath));
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#c9a84c");
  doc.fontSize(28).fillColor("#c9a84c").text("TRI CUBE DIGITAL SOLUTIONS", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(18).fillColor("#111").text("Certificate of Completion", { align: "center" });
  doc.moveDown(1.5);
  doc.fontSize(14).text("This is to certify that", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(24).fillColor("#111").text(user.name, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(14).text(`has successfully completed the ${course.title} program`, { align: "center" });
  doc.moveDown(2);
  doc.fontSize(11).text(`Certificate No: ${certNumber}`, 60, doc.page.height - 90);
  doc.text(`Issued: ${new Date().toDateString()}`, 60, doc.page.height - 70);

  const qr = await QRCode.toDataURL(qrPayload);
  const qrImg = Buffer.from(qr.split(",")[1], "base64");
  doc.image(qrImg, doc.page.width - 160, doc.page.height - 160, { width: 100 });
  doc.end();

  const cert = await prisma.certificate.create({ data: { certNumber, userId: user.id, courseId: course.id, qrPayload, pdfUrl: `/uploads/certificates/${certNumber}.pdf` } });
  res.json({ certificate: cert });
});

r.get("/verify/:certNumber", async (req, res) => {
  const c = await prisma.certificate.findUnique({ where: { certNumber: req.params.certNumber }, include: { user: true, course: true } });
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json({ certificate: { number: c.certNumber, student: c.user.name, course: c.course.title, issuedAt: c.issuedAt } });
});

export default r;
