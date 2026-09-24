import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { z } from "zod";
import {
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { login, register, verifyOtp, resendOtp } from "@/lib/auth";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["login", "register"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — TRI CUBE" },
      {
        name: "description",
        content:
          "Sign in or create your TRI CUBE student account to enroll in courses, download materials, and track progress.",
      },
    ],
  }),
  component: AuthPage,
});

const inputCls =
  "w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]";

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"login" | "register">(search.mode ?? "login");
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  return (
    <>
      <PageHero
        eyebrow="Student account"
        title={
          otpEmail ? (
            <>
              Verify your <span className="gold-text">email</span>
            </>
          ) : mode === "login" ? (
            <>
              Welcome <span className="gold-text">back</span>
            </>
          ) : (
            <>
              Join <span className="gold-text">TRI CUBE</span>
            </>
          )
        }
        subtitle={
          otpEmail
            ? "We sent a 6-digit code to your inbox. Enter it below to activate your account."
            : "Access your courses, downloadable materials, service requests, and certificates from one dashboard."
        }
      />
      <section className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {otpEmail ? (
            <OtpForm
              email={otpEmail}
              redirect={search.redirect}
              initialNotice={otpNotice}
              onBack={() => {
                setOtpEmail(null);
                setOtpNotice(null);
              }}
            />
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 rounded-full border border-border p-1 text-sm font-medium">
                <button
                  onClick={() => setMode("login")}
                  className={`rounded-full px-3 py-1.5 transition ${mode === "login" ? "bg-[var(--gradient-gold)] text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`rounded-full px-3 py-1.5 transition ${mode === "register" ? "bg-[var(--gradient-gold)] text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Create account
                </button>
              </div>
              {mode === "login" ? (
                <LoginForm redirect={search.redirect} />
              ) : (
                <RegisterForm
                  onOtpNeeded={(e, notice) => {
                    setOtpEmail(e);
                    setOtpNotice(notice ?? null);
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function LoginForm({ redirect }: { redirect?: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          await login(email, password);
          navigate({ to: (redirect as any) || "/me" });
        } catch (e: any) {
          setErr(e.message || "Login failed");
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-4"
    >
      <IconField icon={<Mail className="h-4 w-4" />}>
        <input
          required
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </IconField>
      <IconField icon={<Lock className="h-4 w-4" />}>
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </IconField>
      {err && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {err}
        </p>
      )}
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
      >
        {busy ? (
          "Signing in…"
        ) : (
          <>
            Sign in <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <div className="flex justify-between text-xs text-muted-foreground">
        <Link to="/auth/forgot-password" className="hover:text-foreground">
          Forgot password?
        </Link>
        <span>
          Need help?{" "}
          <Link to="/contact" className="text-[var(--gold-dark)] hover:underline">
            Contact us
          </Link>
        </span>
      </div>
    </form>
  );
}

function RegisterForm({ onOtpNeeded }: { onOtpNeeded: (email: string, notice?: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          const res = await register({ name, email, password, phone: phone || undefined });
          let notice: string | undefined;
          if (res.mailSent === false) {
            notice = res.devOtp
              ? `Email delivery is currently disabled. Use this verification code to activate your account: ${res.devOtp}`
              : "Account created, but we couldn't send the verification email. Ask the admin to check SMTP settings.";
          }
          onOtpNeeded(email, notice);
        } catch (e: any) {
          setErr(e.message || "Sign up failed");
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-4"
    >
      <IconField icon={<User className="h-4 w-4" />}>
        <input
          required
          minLength={2}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </IconField>
      <IconField icon={<Mail className="h-4 w-4" />}>
        <input
          required
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </IconField>
      <IconField icon={<Phone className="h-4 w-4" />}>
        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
        />
      </IconField>
      <IconField icon={<Lock className="h-4 w-4" />}>
        <input
          required
          type="password"
          minLength={8}
          placeholder="Password (min. 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </IconField>
      {err && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {err}
        </p>
      )}
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
      >
        {busy ? (
          "Creating account…"
        ) : (
          <>
            Create account <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        By continuing you agree to our terms. We'll email a 6-digit verification code to activate
        your account.
      </p>
    </form>
  );
}

function OtpForm({
  email,
  redirect,
  onBack,
  initialNotice,
}: {
  email: string;
  redirect?: string;
  onBack: () => void;
  initialNotice?: string | null;
}) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<string | null>(initialNotice ?? null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setErr(null);
    setNotice(null);
    try {
      const res = await resendOtp(email);
      if (res.mailSent === false) {
        setNotice(
          res.devOtp
            ? `Email delivery is disabled. Your new code: ${res.devOtp}`
            : "Could not send email — SMTP is not configured. Please contact the admin.",
        );
      } else {
        setNotice("A new code has been sent to your inbox.");
      }
      setCooldown(60);
    } catch (e: any) {
      const msg = e.message || "Could not resend code";
      const m = /wait (\d+)s/i.exec(msg);
      if (m) setCooldown(parseInt(m[1], 10));
      setErr(msg);
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          await verifyOtp(email, otp);
          navigate({ to: (redirect as any) || "/me" });
        } catch (e: any) {
          setErr(e.message || "Verification failed");
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-4"
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 text-[var(--gold-dark)]" />
        <div>
          Sent a verification code to <strong className="text-foreground">{email}</strong>. Code
          expires in 10 minutes.
        </div>
      </div>
      <IconField icon={<KeyRound className="h-4 w-4" />}>
        <input
          required
          inputMode="numeric"
          maxLength={6}
          minLength={6}
          pattern="\d{6}"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className={`${inputCls} tracking-[0.4em] text-center`}
        />
      </IconField>
      {err && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {err}
        </p>
      )}
      {notice && !err && (
        <p className="rounded-lg border border-[var(--gold-soft)] bg-[var(--gold-soft)]/30 px-3 py-2 text-xs text-[var(--gold-dark)]">
          {notice}
        </p>
      )}
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
      >
        {busy ? (
          "Verifying…"
        ) : (
          <>
            Verify & continue <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-muted-foreground">Didn't get the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="inline-flex items-center gap-1 font-medium text-[var(--gold-dark)] hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
          {resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Use a different email
      </button>
    </form>
  );
}

function IconField({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      {children}
    </div>
  );
}
