import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/site-data";
import { Reveal, motionConfig } from "./motion";

/**
 * FAQ — accessible accordion: button + aria-expanded + aria-controls,
 * animated height/auto, rotating chevron. Spec §30.
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-[#F8F6F4] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">FAQ</p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Questions, answered.
          </h2>
        </Reveal>

        <motion.div
          className="mx-auto mt-12 max-w-[760px] space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                className="overflow-hidden rounded-[16px] border border-[#E8E1DD] bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#0E263A]">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-none text-[#247F7C]"
                  >
                    <ChevronDown size={18} aria-hidden />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: motionConfig.ease }}
                    >
                      <p className="px-5 pb-4 text-[14px] leading-[1.6] text-[#6B625D]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
