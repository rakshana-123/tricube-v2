import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

const testimonials = [
  {
    name: "Ananya P.",
    role: "SDE-1, Fintech",
    quote: "TRI CUBE turned my confusion into a career. Placed 3 weeks after completing the MERN capstone project!",
    rating: 5,
    initials: "AP",
    gradient: "linear-gradient(135deg, #0E263A 0%, #265CA0 60%, #2EA5A1 100%)",
  },
  {
    name: "Rohit S.",
    role: "Data Analyst",
    quote: "The Power BI + SQL combo was practical from day one. My interview cases felt just like course homework.",
    rating: 5,
    initials: "RS",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 70%, #247F7C 100%)",
  },
  {
    name: "Meera K.",
    role: "AI Engineer Intern",
    quote: "The AI cohort mentors literally reviewed every PR I opened. Insane real-world value and guidance.",
    rating: 5,
    initials: "MK",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #0E263A 80%, #265CA0 100%)",
  },
  {
    name: "Karthik R.",
    role: "Full Stack Dev",
    quote: "Loved the live industry projects. I walked into interviews with a real, production-level portfolio.",
    rating: 5,
    initials: "KR",
    gradient: "linear-gradient(135deg, #0E263A 0%, #2EA5A1 100%)",
  },
  {
    name: "Priya N.",
    role: "UI/UX Designer",
    quote: "The design program gave me the confidence to switch careers seamlessly. Best investment I ever made!",
    rating: 5,
    initials: "PN",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 100%)",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Active 3 cards to render in the fanning deck
  const activeTestimonials = [
    { ...testimonials[current % testimonials.length], rot: -15 },
    { ...testimonials[(current + 1) % testimonials.length], rot: 5 },
    { ...testimonials[(current + 2) % testimonials.length], rot: 25 },
  ];

  return (
    <section
      style={{
        padding: "100px 0",
        background: "#f0f4f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .fan-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 380px;
          padding: 30px 10px;
          width: 100%;
        }

        .glass-card {
          position: relative;
          width: clamp(290px, 85vw, 360px);
          height: 300px;
          background: var(--card-bg, linear-gradient(135deg, #0E263A 0%, #265CA0 60%, #2EA5A1 100%));
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 16px 40px rgba(14, 38, 58, 0.25);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 28px;
          margin: 0 -70px;
          transform: rotate(calc(var(--r) * 1deg));
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          user-select: none;
        }

        @media (max-width: 640px) {
          .glass-card {
            margin: 0 -90px;
            height: 310px;
          }
        }

        .fan-container:hover .glass-card {
          transform: rotate(0deg);
          margin: 12px 16px;
        }

        .glass-card:hover {
          transform: translateY(-12px) rotate(0deg) scale(1.04) !important;
          z-index: 20 !important;
          box-shadow: 0 25px 50px rgba(46, 165, 161, 0.38);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .glass-card-inner {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 26px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Background Decorative Gradient */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.14) 0%, transparent 70%)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: "center", marginBottom: 30 }}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              Student Feedback
            </span>
          </motion.div>

          <motion.h2 variants={featureCard} className="section-h2" style={{ marginTop: 12 }}>
            What Our Students Say
          </motion.h2>

          <motion.p
            variants={featureCard}
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Real feedback from graduates who built their skills, landed tech jobs, and transformed their careers with TRI CUBE. Hover cards to fan out!
          </motion.p>
        </motion.div>

        {/* Interactive Fanning Glass Cards Deck */}
        <div className="fan-container">
          {activeTestimonials.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="glass-card"
              style={
                {
                  "--r": item.rot,
                  "--card-bg": item.gradient,
                  zIndex: idx + 1,
                } as React.CSSProperties
              }
            >
              <div className="glass-card-inner">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {Array.from({ length: item.rating }).map((_, j) => (
                        <Star key={j} size={15} fill="#FFB81C" color="#FFB81C" />
                      ))}
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 50,
                        background: "rgba(255,255,255,0.2)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      Verified Student
                    </span>
                  </div>

                  <Quote size={20} color="rgba(255,255,255,0.6)" style={{ marginBottom: 6 }} />

                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "#ffffff",
                      fontWeight: 500,
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginTop: 32,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1, y: -1 }}
            whileTap={{ scale: 0.92 }}
            onClick={prev}
            aria-label="Previous feedback"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: "none",
              background: "#f0f4f8",
              boxShadow:
                "6px 6px 14px rgba(14,38,58,0.12), -6px -6px 14px rgba(255,255,255,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#0E263A",
            }}
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to feedback ${i + 1}`}
                style={{
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  height: 6,
                  borderRadius: 3,
                  transition: "all 0.35s ease",
                  background: i === current ? "#2EA5A1" : "rgba(14,38,58,0.2)",
                  width: i === current ? 28 : 8,
                }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1, y: -1 }}
            whileTap={{ scale: 0.92 }}
            onClick={next}
            aria-label="Next feedback"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: "none",
              background: "#f0f4f8",
              boxShadow:
                "6px 6px 14px rgba(14,38,58,0.12), -6px -6px 14px rgba(255,255,255,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#0E263A",
            }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
