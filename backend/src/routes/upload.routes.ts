import { Router } from "express";
import { upload } from "../config/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.post("/", requireAuth, requireRole("admin", "super_admin", "trainer"), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({ url: `/uploads/${req.file.filename}`, size: req.file.size, mime: req.file.mimetype });
});
export default r;
