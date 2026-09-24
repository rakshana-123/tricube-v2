import React from "react";
import { motion } from "framer-motion";

const EASING = [0.22, 1, 0.36, 1] as const;

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        transition: { duration: 0.75, ease: EASING },
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f4f8",
        overflow: "hidden",
      }}
    >
      {/* Decorative soft blobs */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.12) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(38,92,160,0.1) 0%, transparent 70%)",
          bottom: "15%",
          right: "10%",
          pointerEvents: "none",
        }}
      />

      {/* Logo container — neumorphic raised */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASING }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Logo badge */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              background: "#f0f4f8",
              boxShadow:
                "10px 10px 28px rgba(14,38,58,0.14), -10px -10px 28px rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 4,
                borderRadius: 22,
                border: "2px solid transparent",
                borderTop: "2px solid rgba(46,165,161,0.4)",
                borderRight: "2px solid rgba(46,165,161,0.15)",
              }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TC
            </span>
          </div>
        </motion.div>

        {/* Brand name — staggered letter reveal */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {"TRI CUBE".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.05,
                ease: EASING,
              }}
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                fontFamily: '"Inter", sans-serif',
                color: i < 3 ? "#2EA5A1" : "#0E263A",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            fontSize: 13,
            color: "#526575",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Digital Education Platform
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            width: 140,
            height: 3,
            borderRadius: 2,
            background: "rgba(14,38,58,0.08)",
            boxShadow:
              "inset 2px 2px 5px rgba(14,38,58,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #2EA5A1, #265CA0)",
              borderRadius: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
