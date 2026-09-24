import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";
import { Link } from "@tanstack/react-router";

const faqs = [
  {
    q: "What courses do you offer?",
    a: "We offer comprehensive courses in web development, data science, cloud computing, AI/ML, cybersecurity, and more. All designed by industry experts with real-world applications.",
  },
  {
    q: "How does the mentorship program work?",
    a: "Each student is paired with an experienced mentor for personalized guidance, code reviews, career advice, and weekly 1-on-1 sessions tailored to your goals.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, we offer a full refund within 7 days if less than 20% of the course is completed. Contact our support team for assistance.",
  },
  {
    q: "Are certifications recognized?",
    a: "Yes. Every certificate is QR-verifiable and accepted by our 120+ hiring partners. They can be shared directly on LinkedIn and added to your portfolio.",
  },
  {
    q: "Do you offer team or enterprise plans?",
    a: "Yes! Enterprise includes custom learning paths, team dashboards, dedicated managers, API access, and custom branding. Contact us for a tailored quote.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, you can access select courses and community features for free. No credit card required to start exploring.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: "120px 0",
        background: "#f0f4f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft blob decoration */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(38,92,160,0.07) 0%, transparent 70%)",
          bottom: "5%",
          left: "-5%",
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
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
        className="lg:!grid-cols-[340px_1fr]"
      >
        {/* Left: sticky heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              FAQ
            </span>
          </motion.div>

          <motion.h2 variants={featureCard} className="section-h2">
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            variants={featureCard}
            style={{
              marginTop: 16,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 280,
            }}
          >
            Can't find what you're looking for? Contact our support team.
          </motion.p>

          {/* Contact CTA */}
          <motion.div
            variants={featureCard}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ marginTop: 28 }}
          >
            <Link to="/contact" className="btn-primary" style={{ width: "fit-content" }}>
              Contact Support
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Visual stats */}
          <motion.div
            variants={featureCard}
            style={{
              marginTop: 40,
              padding: "20px 24px",
              borderRadius: 20,
              background: "#f0f4f8",
              boxShadow:
                "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#f0f4f8",
                boxShadow:
                  "inset 4px 4px 10px rgba(14,38,58,0.1), inset -4px -4px 10px rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HelpCircle size={20} color="#2EA5A1" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0E263A",
                  letterSpacing: "-0.02em",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                &lt; 2h
              </div>
              <div style={{ fontSize: 12, color: "#526575", marginTop: 1 }}>
                Avg. support response time
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: FAQ accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                variants={featureCard}
                style={{
                  borderRadius: 20,
                  background: "#f0f4f8",
                  boxShadow: isOpen
                    ? "inset 6px 6px 14px rgba(14,38,58,0.1), inset -6px -6px 14px rgba(255,255,255,0.88)"
                    : "6px 6px 16px rgba(14,38,58,0.09), -6px -6px 16px rgba(255,255,255,0.86)",
                  overflow: "hidden",
                  transition: "box-shadow 0.35s ease",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: 600,
                    color: isOpen ? "#2EA5A1" : "#0E263A",
                    fontFamily: '"Inter", sans-serif',
                    transition: "color 0.25s ease",
                  }}
                >
                  <span style={{ flex: 1 }}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isOpen
                        ? "rgba(46,165,161,0.1)"
                        : "rgba(14,38,58,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.25s ease",
                    }}
                  >
                    <ChevronDown
                      size={16}
                      color={isOpen ? "#2EA5A1" : "#526575"}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div
                        style={{
                          padding: "0 24px 22px",
                          fontSize: 14,
                          lineHeight: 1.75,
                          color: "#526575",
                          borderTop: "1px solid rgba(46,165,161,0.1)",
                          paddingTop: 14,
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
