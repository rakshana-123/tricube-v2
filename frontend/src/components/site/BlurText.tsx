import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = defaultFrom;
  const toSnapshots = defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  return (
    <p ref={ref} className={`${className} flex flex-wrap`} style={{ margin: 0 }}>
      {elements.map((segment, index) => {
        const animateKeyframes: Record<string, Array<string | number>> = {};
        const allKeys = new Set([
          ...Object.keys(fromSnapshot),
          ...toSnapshots.flatMap((s) => Object.keys(s)),
        ]);
        allKeys.forEach((k) => {
          animateKeyframes[k] = [
            (fromSnapshot as Record<string, string | number>)[k],
            ...toSnapshots.map((s) => (s as Record<string, string | number>)[k]),
          ];
        });

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: "easeOut",
            }}
            onAnimationComplete={index === elements.length - 1 ? undefined : undefined}
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : ""}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
