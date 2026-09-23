import React from "react";
import { motion } from "framer-motion";
import { dashboardReveal, staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

export function DashboardShowcase() {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "#0E263A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decoration */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,165,161,0.08) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div variants={featureCard}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 16px",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 600,
                color: "#2EA5A1",
                background: "rgba(46,165,161,0.15)",
                border: "1px solid rgba(46,165,161,0.25)",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#2EA5A1",
                }}
              />
              Platform
            </span>
          </motion.div>

          <motion.h2
            variants={featureCard}
            style={{
              marginTop: 20,
              fontFamily: '"Inter", sans-serif',
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Your Learning{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard
            </span>
          </motion.h2>

          <motion.p
            variants={featureCard}
            style={{
              marginTop: 16,
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Track your progress, manage courses, and achieve your goals with our
            intuitive dashboard.
          </motion.p>
        </motion.div>

        {/* Dashboard mock */}
        <motion.div
          variants={dashboardReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            borderRadius: 28,
            overflow: "hidden",
            background: "#f0f4f8",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              padding: "12px 24px",
              borderBottom: "1px solid rgba(14,38,58,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f0f4f8",
            }}
          >
            {[
              { color: "#FF5F57" },
              { color: "#FEBC2E" },
              { color: "#28C840" },
            ].map((dot, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: dot.color,
                  opacity: 0.7,
                }}
              />
            ))}
            <div
              style={{
                flex: 1,
                height: 28,
                borderRadius: 8,
                background: "#f0f4f8",
                boxShadow:
                  "inset 3px 3px 6px rgba(14,38,58,0.08), inset -3px -3px 6px rgba(255,255,255,0.9)",
                marginLeft: 16,
              }}
            />
          </div>

          {/* Dashboard body */}
          <div style={{ padding: 32 }}>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0E263A",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Welcome back, Student 👋
                </div>
                <div style={{ fontSize: 14, color: "#526575", marginTop: 4 }}>
                  Continue your learning journey
                </div>
              </div>
              <div
                style={{
                  padding: "9px 18px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #2EA5A1, #247F7C)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(46,165,161,0.3)",
                  cursor: "pointer",
                }}
              >
                Resume Learning →
              </div>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 28,
              }}
              className="!grid-cols-2 sm:!grid-cols-4"
            >
              {[
                { label: "Courses Enrolled", value: "12", change: "+2 this month" },
                { label: "Hours Learned", value: "148", change: "+24 this week" },
                { label: "Certificates", value: "5", change: "+1 this month" },
                { label: "Streak", value: "14 days", change: "Keep going! 🔥" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: 20,
                    borderRadius: 18,
                    background: "#f0f4f8",
                    boxShadow:
                      "6px 6px 16px rgba(14,38,58,0.1), -6px -6px 16px rgba(255,255,255,0.88)",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#526575", marginBottom: 6, fontWeight: 500 }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#0E263A",
                      letterSpacing: "-0.02em",
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#2EA5A1", marginTop: 4, fontWeight: 600 }}
                  >
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + activity row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
              className="!grid-cols-1 lg:!grid-cols-2fr-1fr"
            >
              {/* Bar chart */}
              <div
                style={{
                  padding: 24,
                  borderRadius: 18,
                  background: "#f0f4f8",
                  boxShadow:
                    "6px 6px 16px rgba(14,38,58,0.1), -6px -6px 16px rgba(255,255,255,0.88)",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0E263A",
                    marginBottom: 20,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Weekly Progress
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 100,
                  }}
                >
                  {[35, 55, 40, 70, 50, 80, 65, 90, 45, 75, 60, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={viewportOnce}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 6,
                        background:
                          i === 11
                            ? "linear-gradient(180deg, #2EA5A1, #265CA0)"
                            : "rgba(46,165,161,0.18)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div
                style={{
                  padding: 24,
                  borderRadius: 18,
                  background: "#f0f4f8",
                  boxShadow:
                    "6px 6px 16px rgba(14,38,58,0.1), -6px -6px 16px rgba(255,255,255,0.88)",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0E263A",
                    marginBottom: 16,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Recent Activity
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { text: "Completed Module 5", time: "2h ago" },
                    { text: "Scored 95% on Quiz", time: "5h ago" },
                    { text: "Started New Course", time: "1d ago" },
                    { text: "Earned Certificate", time: "3d ago" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 13,
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: "#f0f4f8",
                        boxShadow:
                          "inset 3px 3px 6px rgba(14,38,58,0.07), inset -3px -3px 6px rgba(255,255,255,0.85)",
                      }}
                    >
                      <span style={{ color: "#0E263A", fontWeight: 500 }}>
                        {item.text}
                      </span>
                      <span style={{ color: "#526575", fontSize: 11 }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
