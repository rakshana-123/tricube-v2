import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-data";
import { Reveal, motionConfig } from "./motion";

/**
 * Testimonial carousel — AnimatePresence mode="wait", x-slide transitions,
 * manual controls + gentle 7s autoplay (paused on hover, off for
 * reduced motion). Spec §28.
 */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
    [],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    [],
  );

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, reduce, next]);

  const t = TESTIMONIALS[index];

  return (
    <section className="bg-[#F8F6F4] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            Testimonials
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Careers, in their words.
          </h2>
        </Reveal>

        <div
          className="relative mx-auto mt-12 max-w-[760px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote
            className="absolute -top-4 left-6 text-[#2EA5A1]/25"
            size={44}
            aria-hidden
          />
          <div className="overflow-hidden rounded-[24px] border border-[#E8E1DD] bg-white px-6 py-12 text-center sm:px-14">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: motionConfig.ease }}
              >
                <div
                  className="flex justify-center gap-1"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={16} className="fill-[#2EA5A1] text-[#2EA5A1]" aria-hidden />
                  ))}
                </div>
                <blockquote className="mx-auto mt-5 max-w-[46ch] text-[19px] leading-[1.55] font-medium tracking-tight text-[#0E263A] md:text-[22px]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-[15px] font-bold text-[#0E263A]">{t.name}</span>
                  <span className="mt-0.5 block text-[13px] font-medium text-[#6B625D]">
                    {t.role}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E8E1DD] bg-white text-[#0E263A] transition-colors hover:border-[#2EA5A1]/50"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-[#247F7C]" : "w-2 bg-[#E8E1DD] hover:bg-[#2EA5A1]/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E8E1DD] bg-white text-[#0E263A] transition-colors hover:border-[#2EA5A1]/50"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
