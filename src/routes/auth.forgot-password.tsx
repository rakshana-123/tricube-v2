import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Lock, KeyRound } from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { forgotPassword, resetPassword } from "@/lib/auth";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password â€” TRI CUBE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true); setErr(null);
    try {
      const r = await forgotPassword(email);
      setDevOtp(r.devOtp || null);
      setStep("otp");
      setCooldown(60);
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally { setBusy(false); }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) { setErr("Passwords do not match"); return; }
    setBusy(true); setErr(null);
    try {
      await resetPassword(email, otp, pw);
      setStep("done");
      setTimeout(() => navigate({ to: "/auth" }), 2500);
    } catch (e: any) {
      setErr(e.message || "Reset failed");
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title={<>Forgot your <span className="teal-text">password</span>?</>}
        subtitle="Enter your account email and we'll send you a 6-digit code. The code expires in 10 minutes."
      />
      <section className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {step === "done" ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h2 className="mt-3 text-lg font-semibold">Password updated</h2>
              <p className="mt-1 text-sm text-muted-foreground">You can now sign in with your new password.</p>
              <Link to="/auth" className="mt-5 inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                Sign in
              </Link>
            </div>
          ) : step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input required type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-soft)]" />
              </div>
              {err && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
              <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {busy ? "Sendingâ€¦" : <>Send reset code <ArrowRight className="h-4 w-4" /></>}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Remembered it? <Link to="/auth" className="text-[var(--teal)] hover:underline">Back to sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={submitReset} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below with your new password.
              </p>
              {devOtp && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Email delivery is not configured on this server. Use dev code: <b className="font-mono">{devOtp}</b>
                </div>
              )}
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input required inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="6-digit code" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm tracking-widest outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-soft)]" />
              </div>
              <PwField value={pw} onChange={setPw} placeholder="New password" />
              <PwField value={pw2} onChange={setPw2} placeholder="Confirm new password" />
              {err && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
              <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {busy ? "Updatingâ€¦" : <>Update password <ArrowRight className="h-4 w-4" /></>}
              </button>
              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => { setStep("email"); setErr(null); setOtp(""); }} className="text-muted-foreground hover:underline">
                  Use different email
                </button>
                <button type="button" disabled={cooldown > 0 || busy} onClick={() => sendCode()}
                  className="text-[var(--teal)] hover:underline disabled:opacity-50 disabled:no-underline">
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function PwField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input required type="password" minLength={8} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-soft)]" />
    </div>
  );
}

