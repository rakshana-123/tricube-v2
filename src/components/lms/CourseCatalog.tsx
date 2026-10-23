import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BookOpen, Brain, Code2, Database, Megaphone, Star } from "lucide-react";
import { COURSES } from "@/lib/site-data";
import { Reveal, motionConfig } from "./motion";

const CATEGORY_STYLE: Record<string, { icon: typeof Code2; from: string; to: string }> = {
  Programming: { icon: Code2, from: "#0E263A", to: "#265CA0" },
  Web: { icon: BookOpen, from: "#265CA0", to: "#2EA5A1" },
  Data: { icon: Database, from: "#1D6865", to: "#2EA5A1" },
  AI: { icon: Brain, from: "#0E263A", to: "#247F7C" },
  Marketing: { icon: Megaphone, from: "#6B625D", to: "#0E263A" },
};

/**
 * CourseCatalog — 4-col desktop / 2-col tablet / horizontal scroll mobile.
 * Cards lift 8px on hover with a spring; cover art scales ≤1.03 (spec §26).
 */
export function CourseCatalog() {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(COURSES.map((c) => c.category)))],
    [],
  );
  const courses = useMemo(
    () => (category === "All" ? COURSES : COURSES.filter((c) => c.category === category)),
    [category],
  );

  return (
    <section id="courses" className="scroll-mt-20 bg-[#F8F6F4] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[560px]">
            <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
              Catalog
            </p>
            <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
              Courses that ship careers.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  category === cat
                    ? "border-[#247F7C] bg-[#247F7C] text-white"
                    : "border-[#E8E1DD] bg-white text-[#6B625D] hover:border-[#2EA5A1]/50 hover:text-[#0E263A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {courses.map((c) => {
            const style = CATEGORY_STYLE[c.category] ?? CATEGORY_STYLE.Programming;
            return (
              <motion.article
                key={c.slug}
                className="w-[280px] flex-none snap-start overflow-hidden rounded-[16px] border border-[#E8E1DD] bg-white md:w-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
                whileHover={{ y: -8 }}
              >
                <div
                  className="relative h-28 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
                >
                  <motion.div
                    className="absolute inset-0 grid place-items-center text-white/90"
                    whileHover={{ scale: 1.03 }}
                    transition={motionConfig.hoverSpring}
                  >
                    <style.icon size={40} aria-hidden />
                  </motion.div>
                  <span className="absolute top-3 left-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                    {c.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-bold tracking-tight text-[#0E263A]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#6B625D]">
                    {c.trainer} · {c.duration}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[12px] font-semibold text-[#6B625D]">
                    <span className="inline-flex items-center gap-1 text-[#247F7C]">
                      <Star size={13} fill="currentColor" aria-hidden /> {c.rating}
                    </span>
                    <span>{c.students.toLocaleString("en-IN")} learners</span>
                    <span className="ml-auto text-[15px] font-bold text-[#0E263A]">
                      ₹{c.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
