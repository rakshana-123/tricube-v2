import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.env.UPLOAD_DIR || "./uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 100) * 1024 * 1024 },
});

// Multer configured for the material admin dialog. Cover images stay under
// /uploads/materials/cover, gated PDFs under /uploads/materials/pdf, and free
// samples under /uploads/materials/preview. Only /uploads/materials/cover is
// served publicly by express.static; the PDF + preview folders sit behind the
// signed-URL gate in materials.routes.ts.
const materialsRoot = path.join(dir, "materials");
for (const sub of ["cover", "pdf", "preview"]) {
  const p = path.join(materialsRoot, sub);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const materialsStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const bucket =
      file.fieldname === "cover"
        ? "cover"
        : file.fieldname === "preview"
          ? "preview"
          : "pdf";
    cb(null, path.join(materialsRoot, bucket));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

export const uploadMaterial = multer({
  storage: materialsStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
});
