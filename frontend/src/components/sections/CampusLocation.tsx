import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

export function CampusLocation() {
  return (
    <section
      style={{
        padding: "100px 0",
        background: "#f0f4f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration blob */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,165,161,0.12) 0%, transparent 70%)",
          top: "10%",
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
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              Location
            </span>
          </motion.div>

          <motion.h2 variants={featureCard} className="section-h2" style={{ marginTop: 16 }}>
            Visit Our Campus
          </motion.h2>

          <motion.p
            variants={featureCard}
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We'd love to welcome you in person. Drop by our state-of-the-art learning hub for counseling, workshops, or a tour.
          </motion.p>
        </motion.div>

        {/* Content Grid: Left Info Cards + Right Map */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
            alignItems: "stretch",
          }}
          className="lg:!grid-cols-[420px_1fr]"
        >
          {/* Left Info Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Address Card */}
            <motion.div
              variants={featureCard}
              whileHover={{ y: -4, scale: 1.01 }}
              style={{
                padding: 24,
                borderRadius: 24,
                background: "#f0f4f8",
                boxShadow:
                  "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(46,165,161,0.15), rgba(38,92,160,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.8)",
                }}
              >
                <MapPin size={22} color="#2EA5A1" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Campus Address
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0E263A", marginTop: 4, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                  3rd Floor, Innovation Hub, Bengaluru, India
                </div>
              </div>
            </motion.div>

            {/* Timings Card */}
            <motion.div
              variants={featureCard}
              whileHover={{ y: -4, scale: 1.01 }}
              style={{
                padding: 24,
                borderRadius: 24,
                background: "#f0f4f8",
                boxShadow:
                  "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(46,165,161,0.15), rgba(38,92,160,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.8)",
                }}
              >
                <Clock size={22} color="#2EA5A1" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Working Hours
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0E263A", marginTop: 4, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                  Mon – Sat · 9:30 AM – 7:30 PM
                </div>
              </div>
            </motion.div>

            {/* Contact Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Phone Card */}
              <motion.a
                href="tel:+919000000000"
                variants={featureCard}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  background: "#f0f4f8",
                  boxShadow:
                    "6px 6px 16px rgba(14,38,58,0.1), -6px -6px 16px rgba(255,255,255,0.88)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "rgba(46,165,161,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={18} color="#2EA5A1" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase" }}>
                    Phone
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0E263A", marginTop: 2 }}>
                    +91 90000 00000
                  </div>
                </div>
              </motion.a>

              {/* Email Card */}
              <motion.a
                href="mailto:tricubedigitalsolutions@gmail.com"
                variants={featureCard}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  background: "#f0f4f8",
                  boxShadow:
                    "6px 6px 16px rgba(14,38,58,0.1), -6px -6px 16px rgba(255,255,255,0.88)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "rgba(38,92,160,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mail size={18} color="#265CA0" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase" }}>
                    Email
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0E263A", marginTop: 2, wordBreak: "break-all" }}>
                    tricubedigital...
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Map Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 28,
              background: "#f0f4f8",
              boxShadow:
                "12px 12px 30px rgba(14,38,58,0.12), -12px -12px 30px rgba(255,255,255,0.9)",
              padding: 12,
              position: "relative",
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: 360,
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <iframe
                title="Campus Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.98687786443!2d77.637500!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a75f0a0d0d%3A0xf6a7e0259b6b7a0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) saturate(1.1)", minHeight: 360 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Floating Map Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  background: "#f0f4f8",
                  padding: "10px 16px",
                  borderRadius: 14,
                  boxShadow: "4px 4px 12px rgba(14,38,58,0.15), -4px -4px 12px rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0E263A",
                }}
              >
                <Navigation size={15} color="#2EA5A1" />
                Bengaluru Campus
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
