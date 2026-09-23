import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

const highlights = [
  { icon: Zap, text: "Launch in minutes" },
  { icon: Target, text: "Career-focused paths" },
  { icon: TrendingUp, text: "95% placement rate" },
];

export function CTA() {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "#f0f4f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes cta-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .cta-shimmer-text {
          background: linear-gradient(135deg, #2EA5A1 0%, #60A5FA 50%, #2EA5A1 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cta-shimmer 5s ease infinite;
        }

        .cta-card-box {
          position: relative;
          background: #0E263A;
          border-radius: 32px;
          padding: clamp(48px, 6vw, 84px) clamp(24px, 5vw, 84px);
          text-align: center;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(14, 38, 58, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .cta-card-box:hover {
          box-shadow: 0 35px 80px rgba(46, 165, 161, 0.35);
          border-color: rgba(46, 165, 161, 0.4);
        }
      `}</style>

      {/* Outer Container */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="cta-card-box"
        >
          {/* Animated Conic Gradient Overlay */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background:
                "conic-gradient(from 0deg, transparent 0 300deg, rgba(46,165,161,0.2) 340deg, rgba(96,165,250,0.25) 360deg)",
              pointerEvents: "none",
            }}
          />

          {/* Floating Neon Blobs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [-10, 10, -10], y: [-10, 10, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(46,165,161,0.25) 0%, transparent 70%)",
              top: "-25%",
              left: "-10%",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [10, -10, 10], y: [10, -10, 10] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{
              position: "absolute",
              width: 450,
              height: 450,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(38,92,160,0.25) 0%, transparent 70%)",
              bottom: "-25%",
              right: "-10%",
              pointerEvents: "none",
            }}
          />

          {/* Grid Dots Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          {/* Card Content Overlay */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Eyebrow Badge */}
            <motion.div variants={featureCard}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 20px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#2EA5A1",
                  background: "rgba(46,165,161,0.18)",
                  border: "1px solid rgba(46,165,161,0.35)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 16px rgba(46,165,161,0.2)",
                }}
              >
                <Sparkles size={14} color="#2EA5A1" />
                Get Started Today
              </motion.span>
            </motion.div>

            {/* Main Title */}
            <motion.h2
              variants={featureCard}
              style={{
                marginTop: 24,
                fontFamily: '"Inter", sans-serif',
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              Ready to Transform
              <br />
              <span className="cta-shimmer-text">Your Workflow?</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={featureCard}
              style={{
                marginTop: 18,
                maxWidth: 520,
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 16,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Join 4,000+ learners who are building their future with TRI CUBE.
              Build smarter. Work faster. Achieve more.
            </motion.p>

            {/* Animated Feature Highlights Pills */}
            <motion.div
              variants={featureCard}
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 16,
                marginTop: 32,
              }}
            >
              {highlights.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.08)",
                    padding: "8px 18px",
                    borderRadius: 50,
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(46,165,161,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={13} color="#2EA5A1" />
                  </div>
                  {text}
                </motion.div>
              ))}
            </motion.div>

            {/* Pulsing CTA Buttons */}
            <motion.div
              variants={featureCard}
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "16px 38px",
                    borderRadius: 16,
                    fontSize: 16,
                    fontWeight: 700,
                    textDecoration: "none",
                    color: "#fff",
                    background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                    boxShadow: "0 10px 30px rgba(46,165,161,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                >
                  Get Started Free
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "inline-flex" }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/courses"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "16px 36px",
                    borderRadius: 16,
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#ffffff",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(12px)",
                    cursor: "pointer",
                  }}
                >
                  View Courses
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
