import React from "react";
import { motion } from "framer-motion";
import { Star, Users, Clock, ArrowRight } from "lucide-react";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";
import { Link } from "@tanstack/react-router";

const courses = [
  {
    title: "Web Development Bootcamp",
    category: "Development",
    instructor: "Aditya R.",
    rating: 4.9,
    students: "2.5K",
    duration: "12 weeks",
    price: "₹9,999",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #265CA0 100%)",
    slug: "web-development-bootcamp",
  },
  {
    title: "UI/UX Design Mastery",
    category: "Design",
    instructor: "Priya S.",
    rating: 4.8,
    students: "1.8K",
    duration: "8 weeks",
    price: "₹7,999",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 100%)",
    slug: "ui-ux-design",
  },
  {
    title: "Data Science Pro",
    category: "Data",
    instructor: "Rahul K.",
    rating: 4.9,
    students: "3.2K",
    duration: "16 weeks",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
    slug: "data-science-pro",
  },
  {
    title: "AI & Prompt Engineering",
    category: "AI",
    instructor: "Kabir V.",
    rating: 4.9,
    students: "980",
    duration: "6 weeks",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #265CA0 0%, #0E263A 100%)",
    slug: "ai-prompt-eng",
  },
  {
    title: "Full Stack MERN",
    category: "Web",
    instructor: "Priya S.",
    rating: 4.8,
    students: "860",
    duration: "14 weeks",
    price: "₹16,999",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #265CA0 100%)",
    slug: "full-stack-mern",
  },
  {
    title: "Power BI Analyst",
    category: "Data",
    instructor: "Sneha M.",
    rating: 4.8,
    students: "720",
    duration: "6 weeks",
    price: "₹6,999",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #265CA0 0%, #2EA5A1 100%)",
    slug: "power-bi",
  },
  {
    title: "Java + Spring Boot",
    category: "Programming",
    instructor: "Meera J.",
    rating: 4.7,
    students: "410",
    duration: "16 weeks",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
    slug: "java-spring",
  },
  {
    title: "Digital Marketing 360",
    category: "Marketing",
    instructor: "Ishaan D.",
    rating: 4.7,
    students: "640",
    duration: "8 weeks",
    price: "₹9,999",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
    gradient: "linear-gradient(135deg, #265CA0 0%, #0E263A 100%)",
    slug: "digital-marketing-360",
  },
];

export function CourseCatalog() {
  return (
    <section style={{ padding: "120px 0", background: "#f0f4f8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
          }}
          className="flex-col !items-start gap-4 sm:!flex-row sm:!items-end"
        >
          <div>
            <motion.div variants={featureCard}>
              <span className="eyebrow">
                <span className="teal-dot" />
                Trending Courses
              </span>
            </motion.div>
            <motion.h2
              variants={featureCard}
              className="section-h2"
              style={{ marginTop: 16 }}
            >
              Expand your skillset
            </motion.h2>
          </div>
          <motion.div variants={featureCard}>
            <a
              href="/courses"
              className="btn-ghost"
              style={{ padding: "10px 20px" }}
            >
              View All Courses
            </a>
          </motion.div>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 32,
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-4"
        >
          {courses.map((course) => (
            <motion.div
              key={course.title}
              variants={featureCard}
              whileHover={{
                y: -8,
                transition: { type: "spring" as const, stiffness: 350, damping: 25 },
              }}
              style={{
                borderRadius: 24,
                background: "#f0f4f8",
                boxShadow:
                  "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card Image Header */}
              <div
                style={{
                  height: 160,
                  position: "relative",
                  backgroundColor: "#E2E8F0",
                  overflow: "hidden",
                }}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(14,38,58,0.7) 0%, transparent 70%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "rgba(46,165,161,0.85)",
                    padding: "3px 10px",
                    borderRadius: 50,
                    letterSpacing: "0.02em",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {course.category}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: 18 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#2EA5A1",
                    background: "rgba(46,165,161,0.1)",
                    marginBottom: 10,
                    letterSpacing: "0.02em",
                  }}
                >
                  {course.category}
                </span>

                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0E263A",
                    lineHeight: 1.3,
                    marginBottom: 6,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {course.title}
                </h3>

                <p style={{ fontSize: 13, color: "#526575", marginBottom: 12 }}>
                  by {course.instructor}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 12,
                    color: "#526575",
                    marginBottom: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} fill="#2EA5A1" color="#2EA5A1" /> {course.rating}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={12} /> {course.students}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {course.duration}
                  </span>
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: "1px solid rgba(14,38,58,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#2EA5A1",
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {course.price}
                  </span>
                  <a
                    href={`/courses/${course.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2EA5A1",
                      textDecoration: "none",
                    }}
                  >
                    Enroll <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/courses" className="btn-primary">
              View All Courses
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
