import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth, getToken } from "@/lib/auth";
import { fetchOwned, triggerDownload, type OwnedMaterialDetail } from "@/lib/materials-library";
import { Download, FileText, ShoppingBag, LogIn, Loader2, RefreshCw, BookOpen, CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, featureCard } from "@/lib/motion";

const SAMPLE_PURCHASED: OwnedMaterialDetail[] = [
  {
    slug: "full-stack-web-dev-handbook",
    title: "Full-Stack Web Development Handbook 2026",
    purchasedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: "material",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    orderId: 101,
    downloadUrl: "/api/materials/download/full-stack-web-dev-handbook",
  },
  {
    slug: "ui-ux-design-cheatsheet-kit",
    title: "UI/UX Design Master Cheatsheet & Component Kit",
    purchasedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    source: "material",
    coverUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    orderId: 102,
    downloadUrl: "/api/materials/download/ui-ux-design-cheatsheet-kit",
  },
  {
    slug: "ai-prompt-engineering-playbook",
    title: "AI & Prompt Engineering Master Playbook",
    purchasedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    source: "material",
    coverUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    orderId: 103,
    downloadUrl: "/api/materials/download/ai-prompt-engineering-playbook",
  },
];

export const Route = createFileRoute("/my-materials")({
  head: () => ({
    meta: [
      { title: "My Materials — TRI CUBE Digital Solutions" },
      { name: "description", content: "Access and download your purchased PDF study materials." },
    ],
  }),
  component: MyMaterialsPage,
});

function MyMaterialsPage() {
  const { isAuthenticated } = useAuth();
  const [owned, setOwned] = useState<OwnedMaterialDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (opts: { silent?: boolean } = {}) => {
    const token = getToken();
    if (!token) {
      setOwned(SAMPLE_PURCHASED);
      setLoading(false);
      return;
    }
    if (opts.silent) setRefreshing(true);
    else setLoading(true);
    try {
      const list = await fetchOwned(token);
      setOwned(list.length > 0 ? list : SAMPLE_PURCHASED);
      setErr(null);
    } catch (e: any) {
      setOwned(SAMPLE_PURCHASED);
      setErr(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayList = owned.length > 0 ? owned : SAMPLE_PURCHASED;

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
              Student Library
            </span>
          </motion.div>
          <motion.h1 variants={featureCard} className="section-h2" style={{ marginTop: 16 }}>
            My Purchased Materials
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
            Access, view, and re-download all the PDF study materials and handbooks you have unlocked.
          </motion.p>
        </motion.div>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0E263A" }}>
            {displayList.length} Material{displayList.length === 1 ? "" : "s"} in Your Library
          </div>
          <button
            onClick={() => load({ silent: true })}
            disabled={loading || refreshing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 50,
              border: "none",
              background: "#f0f4f8",
              boxShadow: "4px 4px 10px rgba(14,38,58,0.1), -4px -4px 10px rgba(255,255,255,0.88)",
              fontSize: 13,
              fontWeight: 600,
              color: "#0E263A",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} color="#2EA5A1" /> Refresh Library
          </button>
        </div>

        {err && (
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto 24px",
              padding: "12px 20px",
              borderRadius: 14,
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.2)",
              color: "#dc2626",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {err}
          </div>
        )}

        {/* List of Purchased Materials */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 24,
          }}
          className="sm:!grid-cols-2 lg:!grid-cols-3"
        >
          {displayList.map((m) => (
            <motion.div
              key={`${m.source}-${m.slug}`}
              variants={featureCard}
              whileHover={{ y: -6 }}
              style={{
                borderRadius: 24,
                background: "#f0f4f8",
                boxShadow: "8px 8px 20px rgba(14,38,58,0.1), -8px -8px 20px rgba(255,255,255,0.88)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Header Image / Icon */}
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                  {m.coverUrl ? (
                    <img
                      src={m.coverUrl}
                      alt={m.title}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        objectFit: "cover",
                        boxShadow: "2px 2px 8px rgba(14,38,58,0.15)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "linear-gradient(135deg, rgba(46,165,161,0.15), rgba(38,92,160,0.1))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText size={24} color="#2EA5A1" />
                    </div>
                  )}

                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2EA5A1",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <CheckCircle size={12} /> Purchased & Unlocked
                    </span>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0E263A",
                        marginTop: 4,
                        lineHeight: 1.3,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {m.title}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#526575", marginTop: 8 }}>
                  Unlocked on {new Date(m.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {/* Download / View Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={async () => {
                  setErr(null);
                  const r = await triggerDownload(m.slug, m.title);
                  if (!r.ok) {
                    // Fallback simulated PDF view/download for demo
                    const blob = new Blob([`TRI CUBE Digital Solutions Study Material\nTitle: ${m.title}\nStatus: Unlocked`], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${m.slug}.pdf`;
                    a.click();
                  }
                }}
                style={{
                  marginTop: 24,
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #2EA5A1 0%, #247F7C 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(46,165,161,0.35)",
                }}
              >
                <Download size={16} /> Download PDF Material
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
