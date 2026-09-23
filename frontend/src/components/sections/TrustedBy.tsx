import React from "react";
import { motion } from "framer-motion";

const companies = [
  {
    name: "Infosys",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 700, color: "#007CC3", fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}>
        Infosys
      </div>
    ),
  },
  {
    name: "TCS",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 800, color: "#003E6C", fontFamily: "sans-serif" }}>
        TCS
      </div>
    ),
  },
  {
    name: "Wipro",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 800, color: "#000000", fontFamily: "sans-serif" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 8px)", gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#11C3D0" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4BA23D" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#005CA9" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFC600" }} />
        </div>
        wipro
      </div>
    ),
  },
  {
    name: "Accenture",
    logo: (
      <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, color: "#000000", fontFamily: "sans-serif" }}>
        accenture<span style={{ color: "#A100FF", marginLeft: 2, fontWeight: 900 }}>&gt;</span>
      </div>
    ),
  },
  {
    name: "Deloitte",
    logo: (
      <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, color: "#000000", fontFamily: "sans-serif" }}>
        Deloitte<span style={{ color: "#86BC25", fontSize: 26 }}>.</span>
      </div>
    ),
  },
  {
    name: "Capgemini",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 22, fontWeight: 600, color: "#0070AD", fontFamily: "sans-serif", fontStyle: "italic" }}>
        <div style={{ width: 16, height: 20, background: "#0070AD", borderTopRightRadius: 10, borderBottomLeftRadius: 10 }} />
        Capgemini
      </div>
    ),
  },
  {
    name: "Zoho",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 26, fontWeight: 700, color: "#000000", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ width: 11, height: 11, background: "#E31837", borderRadius: 3 }} />
          <div style={{ width: 11, height: 11, background: "#0056A4", borderRadius: 3 }} />
          <div style={{ width: 11, height: 11, background: "#FFB81C", borderRadius: 3 }} />
          <div style={{ width: 11, height: 11, background: "#00833E", borderRadius: 3 }} />
        </div>
        ZOHO
      </div>
    ),
  },
  {
    name: "Razorpay",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 22, fontWeight: 700, color: "#0B2239", fontFamily: "sans-serif" }}>
        <div style={{ width: 18, height: 18, background: "linear-gradient(135deg, #02042B, #3395FF)", borderRadius: 4 }} />
        Razorpay
      </div>
    ),
  },
];

// Double the array to create a seamless infinite loop
const marqueeLogos = [...companies, ...companies];

export function TrustedBy() {
  return (
    <section
      style={{
        padding: "60px 0",
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(14,38,58,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#526575",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: 40,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Trusted by professionals at leading companies
        </motion.p>

        {/* Marquee Container */}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          {/* Animated Track */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 80,
              whiteSpace: "nowrap",
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            {marqueeLogos.map((company, i) => (
              <motion.div
                key={`${company.name}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.3s ease",
                  cursor: "default",
                }}
                whileHover={{ scale: 1.05 }}
              >
                {company.logo}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
