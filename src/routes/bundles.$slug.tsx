import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { PageHero } from "@/components/site/SectionHeading";
import { getBundle, absoluteMedia, type BundleDTO } from "@/lib/materials-api";
import { API_BASE, startPayment } from "@/lib/payments";
import { PaymentRetry } from "@/components/site/PaymentRetry";
import { addOwned, isOwned, setDownloadUrl, triggerDownload } from "@/lib/materials-library";
import { Download, Package, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import PdfPreviewGallery from "@/components/site/PdfPreviewGallery";
import { getDownloadUrl } from "@/lib/materials-library";
import { API_BASE as API } from "@/lib/payments";

export const Route = createFileRoute("/bundles/$slug")({
  head: ({ loaderData }) => {
    const b = (loaderData as any)?.bundle as BundleDTO | undefined;
    return {
      meta: [
        { title: b ? `${b.title} — TRI CUBE Bundle` : "Bundle — TRI CUBE" },
        { name: "description", content: b?.description || "TRI CUBE material bundle." },
      ],
    };
  },
  loader: async ({ params }) => {
    const bundle = await getBundle(params.slug);
    if (!bundle) throw notFound();
    return { bundle };
  },
  component: BundleDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Bundle not found</h1>
      <Link to="/materials" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to materials
      </Link>
    </div>
  ),
});

function BundleDetail() {
  const { bundle } = Route.useLoaderData() as { bundle: BundleDTO };
  const navigate = useNavigate();
  const [ownedAll, setOwnedAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [openItemSlug, setOpenItemSlug] = useState<string | null>(null);
  const cover = absoluteMedia(bundle.coverUrl);
  const items = bundle.items || [];
  const original = items.reduce((s: number, it: any) => s + (it.material?.price || 0), 0);
  const savings = Math.max(0, original - bundle.price);

  useEffect(() => {
    setOwnedAll(items.length > 0 && items.every((it: any) => isOwned(it.material.slug)));
  }, [bundle.slug, items]);

  async function handleBuy() {
    setErr(null);
    if (!getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: `/bundles/${bundle.slug}` } });
      return;
    }
    setBusy(true);
    setAttempt((n) => n + 1);
    const res = await startPayment({
      createOrderPath: "/api/materials/create-order",
      createOrderBody: { bundleId: bundle.slug, email: "guest@tricube.local" },
      title: bundle.title,
      amountInr: bundle.price,
      onPaid: async (r) => {
        if (r.razorpay_signature === "demo_signature") return;
        const deadline = Date.now() + 30_000;
        let lastErr = "Verification rejected";
        while (Date.now() < deadline) {
          const vr = await fetch(`${API_BASE}/api/materials/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...r, bundleId: bundle.slug }),
          });
          if (vr.status === 202) {
            await new Promise((s) => setTimeout(s, 2000));
            continue;
          }
          if (!vr.ok) {
            try {
              lastErr = (await vr.json())?.error || lastErr;
            } catch {}
            throw new Error(lastErr);
          }
          const data = await vr.json();
          if (data?.ok && Array.isArray(data.downloads)) {
            for (const d of data.downloads) setDownloadUrl(d.slug, d.url);
            return;
          }
          if (data?.pending) {
            await new Promise((s) => setTimeout(s, 2000));
            continue;
          }
          throw new Error("Verification rejected");
        }
        throw new Error(
          "Payment received. Confirmation is taking longer than usual — check your email.",
        );
      },
    });
    setBusy(false);
    if (res.status === "paid") {
      for (const it of items) addOwned(it.material.slug);
      setOwnedAll(true);
      setTimeout(() => {
        items.forEach((it: any) => triggerDownload(it.material.slug, it.material.title));
      }, 250);
      setTimeout(() => {
        navigate({ to: "/my-materials" });
      }, 1800);
    } else if (res.status === "demo") {
      setErr("Demo mode is enabled — no real payment was taken, so the bundle stays locked.");
    } else if (res.status === "failed") setErr(res.message || "Payment failed. Please try again.");
    else if (res.status === "cancelled")
      setErr(res.message || "Payment was cancelled before it completed.");
  }

  return (
    <>
      <PageHero
        eyebrow="Bundle"
        title={<>{bundle.title}</>}
        subtitle={bundle.description || `${items.length} materials in one pack`}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="glass relative aspect-[16/9] overflow-hidden rounded-2xl">
            {cover ? (
              <img
                src={cover}
                alt={bundle.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[var(--gradient-hero)]">
                <Package className="h-16 w-16 text-primary" />
              </div>
            )}
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight">What&apos;s included</h2>
          <div className="mt-4 grid gap-3">
            {items.map((it: any) => (
              <div
                key={it.material.slug}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{it.material.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {it.material.pages} pages · {it.material.category}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{it.material.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass h-fit rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Bundle price
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-semibold gold-text">₹{bundle.price.toLocaleString()}</div>
            {savings > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{original.toLocaleString()}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="mt-1 text-xs font-semibold text-primary">
              You save ₹{savings.toLocaleString()}
            </p>
          )}
          <button
            onClick={handleBuy}
            disabled={busy || ownedAll}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {ownedAll
              ? "You own this bundle"
              : busy
                ? "Opening checkout…"
                : "Buy bundle & download all"}
          </button>
          {err && !ownedAll && (
            <PaymentRetry
              message={err}
              attempt={attempt}
              busy={busy}
              onRetry={handleBuy}
              onDismiss={() => setErr(null)}
            />
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" /> Secure payment via Razorpay.
          </p>
        </aside>
      </section>

      {items.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-semibold tracking-tight">Preview each material</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Thumbnails and page counts for every PDF in this pack. Unlocked items show the full
            document; locked ones show the free sample.
          </p>
          <div className="mt-6 grid gap-3">
            {items.map((it: any) => {
              const slug = it.material.slug as string;
              const isItemOwned = isOwned(slug);
              const unlocked = getDownloadUrl(slug);
              const unlockedAbs = unlocked
                ? unlocked.startsWith("http")
                  ? unlocked
                  : `${API}${unlocked}`
                : null;
              const previewAbs = it.material.previewUrl
                ? `${API}/api/materials/preview/${encodeURIComponent(slug)}`
                : null;
              const src = isItemOwned ? unlockedAbs || previewAbs : previewAbs;
              const isOpen = openItemSlug === slug;
              return (
                <div key={slug} className="rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => setOpenItemSlug(isOpen ? null : slug)}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                      {isItemOwned ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{it.material.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {it.material.pages} pages · {it.material.category}
                        {isItemOwned ? " · Unlocked" : previewAbs ? " · Sample available" : ""}
                      </p>
                    </div>
                    <span className="text-xs text-primary">
                      {isOpen ? "Hide" : src ? "Preview" : "No preview"}
                    </span>
                  </button>
                  {isOpen && src && (
                    <div className="border-t border-border px-4 pb-5">
                      <PdfPreviewGallery
                        src={src}
                        storageKey={`material:${slug}`}
                        label={isItemOwned ? "Full document" : "Free sample pages"}
                        maxThumbs={isItemOwned ? 24 : 6}
                        showAll={isItemOwned}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
