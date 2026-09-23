import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, ShieldCheck, Clock, Zap } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";
import { Link } from "@tanstack/react-router";

const trialPerks = [
  "7 Days Unlimited Access to 200+ Courses",
  "Live Weekly Q&A with Senior Mentors",
  "Hands-on Code Labs & Project Files",
  "QR-Verifiable Certificate of Completion",
  "No Credit Card Required to Start",
  "Cancel Anytime in 1 Click",
];

export function Trial() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      setSubmitted(true);
    }
  };

  return (
    <section
      style={{
        padding: "110px 0",
        background: "#0E263A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.18) 0%, transparent 70%)",
          top: "-15%",
          left: "-10%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(38,92,160,0.18) 0%, transparent 70%)",
          bottom: "-15%",
          right: "-5%",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="lg:!grid-cols-12"
        >
          {/* Left Text Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:!col-span-7"
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
                <Sparkles size={13} />
                7-Day Free Trial
              </span>
            </motion.div>

            <motion.h2
              variants={featureCard}
              style={{
                marginTop: 20,
                fontFamily: '"Inter", sans-serif',
                fontSize: "clamp(32px, 4.5vw, 54px)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              Start Your Free Trial.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2EA5A1 0%, #265CA0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Experience Premium Learning.
              </span>
            </motion.h2>

            <motion.p
              variants={featureCard}
              style={{
                marginTop: 18,
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 540,
              }}
            >
              Get full, unrestricted access to all courses, live workshops, and expert mentors for 7 full days. Test drive the platform before committing!
            </motion.p>

            {/* Trial Perks Checklist */}
            <motion.div
              variants={staggerContainer}
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
              }}
              className="sm:!grid-cols-2"
            >
              {trialPerks.map((perk) => (
                <motion.div
                  key={perk}
                  variants={featureCard}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: "rgba(46,165,161,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} color="#2EA5A1" />
                  </div>
                  {perk}
                </motion.div>
              ))}
            </motion.div>

            {/* Guarantee chips */}
            <motion.div
              variants={featureCard}
              style={{
                marginTop: 36,
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={16} color="#2EA5A1" />
                No credit card required
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={16} color="#2EA5A1" />
                Instant setup in 30s
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} color="#2EA5A1" />
                Cancel in 1 click
              </div>
            </motion.div>
          </motion.div>

          {/* Right Card / Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:!col-span-5"
          >
            <div
              style={{
                borderRadius: 28,
                background: "linear-gradient(160deg, #f0f4f8 0%, #e8ecf0 100%)",
                padding: "clamp(28px, 4vw, 40px)",
                boxShadow:
                  "16px 16px 40px rgba(14,38,58,0.3), -16px -16px 40px rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0E263A", fontFamily: '"Inter", sans-serif' }}>
                  Claim Your Free 7 Days
                </div>
                <div style={{ fontSize: 13, color: "#526575", marginTop: 4 }}>
                  No payment details required. Instant access.
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: 24,
                    borderRadius: 20,
                    background: "rgba(46,165,161,0.1)",
                    border: "1px solid rgba(46,165,161,0.25)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#2EA5A1",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 14px",
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0E263A" }}>
                    Trial Activated!
                  </div>
                  <div style={{ fontSize: 13, color: "#526575", marginTop: 6, lineHeight: 1.5 }}>
                    Welcome aboard, {name}! We've sent your instant access link to <strong>{email}</strong>.
                  </div>
                  <Link
                    to="/courses"
                    style={{
                      marginTop: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      padding: "12px 0",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                      color: "#fff",
                      background: "linear-gradient(135deg, #2EA5A1, #247F7C)",
                    }}
                  >
                    Explore All Courses <ArrowRight size={15} />
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(14,38,58,0.12)",
                        background: "#fff",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(14,38,58,0.12)",
                        background: "#fff",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "15px 0",
                      borderRadius: 13,
                      border: "none",
                      background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 16px rgba(46,165,161,0.4)",
                    }}
                  >
                    Start 7-Day Free Trial
                    <ArrowRight size={16} />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
