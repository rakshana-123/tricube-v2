import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, TrendingUp } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

const benefits = [
  "Personalized learning paths based on your goals",
  "Live sessions with industry experts",
  "Hands-on projects with real-world applications",
  "Peer collaboration and networking opportunities",
  "Career support with resume reviews and mock interviews",
  "Industry-recognized certifications",
];

// Helper to stagger children internally in a component
const innerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const popIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring" as const } },
};

export function Benefits() {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "#f0f4f8", // Bright neumorphic base instead of Navy
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-grid">
          {/* ── LEFT: Text + Checklist ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={featureCard}>
              <span className="eyebrow">
                <span className="teal-dot" />
                Benefits
              </span>
            </motion.div>

            <motion.h2
              variants={featureCard}
              className="section-h2"
              style={{ marginTop: 20 }}
            >
              Why Learners{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Choose Us
              </span>
            </motion.h2>

            <motion.p
              variants={featureCard}
              style={{
                marginTop: 16,
                fontSize: 16,
                lineHeight: 1.65,
                color: "#526575",
                maxWidth: 440,
              }}
            >
              We combine expert instruction with cutting-edge technology to deliver
              an unmatched learning experience. Here is the proof in the numbers.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              style={{
                marginTop: 36,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={featureCard}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontSize: 15,
                    color: "#0E263A",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle2
                    size={18}
                    color="#2EA5A1"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  {benefit}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Custom Animated Metric Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              alignContent: "center",
            }}
          >
            {/* CARD 1: Completion Rate (Speedometer Gauge) */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "8px 8px 24px rgba(14,38,58,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative", width: 100, height: 60 }}>
                <svg viewBox="0 0 100 50" style={{ overflow: "visible" }}>
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f0f4f8"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#2EA5A1"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    initial={{ strokeDashoffset: 125.6 }}
                    whileInView={{ strokeDashoffset: 125.6 * (1 - 0.98) }}
                    viewport={viewportOnce}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#0E263A",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  98%
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#526575", marginTop: 12, fontWeight: 600 }}>
                Completion Rate
              </div>
            </motion.div>

            {/* CARD 2: Student Satisfaction (Horizontal Bar) */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "8px 8px 24px rgba(14,38,58,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0E263A" }}>92%</div>
              <div style={{ fontSize: 13, color: "#526575", marginTop: 2, fontWeight: 600, marginBottom: 16 }}>
                Student Satisfaction
              </div>
              <div style={{ width: "100%", height: 8, background: "#f0f4f8", borderRadius: 4, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #2EA5A1, #265CA0)", borderRadius: 4 }}
                />
              </div>
            </motion.div>

            {/* CARD 3: Job Placement (Trend Line) */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "8px 8px 24px rgba(14,38,58,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0E263A" }}>97%</div>
                  <div style={{ fontSize: 13, color: "#526575", marginTop: 2, fontWeight: 600 }}>
                    Job Placement
                  </div>
                </div>
                <div style={{ padding: 8, background: "rgba(46,165,161,0.1)", borderRadius: 10 }}>
                  <TrendingUp size={20} color="#2EA5A1" />
                </div>
              </div>
              
              <svg viewBox="0 0 100 30" style={{ width: "100%", height: 40, marginTop: 12, overflow: "visible" }}>
                <motion.path
                  d="M 0 25 Q 25 25, 40 15 T 70 10 T 100 5"
                  fill="none"
                  stroke="#2EA5A1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.circle
                  cx="100" cy="5" r="4" fill="#265CA0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: 1.7 }}
                />
              </svg>
            </motion.div>

            {/* CARD 4: Course Rating (Staggered Stars) */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "8px 8px 24px rgba(14,38,58,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0E263A" }}>4.9</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#526575" }}>/5</div>
              </div>
              <div style={{ fontSize: 13, color: "#526575", marginTop: 2, fontWeight: 600, marginBottom: 12 }}>
                Course Rating
              </div>
              
              <motion.div
                variants={innerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                style={{ display: "flex", gap: 4 }}
              >
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <motion.div key={i} variants={popIn}>
                    <Star
                      size={20}
                      fill={i === 4 ? "url(#half-star)" : "#F59E0B"}
                      color="#F59E0B"
                      strokeWidth={1}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Half-star gradient definition */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="90%" stopColor="#F59E0B" />
                    <stop offset="90%" stopColor="#f0f4f8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
