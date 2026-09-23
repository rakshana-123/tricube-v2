import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { PageHero } from "@/components/site/SectionHeading";
import { getMaterial, splitHighlights, absoluteMedia, type MaterialDTO } from "@/lib/materials-api";
import { API_BASE, startPayment } from "@/lib/payments";
import { addOwned, isOwned, setDownloadUrl, triggerDownload } from "@/lib/materials-library";
import { Download, FileText, CheckCircle2, ArrowLeft, Star, Lock, Eye } from "lucide-react";
import PdfPreviewGallery from "@/components/site/PdfPreviewGallery";
import { getDownloadUrl } from "@/lib/materials-library";
import { PaymentRetry } from "@/components/site/PaymentRetry";

export const Route = createFileRoute("/materials/$slug")({
  head: ({ loaderData }) => {
    const m = (loaderData as any)?.material as MaterialDTO | undefined;
    return {
      meta: [
        { title: m ? `${m.title} â€” TRI CUBE Materials` : "Material â€” TRI CUBE" },
        { name: "description", content: m ? `${m.description} Â· ${m.pages} pages PDF.` : "TRI CUBE study material." },
      ],
    };
  },
  loader: async ({ params }) => {
    const material = await getMaterial(params.slug);
    if (!material) throw notFound();
    return { material };
  },
  component: MaterialDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Material not found</h1>
      <Link to="/materials" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to materials
      </Link>
    </div>
  ),
});

function MaterialDetail() {
  const { material } = Route.useLoaderData() as { material: MaterialDTO };
  const navigate = useNavigate();
  const [owned, setOwned] = useState(false);
  const [demo, setDemo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const cover = absoluteMedia(material.coverUrl);
  const highlights = splitHighlights(material.highlights);
  const previewHref = material.previewUrl ? `${API_BASE}/api/materials/preview/${encodeURIComponent(material.slug)}` : null;
  const unlockedHref = (() => {
    const u = getDownloadUrl(material.slug);
    if (!u) return null;
    return u.startsWith("http") ? u : `${API_BASE}${u}`;
  })();
  const galleryHref = owned ? unlockedHref || previewHref : previewHref;
  const galleryLabel = owned ? "Your library Â· full document" : "Free sample pages";

  useEffect(() => { setOwned(isOwned(material.slug)); }, [material.slug]);

  async function handleBuy() {
    setErr(null);
    if (!getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: `/materials/${material.slug}` } });
      return;
    }
    if (owned) {
      const r = await triggerDownload(material.slug, material.title);
      if (!r.ok) setErr(r.error);
      return;
    }
    setBusy(true);
    setAttempt((n) => n + 1);
    const res = await startPayment({
      createOrderPath: "/api/materials/create-order",
      createOrderBody: { materialId: material.slug, email: "guest@tricube.local" },
      title: material.title,
      amountInr: material.price,
      onPaid: async (r) => {
        if (r.razorpay_signature === "demo_signature") return;
        const deadline = Date.now() + 30_000;
        let lastErr = "Verification rejected";
        while (Date.now() < deadline) {
          const vr = await fetch(`${API_BASE}/api/materials/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...r, materialId: material.slug }),
          });
          if (vr.status === 202) { await new Promise((s) => setTimeout(s, 2000)); continue; }
          if (!vr.ok) {
            try { lastErr = (await vr.json())?.error || lastErr; } catch {}
            throw new Error(lastErr);
          }
          const data = await vr.json();
          if (data?.ok && data?.downloadUrl) { setDownloadUrl(material.slug, data.downloadUrl); return; }
          if (data?.pending) { await new Promise((s) => setTimeout(s, 2000)); continue; }
          throw new Error("Verification rejected");
        }
        throw new Error("Payment received. Confirmation is taking longer than usual â€” check your email for the download link.");
      },
    });
    setBusy(false);
    if (res.status === "paid") {
      addOwned(material.slug);
      setOwned(true);
      setTimeout(() => {
        triggerDownload(material.slug, material.title).then((r) => { if (!r.ok) setErr(r.error); });
      }, 250);
      setTimeout(() => { navigate({ to: "/my-materials" }); }, 1500);
    } else if (res.status === "demo") {
      setErr(res.message || "Demo mode is enabled â€” no real payment was taken, so the PDF stays locked.");
    } else if (res.status === "failed") setErr(res.message || "Payment failed. Please try again.");
    else if (res.status === "cancelled") setErr(res.message || "Payment was cancelled before it completed.");
  }

  return (
    <>
      <PageHero eyebrow={material.category} title={<>{material.title}</>} subtitle={`${material.pages} pages Â· Instant PDF download`} />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          {demo && (
            <div className="mb-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-foreground">
              Demo mode â€” backend offline. Sample PDF delivered for preview.
            </div>
          )}
          <div className="glass relative aspect-[4/3] overflow-hidden rounded-2xl">
            {cover ? (
              <img src={cover} alt={material.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-background/80 backdrop-blur">
                      <FileText className="h-9 w-9 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-foreground">{material.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{material.pages}-page PDF</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold tracking-tight">About this material</h2>
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{material.longDescription || material.description}</p>
            {highlights.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">What&apos;s inside</h3>
                <ul className="mt-3 grid gap-2 md:grid-cols-2">
                  {highlights.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {previewHref && (
              <a
                href={previewHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-primary"
              >
                <Eye className="h-3.5 w-3.5" /> Preview free sample pages
              </a>
            )}

            {galleryHref && (
              <PdfPreviewGallery
                src={galleryHref}
                storageKey={`material:${material.slug}`}
                label={galleryLabel}
                maxThumbs={owned ? 24 : 6}
                showAll={owned}
              />
            )}
          </div>
        </div>

        <aside className="glass h-fit rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
            <span>{material.category}</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {material.rating}</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <div className="text-3xl font-semibold teal-text">â‚¹{material.price.toLocaleString()}</div>
            <span className="mb-1 text-xs text-muted-foreground">one-time</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{material.pages}-page PDF Â· lifetime re-download</p>
          <button
            onClick={handleBuy}
            disabled={busy}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
          >
            <Download className="h-4 w-4" />
            {owned ? "Download PDF again" : busy ? "Opening checkoutâ€¦" : "Buy & download PDF"}
          </button>
          {owned && !busy && <p className="mt-3 text-center text-xs text-primary">You already own this â€” download unlocked.</p>}
          {err && !owned && (
            <PaymentRetry
              message={err}
              attempt={attempt}
              busy={busy}
              onRetry={handleBuy}
              onDismiss={() => setErr(null)}
            />
          )}
          {err && owned && <p className="mt-3 text-center text-xs text-destructive">{err}</p>}
          <p className="mt-3 text-center text-xs text-muted-foreground"><Lock className="mr-1 inline h-3 w-3" /> Secure payment via Razorpay. Saved to My Materials.</p>
          <Link to="/my-materials" className="mt-4 block text-center text-xs font-medium text-foreground/70 underline-offset-4 hover:underline">View my library â†’</Link>
        </aside>
      </section>
    </>
  );
}

