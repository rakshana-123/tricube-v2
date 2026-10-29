import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileUp,
  Lock,
  Mail,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentRetry } from "@/components/site/PaymentRetry";
import { getStoredUser } from "@/lib/auth";
import { API_BASE, startPayment } from "@/lib/payments";
import {
  absoluteMedia,
  getService,
  parseSections,
  splitFeatures,
  type ServiceDTO,
  type ServiceSection,
} from "@/lib/services-api";
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
    <div className="neo-surface min-h-[65vh] grid place-items-center px-6 py-24">
      <div className="neo-extruded max-w-md w-full p-10 text-center">
        <h1 className="font-display text-3xl font-extrabold">Service not found</h1>
        <Link
          to="/services"
          className="neo-cta-gold mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-extrabold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="neo-surface min-h-[65vh] grid place-items-center px-6 py-24">
      <div className="neo-extruded max-w-md w-full p-10 text-center">
        <h1 className="font-display text-2xl font-extrabold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {String(error?.message || error)}
        </p>
      </div>
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
  const prefersReduced = useReducedMotion();
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
  const [demo] = useState(false);
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
          const r = await fetch(`${API_BASE}/api/service-requests`, {
            method: "POST",
            body: fd,
          });
          if (!r.ok)
            throw new Error(
              "Payment succeeded but submission failed. Our team will contact you."
            );
        },
      });
      if (res.status === "paid") setDone(true);
      else if (res.status === "demo")
        setError(
          res.message ||
            "Demo mode is enabled — no real payment was taken, so the service is not activated."
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
      <div className="neo-surface min-h-[65vh] grid place-items-center px-6 py-24">
        <div className="neo-extruded px-8 py-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Loading sculpted service workspace…
        </div>
      </div>
    );
  }

  if (!svc) {
    return (
      <div className="neo-surface min-h-[65vh] grid place-items-center px-6 py-24">
        <div className="neo-extruded max-w-md w-full p-10 text-center">
          <h1 className="font-display text-3xl font-extrabold">Service not found</h1>
          <Link
            to="/services"
            className="neo-cta-gold mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-extrabold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to services
          </Link>
        </div>
      </div>
    );
  }

  const features = splitFeatures(svc.features);
  const img = absoluteMedia(svc.imageUrl);
  const priceOffer = svc.offerPrice ?? svc.price;
  const sections = parseSections(svc.sections);

  return (
    <div className="neo-surface text-zinc-900 dark:text-zinc-100 pb-20">
      {/* Sculpted Neomorphic Service Header */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 pb-8">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="neo-extruded relative overflow-hidden p-7 sm:p-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E09A3B] via-[#F4BA63] to-transparent"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/services"
              className="neo-orb inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold text-zinc-700 hover:text-[#C87E20] dark:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#E09A3B]" />
              <span>All Services</span>
            </Link>

            <span className="neo-inset inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#C87E20] dark:text-[#F0A847]">
              <Sparkles className="h-3.5 w-3.5 text-[#E09A3B]" />
              {isResumeReview ? "Resume Review · ₹99" : "Service Request"}
            </span>
          </div>

          <h1 className="font-display mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {svc.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {isResumeReview
              ? "Pay ₹99, upload your resume, and get a detailed line-by-line review from our expert — emailed to you in 3–4 working days."
              : "Pay securely first, share your requirements or brief, and our engineering team reviews and delivers straight to your email."}
          </p>
        </motion.div>
      </section>

      {isResumeReview && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-4">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            ].map((s, idx) => (
              <motion.div
                key={s.title}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="neo-extruded neo-extruded-interactive flex gap-3.5 p-5"
              >
                <div className="neo-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#E09A3B]">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-sm font-extrabold">{s.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {s.body}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Main Split Workspace: Sculpted Summary Card + Neomorphic Form */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 py-8 md:grid-cols-[1fr_1.22fr] items-start">
        <motion.aside
          initial={prefersReduced ? false : { opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="neo-extruded p-6 sm:p-7"
        >
          {img && (
            <div className="mb-5 neo-inset p-2.5">
              <div className="aspect-[16/9] overflow-hidden rounded-xl">
                <img src={img} alt={svc.title} className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          <h2 className="font-display text-xl font-extrabold">{svc.title}</h2>
          <p className="mt-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-[#E09A3B]" />
            Duration · {svc.duration}
          </p>

          <ul className="mt-5 space-y-2.5 text-sm">
            {features.map((f: string) => (
              <li key={f} className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 neo-inset p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              All-Inclusive Service Fee
            </div>
            <div className="mt-1 flex items-end gap-2.5">
              <div className="font-display text-3xl font-extrabold gold-text">
                ₹{priceOffer.toLocaleString()}
              </div>
              {svc.price > priceOffer && (
                <div className="pb-1 text-xs font-semibold text-zinc-400 line-through">
                  ₹{svc.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {isResumeReview && (
            <p className="mt-4 neo-inset flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium">
              <Clock className="h-3.5 w-3.5 text-[#E09A3B] shrink-0" />
              Expected delivery: <b className="ml-1 font-extrabold">{expected}</b>
            </p>
          )}

          <p className="mt-4 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Lock className="h-3.5 w-3.5 text-[#E09A3B] shrink-0" />
            Secure Razorpay checkout · UPI, cards, netbanking
          </p>
        </motion.aside>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neo-extruded p-8 sm:p-10 text-center"
          >
            <div className="neo-cta-gold mx-auto grid h-16 w-16 place-items-center rounded-full">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-extrabold">
              Request received
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {demo ? (
                <>
                  Demo mode — backend offline. Connect the local backend to actually
                  deliver to <b>{form.email}</b>.
                </>
              ) : isResumeReview ? (
                <>
                  Payment confirmed. Your reviewed resume will be emailed to{" "}
                  <b>{form.email}</b> by <b>{expected}</b>.
                </>
              ) : (
                <>
                  Payment confirmed. Our team will review your request and email the
                  deliverable to <b>{form.email}</b> shortly.
                </>
              )}
            </p>
            <Link
              to="/services"
              className="neo-cta-gold mt-7 inline-flex px-6 py-3 text-sm font-extrabold"
            >
              Browse more services
            </Link>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReduced ? false : { opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.58, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="neo-extruded p-6 sm:p-8"
          >
            <h3 className="font-display text-xl font-extrabold">
              {isResumeReview ? "Your details & resume" : "Your details"}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
              label={
                isResumeReview
                  ? "What should the reviewer focus on?"
                  : "Notes / requirements"
              }
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
              <label className="neo-inset flex cursor-pointer items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors hover:border-[#E09A3B]/50">
                <Upload className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span className="flex-1 truncate text-zinc-700 dark:text-zinc-300">
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
                    isResumeReview
                      ? ".pdf,.doc,.docx"
                      : ".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.txt"
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
              className="neo-cta-gold mt-7 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold disabled:opacity-60 cursor-pointer"
            >
              {submitting
                ? "Opening secure checkout…"
                : `Pay ₹${priceOffer.toLocaleString()} & submit`}
            </button>

            <p className="mt-3.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {isResumeReview ? (
                <>
                  Pay first via Razorpay. Your resume is sent to our expert and the
                  review is emailed back within 3–4 working days.
                </>
              ) : (
                <>
                  You'll pay first via Razorpay. Your details + file are then sent to
                  our team for review and email delivery.
                </>
              )}
            </p>
          </motion.form>
        )}
      </section>

      {sections.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-6 pb-8">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <SectionBlock key={i} section={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionBlock({ section }: { section: ServiceSection }) {
  switch (section.type) {
    case "heading":
      return section.level === 3 ? (
        <h3 className="font-display text-xl font-extrabold">{section.text}</h3>
      ) : (
        <h2 className="font-display text-2xl font-extrabold md:text-3xl">
          {section.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          {section.text}
        </p>
      );
    case "steps":
      return (
        <div>
          {section.title && (
            <h3 className="font-display mb-4 text-xl font-extrabold">
              {section.title}
            </h3>
          )}
          <ol className="grid gap-4 md:grid-cols-2">
            {section.items.map((it, i) => (
              <li key={i} className="neo-extruded flex gap-3.5 p-5">
                <span className="neo-cta-gold grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-display font-bold">{it.title}</div>
                  {it.body && (
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {it.body}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "benefits":
      return (
        <div>
          {section.title && (
            <h3 className="font-display mb-4 text-xl font-extrabold">
              {section.title}
            </h3>
          )}
          <ul className="grid gap-3 md:grid-cols-2">
            {section.items.map((t, i) => (
              <li
                key={i}
                className="neo-inset flex items-start gap-2.5 px-4 py-3.5 text-sm font-medium"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "highlights":
      return (
        <div>
          {section.title && (
            <h3 className="font-display mb-4 text-xl font-extrabold">
              {section.title}
            </h3>
          )}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {section.items.map((h, i) => (
              <div key={i} className="neo-extruded p-5">
                <div className="font-display text-2xl font-extrabold gold-text">
                  {h.value}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
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
          {section.title && (
            <h3 className="font-display mb-4 text-xl font-extrabold">
              {section.title}
            </h3>
          )}
          <div className="neo-extruded divide-y divide-zinc-200/60 dark:divide-zinc-800/80 overflow-hidden">
            {section.items.map((f, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="cursor-pointer list-none text-sm font-bold">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="neo-extruded flex items-center gap-3.5 p-5">
          <Sparkles className="h-5 w-5 shrink-0 text-[#E09A3B]" />
          <p className="text-sm font-bold">{section.text}</p>
        </div>
      );
  }
}

const inputCls =
  "neo-inset w-full px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#E09A3B]/45";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block text-sm">
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}
