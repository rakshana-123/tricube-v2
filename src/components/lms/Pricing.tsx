import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
import { Reveal, motionConfig } from "./motion";

const PLANS = [
  {
    name: "Starter",
    monthly: 499,
    tagline: "Dip your toes",
    features: ["1 course at a time", "Community access", "Recordings for 6 months", "Certificate of completion"],
    cta: "Start free trial",
  },
  {
    name: "Professional",
    monthly: 999,
    tagline: "The full cohort experience",
    features: [
      "Unlimited courses",
      "Live cohorts + 1:1 mentors",
      "Lifetime recordings & notes",
      "Placement support",
      "QR-verifiable certificate",
    ],
    cta: "Go Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: 0,
    tagline: "For teams of 10+",
    features: [
      "Dedicated mentor pool",
      "Custom learning paths",
      "Team analytics dashboard",
      "Invoicing & SLA",
    ],
    cta: "Talk to sales",
  },
];

/**
 * Pricing — monthly/annual toggle with a shared-layout pill (layoutId),
 * AnimatePresence price swaps. Spec §29.
 */
export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            Pricing
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Simple plans, serious outcomes.
          </h2>

          <div
            className="mt-8 inline-flex rounded-full border border-[#E8E1DD] bg-[#F8F6F4] p-1"
            role="group"
            aria-label="Billing period"
          >
            {(["Monthly", "Annual"] as const).map((label) => {
              const active = (label === "Annual") === annual;
              return (
                <button
                  key={label}
                  onClick={() => setAnnual(label === "Annual")}
                  aria-pressed={active}
                  className={`relative rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${
                    active ? "text-white" : "text-[#6B625D] hover:text-[#0E263A]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-toggle"
                      className="absolute inset-0 rounded-full bg-[#247F7C]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative">
                    {label}
                    {label === "Annual" && (
                      <span className={active ? " text-[#7DD8D5]" : "text-[#247F7C]"}>
                        {" "}
                        −20%
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = p.monthly === 0 ? null : annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <motion.div
                key={p.name}
                className={`relative flex flex-col rounded-[24px] border p-7 ${
                  p.popular
                    ? "border-[#0E263A] bg-[#0E263A] text-white shadow-[0_32px_80px_-24px_rgba(14,38,58,0.45)]"
                    : "border-[#E8E1DD] bg-white"
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
                whileHover={{ y: -6 }}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2EA5A1] px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                    Most popular
                  </span>
                )}
                <h3
                  className={`text-[15px] font-bold tracking-wide uppercase ${
                    p.popular ? "text-[#7DD8D5]" : "text-[#247F7C]"
                  }`}
                >
                  {p.name}
                </h3>
                <p className={`mt-1 text-[13px] ${p.popular ? "text-white/60" : "text-[#6B625D]"}`}>
                  {p.tagline}
                </p>
                <div className="mt-5 flex h-14 items-baseline gap-1.5">
                  {price === null ? (
                    <span
                      className={`text-[34px] font-bold tracking-tight ${
                        p.popular ? "text-white" : "text-[#0E263A]"
                      }`}
                    >
                      Custom
                    </span>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className={`text-[34px] font-bold tracking-tight ${
                          p.popular ? "text-white" : "text-[#0E263A]"
                        }`}
                      >
                        ₹{price.toLocaleString("en-IN")}
                      </motion.span>
                    </AnimatePresence>
                  )}
                  {price !== null && (
                    <span
                      className={`text-[13px] font-medium ${
                        p.popular ? "text-white/60" : "text-[#6B625D]"
                      }`}
                    >
                      /mo{annual ? " · billed annually" : ""}
                    </span>
                  )}
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        className={`mt-0.5 flex-none ${p.popular ? "text-[#2EA5A1]" : "text-[#247F7C]"}`}
                        aria-hidden
                      />
                      <span
                        className={`text-[14px] leading-[1.5] ${
                          p.popular ? "text-white/85" : "text-[#6B625D]"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`mt-8 rounded-[10px] py-3 text-center text-[14px] font-semibold transition-colors ${
                    p.popular
                      ? "bg-[#247F7C] text-white hover:bg-[#2EA5A1]"
                      : "border border-[#E8E1DD] text-[#0E263A] hover:border-[#247F7C] hover:text-[#247F7C]"
                  }`}
                >
                  {p.cta}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
