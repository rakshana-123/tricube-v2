import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, FileText, ArrowRight, Search, Sparkles, BookOpen, Download } from "lucide-react";
import {
  listMaterials,
  listBundles,
  absoluteMedia,
  type MaterialDTO,
} from "@/lib/materials-api";
import { useQuery } from "@tanstack/react-query";
import { staggerContainer, featureCard, viewportOnce } from "@/lib/motion";

const SAMPLE_MATERIALS: MaterialDTO[] = [
  {
    slug: "full-stack-web-dev-handbook",
    title: "Full-Stack Web Development Handbook 2026",
    description: "Complete guide covering React, Node.js, Next.js, System Design, and 50+ interview questions with code snippets.",
    category: "Development",
    price: 499,
    pages: 142,
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    slug: "ui-ux-design-cheatsheet-kit",
    title: "UI/UX Design Master Cheatsheet & Component Kit",
    description: "Essential Figma typography scale, color rules, layout grids, auto-layout guides, and micro-interaction patterns.",
    category: "Design",
    price: 399,
    pages: 88,
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    slug: "data-science-python-cheatsheet",
    title: "Data Science & Machine Learning Math Cheatsheet",
    description: "Comprehensive notes on NumPy, Pandas, Scikit-Learn, Linear Algebra, Probability, and Model Evaluation metrics.",
    category: "Data Science",
    price: 599,
    pages: 110,
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "ai-prompt-engineering-playbook",
    title: "AI & Prompt Engineering Master Playbook",
    description: "100+ tested system prompts, chain-of-thought strategies, RAG architecture notes, and LLM fine-tuning guides.",
    category: "AI / ML",
    price: 699,
    pages: 165,
    rating: 5.0,
    coverUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    slug: "java-spring-boot-interview-guide",
    title: "Java & Spring Boot Cracking the Coding Interview",
    description: "Core Java multithreading, Spring Security, Microservices architecture, Hibernate ORM, and 80+ top interview questions.",
    category: "Programming",
    price: 449,
    pages: 124,
    rating: 4.7,
    coverUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "digital-marketing-growth-playbook",
    title: "Digital Marketing 360 Growth & SEO Blueprint",
    description: "Step-by-step strategies for Meta Ads, Google Analytics 4, Technical SEO audits, conversion rate optimization, and copywriting.",
    category: "Marketing",
    price: 349,
    pages: 96,
    rating: 4.8,
    coverUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

export const Route = createFileRoute("/materials/")({
  head: () => ({
    meta: [
      { title: "Study Materials — TRI CUBE Digital Solutions" },
      {
        name: "description",
        content:
          "Downloadable PDF study materials uploaded by expert instructors — interview notes, cheatsheets, and comprehensive handbooks.",
      },
      { property: "og:title", content: "TRI CUBE Materials" },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const [category, setCategory] = useState<string>("all");
  const [q, setQ] = useState("");
  const materialsQ = useQuery({
    queryKey: ["materials", category, q],
    queryFn: () => listMaterials({ category, q }),
  });
  const bundlesQ = useQuery({ queryKey: ["bundles"], queryFn: listBundles });

  const fetched = materialsQ.data ?? [];
  const displayMaterials = fetched.length > 0 ? fetched : SAMPLE_MATERIALS;

  const filteredMaterials = useMemo(() => {
    return displayMaterials.filter((m) => {
      const matchCat = category === "all" || m.category.toLowerCase() === category.toLowerCase();
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.description.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [displayMaterials, category, q]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    displayMaterials.forEach((m) => m.category && set.add(m.category));
    return ["all", ...Array.from(set)];
  }, [displayMaterials]);

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh", paddingTop: 130, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Page Hero */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <motion.div variants={featureCard}>
            <span className="eyebrow">
              <span className="teal-dot" />
              Instructor & Admin Uploads
            </span>
          </motion.div>
          <motion.h1 variants={featureCard} className="section-h2" style={{ marginTop: 16 }}>
            All Study Materials
          </motion.h1>
          <motion.p
            variants={featureCard}
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
            Curated PDF handbooks, interview cheatsheets, and study notes prepared by expert instructors. Instant download & lifetime library access.
          </motion.p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: 20,
            borderRadius: 24,
            background: "#f0f4f8",
            boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
          className="md:!flex-row md:!items-center md:!justify-between"
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              maxWidth: 400,
            }}
          >
            <Search
              size={18}
              color="#526575"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, topic or keyword..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 46px",
                borderRadius: 50,
                border: "none",
                background: "#f0f4f8",
                boxShadow: "inset 3px 3px 8px rgba(14,38,58,0.1), inset -3px -3px 8px rgba(255,255,255,0.9)",
                fontSize: 14,
                color: "#0E263A",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  color: category === c ? "#fff" : "#526575",
                  background: category === c ? "linear-gradient(135deg, #2EA5A1, #247F7C)" : "#f0f4f8",
                  boxShadow: category === c ? "0 4px 12px rgba(46,165,161,0.3)" : "4px 4px 10px rgba(14,38,58,0.08), -4px -4px 10px rgba(255,255,255,0.85)",
                }}
              >
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Materials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 32,
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-3"
        >
          {filteredMaterials.map((m, index) => (
            <MaterialCard key={m.slug} m={m} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MaterialCard({ m, index }: { m: MaterialDTO; index: number }) {
  const cover = absoluteMedia(m.coverUrl) || m.coverUrl;

  return (
    <motion.div
      variants={featureCard}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 350, damping: 25 } }}
      style={{
        borderRadius: 24,
        background: "#f0f4f8",
        boxShadow: "8px 8px 24px rgba(14,38,58,0.12), -8px -8px 24px rgba(255,255,255,0.9)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* 1. Preview / Thumbnail */}
      <div
        style={{
          height: 180,
          position: "relative",
          background: "#0E263A",
          overflow: "hidden",
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={m.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0E263A, #265CA0)",
              color: "#2EA5A1",
            }}
          >
            <BookOpen size={48} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(14,38,58,0.85) 0%, transparent 60%)",
          }}
        />

        {/* 2. Category Pill */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(46,165,161,0.9)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 50,
            letterSpacing: "0.02em",
            backdropFilter: "blur(6px)",
          }}
        >
          {m.category}
        </div>

        {/* 3. Rating Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(14,38,58,0.85)",
            color: "#FFB81C",
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 8,
            backdropFilter: "blur(6px)",
          }}
        >
          <Star size={13} fill="#FFB81C" />
          {m.rating || 4.9}
        </div>

        {/* Page count pill top right */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 50,
            backdropFilter: "blur(6px)",
          }}
        >
          <FileText size={12} />
          {m.pages || 100} Pages
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 4. Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#0E263A",
            lineHeight: 1.35,
            fontFamily: '"Inter", sans-serif',
            marginBottom: 10,
          }}
        >
          {m.title}
        </h3>

        {/* 5. Description */}
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: "#526575",
            marginBottom: 20,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {m.description}
        </p>

        {/* Footer: 6. Page Count + 7. Price & Action Button */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid rgba(14,38,58,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#526575", textTransform: "uppercase" }}>Price</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0E263A",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              ₹{m.price.toLocaleString()}
            </div>
          </div>

          <Link
            to="/materials/$slug"
            params={{ slug: m.slug }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
              boxShadow: "0 4px 12px rgba(46,165,161,0.35)",
            }}
          >
            Get Material <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
