import { motion } from "framer-motion";
import { GraduationCap, Layers, TrendingUp } from "lucide-react";
import { AnimatedCounter, ProgressRing, Reveal } from "./motion";

/**
 * DashboardShowcase — large product mockup (scale 0.96→1 reveal) with
 * staggered metric cards (spec §27).
 */
export function DashboardShowcase() {
  return (
    <section id="dashboard" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-[600px] text-center">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            Learner dashboard
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            One dashboard. Zero guesswork.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#6B625D]">
            Streaks, module progress and placement readiness — everything a learner (and
            their mentor) needs on one screen.
          </p>
        </Reveal>

        <motion.div
          className="relative mx-auto mt-14 max-w-[960px]"
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-[24px] border border-[#E8E1DD] bg-white shadow-[0_40px_100px_-32px_rgba(14,38,58,0.3)]">
            <div className="flex items-center justify-between border-b border-[#E8E1DD] bg-[#F8F6F4] px-5 py-3">
              <span className="text-[12px] font-bold text-[#6B625D]">
                Placement readiness · MERN cohort
              </span>
              <span className="rounded-full bg-[#2EA5A1]/15 px-2.5 py-1 text-[11px] font-bold text-[#247F7C]">
                On track
              </span>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 lg:grid-cols-6">
              <motion.div
                className="rounded-[16px] border border-[#E8E1DD] p-4 sm:col-span-2 lg:col-span-2"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <p className="text-[11px] font-bold tracking-wide text-[#6B625D] uppercase">
                  Courses in progress
                </p>
                <p className="mt-2 text-[34px] leading-none font-bold tracking-tight text-[#0E263A]">
                  <AnimatedCounter value={4} />
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    ["Full Stack MERN", 64],
                    ["Data Science Pro", 41],
                    ["SQL Deep Dive", 88],
                  ].map(([name, pct]) => (
                    <div key={name as string}>
                      <div className="flex justify-between text-[11px] font-semibold text-[#6B625D]">
                        <span>{name}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F8F6F4]">
                        <motion.div
                          className="h-full rounded-full bg-[#2EA5A1]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="grid place-items-center rounded-[16px] border border-[#E8E1DD] p-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <ProgressRing progress={76} size={84} label="76%" />
                <p className="mt-2 text-[11px] font-bold text-[#6B625D]">Readiness</p>
              </motion.div>

              {[
                { icon: TrendingUp, label: "Learning hours", value: 128, suffix: "h" },
                { icon: Layers, label: "Labs completed", value: 46, suffix: "" },
                { icon: GraduationCap, label: "Certificates", value: 3, suffix: "" },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  className="rounded-[16px] border border-[#E8E1DD] p-4"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                >
                  <m.icon size={16} className="text-[#2EA5A1]" aria-hidden />
                  <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-[#0E263A]">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-1.5 text-[11px] font-bold text-[#6B625D]">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
