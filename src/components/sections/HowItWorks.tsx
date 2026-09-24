import React from "react";
import { motion } from "framer-motion";
import { Search, Monitor, Trophy, Briefcase } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Choose a Course",
    description: "Browse our catalog and select a course that matches your career goals.",
    gradient: "linear-gradient(135deg, #0E263A 0%, #265CA0 60%, #2EA5A1 100%)",
  },
  {
    id: 2,
    icon: Monitor,
    title: "Learn at Your Pace",
    description:
      "Access video lessons, hands-on projects, and mentor support on your schedule.",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 70%, #247F7C 100%)",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Build Your Portfolio",
    description:
      "Complete real-world projects that showcase your skills to employers.",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #0E263A 80%, #265CA0 100%)",
  },
  {
    id: 4,
    icon: Briefcase,
    title: "Get Certified",
    description:
      "Earn an industry-recognized certificate and land your dream role.",
    gradient: "linear-gradient(135deg, #0E263A 0%, #2EA5A1 100%)",
  },
];

const trackers = Array.from({ length: 25 }, (_, i) => `tr-${i + 1}`);

export function HowItWorks() {
  return (
    <section style={{ padding: "110px 0", background: "#f0f4f8", position: "relative", overflow: "hidden" }}>
      {/* 3D Tilt Mouse Tracker CSS */}
      <style>{`
        .step-tilt-container {
          position: relative;
          width: 100%;
          height: 290px;
          transition: transform 200ms ease;
          user-select: none;
          -webkit-user-select: none;
        }

        .step-tilt-container:active {
          transform: scale(0.97);
        }

        .step-canvas {
          perspective: 800px;
          inset: 0;
          z-index: 10;
          position: absolute;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: 0;
          grid-template-areas:
            "tr-1 tr-2 tr-3 tr-4 tr-5"
            "tr-6 tr-7 tr-8 tr-9 tr-10"
            "tr-11 tr-12 tr-13 tr-14 tr-15"
            "tr-16 tr-17 tr-18 tr-19 tr-20"
            "tr-21 tr-22 tr-23 tr-24 tr-25";
        }

        .tracker {
          position: relative;
          z-index: 20;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .tr-1 { grid-area: tr-1; }
        .tr-2 { grid-area: tr-2; }
        .tr-3 { grid-area: tr-3; }
        .tr-4 { grid-area: tr-4; }
        .tr-5 { grid-area: tr-5; }
        .tr-6 { grid-area: tr-6; }
        .tr-7 { grid-area: tr-7; }
        .tr-8 { grid-area: tr-8; }
        .tr-9 { grid-area: tr-9; }
        .tr-10 { grid-area: tr-10; }
        .tr-11 { grid-area: tr-11; }
        .tr-12 { grid-area: tr-12; }
        .tr-13 { grid-area: tr-13; }
        .tr-14 { grid-area: tr-14; }
        .tr-15 { grid-area: tr-15; }
        .tr-16 { grid-area: tr-16; }
        .tr-17 { grid-area: tr-17; }
        .tr-18 { grid-area: tr-18; }
        .tr-19 { grid-area: tr-19; }
        .tr-20 { grid-area: tr-20; }
        .tr-21 { grid-area: tr-21; }
        .tr-22 { grid-area: tr-22; }
        .tr-23 { grid-area: tr-23; }
        .tr-24 { grid-area: tr-24; }
        .tr-25 { grid-area: tr-25; }

        .tr-1:hover ~ .step-card { transform: rotateX(18deg) rotateY(-12deg); }
        .tr-2:hover ~ .step-card { transform: rotateX(18deg) rotateY(-6deg); }
        .tr-3:hover ~ .step-card { transform: rotateX(18deg) rotateY(0deg); }
        .tr-4:hover ~ .step-card { transform: rotateX(18deg) rotateY(6deg); }
        .tr-5:hover ~ .step-card { transform: rotateX(18deg) rotateY(12deg); }

        .tr-6:hover ~ .step-card { transform: rotateX(9deg) rotateY(-12deg); }
        .tr-7:hover ~ .step-card { transform: rotateX(9deg) rotateY(-6deg); }
        .tr-8:hover ~ .step-card { transform: rotateX(9deg) rotateY(0deg); }
        .tr-9:hover ~ .step-card { transform: rotateX(9deg) rotateY(6deg); }
        .tr-10:hover ~ .step-card { transform: rotateX(9deg) rotateY(12deg); }

        .tr-11:hover ~ .step-card { transform: rotateX(0deg) rotateY(-12deg); }
        .tr-12:hover ~ .step-card { transform: rotateX(0deg) rotateY(-6deg); }
        .tr-13:hover ~ .step-card { transform: rotateX(0deg) rotateY(0deg); }
        .tr-14:hover ~ .step-card { transform: rotateX(0deg) rotateY(6deg); }
        .tr-15:hover ~ .step-card { transform: rotateX(0deg) rotateY(12deg); }

        .tr-16:hover ~ .step-card { transform: rotateX(-9deg) rotateY(-12deg); }
        .tr-17:hover ~ .step-card { transform: rotateX(-9deg) rotateY(-6deg); }
        .tr-18:hover ~ .step-card { transform: rotateX(-9deg) rotateY(0deg); }
        .tr-19:hover ~ .step-card { transform: rotateX(-9deg) rotateY(6deg); }
        .tr-20:hover ~ .step-card { transform: rotateX(-9deg) rotateY(12deg); }

        .tr-21:hover ~ .step-card { transform: rotateX(-18deg) rotateY(-12deg); }
        .tr-22:hover ~ .step-card { transform: rotateX(-18deg) rotateY(-6deg); }
        .tr-23:hover ~ .step-card { transform: rotateX(-18deg) rotateY(0deg); }
        .tr-24:hover ~ .step-card { transform: rotateX(-18deg) rotateY(6deg); }
        .tr-25:hover ~ .step-card { transform: rotateX(-18deg) rotateY(12deg); }

        .step-card {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 24px;
          border-radius: 24px;
          transition: transform 160ms ease-out, filter 300ms ease;
          background: var(--teal-gradient, linear-gradient(135deg, #0E263A 0%, #265CA0 60%, #2EA5A1 100%));
          box-shadow: 0 16px 40px rgba(14, 38, 58, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.25);
          overflow: hidden;
        }

        .step-card::before {
          content: '';
          background: linear-gradient(135deg, #2EA5A1 0%, #265CA0 50%, #0E263A 100%);
          filter: blur(2rem);
          opacity: 30%;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          z-index: -1;
          transition: opacity 250ms ease;
        }

        .step-tilt-container:hover .step-card::before {
          opacity: 85%;
        }

        .tracker:hover ~ .step-card {
          filter: brightness(1.12);
        }
      `}</style>

      {/* Background Decorative Blob */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "-6%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,165,161,0.1) 0%, transparent 70%)",
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
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              How It Works
            </span>
          </motion.div>
          <motion.h2 variants={featureCard} className="section-h2" style={{ marginTop: 12 }}>
            Start Learning in 4 Steps
          </motion.h2>
          <motion.p
            variants={featureCard}
            style={{
              marginTop: 14,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            A simple, structured path from curiosity to career-ready skills. Hover cards to feel the 3D mouse tracking!
          </motion.p>
        </motion.div>

        {/* 4 Cards Grid with 3D Tilt */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 24,
            position: "relative",
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div key={step.id} variants={featureCard}>
              <div className="step-tilt-container">
                <div className="step-canvas">
                  {trackers.map((trClass) => (
                    <div key={trClass} className={`tracker ${trClass}`} />
                  ))}

                  <div
                    className="step-card"
                    style={{ "--teal-gradient": step.gradient } as React.CSSProperties}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginBottom: 20,
                        }}
                      >
                        {/* Step Icon inside glowing glass box */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <step.icon size={24} color="#ffffff" />
                        </div>
                      </div>

                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#ffffff",
                          marginBottom: 10,
                          fontFamily: '"Inter", sans-serif',
                          letterSpacing: "-0.02em",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "rgba(255, 255, 255, 0.88)",
                        }}
                      >
                        {step.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.5px",
                        opacity: 0.9,
                      }}
                    >
                      <span>Explore</span> &rarr;
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
