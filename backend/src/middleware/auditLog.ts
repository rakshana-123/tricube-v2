import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";
import type { AuthedRequest } from "./auth.js";

// Skip noisy or non-admin surfaces.
const SKIP_PREFIXES = [
  "/api/materials/webhook",
  "/api/payments/webhook",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/otp",
  "/api/auth/resend-otp",
  "/api/auth/verify-otp",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/contact",
  "/api/admin/activity",
];

function inferAction(method: string, url: string): string {
  const path = url.split("?")[0];
  if (method === "DELETE") return `delete ${path}`;
  if (method === "POST") {
    if (/\/upload/i.test(path) || /\/uploads(\/|$)/.test(path)) return `upload ${path}`;
    return `create ${path}`;
  }
  if (method === "PATCH" || method === "PUT") {
    if (/\/toggle|\/publish/i.test(path)) return `publish ${path}`;
    return `edit ${path}`;
  }
  return `${method.toLowerCase()} ${path}`;
}

function scrub(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  try {
    const clone: Record<string, unknown> = { ...(body as Record<string, unknown>) };
    for (const k of Object.keys(clone)) {
      if (/pass(word)?|secret|token|otp/i.test(k)) clone[k] = "***";
      const v = clone[k];
      if (typeof v === "string" && v.length > 200) clone[k] = v.slice(0, 200) + "…";
    }
    const s = JSON.stringify(clone);
    return s.length > 1500 ? s.slice(0, 1500) + "…" : s;
  } catch {
    return null;
  }
}

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  if (!["POST", "PATCH", "PUT", "DELETE"].includes(method)) return next();
  const url = req.originalUrl || req.url;
  if (SKIP_PREFIXES.some((p) => url.startsWith(p))) return next();

  const bodySnapshot = scrub((req as Request & { body?: unknown }).body);
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip || null;

  res.on("finish", () => {
    const user = (req as AuthedRequest).user;
    if (!user) return;
    if (!["admin", "super_admin"].includes(user.role)) return;
    if (res.statusCode >= 400) return;
    const meta = JSON.stringify({ status: res.statusCode, body: bodySnapshot ? JSON.parse(bodySnapshot) : undefined });
    prisma.activityLog
      .create({
        data: {
          userId: user.id,
          action: inferAction(method, url),
          meta,
          ip: ip ?? undefined,
        },
      })
      .catch(() => {
        /* audit failures must not break requests */
      });
  });
  next();
}