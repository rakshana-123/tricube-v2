// Local library of owned materials. Persists to localStorage so the user's
// "My Materials" page survives reloads without a backend.

export type OwnedMaterial = { slug: string; purchasedAt: string };

const KEY = "tricube.materials.owned";
const URL_KEY = "tricube.materials.downloadUrls";

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000";

export type OwnedMaterialDetail = {
  slug: string;
  title: string;
  coverUrl: string | null;
  purchasedAt: string;
  orderId: number;
  source: "material" | "bundle";
  bundleSlug?: string;
  downloadUrl: string;
};

// Fetch every paid PDF for the signed-in user (single + bundle-expanded),
// each with a fresh signed 24h download URL. Empty when unauthenticated.
export async function fetchOwned(token: string): Promise<OwnedMaterialDetail[]> {
  const res = await fetch(`${API_BASE}/api/me/materials`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "Please sign in again." : `Failed (${res.status})`);
  }
  const j = await res.json();
  const list: OwnedMaterialDetail[] = Array.isArray(j?.materials) ? j.materials : [];
  // Mirror into the offline cache so old callers of getOwned/getDownloadUrl still work.
  try {
    const owned = list.map((m) => ({ slug: m.slug, purchasedAt: m.purchasedAt }));
    localStorage.setItem(KEY, JSON.stringify(owned));
    const urls: Record<string, string> = {};
    for (const m of list) urls[m.slug] = m.downloadUrl;
    localStorage.setItem(URL_KEY, JSON.stringify(urls));
  } catch {}
  return list;
}

export function getOwned(): OwnedMaterial[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isOwned(slug: string) {
  return getOwned().some((o) => o.slug === slug);
}

export function addOwned(slug: string) {
  const list = getOwned().filter((o) => o.slug !== slug);
  list.unshift({ slug, purchasedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list));
}

// Signed URLs returned by the backend after successful signature+status
// verification. Stored per-slug so "Download again" from My Materials can
// re-use them until they expire; on 403 we transparently ask the user to
// re-purchase (or fall back to the sample in demo mode).
function readUrls(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(URL_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function setDownloadUrl(slug: string, url: string) {
  const all = readUrls();
  all[slug] = url;
  localStorage.setItem(URL_KEY, JSON.stringify(all));
}

export function getDownloadUrl(slug: string): string | null {
  return readUrls()[slug] ?? null;
}

// All materials share a single sample PDF in demo mode. Real backend would
// serve /api/materials/download/:slug behind an auth + purchase check.
export const SAMPLE_PDF_URL = "/materials/sample.pdf";

function clickDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Downloads the material PDF only after the backend confirms the signed
// URL is still valid (HEAD check → 200). Falls back to the sample PDF only
// when the backend is entirely unreachable (demo mode).
export async function triggerDownload(slug: string, title: string): Promise<
  { ok: true; demo: boolean } | { ok: false; error: string }
> {
  void title;
  const stored = getDownloadUrl(slug);
  if (stored) {
    const abs = stored.startsWith("http") ? stored : `${API_BASE}${stored}`;
    try {
      const check = await fetch(abs, { method: "HEAD" });
      if (check.ok) {
        clickDownload(abs, `${slug}.pdf`);
        return { ok: true, demo: false };
      }
      if (check.status === 403 || check.status === 401) {
        return { ok: false, error: "Your download link has expired. Please purchase again." };
      }
    } catch {
      /* fall through to demo */
    }
  }
  // No signed URL or backend offline → demo fallback (preview only).
  clickDownload(SAMPLE_PDF_URL, `${slug}.pdf`);
  return { ok: true, demo: true };
}