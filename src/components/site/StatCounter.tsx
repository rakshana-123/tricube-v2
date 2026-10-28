import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      mv.set(0);
      const c = animate(mv, value, { duration: 1.6, ease: "easeOut" });
      return () => c.stop();
    } else {
      mv.set(0);
    }
  }, [inView, mv, value]);

  return (
    <span className="tabular-nums">
      <motion.span ref={ref}>{rounded}</motion.span>
      {suffix}
    </span>
  );
}