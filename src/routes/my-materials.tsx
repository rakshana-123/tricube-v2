import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth, getToken } from "@/lib/auth";
import { PageHero } from "@/components/site/SectionHeading";
import { fetchOwned, triggerDownload, type OwnedMaterialDetail } from "@/lib/materials-library";
import { Download, FileText, ShoppingBag, LogIn, Loader2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/my-materials")({
  head: () => ({
    meta: [
      { title: "My Materials â€” TRI CUBE" },
      { name: "description", content: "Your purchased PDF study materials. Download anytime." },
      { name: "robots", content: "noindex" },
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
    if (!token) { setLoading(false); return; }
    if (opts.silent) setRefreshing(true); else setLoading(true);
    try {
      const list = await fetchOwned(token);
      setOwned(list);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Could not load your library.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    load();
    const onFocus = () => load({ silent: true });
    const onVisible = () => { if (document.visibilityState === "visible") load({ silent: true }); };
    const onPageShow = () => load({ silent: true });
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    // Short poll for ~30s so webhook-confirmed purchases appear without reload
    let ticks = 0;
    const interval = window.setInterval(() => {
      ticks += 1;
      load({ silent: true });
      if (ticks >= 10) window.clearInterval(interval);
    }, 3000);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
      window.clearInterval(interval);
    };
  }, [isAuthenticated, load]);

  if (!isAuthenticated) {
    return (
      <>
        <PageHero
          eyebrow="Library"
          title={<>My <span className="teal-text">Materials</span></>}
          subtitle="Sign in to see the PDFs you've purchased."
        />
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Sign in to view your library</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your purchased materials are tied to your account. Sign in to download them again anytime.
            </p>
            <Link
              to="/auth"
              search={{ redirect: "/my-materials" }}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Sign in
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Library"
        title={<>My <span className="teal-text">Materials</span></>}
        subtitle="Every PDF you've purchased. Re-download anytime, on any device."
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => load({ silent: true })}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        {err && (
          <div className="mx-auto mb-6 max-w-md rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-center text-xs text-destructive">
            {err}
          </div>
        )}
        {loading ? (
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your libraryâ€¦
          </div>
        ) : owned.length === 0 ? (
          <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Nothing here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              After a successful payment your PDFs appear here automatically.
            </p>
            <Link
              to="/materials"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse materials
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owned.map((m) => (
              <div
                key={`${m.source}-${m.slug}`}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {m.coverUrl ? (
                      <img src={m.coverUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {m.source === "bundle" ? `Bundle Â· ${m.bundleSlug}` : "Material"}
                      </span>
                      <h3 className="text-sm font-semibold leading-snug">{m.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Purchased {new Date(m.purchasedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setErr(null);
                    const r = await triggerDownload(m.slug, m.title);
                    if (!r.ok) {
                      setErr(r.error);
                      const token = getToken();
                      if (token) {
                        try { setOwned(await fetchOwned(token)); } catch {}
                      }
                    }
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
