import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { auditLogger } from "./middleware/auditLog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: (process.env.CORS_ORIGIN || "*").split(","), credentials: true }));
// Webhook endpoints need the raw request body so HMAC can be verified against
// the exact bytes Razorpay signed. Mount raw parsers BEFORE express.json().
app.use("/api/materials/webhook", express.raw({ type: "*/*", limit: "2mb" }));
app.use("/api/payments/webhook", express.raw({ type: "*/*", limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// Gated material PDFs and previews must NEVER be reachable via the public
// static mount — they're served through signed-token routes in
// materials.routes.ts. Block those subpaths before express.static resolves.
app.use("/uploads/materials/pdf", (_req, res) => res.status(404).end());
app.use("/uploads/materials/preview", (_req, res) => res.status(404).end());
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "./uploads")));

app.use("/api", rateLimit({ windowMs: 60_000, max: 300 }));
app.get("/health", (_req, res) => res.json({ ok: true, service: "tricube-api" }));
app.use("/api", auditLogger, router);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`TRI CUBE API listening on http://localhost:${port}`));