import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { z } from "zod";
import { Mail, Lock, User, Phone, ShieldCheck, ArrowRight, KeyRound, RefreshCw } from "lucide-react";
import { login, register, verifyOtp, resendOtp } from "@/lib/auth";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["login", "register"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in â€” TRI CUBE" },
      { name: "description", content: "Sign in or create your TRI CUBE student account to enroll in courses, download materials, and track progress." },
    ],
  }),
  component: AuthPage,
});

const inputCls = "w-full neo-input py-3.5 pl-11 pr-4 text-sm transition outline-none";

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"login" | "register">(search.mode ?? "login");
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:flex flex-1 flex-col justify-between hero-bg p-8">
        <div className="neo-card h-full w-full flex flex-col p-16 justify-between rounded-3xl">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <img src={logoAsset.url} alt="TRI CUBE" style={{ height: 52, width: 52, borderRadius: 10, objectFit: "contain", border: "1.5px solid var(--color-border)", background: "#fff", padding: 4 }} />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--navy)" }}>TRI<span style={{ color: "var(--teal)" }}>&middot;</span>CUBE</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-muted-foreground)" }}>Digital Solutions</div>
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-tight mt-4">
              Join 4,200+ <br />
              <span className="teal-text">learners</span>
            </h1>
            
            <div className="mt-16 space-y-6 flex flex-col">
              <div className="neo-card p-5 inline-flex items-center gap-5 w-72 rounded-2xl">
                <div className="font-bold text-2xl teal-text">4.2k+</div>
                <div className="text-sm font-medium">Students trained</div>
              </div>
              <div className="neo-card p-5 inline-flex items-center gap-5 w-72 rounded-2xl">
                <div className="font-bold text-2xl teal-text">12+</div>
                <div className="text-sm font-medium">Active Courses</div>
              </div>
              <div className="neo-card p-5 inline-flex items-center gap-5 w-72 rounded-2xl">
                <div className="font-bold text-2xl teal-text">94%</div>
                <div className="text-sm font-medium">Placement rate</div>
              </div>
            </div>
          </div>
          
          <div className="neo-card p-8 rounded-2xl mt-12 border-l-4 border-[var(--teal)]">
            <p className="italic text-lg text-foreground/80 leading-relaxed">"The school we wish we had"</p>
            <p className="mt-4 text-sm font-bold teal-text uppercase tracking-widest">â€” Founders</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative bg-background">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
             <div className="inline-flex items-center gap-3 mb-6">
              <img src={logoAsset.url} alt="TRI CUBE" style={{ height: 40, width: 40, borderRadius: 8, objectFit: "contain", border: "1.5px solid var(--color-border)", background: "#fff", padding: 3 }} />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--navy)" }}>TRI<span style={{ color: "var(--teal)" }}>&middot;</span>CUBE</div>
                <div style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-muted-foreground)" }}>Digital Solutions</div>
              </div>
            </div>
             <h2 className="text-3xl font-bold">
               {otpEmail
                 ? <>Verify your <span className="teal-text">email</span></>
                 : mode === "login"
                   ? <>Welcome <span className="teal-text">back</span></>
                   : <>Join <span className="teal-text">TRI CUBE</span></>}
             </h2>
             <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
               {otpEmail
                 ? "We sent a 6-digit code to your inbox."
                 : "Access your courses and track your progress."}
             </p>
          </div>
          
          <div className="neo-card p-8 rounded-[2rem]">
            {otpEmail ? (
              <OtpForm email={otpEmail} redirect={search.redirect} initialNotice={otpNotice} onBack={() => { setOtpEmail(null); setOtpNotice(null); }} />
            ) : (
              <>
                <div className="mb-8 flex rounded-full p-1.5 neo-inset">
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 rounded-full py-3 text-sm font-bold transition-all ${mode === "login" ? "neo-btn-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                  >Sign in</button>
                  <button
                    onClick={() => setMode("register")}
                    className={`flex-1 rounded-full py-3 text-sm font-bold transition-all ${mode === "register" ? "neo-btn-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                  >Create account</button>
                </div>
                {mode === "login"
                  ? <LoginForm redirect={search.redirect} />
                  : <RegisterForm onOtpNeeded={(e, notice) => { setOtpEmail(e); setOtpNotice(notice ?? null); }} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
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
        setBusy(true); setErr(null);
        try {
          await login(email, password);
          navigate({ to: (redirect as any) || "/me" });
        } catch (e: any) { setErr(e.message || "Login failed"); }
        finally { setBusy(false); }
      }}
      className="space-y-5"
    >
      <IconField icon={<Mail className="h-5 w-5" />}>
        <input required type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </IconField>
      <IconField icon={<Lock className="h-5 w-5" />}>
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </IconField>
      {err && <p className="border-l-4 border-destructive bg-destructive/5 p-4 rounded-xl text-sm text-destructive font-medium">{err}</p>}
      <button disabled={busy} className="neo-btn-primary w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all">
        {busy ? "Signing inâ€¦" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>
      <div className="flex justify-between text-sm font-medium pt-2">
        <Link to="/auth/forgot-password" className="teal-text transition hover:opacity-80">Forgot password?</Link>
        <span className="text-muted-foreground">Need help? <Link to="/contact" className="teal-text transition hover:opacity-80 ml-1">Contact us</Link></span>
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
        setBusy(true); setErr(null);
        try {
          const res = await register({ name, email, password, phone: phone || undefined });
          let notice: string | undefined;
          if (res.mailSent === false) {
            notice = res.devOtp
              ? `Email delivery is currently disabled. Use this verification code to activate your account: ${res.devOtp}`
              : "Account created, but we couldn't send the verification email. Ask the admin to check SMTP settings.";
          }
          onOtpNeeded(email, notice);
        } catch (e: any) { setErr(e.message || "Sign up failed"); }
        finally { setBusy(false); }
      }}
      className="space-y-5"
    >
      <IconField icon={<User className="h-5 w-5" />}>
        <input required minLength={2} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </IconField>
      <IconField icon={<Mail className="h-5 w-5" />}>
        <input required type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </IconField>
      <IconField icon={<Phone className="h-5 w-5" />}>
        <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
      </IconField>
      <IconField icon={<Lock className="h-5 w-5" />}>
        <input required type="password" minLength={8} placeholder="Password (min. 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </IconField>
      {err && <p className="border-l-4 border-destructive bg-destructive/5 p-4 rounded-xl text-sm text-destructive font-medium">{err}</p>}
      <button disabled={busy} className="neo-btn-primary w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all">
        {busy ? "Creating accountâ€¦" : <>Create account <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
        By continuing you agree to our terms. We'll email a 6-digit verification code to activate your account.
      </p>
    </form>
  );
}

function OtpForm({ email, redirect, onBack, initialNotice }: { email: string; redirect?: string; onBack: () => void; initialNotice?: string | null }) {
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
    setResending(true); setErr(null); setNotice(null);
    try {
      const res = await resendOtp(email);
      if (res.mailSent === false) {
        setNotice(res.devOtp
          ? `Email delivery is disabled. Your new code: ${res.devOtp}`
          : "Could not send email â€” SMTP is not configured. Please contact the admin.");
      } else {
        setNotice("A new code has been sent to your inbox.");
      }
      setCooldown(60);
    } catch (e: any) {
      const msg = e.message || "Could not resend code";
      const m = /wait (\d+)s/i.exec(msg);
      if (m) setCooldown(parseInt(m[1], 10));
      setErr(msg);
    } finally { setResending(false); }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(null);
        try {
          await verifyOtp(email, otp);
          navigate({ to: (redirect as any) || "/me" });
        } catch (e: any) { setErr(e.message || "Verification failed"); }
        finally { setBusy(false); }
      }}
      className="space-y-5"
    >
      <div className="flex items-start gap-4 neo-inset rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 teal-text" />
        <div>Sent a verification code to <strong className="text-foreground">{email}</strong>. Code expires in 10 minutes.</div>
      </div>
      <IconField icon={<KeyRound className="h-5 w-5" />}>
        <input
          required
          inputMode="numeric"
          maxLength={6}
          minLength={6}
          pattern="\d{6}"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className={`${inputCls} tracking-[0.5em] text-center text-lg font-bold`}
        />
      </IconField>
      {err && <p className="border-l-4 border-destructive bg-destructive/5 p-4 rounded-xl text-sm text-destructive font-medium">{err}</p>}
      {notice && !err && <p className="border-l-4 border-[var(--teal-soft)] bg-[var(--teal-soft)]/10 p-4 rounded-xl text-sm teal-text font-medium">{notice}</p>}
      <button disabled={busy} className="neo-btn-primary w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all">
        {busy ? "Verifyingâ€¦" : <>Verify & continue <ArrowRight className="h-4 w-4" /></>}
      </button>
      <div className="flex items-center justify-center gap-2 text-sm mt-4">
        <span className="text-muted-foreground">Didn't get the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="inline-flex items-center gap-1.5 font-bold teal-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
          {resending ? "Sendingâ€¦" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
      <button type="button" onClick={onBack} className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground transition pt-4">
        Use a different email
      </button>
    </form>
  );
}

function IconField({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60">{icon}</span>
      {children}
    </div>
  );
}


