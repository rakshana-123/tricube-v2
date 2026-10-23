import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles, TrendingUp, Users } from "lucide-react";
import { STATS } from "@/lib/site-data";
import { AnimatedCounter, MagneticButton, motionConfig } from "./motion";

/**
 * Hero — left: eyebrow/headline/description/dual CTA/trust row.
 * Right: floating LMS dashboard mockup (course card, progress, analytics)
 * with staggered entrance and a gentle 5s float (reduced-motion aware).
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24">
      {/* soft teal wash, decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[#2EA5A1]/10 blur-3xl"
      />
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {[
            <span
              key="eyebrow"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E1DD] bg-[#F8F6F4] px-3 py-1 text-[13px] font-semibold text-[#247F7C]"
            >
              <Sparkles size={14} aria-hidden /> Live cohorts · Mentor-led
            </span>,
            <h1
              key="h1"
              className="mt-5 text-[40px] leading-[1.05] font-bold tracking-[-0.04em] text-[#0E263A] md:text-[64px]"
            >
              The learning platform that turns effort into{" "}
              <span className="text-[#247F7C]">careers</span>.
            </h1>,
            <p
              key="p"
              className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-[#6B625D] md:text-lg"
            >
              Live cohorts, real client projects and placement support — with a dashboard
              that keeps every learner on track from first lesson to offer letter.
            </p>,
            <div key="cta" className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#247F7C] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(36,127,124,0.5)] transition-colors hover:bg-[#1D6865]"
                >
                  Start learning <ArrowRight size={17} aria-hidden />
                </a>
              </MagneticButton>
              <a
                href="#dashboard"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#E8E1DD] bg-white px-6 py-3 text-[15px] font-semibold text-[#0E263A] transition-colors hover:bg-[#F8F6F4]"
              >
                <PlayCircle size={18} className="text-[#2EA5A1]" aria-hidden /> See it in action
              </a>
            </div>,
            <div key="trust" className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-[26px] font-bold tracking-tight text-[#0E263A]">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[13px] font-medium text-[#6B625D]">{s.label}</p>
                </div>
              ))}
            </div>,
          ].map((child) => (
            <motion.div
              key={child.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={reduce ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <DashboardMock />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** The floating product mockup — dashboard chrome, progress, analytics. */
function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E8E1DD] bg-white shadow-[0_32px_80px_-24px_rgba(14,38,58,0.25)]">
      <div className="flex items-center gap-1.5 border-b border-[#E8E1DD] bg-[#F8F6F4] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E8E1DD]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E8E1DD]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E8E1DD]" />
        <span className="ml-3 text-[11px] font-semibold text-[#6B625D]">
          studio.tricube.dev
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#6B625D]">Welcome back, Ada</p>
            <p className="text-[17px] font-bold tracking-tight text-[#0E263A]">
              Full Stack MERN · Module 6
            </p>
          </div>
          <span className="rounded-full bg-[#2EA5A1]/15 px-2.5 py-1 text-[11px] font-bold text-[#247F7C]">
            64% complete
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#F8F6F4]">
          <motion.div
            className="h-full rounded-full bg-[#2EA5A1]"
            initial={{ width: 0 }}
            animate={{ width: "64%" }}
            transition={{ duration: 1.2, delay: 0.5, ease: motionConfig.ease }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Streak", value: "12d", icon: Sparkles },
            { label: "Hours", value: "9.5", icon: TrendingUp },
            { label: "Peers", value: "48", icon: Users },
          ].map((m) => (
            <div key={m.label} className="rounded-[16px] border border-[#E8E1DD] p-3">
              <m.icon size={15} className="text-[#2EA5A1]" aria-hidden />
              <p className="mt-1.5 text-[17px] font-bold text-[#0E263A]">{m.value}</p>
              <p className="text-[11px] font-medium text-[#6B625D]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[16px] border border-[#E8E1DD] p-4">
          <p className="text-[12px] font-semibold text-[#6B625D]">This week&apos;s activity</p>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {[38, 55, 42, 70, 62, 88, 76].map((h, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-t-[4px] ${i === 5 ? "bg-[#2EA5A1]" : "bg-[#E8E1DD]"}`}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.06, ease: motionConfig.ease }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[16px] bg-[#0E263A] p-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2EA5A1]/20">
            <PlayCircle size={18} className="text-[#2EA5A1]" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-white">
              Next lesson: Redux Toolkit patterns
            </p>
            <p className="text-[11px] text-white/60">12 min · continues where you left off</p>
          </div>
          <span className="ml-auto rounded-full bg-[#247F7C] px-3 py-1.5 text-[11px] font-bold text-white">
            Resume
          </span>
        </div>
      </div>
    </div>
  );
}
