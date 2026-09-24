import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageSquare, Mail, Send, CheckCircle2, Navigation } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — TRI CUBE Digital Solutions" },
      {
        name: "description",
        content:
          "Get in touch with TRI CUBE. Contact our campus in Bengaluru or send us a message online.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh", paddingTop: 130, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Page Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              Contact Us
            </span>
          </motion.div>
          <motion.h1 variants={featureCard} className="section-h2" style={{ marginTop: 16 }}>
            Get In Touch With Us
          </motion.h1>
          <motion.p
            variants={featureCard}
            style={{
              marginTop: 14,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Have a question about our courses, study materials, or admissions? Our team is here to help you.
          </motion.p>
        </motion.div>

        {/* Contact Section Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "start",
          }}
          className="lg:!grid-cols-12"
        >
          {/* ── LEFT: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="lg:!col-span-7"
            style={{
              padding: "clamp(28px, 4vw, 44px)",
              borderRadius: 28,
              background: "#f0f4f8",
              boxShadow:
                "12px 12px 30px rgba(14,38,58,0.1), -12px -12px 30px rgba(255,255,255,0.9)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0E263A", fontFamily: '"Inter", sans-serif' }}>
                Send Us a Message
              </div>
              <div style={{ fontSize: 14, color: "#526575", marginTop: 4 }}>
                Fill out the form below and we will respond within 2 hours.
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: 32,
                  borderRadius: 20,
                  background: "rgba(46,165,161,0.1)",
                  border: "1px solid rgba(46,165,161,0.25)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#2EA5A1",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 4px 14px rgba(46,165,161,0.3)",
                  }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0E263A" }}>
                  Message Sent Successfully!
                </div>
                <div style={{ fontSize: 14, color: "#526575", marginTop: 8, lineHeight: 1.6 }}>
                  Thank you <strong>{formData.fullName}</strong>. We have received your message regarding "<strong>{formData.subject || "General Inquiry"}</strong>" and will get back to you at <strong>{formData.email}</strong> shortly.
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ fullName: "", email: "", phoneNumber: "", subject: "", message: "" });
                  }}
                  style={{
                    marginTop: 24,
                    padding: "10px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2EA5A1, #247F7C)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="sm:!grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#f0f4f8",
                        boxShadow: "inset 3px 3px 7px rgba(14,38,58,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#f0f4f8",
                        boxShadow: "inset 3px 3px 7px rgba(14,38,58,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="sm:!grid-cols-2">
                  {/* Phone Number */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+91 90000 00000"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#f0f4f8",
                        boxShadow: "inset 3px 3px 7px rgba(14,38,58,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Course Admissions"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#f0f4f8",
                        boxShadow: "inset 3px 3px 7px rgba(14,38,58,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)",
                        fontSize: 14,
                        color: "#0E263A",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0E263A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 16,
                      border: "none",
                      background: "#f0f4f8",
                      boxShadow: "inset 3px 3px 7px rgba(14,38,58,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)",
                      fontSize: 14,
                      color: "#0E263A",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    padding: "16px 0",
                    borderRadius: 14,
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
                    boxShadow: "0 6px 20px rgba(46,165,161,0.35)",
                  }}
                >
                  Send Message <Send size={16} />
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* ── RIGHT: Contact Information ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="lg:!col-span-5"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0E263A", fontFamily: '"Inter", sans-serif' }}>
                Contact Information
              </div>
              <div style={{ fontSize: 14, color: "#526575", marginTop: 4 }}>
                Reach us directly via phone, email, WhatsApp or visit our campus.
              </div>
            </div>

            {/* Office / Location Card */}
            <motion.div
              whileHover={{ y: -3 }}
              style={{
                padding: 22,
                borderRadius: 22,
                background: "#f0f4f8",
                boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "linear-gradient(135deg, rgba(46,165,161,0.15), rgba(38,92,160,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.8)",
                }}
              >
                <MapPin size={20} color="#2EA5A1" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Office Location
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0E263A", marginTop: 4, lineHeight: 1.4 }}>
                  3rd Floor, Innovation Hub, Bengaluru, India
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.a
              href="tel:+919000000000"
              whileHover={{ y: -3 }}
              style={{
                padding: 22,
                borderRadius: 22,
                background: "#f0f4f8",
                boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(46,165,161,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Phone size={20} color="#2EA5A1" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Phone Number
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0E263A", marginTop: 4 }}>
                  +91 90000 00000
                </div>
              </div>
            </motion.a>

            {/* WhatsApp Card */}
            <motion.a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              style={{
                padding: 22,
                borderRadius: 22,
                background: "#f0f4f8",
                boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(37,211,102,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MessageSquare size={20} color="#25D366" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  WhatsApp Support
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0E263A", marginTop: 4 }}>
                  +91 90000 00000
                </div>
              </div>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:tricubedigitalsolutions@gmail.com"
              whileHover={{ y: -3 }}
              style={{
                padding: 22,
                borderRadius: 22,
                background: "#f0f4f8",
                boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(38,92,160,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Mail size={20} color="#265CA0" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#526575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Email Address
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0E263A", marginTop: 4, wordBreak: "break-all" }}>
                  tricubedigitalsolutions@gmail.com
                </div>
              </div>
            </motion.a>

            {/* Google Maps Embed */}
            <div
              style={{
                borderRadius: 24,
                background: "#f0f4f8",
                boxShadow: "10px 10px 24px rgba(14,38,58,0.12), -10px -10px 24px rgba(255,255,255,0.9)",
                padding: 10,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 240,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <iframe
                  title="TRI CUBE Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.98687786443!2d77.637500!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a75f0a0d0d%3A0xf6a7e0259b6b7a0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "contrast(1.05)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    background: "#f0f4f8",
                    padding: "6px 12px",
                    borderRadius: 10,
                    boxShadow: "2px 2px 8px rgba(14,38,58,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0E263A",
                  }}
                >
                  <Navigation size={13} color="#2EA5A1" />
                  Bengaluru Office
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
