import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { motion } from "framer-motion";
import { Star, FileText, ArrowRight, Search, Package, Sparkles } from "lucide-react";
import { listMaterials, listBundles, absoluteMedia, type MaterialDTO, type BundleDTO } from "@/lib/materials-api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/materials/")({
  head: () => ({
    meta: [
      { title: "Study Materials â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Downloadable PDF study materials â€” interview notes, cheatsheets, resume templates and handbooks." },
      { property: "og:title", content: "TRI CUBE Materials" },
      { property: "og:description", content: "Premium PDF study materials, one-time payment, instant download." },
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

  const materials = materialsQ.data ?? [];
  const bundles = bundlesQ.data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    (materialsQ.data ?? []).forEach((m) => m.category && set.add(m.category));
    return ["all", ...Array.from(set)];
  }, [materialsQ.data]);

  return (
    <>
      <PageHero
        eyebrow="Materials"
        title={<>Premium <span className="teal-text">PDF study materials</span></>}
        subtitle="One-time payment. Instant download. Saved to your library for re-download anytime."
      />

      {/* Search + filters */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="glass flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search materialsâ€¦"
              className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  category === c
                    ? "border-transparent bg-[var(--gradient-gold)] text-primary-foreground"
                    : "border-border bg-background text-foreground/70 hover:border-primary"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">Bundles &amp; combo packs</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bundles.map((b) => (
              <BundleCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      {/* Materials */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">All materials</h2>
        </div>
        {materialsQ.isLoading ? (
          <p className="text-sm text-muted-foreground">Loadingâ€¦</p>
        ) : materials.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No materials match your search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <MaterialCard key={m.slug} m={m} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function MaterialCard({ m, index }: { m: MaterialDTO; index: number }) {
  const cover = absoluteMedia(m.coverUrl);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {cover ? (
          <img src={cover} alt={m.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-[var(--gradient-hero)]">
            <FileText className="h-10 w-10 text-primary" />
          </div>
        )}
        {m.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--gradient-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.category}</span>
            <h3 className="mt-1 text-base font-semibold leading-snug">{m.title}</h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold">
            <Star className="h-3 w-3 fill-current text-primary" /> {m.rating}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.description}</p>
        <div className="mt-auto flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 mt-4">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-foreground/80">
            <FileText className="h-3.5 w-3.5" /> {m.pages} pages
          </span>
          <Link
            to="/materials/$slug"
            params={{ slug: m.slug }}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold shadow-sm transition group-hover:bg-[var(--gradient-gold)] group-hover:text-primary-foreground group-hover:border-transparent"
          >
            â‚¹{m.price.toLocaleString()} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function BundleCard({ b }: { b: BundleDTO }) {
  const cover = absoluteMedia(b.coverUrl);
  const original = (b.items || []).reduce((s, it) => s + (it.material?.price || 0), 0);
  const savings = original > 0 ? Math.max(0, original - b.price) : 0;
  return (
    <Link
      to="/bundles/$slug"
      params={{ slug: b.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] bg-secondary">
        {cover ? (
          <img src={cover} alt={b.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-[var(--gradient-hero)]">
            <Package className="h-10 w-10 text-primary" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--gradient-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          Bundle
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold">{b.title}</h3>
        {b.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{b.description}</p>}
        <p className="mt-2 text-xs text-muted-foreground">{(b.items || []).length} PDFs included</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-semibold teal-text">â‚¹{b.price.toLocaleString()}</span>
          {savings > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">â‚¹{original.toLocaleString()}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Save â‚¹{savings.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

