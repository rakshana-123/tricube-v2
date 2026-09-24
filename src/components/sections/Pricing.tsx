import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Starter",
    description: "Perfect for beginners",
    monthly: 19,
    yearly: 190,
    popular: false,
    features: [
      "5 Course Access",
      "Community Forum",
      "Basic Analytics",
      "Email Support",
      "Certificate of Completion",
    ],
  },
  {
    name: "Professional",
    description: "Most popular choice",
    monthly: 49,
    yearly: 490,
    popular: true,
    features: [
      "Unlimited Courses",
      "Live Workshops",
      "Advanced Analytics",
      "Priority Support",
      "Mentorship Access",
      "Career Guidance",
    ],
  },
  {
    name: "Enterprise",
    description: "For teams & organizations",
    monthly: 99,
    yearly: 990,
    popular: false,
    features: [
      "Everything in Pro",
      "Custom Learning Paths",
      "Team Dashboard",
      "API Access",
      "Dedicated Manager",
      "Custom Branding",
      "SSO Integration",
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      style={{
        padding: "120px 0",
        background: "#0E263A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.1) 0%, transparent 70%)",
          bottom: "-10%",
          right: "-5%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
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
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: "center", marginBottom: 48 }}
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
              Pricing
            </span>
          </motion.div>

          <motion.h2
            variants={featureCard}
            style={{
              marginTop: 20,
              fontFamily: '"Inter", sans-serif',
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            Simple,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Transparent
            </span>{" "}
            Pricing
          </motion.h2>

          <motion.p
            variants={featureCard}
            style={{
              marginTop: 12,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            No hidden fees. Cancel anytime. Choose the plan that fits your learning
            goals.
          </motion.p>

          {/* Toggle */}
          <motion.div
            variants={featureCard}
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                color: !annual ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "color 0.2s",
              }}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                background: annual
                  ? "linear-gradient(135deg, #2EA5A1, #265CA0)"
                  : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                position: "relative",
                padding: 0,
                boxShadow: annual ? "0 3px 12px rgba(46,165,161,0.4)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: annual ? 25 : 3,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            </button>
            <span
              style={{
                color: annual ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "color 0.2s",
              }}
            >
              Annual
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#2EA5A1",
                  background: "rgba(46,165,161,0.15)",
                  border: "1px solid rgba(46,165,161,0.25)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                Save 20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* Plan cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 24,
            maxWidth: 1000,
            margin: "0 auto",
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={featureCard}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 350, damping: 25 },
              }}
              style={{
                position: "relative",
                borderRadius: 24,
                padding: "clamp(24px, 3vw, 36px)",
                background: plan.popular
                  ? "linear-gradient(160deg, #f0f4f8 0%, #e8ecf0 100%)"
                  : "rgba(255,255,255,0.04)",
                border: plan.popular
                  ? "none"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: plan.popular
                  ? "16px 16px 40px rgba(14,38,58,0.25), -16px -16px 40px rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "5px 16px",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(46,165,161,0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Sparkles size={11} />
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: plan.popular ? "#526575" : "rgba(255,255,255,0.4)",
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: plan.popular ? "#526575" : "rgba(255,255,255,0.35)",
                  marginBottom: 20,
                }}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    color: plan.popular ? "#526575" : "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                  }}
                >
                  $
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={annual ? "year" : "month"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: plan.popular ? "#0E263A" : "#fff",
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {annual ? plan.yearly : plan.monthly}
                  </motion.span>
                </AnimatePresence>
                <span
                  style={{
                    fontSize: 14,
                    color: plan.popular ? "#526575" : "rgba(255,255,255,0.4)",
                  }}
                >
                  /{annual ? "yr" : "mo"}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: plan.popular
                    ? "rgba(14,38,58,0.08)"
                    : "rgba(255,255,255,0.07)",
                  margin: "20px 0",
                }}
              />

              {/* Features */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: plan.popular
                        ? "#526575"
                        : "rgba(255,255,255,0.65)",
                      lineHeight: 1.4,
                    }}
                  >
                    <Check
                      size={16}
                      color="#2EA5A1"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{ marginTop: 28 }}
              >
                <Link
                  to="/contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 13,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    color: plan.popular ? "#fff" : "rgba(255,255,255,0.8)",
                    background: plan.popular
                      ? "linear-gradient(135deg, #2EA5A1, #247F7C)"
                      : "rgba(255,255,255,0.06)",
                    border: plan.popular
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: plan.popular
                      ? "0 4px 16px rgba(46,165,161,0.35)"
                      : "none",
                    cursor: "pointer",
                  }}
                >
                  Get Started
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
