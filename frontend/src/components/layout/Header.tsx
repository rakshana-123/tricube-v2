import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";

const EASING = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/courses", label: "Courses" },
  { to: "/materials", label: "Materials" },
  { to: "/my-materials", label: "My Materials" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouterState();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? "down" : "up";
    if (latest > 60) {
      setIsScrolled(true);
      if (direction === "down" && latest - lastScrollY > 8) {
        setIsHidden(true);
      } else if (direction === "up") {
        setIsHidden(false);
      }
    } else {
      setIsScrolled(false);
      setIsHidden(false);
    }
    setLastScrollY(latest);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [router.location]);

  const currentPath = router.location.pathname;

  return (
    <motion.header
      initial={false}
      animate={isHidden ? { y: -100 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 16px",
      }}
    >
      {/* Floating Transparent Navbar Container */}
      <div
        style={{
          maxWidth: 1320,
          margin: "12px auto 0",
          borderRadius: 20,
          padding: "10px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isScrolled
            ? "rgba(240, 244, 248, 0.94)"
            : "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isScrolled
            ? "1px solid rgba(255, 255, 255, 0.8)"
            : "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: isScrolled
            ? "8px 8px 24px rgba(14,38,58,0.12), -8px -8px 24px rgba(255,255,255,0.88)"
            : "0 10px 30px rgba(0,0,0,0.2)",
          transition: "all 0.35s ease",
        }}
      >
        {/* Brand Logo with Hover Animation */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 4, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2EA5A1 0%, #265CA0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              fontFamily: '"Inter", sans-serif',
              boxShadow: "0 4px 14px rgba(46,165,161,0.4)",
            }}
          >
            TC
          </motion.div>
          <motion.span
            whileHover={{ scale: 1.02 }}
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: isScrolled ? "#0E263A" : "#FFFFFF",
              letterSpacing: "-0.03em",
              fontFamily: '"Inter", sans-serif',
              transition: "color 0.35s ease",
            }}
          >
            TRI{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2EA5A1, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CUBE
            </span>
          </motion.span>
        </Link>

        {/* Desktop Nav Links with Transparent Hover Pill */}
        <nav
          onMouseLeave={() => setHoveredNav(null)}
          style={{ display: "flex", alignItems: "center", gap: 2 }}
          className="hidden xl:flex"
        >
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.to);
            const isHovered = hoveredNav === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredNav(link.to)}
                style={{ position: "relative", textDecoration: "none" }}
              >
                {/* Hover Background Pill */}
                {isHovered && (
                  <motion.div
                    layoutId="hover-pill"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 10,
                      background: isScrolled
                        ? "rgba(46,165,161,0.12)"
                        : "rgba(255,255,255,0.16)",
                      zIndex: 0,
                    }}
                  />
                )}

                <motion.span
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "block",
                    padding: "7px 13px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isActive
                      ? "#2EA5A1"
                      : isHovered
                      ? "#2EA5A1"
                      : isScrolled
                      ? "#526575"
                      : "rgba(255,255,255,0.9)",
                    fontFamily: '"Inter", sans-serif',
                    transition: "color 0.25s ease",
                  }}
                >
                  {link.label}
                </motion.span>

                {/* Active Indicator Underline */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 16,
                      height: 2.5,
                      borderRadius: 2,
                      background: "linear-gradient(90deg, #2EA5A1, #60A5FA)",
                      boxShadow: "0 2px 8px rgba(46,165,161,0.6)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
          className="hidden xl:flex"
        >
          <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/auth"
              style={{
                display: "block",
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                color: isScrolled ? "#526575" : "rgba(255,255,255,0.9)",
                background: "transparent",
                transition: "color 0.25s",
              }}
            >
              Log in
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              to="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 22px",
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                color: "#fff",
                background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                boxShadow: "0 4px 14px rgba(46,165,161,0.4)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Get Started
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <ArrowRight size={13} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 11,
            border: isScrolled ? "none" : "1px solid rgba(255,255,255,0.25)",
            background: isScrolled ? "#f0f4f8" : "rgba(255,255,255,0.14)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            color: isScrolled ? "#0E263A" : "#FFFFFF",
          }}
          className="xl:hidden"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASING }}
            style={{
              maxWidth: 1320,
              margin: "8px auto 0",
              borderRadius: 20,
              background: isScrolled
                ? "rgba(240,244,248,0.97)"
                : "rgba(14,38,58,0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.18)",
              overflow: "hidden",
            }}
            className="xl:hidden"
          >
            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {navLinks.map((link, i) => {
                const isActive =
                  link.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(link.to);
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3, ease: EASING }}
                  >
                    <Link
                      to={link.to}
                      style={{
                        display: "block",
                        padding: "11px 16px",
                        borderRadius: 11,
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        color: isActive
                          ? "#2EA5A1"
                          : isScrolled
                          ? "#526575"
                          : "rgba(255,255,255,0.85)",
                        background: isActive
                          ? "rgba(46,165,161,0.12)"
                          : "transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 8,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Link
                  to="/auth"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 16px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: isScrolled ? "#526575" : "#fff",
                    background: isScrolled ? "#f0f4f8" : "rgba(255,255,255,0.12)",
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/contact"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "11px 16px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#fff",
                    background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                    boxShadow: "0 4px 14px rgba(46,165,161,0.3)",
                  }}
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
