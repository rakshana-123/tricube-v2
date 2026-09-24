import React, { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [cursorX, cursorY, isVisible],
  );

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isTouch, prefersReduced]);

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);
    const interactives = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select",
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });
    return () => {
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [isTouch, prefersReduced, isVisible]);

  if (isTouch || prefersReduced || !isVisible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        width: isHovering ? 36 : 8,
        height: isHovering ? 36 : 8,
        borderRadius: "50%",
        background: "#2EA5A1",
        pointerEvents: "none",
        zIndex: 99999,
        transform: "translate(-50%, -50%)",
        transition: "width 0.2s, height 0.2s, background 0.2s",
        opacity: 0.8,
        mixBlendMode: "difference",
      }}
    />
  );
}
