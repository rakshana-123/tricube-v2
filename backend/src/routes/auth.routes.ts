import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { sendMail, emailTemplates } from "../config/mailer.js";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";

const r = Router();

function sign(user: { id: number; email: string; role: string }) {
  const access = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: (process.env.JWT_ACCESS_TTL ?? "15m") as SignOptions["expiresIn"],
    }
  );

  const refresh = jwt.sign(
    { sub: user.id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: (process.env.JWT_REFRESH_TTL ?? "30d") as SignOptions["expiresIn"],
    }
  );
  return { access, refresh };
}

r.post("/register", async (req, res) => {
  const body = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    phone: z.string().max(32).optional(),
  }).parse(req.body);

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      passwordHash: await bcrypt.hash(body.password, 10),
      role: "student",
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60_000),
      student: { create: {} },
    },
  });
  // Never fail account creation because SMTP is misconfigured — the user
  // can request a resend once the mailer is fixed. Log the OTP so the admin
  // can still verify the account manually during local development.
  let mailSent = true;
  try {
    await sendMail({ to: body.email, subject: "Welcome to TRI CUBE — verify your email", html: emailTemplates.welcome(body.name) + emailTemplates.otp(otp), template: "welcome" });
  } catch (err: any) {
    mailSent = false;
    console.warn(`[auth/register] SMTP send failed for ${body.email}: ${err?.message || err}`);
    console.warn(`[auth/register] OTP for ${body.email} is ${otp} (dev fallback — configure SMTP_PASS to enable real email)`);
  }
  res.json({ ok: true, userId: user.id, mailSent, ...(mailSent ? {} : { devOtp: process.env.NODE_ENV === "production" ? undefined : otp }) });
});

r.post("/verify-otp", async (req, res) => {
  const { email, otp } = z.object({ email: z.string().email(), otp: z.string().length(6) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date())
    return res.status(400).json({ error: "Invalid or expired OTP" });
  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, otp: null, otpExpiresAt: null } });
  const tokens = sign({ id: user.id, email: user.email, role: user.role });
  res.json({ ok: true, ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

r.post("/resend-otp", async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Account not found" });
  if (user.emailVerified) return res.status(400).json({ error: "Email already verified" });
  // Simple 60s throttle based on last otpExpiresAt (issued at ~ expires - 10min)
  if (user.otpExpiresAt) {
    const issuedAt = user.otpExpiresAt.getTime() - 10 * 60_000;
    if (Date.now() - issuedAt < 60_000) {
      const wait = Math.ceil((60_000 - (Date.now() - issuedAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${wait}s before requesting another code`, retryAfter: wait });
    }
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt: new Date(Date.now() + 10 * 60_000) },
  });
  let mailSent = true;
  try {
    await sendMail({ to: user.email, subject: "Your TRI CUBE verification code", html: emailTemplates.otp(otp), template: "otp" });
  } catch (err: any) {
    mailSent = false;
    console.warn(`[auth/resend-otp] SMTP send failed for ${user.email}: ${err?.message || err}`);
    console.warn(`[auth/resend-otp] OTP for ${user.email} is ${otp}`);
  }
  res.json({ ok: true, mailSent, ...(mailSent ? {} : { devOtp: process.env.NODE_ENV === "production" ? undefined : otp }) });
});

r.post("/login", async (req, res) => {
  const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: "Invalid credentials" });
  const tokens = sign({ id: user.id, email: user.email, role: user.role });
  res.json({ ok: true, ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

r.post("/refresh", async (req, res) => {
  const { refresh } = z.object({ refresh: z.string() }).parse(req.body);
  try {
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: "Invalid refresh" });
    const tokens = sign({ id: user.id, email: user.email, role: user.role });
    res.json(tokens);
  } catch { res.status(401).json({ error: "Invalid refresh" }); }
});

r.post("/forgot-password", async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  // Do not reveal whether the account exists.
  if (!user) return res.json({ ok: true, mailSent: true });

  // 60s throttle
  if (user.otpExpiresAt) {
    const issuedAt = user.otpExpiresAt.getTime() - 10 * 60_000;
    if (Date.now() - issuedAt < 60_000) {
      const wait = Math.ceil((60_000 - (Date.now() - issuedAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${wait}s before requesting another code`, retryAfter: wait });
    }
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt: new Date(Date.now() + 10 * 60_000) },
  });

  let mailSent = true;
  try {
    await sendMail({ to: email, subject: "Your TRI CUBE password reset code", html: emailTemplates.otp(otp), template: "reset" });
  } catch (err: any) {
    mailSent = false;
    console.warn(`[auth/forgot-password] SMTP send failed for ${email}: ${err?.message || err}`);
    console.warn(`[auth/forgot-password] Reset OTP for ${email} is ${otp}`);
  }
  res.json({ ok: true, mailSent, ...(mailSent ? {} : { devOtp: process.env.NODE_ENV === "production" ? undefined : otp }) });
});

r.post("/reset-password", async (req, res) => {
  const { email, otp, password } = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    password: z.string().min(8).max(128),
  }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 10), otp: null, otpExpiresAt: null },
  });
  res.json({ ok: true });
});

r.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { student: true, admin: true } });
  res.json({ user });
});

export default r;
