import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, TrendingUp, Clock, Shield } from "lucide-react";
import { staggerContainer, viewportOnce } from "@/lib/motion";

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description:
      "Learn from industry professionals with real-world experience and proven track records.",
    gradient: "linear-gradient(135deg, #0E263A 0%, #265CA0 100%)",
    accent: "#2EA5A1",
    badge: "Top Rated",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join a network of 4,000+ learners and mentors collaborating every day.",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 100%)",
    accent: "#265CA0",
    badge: "4K+ Members",
  },
  {
    icon: Award,
    title: "Certified Programs",
    description:
      "Earn industry-recognized certificates that validate your new skills.",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #16A34A 100%)",
    accent: "#16A34A",
    badge: "ISO Verified",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "95% of our graduates see career advancement within 6 months of completion.",
    gradient: "linear-gradient(135deg, #0E263A 0%, #2EA5A1 100%)",
    accent: "#0E263A",
    badge: "95% Success",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Learn at your own pace with lifetime access to all course materials.",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #265CA0 100%)",
    accent: "#4F46E5",
    badge: "Lifetime Access",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description:
      "Every course is reviewed and approved by our quality team before publishing.",
    gradient: "linear-gradient(135deg, #D97706 0%, #2EA5A1 100%)",
    accent: "#D97706",
    badge: "100% Guaranteed",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

export function Features() {
  return (
    <section style={{ padding: "110px 0", background: "#f0f4f8", position: "relative", overflow: "hidden" }}>
      {/* CSS Animation for Hover Reveal Cards */}
      <style>{`
        .succeed-card {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(14, 38, 58, 0.15);
        }

        .succeed-card-front {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 24px;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          z-index: 1;
          text-align: center;
        }

        .succeed-card-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .succeed-card-front-title {
          font-size: 19px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.2px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .succeed-card-front-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.16);
          padding: 4px 12px;
          border-radius: 50px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .succeed-card:hover {
          transform: rotate(-4deg) scale(1.05);
          box-shadow: 0 22px 45px rgba(14, 38, 58, 0.28);
        }

        .succeed-card:hover .succeed-card-front {
          transform: scale(0) rotate(-45deg);
          opacity: 0;
        }

        .succeed-card-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          width: 100%;
          height: 100%;
          padding: 28px 24px;
          box-sizing: border-box;
          background-color: #ffffff;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          border-radius: 24px;
          border: 1px solid rgba(46, 165, 161, 0.2);
        }

        .succeed-card:hover .succeed-card-content {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 1;
        }

        .succeed-card-title {
          margin: 0;
          font-size: 20px;
          color: #0E263A;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
        }

        .succeed-card-description {
          margin: 10px 0 0;
          font-size: 14px;
          color: #526575;
          line-height: 1.6;
        }

        .succeed-card-footer {
          margin-top: 14px;
          font-size: 12px;
          font-weight: 700;
          color: #2EA5A1;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      {/* Decorative Blob */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(38,92,160,0.08) 0%, transparent 70%)",
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
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <motion.div variants={cardVariants}>
            <span className="eyebrow">
              <span className="teal-dot" />
              Features
            </span>
          </motion.div>

          <motion.h2 variants={cardVariants} className="section-h2" style={{ marginTop: 12 }}>
            Everything You Need to Succeed
          </motion.h2>

          <motion.p
            variants={cardVariants}
            style={{
              marginTop: 14,
              fontSize: 16,
              lineHeight: 1.65,
              color: "#526575",
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            A complete learning ecosystem designed to help you master new skills and
            advance your career. Hover any card to inspect details!
          </motion.p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 28,
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="succeed-card"
              style={{ background: feature.gradient }}
            >
              {/* Front View (Icon & Badge) */}
              <div className="succeed-card-front">
                <div className="succeed-card-icon-box">
                  <feature.icon size={30} color="#ffffff" />
                </div>
                <h3 className="succeed-card-front-title">{feature.title}</h3>
                <span className="succeed-card-front-badge">{feature.badge}</span>
              </div>

              {/* Hover Revealed Content */}
              <div className="succeed-card-content">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${feature.accent}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <feature.icon size={18} color={feature.accent} />
                </div>
                <h3 className="succeed-card-title">{feature.title}</h3>
                <p className="succeed-card-description">{feature.description}</p>
                <div className="succeed-card-footer">
                  <span>Explore Feature</span> &rarr;
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
