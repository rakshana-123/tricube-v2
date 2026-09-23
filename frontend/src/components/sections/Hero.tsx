import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, BookOpen, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";

const EASING = [0.22, 1, 0.36, 1] as const;

/* ── Animated Counter Component ─────────────────────────────────── */
function FastCountNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const duration = 1600; // 1.6 seconds fast count
    const steps = 60;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  const formatted = Number.isInteger(target)
    ? Math.floor(count).toLocaleString()
    : count.toFixed(1);

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

/* ── Slide data ─────────────────────────────────────────────────── */
const slides = [
  {
    eyebrow: "Premium Digital Education",
    title: "Building Better",
    titleAccent: "Digital Careers",
    description:
      "Premium courses, expert-led training, and innovative learning experiences designed to transform your career and unlock your full potential.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "Students collaborating at a desk with laptops and books",
    ctaLabel: "Explore Courses",
    ctaTo: "/courses",
  },
  {
    eyebrow: "Industry-Recognized Certifications",
    title: "Certified Skills.",
    titleAccent: "Real Impact.",
    description:
      "Earn QR-verifiable certificates accepted by 120+ hiring partners. Build a portfolio that speaks for itself in any interview room.",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "A student studying in a modern library with books and a laptop",
    ctaLabel: "View Programs",
    ctaTo: "/courses",
  },
  {
    eyebrow: "Expert-Led Live Sessions",
    title: "Learn From",
    titleAccent: "The Best Minds",
    description:
      "Work directly with industry professionals who review your code, guide your projects, and open doors to real opportunities.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "Group of diverse students studying together with laptops",
    ctaLabel: "Meet Our Trainers",
    ctaTo: "/about",
  },
];

const heroStats = [
  { target: 4, suffix: "K+", label: "Students", icon: Users },
  { target: 20, suffix: "+", label: "Courses", icon: BookOpen },
  { target: 4.9, suffix: "★", label: "Rating", icon: Award },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0E263A",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Full-Screen Edge-to-Edge Background Image Slider */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`slide-${current}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.8, ease: EASING },
            }}
            transition={{ duration: 0.9, ease: EASING }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Full Screen Image */}
            <motion.img
              key={`bg-img-${current}`}
              src={slides[current].image}
              alt={slides[current].imageAlt}
              initial={{ scale: 1, x: 0 }}
              animate={{ scale: 1.08, x: -20 }}
              transition={{ duration: 6, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Dark Gradient Overlay for optimal readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(14,38,58,0.92) 0%, rgba(14,38,58,0.7) 50%, rgba(14,38,58,0.35) 100%), linear-gradient(to bottom, rgba(14,38,58,0.6) 0%, transparent 30%, rgba(14,38,58,0.85) 100%)",
                zIndex: 1,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Auto-scroll top progress line */}
        <motion.div
          key={`progress-${current}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 4,
            background: "linear-gradient(90deg, #2EA5A1, #265CA0)",
            zIndex: 20,
          }}
        />
      </div>

      {/* Hero Content Overlay (clears transparent fixed navbar) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(130px, 18vh, 180px) 24px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <div style={{ maxWidth: 780 }}>
          <motion.div
            key={`eyebrow-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASING }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 600,
                color: "#2EA5A1",
                background: "rgba(46,165,161,0.18)",
                border: "1px solid rgba(46,165,161,0.35)",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#2EA5A1",
                  boxShadow: "0 0 8px #2EA5A1",
                }}
              />
              {slides[current].eyebrow}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASING }}
            style={{
              marginTop: 24,
              fontFamily: '"Inter", sans-serif',
              fontSize: "clamp(42px, 6.5vw, 76px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
              textShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {slides[current].title}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #2EA5A1 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {slides[current].titleAccent}
            </span>
          </motion.h1>

          <motion.p
            key={`desc-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASING }}
            style={{
              marginTop: 22,
              fontSize: "clamp(16px, 1.5vw, 19px)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 580,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {slides[current].description}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASING }}
            style={{
              marginTop: 36,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={slides[current].ctaTo}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 36px",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                  boxShadow: "0 8px 24px rgba(46,165,161,0.45)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {slides[current].ctaLabel}
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 36px",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "#FFFFFF",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(14px)",
                }}
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Floating Area: Glass Stats Bar & Indicator Dots */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {/* Glass Stats Bar with Fast Count Scrolling */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(12px, 3vw, 36px)",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 24,
              padding: "16px 28px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
              flexGrow: 1,
              maxWidth: 720,
            }}
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(46,165,161,0.2)",
                    border: "1px solid rgba(46,165,161,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <stat.icon size={20} color="#2EA5A1" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#FFFFFF",
                      letterSpacing: "-0.02em",
                      fontFamily: '"Inter", sans-serif',
                      lineHeight: 1.1,
                    }}
                  >
                    <FastCountNumber target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.75)",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicator Dots */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "14px 22px",
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  height: 6,
                  borderRadius: 3,
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  background: i === current ? "#2EA5A1" : "rgba(255,255,255,0.3)",
                  width: i === current ? 32 : 8,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
