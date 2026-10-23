import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Central motion tokens — every animated component in the platform site
 * reuses these so timing/easing stays coherent (spec §44).
 * Ease [0.22, 1, 0.36, 1]: fast-out slow-in, the site's single reveal curve.
 */
export const motionConfig = {
  ease: [0.22, 1, 0.36, 1] as const,
  fast: 0.2,
  normal: 0.35,
  reveal: 0.65,
  hero: 0.8,
  spring: { type: "spring" as const, stiffness: 350, damping: 28 },
  hoverSpring: { type: "spring" as const, stiffness: 350, damping: 25 },
};

/** Standard scroll reveal — fades + rises 30px, once, 15% visible. */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: motionConfig.reveal, ease: motionConfig.ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MagneticButton — follows the cursor up to 8px. Disabled on touch devices
 * and reduced motion (spec §34).
 */
export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      x.set(Math.max(-8, Math.min(8, dx * 0.25)));
      y.set(Math.max(-8, Math.min(8, dy * 0.25)));
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, x, y]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

/** AnimatedCounter — counts up when scrolled into view. */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: motionConfig.ease });
    return () => controls.stop();
  }, [inView, value, duration, reduce, mv]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/** ProgressRing — animated SVG arc (spec §37). */
export function ProgressRing({
  progress,
  size = 64,
  stroke = 6,
  label,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E1DD" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2EA5A1"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: progress / 100 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: motionConfig.ease }}
        />
      </svg>
      {label && (
        <span className="absolute text-[11px] font-semibold text-[#0E263A]">{label}</span>
      )}
    </div>
  );
}
