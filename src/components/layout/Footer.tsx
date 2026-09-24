import React from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { footerStagger, footerCol, viewportOnce } from "@/lib/motion";

const footerLinks = {
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Careers", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
  Learning: [
    { label: "Courses", to: "/courses" },
    { label: "Free Trial", to: "/auth" },
    { label: "Materials", to: "/materials" },
    { label: "My Materials", to: "/my-materials" },
  ],
  Support: [
    { label: "Help Center", to: "/faq" },
    { label: "FAQ", to: "/faq" },
    { label: "Privacy Policy", to: "/about" },
    { label: "Terms of Service", to: "/about" },
  ],
};

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "#0E263A",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.06) 0%, transparent 70%)",
          top: "-20%",
          right: "-10%",
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
        {/* Top newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          style={{
            margin: "60px 0",
            padding: "36px 40px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                fontFamily: '"Inter", sans-serif',
                marginBottom: 6,
              }}
            >
              Stay in the loop
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              Get notified about new courses, events, materials, and career tips.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              style={{
                padding: "11px 18px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                minWidth: 220,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "11px 22px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(46,165,161,0.3)",
              }}
            >
              Subscribe
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </motion.div>

        {/* Main footer grid */}
        <motion.div
          variants={footerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            paddingBottom: 48,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
          }}
          className="lg:!grid-cols-12"
        >
          {/* Brand column */}
          <motion.div variants={footerCol} className="lg:!col-span-4">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                TC
              </div>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                TRI{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #2EA5A1, #265CA0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  CUBE
                </span>
              </span>
            </Link>

            <p
              style={{
                maxWidth: 300,
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Empowering the next generation with premium digital education, downloadable study materials, and innovative learning experiences.
            </p>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <a
                href="mailto:tricubedigitalsolutions@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                <Mail size={14} style={{ color: "#2EA5A1" }} />
                tricubedigitalsolutions@gmail.com
              </a>
              <a
                href="tel:+919000000000"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                }}
              >
                <Phone size={14} style={{ color: "#2EA5A1" }} />
                +91 90000 00000
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <MapPin size={14} style={{ color: "#2EA5A1" }} />
                3rd Floor, Innovation Hub, Bengaluru, India
              </div>
            </div>
          </motion.div>

          {/* Links column */}
          <motion.div variants={footerCol} className="lg:!col-span-5">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 32,
              }}
              className="sm:!grid-cols-3"
            >
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.25)",
                      marginBottom: 16,
                    }}
                  >
                    {category}
                  </h4>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.4)",
                            textDecoration: "none",
                            transition: "color 0.2s",
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Socials & Trial Pass column */}
          <motion.div variants={footerCol} className="lg:!col-span-3">
            <h4
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 16,
              }}
            >
              Follow Us
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  <social.icon size={15} />
                </motion.a>
              ))}
            </div>

            {/* Trial Pass Mini Card */}
            <div
              style={{
                marginTop: 32,
                padding: "20px 24px",
                borderRadius: 16,
                background: "rgba(46,165,161,0.08)",
                border: "1px solid rgba(46,165,161,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#2EA5A1",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                <Sparkles size={16} /> 7-Day Free Trial
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, lineHeight: 1.4 }}>
                Instant access to 200+ courses & live sessions.
              </div>
              <Link
                to="/auth"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#2EA5A1",
                  textDecoration: "none",
                }}
              >
                Start Trial →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
        <div
          style={{
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
          className="sm:!flex-row"
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} TRI CUBE Digital Solutions. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
