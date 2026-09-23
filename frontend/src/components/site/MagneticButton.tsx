import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { magneticSpring } from "@/lib/motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", style, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);
  const [isTouch, setIsTouch] = useState(false);

  React.useEffect(() => {
    setIsTouch("ontouchstart" in window);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouch) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.15)));
      y.set(Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.15)));
    },
    [x, y, isTouch],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}
