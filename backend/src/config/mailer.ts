import nodemailer from "nodemailer";
import { prisma } from "../db.js";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendMail(opts: { to: string; subject: string; html: string; template: string }) {
  try {
    await mailer.sendMail({ from: process.env.SMTP_FROM, to: opts.to, subject: opts.subject, html: opts.html });
    await prisma.emailLog.create({ data: { toEmail: opts.to, subject: opts.subject, template: opts.template, status: "sent" } });
  } catch (e: any) {
    await prisma.emailLog.create({ data: { toEmail: opts.to, subject: opts.subject, template: opts.template, status: "failed", error: String(e?.message || e) } });
    throw e;
  }
}

export const emailTemplates = {
  welcome: (name: string) => `<h2>Welcome ${name}!</h2><p>Welcome to TRI CUBE Digital Solutions.</p>`,
  otp: (otp: string) => `<h2>Your OTP</h2><p>Use <b>${otp}</b> — expires in 10 minutes.</p>`,
  purchase: (course: string, amount: number) => `<h2>Purchase confirmed</h2><p>Your enrollment for <b>${course}</b> for ₹${amount} is confirmed.</p>`,
  reset: (link: string) => `<h2>Reset password</h2><p><a href="${link}">Reset here</a>. Expires in 30 minutes.</p>`,
  certificate: (course: string) => `<h2>Certificate ready</h2><p>Your certificate for <b>${course}</b> is available on your dashboard.</p>`,
  eventReg: (event: string) => `<h2>Event registered</h2><p>You're in for <b>${event}</b>. See you there!</p>`,
  /**
   * Full receipt + order summary email sent after a Razorpay payment is
   * confirmed (via /verify or webhook). Includes payment/order IDs,
   * itemised amount, and a direct access link to the purchased asset.
   */
  receipt: (o: {
    customerName?: string | null;
    itemKind: "course" | "material" | "bundle" | "service";
    itemTitle: string;
    amount: number; // rupees
    currency?: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    paidAt?: Date | string;
    accessUrl?: string | null;
    accessLabel?: string;
    accessNote?: string;
  }) => {
    const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
    const paid = o.paidAt ? new Date(o.paidAt) : new Date();
    const paidStr = paid.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const curr = o.currency || "INR";
    const kindLabel =
      o.itemKind === "course" ? "Course enrollment"
      : o.itemKind === "material" ? "Study material"
      : o.itemKind === "bundle" ? "Materials bundle"
      : "Service order";
    const accessBtn = o.accessUrl
      ? `<p style="margin:24px 0"><a href="${o.accessUrl}" style="background:#D4AF37;color:#111;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">${o.accessLabel || "Open your purchase"}</a></p>`
      : "";
    const dashboard = site ? `<p style="margin:8px 0"><a href="${site}/me" style="color:#8a6d13">Go to your dashboard →</a></p>` : "";
    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
  <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #eee">
    <div style="font-size:12px;letter-spacing:3px;color:#8a6d13;text-transform:uppercase">TRI CUBE Digital Solutions</div>
    <h2 style="margin:8px 0 0;font-size:22px">Payment received ✓</h2>
  </div>
  <p style="margin:20px 0 4px">Hi ${o.customerName || "there"},</p>
  <p style="margin:0 0 16px;color:#444">Thanks for your purchase. Here is your order summary and receipt.</p>

  <div style="background:#fafaf5;border:1px solid #eee6cf;border-radius:12px;padding:16px 18px">
    <div style="font-size:11px;letter-spacing:2px;color:#8a6d13;text-transform:uppercase">${kindLabel}</div>
    <div style="font-size:18px;font-weight:600;margin-top:4px">${o.itemTitle}</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:14px;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 0;color:#666">Amount paid</td><td style="text-align:right;font-weight:600">₹${o.amount.toLocaleString("en-IN")} ${curr}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Paid on</td><td style="text-align:right">${paidStr}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Order ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayOrderId}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayPaymentId}</td></tr>
    </table>
  </div>

  ${accessBtn}
  ${o.accessNote ? `<p style="color:#555;font-size:13px;margin:12px 0">${o.accessNote}</p>` : ""}
  ${dashboard}

  <p style="margin-top:24px;color:#666;font-size:12px">Keep this email as your receipt. Need help? Reply to this message or write to <a href="mailto:tricubedigitalsolutions@gmail.com" style="color:#8a6d13">tricubedigitalsolutions@gmail.com</a>.</p>
  <p style="color:#999;font-size:11px;margin-top:8px">— TRI CUBE Digital Solutions</p>
</div>`;
  },
  serviceRequestReceived: (service: string, amount: number) =>
    `<h2>Request received</h2><p>Thanks — your payment of ₹${amount} for <b>${service}</b> is confirmed.</p><p>Our expert team will review your submission and email the deliverable to you within <b>3–4 working days</b>.</p><p>— TRI CUBE Digital Solutions</p>`,
  /**
   * Sent when Razorpay reports `payment.failed`. Clarifies that no money was
   * charged (or will be auto-reversed by the bank) and gives the customer a
   * one-click way to retry the same purchase.
   */
  paymentFailed: (o: {
    customerName?: string | null;
    itemKind: "course" | "material" | "bundle" | "service";
    itemTitle: string;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId?: string | null;
    reason?: string | null;
    retryUrl?: string | null;
  }) => {
    const site = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
    const retry = o.retryUrl
      ? `<p style="margin:24px 0"><a href="${o.retryUrl}" style="background:#D4AF37;color:#111;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">Retry payment</a></p>`
      : "";
    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
  <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #eee">
    <div style="font-size:12px;letter-spacing:3px;color:#8a6d13;text-transform:uppercase">TRI CUBE Digital Solutions</div>
    <h2 style="margin:8px 0 0;font-size:22px;color:#b23">Payment could not be completed</h2>
  </div>
  <p style="margin:20px 0 4px">Hi ${o.customerName || "there"},</p>
  <p style="margin:0 0 16px;color:#444">Your recent payment attempt for <b>${o.itemTitle}</b> did not go through, so no access has been granted yet.</p>
  <div style="background:#fff6f6;border:1px solid #f3d4d4;border-radius:12px;padding:16px 18px">
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 0;color:#666">Item</td><td style="text-align:right;font-weight:600">${o.itemTitle}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Amount attempted</td><td style="text-align:right">₹${o.amount.toLocaleString("en-IN")}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Order ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayOrderId}</td></tr>
      ${o.razorpayPaymentId ? `<tr><td style="padding:4px 0;color:#666">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayPaymentId}</td></tr>` : ""}
      ${o.reason ? `<tr><td style="padding:4px 0;color:#666">Reason</td><td style="text-align:right">${o.reason}</td></tr>` : ""}
    </table>
  </div>
  <h3 style="margin:20px 0 6px;font-size:15px">What happens next</h3>
  <ul style="margin:0 0 8px 18px;color:#444;font-size:14px;line-height:1.55">
    <li>You have <b>not been charged</b>. Any temporary hold placed by your bank is auto-released, typically within 5–7 working days.</li>
    <li>Your access status is <b>unchanged</b> — nothing was unlocked and nothing was revoked.</li>
    <li>You can safely retry using the same or a different payment method.</li>
  </ul>
  ${retry}
  <p style="margin-top:24px;color:#666;font-size:12px">Need help? Reply to this email or write to <a href="mailto:tricubedigitalsolutions@gmail.com" style="color:#8a6d13">tricubedigitalsolutions@gmail.com</a>${site ? ` — please include order ID <b>${o.razorpayOrderId}</b>.` : "."}</p>
  <p style="color:#999;font-size:11px;margin-top:8px">— TRI CUBE Digital Solutions</p>
</div>`;
  },
  /**
   * Sent when Razorpay confirms a refund (`refund.created` / `refund.processed`).
   * Explains the refund amount, expected settlement window, and the effect on
   * the customer's access to the purchased item.
   */
  refund: (o: {
    customerName?: string | null;
    itemKind: "course" | "material" | "bundle" | "service";
    itemTitle: string;
    amount: number; // refunded amount in rupees
    originalAmount?: number; // original paid amount in rupees
    razorpayOrderId: string;
    razorpayPaymentId: string;
    refundId: string;
    status?: "processed" | "pending" | "failed" | string;
    speed?: "normal" | "optimum" | string | null;
    accessRevoked?: boolean;
  }) => {
    const isPartial = typeof o.originalAmount === "number" && o.originalAmount > o.amount;
    const processed = (o.status || "pending") === "processed";
    const eta = o.speed === "optimum"
      ? "within a few hours"
      : "in 5–7 working days";
    const accessLine = o.accessRevoked
      ? `<li>Access to <b>${o.itemTitle}</b> has been <b>revoked</b> effective immediately.</li>`
      : isPartial
        ? `<li>Your access to <b>${o.itemTitle}</b> is <b>unchanged</b> — this is a partial refund only.</li>`
        : `<li>Access to <b>${o.itemTitle}</b> will remain available until the refund settles, after which it will be revoked.</li>`;
    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
  <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #eee">
    <div style="font-size:12px;letter-spacing:3px;color:#8a6d13;text-transform:uppercase">TRI CUBE Digital Solutions</div>
    <h2 style="margin:8px 0 0;font-size:22px">Refund ${processed ? "processed" : "initiated"}</h2>
  </div>
  <p style="margin:20px 0 4px">Hi ${o.customerName || "there"},</p>
  <p style="margin:0 0 16px;color:#444">${processed
    ? `Your refund has been processed and sent to your bank. It should reflect on your original payment method ${eta}.`
    : `We've initiated a refund on your original payment. The amount will be credited back to your source account ${eta}.`}</p>
  <div style="background:#f5faf5;border:1px solid #d4ecd4;border-radius:12px;padding:16px 18px">
    <div style="font-size:11px;letter-spacing:2px;color:#2e7d32;text-transform:uppercase">${isPartial ? "Partial refund" : "Full refund"}</div>
    <div style="font-size:18px;font-weight:600;margin-top:4px">${o.itemTitle}</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:14px;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 0;color:#666">Refunded amount</td><td style="text-align:right;font-weight:600">₹${o.amount.toLocaleString("en-IN")}</td></tr>
      ${typeof o.originalAmount === "number" ? `<tr><td style="padding:4px 0;color:#666">Original payment</td><td style="text-align:right">₹${o.originalAmount.toLocaleString("en-IN")}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#666">Refund ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.refundId}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Order ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayOrderId}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${o.razorpayPaymentId}</td></tr>
    </table>
  </div>
  <h3 style="margin:20px 0 6px;font-size:15px">What this means for your access</h3>
  <ul style="margin:0 0 8px 18px;color:#444;font-size:14px;line-height:1.55">
    ${accessLine}
    <li>Any signed download links previously issued may stop working once the refund settles.</li>
    <li>You can re-purchase this item any time — your account and history are preserved.</li>
  </ul>
  <p style="margin-top:24px;color:#666;font-size:12px">Questions about this refund? Reply to this email or write to <a href="mailto:tricubedigitalsolutions@gmail.com" style="color:#8a6d13">tricubedigitalsolutions@gmail.com</a> — please include refund ID <b>${o.refundId}</b>.</p>
  <p style="color:#999;font-size:11px;margin-top:8px">— TRI CUBE Digital Solutions</p>
</div>`;
  },
  serviceDelivered: (service: string, note: string, fileUrl?: string) =>
    `<h2>Your ${service} is ready</h2><p>${note || "Please find the deliverable attached / linked below."}</p>${fileUrl ? `<p><a href="${fileUrl}">Download deliverable</a></p>` : ""}<p>— TRI CUBE Digital Solutions</p>`,
  serviceRequestAdmin: (o: {
    serviceTitle: string;
    amount: number;
    name: string;
    email: string;
    phone: string;
    targetRole: string;
    notes: string;
    fileUrl: string | null;
    paymentId: string;
    requestId: number;
  }) => `
    <h2>New paid service request</h2>
    <p><b>${o.serviceTitle}</b> — ₹${o.amount} paid</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      <tr><td><b>Request ID</b></td><td>#${o.requestId}</td></tr>
      <tr><td><b>Name</b></td><td>${o.name}</td></tr>
      <tr><td><b>Email</b></td><td>${o.email}</td></tr>
      <tr><td><b>Phone</b></td><td>${o.phone || "—"}</td></tr>
      <tr><td><b>Target role</b></td><td>${o.targetRole || "—"}</td></tr>
      <tr><td><b>Notes</b></td><td>${(o.notes || "—").replace(/\n/g, "<br/>")}</td></tr>
      <tr><td><b>Payment ID</b></td><td>${o.paymentId}</td></tr>
      <tr><td><b>File</b></td><td>${o.fileUrl ? `<a href="${o.fileUrl}">Download uploaded file</a>` : "— none —"}</td></tr>
    </table>
    <p style="margin-top:16px">Please review and email the deliverable back to <b>${o.email}</b> within 3–4 working days.</p>`,
};
