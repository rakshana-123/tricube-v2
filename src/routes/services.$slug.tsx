import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { PageHero } from "@/components/site/SectionHeading";
import {
  getService,
  splitFeatures,
  absoluteMedia,
  parseSections,
  type ServiceDTO,
  type ServiceSection,
} from "@/lib/services-api";
import {
  CheckCircle2,
  Upload,
  Lock,
  ArrowLeft,
  CreditCard,
  FileUp,
  UserCheck,
  Mail,
  Clock,
  Sparkles,
} from "lucide-react";
import { startPayment, API_BASE } from "@/lib/payments";
import { PaymentRetry } from "@/components/site/PaymentRetry";
import { formatExpectedRange } from "@/lib/working-days";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — TRI CUBE Services` },
      {
        name: "description",
        content:
          "TRI CUBE service request — pay securely, submit your details, and our team delivers to your email.",
      },
    ],
  }),
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Service not found</h1>
      <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String(error?.message || error)}</p>
    </div>
  ),
});

type FormState = {
  name: string;
  email: string;
  phone: string;
  targetRole: string;
  notes: string;
  file: File | null;
};

function ServiceDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [svc, setSvc] = useState<ServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    getService(slug).then((r) => {
      if (alive) {
        setSvc(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const isResumeReview = slug === "resume-review";
  const expected = formatExpectedRange();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    targetRole: "",
    notes: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function runCheckout() {
    setError(null);
    if (!svc) return;
    if (!getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: `/services/${svc.slug}` } });
      return;
    }
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    if (form.file && form.file.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB.");
      return;
    }
    setSubmitting(true);
    setAttempt((n) => n + 1);
    try {
      const res = await startPayment({
        createOrderPath: "/api/service-requests/order",
        createOrderBody: { serviceSlug: svc.slug },
        title: svc.title,
        amountInr: svc.offerPrice ?? svc.price,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        onPaid: async (resp) => {
          if (resp.razorpay_signature === "demo_signature") return;
          const fd = new FormData();
          fd.append("serviceSlug", svc.slug);
          fd.append("name", form.name);
          fd.append("email", form.email);
          fd.append("phone", form.phone);
          fd.append("targetRole", form.targetRole);
          fd.append("notes", form.notes);
          fd.append("razorpayOrderId", resp.razorpay_order_id);
          fd.append("razorpayPaymentId", resp.razorpay_payment_id);
          fd.append("razorpaySignature", resp.razorpay_signature);
          if (form.file) fd.append("file", form.file);
          const r = await fetch(`${API_BASE}/api/service-requests`, { method: "POST", body: fd });
          if (!r.ok)
            throw new Error("Payment succeeded but submission failed. Our team will contact you.");
        },
      });
      if (res.status === "paid") setDone(true);
      else if (res.status === "demo")
        setError(
          res.message ||
            "Demo mode is enabled — no real payment was taken, so the service is not activated.",
        );
      else if (res.status === "cancelled")
        setError(res.message || "Payment was cancelled before it completed.");
      else if (res.status === "failed")
        setError(res.message || "Payment failed. Please try again.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runCheckout();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!svc) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Service not found</h1>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </div>
    );
  }
  const features = splitFeatures(svc.features);
  const img = absoluteMedia(svc.imageUrl);
  const priceOffer = svc.offerPrice ?? svc.price;
  const sections = parseSections(svc.sections);

  return (
    <>
      <PageHero
        eyebrow={isResumeReview ? "Resume Review · ₹99" : "Service request"}
        title={<>{svc.title}</>}
        subtitle={
          isResumeReview
            ? "Pay ₹99, upload your resume, and get a detailed line-by-line review from our expert — emailed to you in 3–4 working days."
            : "Pay first, share the details, and our team reviews and delivers to your email."
        }
      />

      {isResumeReview && (
        <section className="mx-auto max-w-6xl px-6">
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-4">
            {[
              { icon: CreditCard, title: "1. Pay ₹99", body: "Secure Razorpay checkout." },
              { icon: FileUp, title: "2. Upload resume", body: "PDF or DOCX, up to 10 MB." },
              {
                icon: UserCheck,
                title: "3. Expert reviews",
                body: "Our reviewer works on it in 3–4 working days.",
              },
              {
                icon: Mail,
                title: "4. Emailed back",
                body: `Reviewed file + notes to your inbox by ${expected}.`,
              },
            ].map((s) => (
              <div key={s.title} className="flex gap-3 rounded-xl bg-secondary/50 p-3">
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1fr_1.2fr]">
        <aside className="glass h-fit rounded-2xl p-6">
          {img && (
            <div className="mb-5 aspect-[16/9] overflow-hidden rounded-xl">
              <img src={img} alt={svc.title} className="h-full w-full object-cover" />
            </div>
          )}
          <h3 className="text-lg font-semibold">{svc.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Duration · {svc.duration}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {features.map((f: string) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-end gap-2">
            <div className="text-3xl font-semibold gold-text">₹{priceOffer.toLocaleString()}</div>
            {svc.price > priceOffer && (
              <div className="pb-1 text-xs text-muted-foreground line-through">
                ₹{svc.price.toLocaleString()}
              </div>
            )}
          </div>
          {isResumeReview && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Expected delivery: <b className="ml-1">{expected}</b>
            </p>
          )}
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Secure Razorpay checkout · UPI, cards, netbanking
          </p>
        </aside>

        {done ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">Request received</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {demo ? (
                <>
                  Demo mode — backend offline. Connect the local backend to actually deliver to{" "}
                  <b>{form.email}</b>.
                </>
              ) : isResumeReview ? (
                <>
                  Payment confirmed. Your reviewed resume will be emailed to <b>{form.email}</b> by{" "}
                  <b>{expected}</b>.
                </>
              ) : (
                <>
                  Payment confirmed. Our team will review your request and email the deliverable to{" "}
                  <b>{form.email}</b> shortly.
                </>
              )}
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse more services
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold">
              {isResumeReview ? "Your details & resume" : "Your details"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isResumeReview
                ? "We'll email the review to the address you enter here."
                : "We'll email the delivery to the address you enter here."}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Email *">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={isResumeReview ? "Phone (WhatsApp preferred)" : "Phone"}>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Target role / company">
                <input
                  value={form.targetRole}
                  onChange={(e) => set("targetRole", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. SDE-1, Fintech"
                />
              </Field>
            </div>
            <Field
              label={isResumeReview ? "What should the reviewer focus on?" : "Notes / requirements"}
            >
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={inputCls + " resize-none"}
                placeholder={
                  isResumeReview
                    ? "e.g. Applying for SDE-1 roles. Please improve impact statements, ATS score and formatting."
                    : "Tell us what you need. Links, references, deadlines…"
                }
              />
            </Field>
            <Field
              label={
                isResumeReview
                  ? "Upload your resume * (PDF or DOCX, max 10 MB)"
                  : "Attach file (resume, brief, references — max 10 MB)"
              }
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm hover:bg-secondary">
                <Upload className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate">
                  {form.file?.name ||
                    (isResumeReview
                      ? "Click to upload your resume (PDF or DOCX)"
                      : "Click to choose a file (PDF, DOCX, ZIP, images)")}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => set("file", e.target.files?.[0] || null)}
                  accept={
                    isResumeReview ? ".pdf,.doc,.docx" : ".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.txt"
                  }
                />
              </label>
            </Field>

            {error && !done && (
              <PaymentRetry
                message={error}
                attempt={attempt}
                busy={submitting}
                onRetry={() => {
                  void runCheckout();
                }}
                onDismiss={() => setError(null)}
              />
            )}

            <button
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting
                ? "Opening secure checkout…"
                : `Pay ₹${priceOffer.toLocaleString()} & submit`}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {isResumeReview ? (
                <>
                  Pay first via Razorpay. Your resume is sent to our expert and the review is
                  emailed back within 3–4 working days.
                </>
              ) : (
                <>
                  You'll pay first via Razorpay. Your details + file are then sent to our team for
                  review and email delivery.
                </>
              )}
            </p>
          </form>
        )}
      </section>

      {sections.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <SectionBlock key={i} section={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function SectionBlock({ section }: { section: ServiceSection }) {
  switch (section.type) {
    case "heading":
      return section.level === 3 ? (
        <h3 className="text-xl font-semibold">{section.text}</h3>
      ) : (
        <h2 className="text-2xl font-semibold md:text-3xl">{section.text}</h2>
      );
    case "paragraph":
      return (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {section.text}
        </p>
      );
    case "steps":
      return (
        <div>
          {section.title && <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>}
          <ol className="grid gap-3 md:grid-cols-2">
            {section.items.map((it, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--gradient-gold)] text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium">{it.title}</div>
                  {it.body && <div className="mt-1 text-xs text-muted-foreground">{it.body}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "benefits":
      return (
        <div>
          {section.title && <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>}
          <ul className="grid gap-2 md:grid-cols-2">
            {section.items.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-xl bg-secondary/50 px-4 py-3 text-sm"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
      );
    case "highlights":
      return (
        <div>
          {section.title && <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {section.items.map((h, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <div className="text-2xl font-semibold gold-text">{h.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {h.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "faq":
      return (
        <div>
          {section.title && <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>}
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {section.items.map((f, i) => (
              <details key={i} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="glass flex items-center gap-3 rounded-2xl p-5">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">{section.text}</p>
        </div>
      );
  }
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
