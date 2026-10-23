// Client wrapper around /api/materials. Falls back to the static MATERIALS
// catalogue when the backend is unreachable so preview still renders.
import { API_BASE, resolveAssetUrl, tryBackendFetch } from "./payments";
import { MATERIALS as STATIC_MATERIALS } from "./site-data";
import { adminFetch, getAdminToken } from "./services-api";

export type MaterialDTO = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  category: string;
  pages: number;
  price: number;
  rating: number;
  highlights?: string | null; // "a|b|c"
  coverUrl?: string | null;
  pdfUrl?: string | null;
  previewUrl?: string | null;
  active?: boolean;
  featured?: boolean;
};

export type BundleDTO = {
  id?: number;
  slug: string;
  title: string;
  description?: string | null;
  price: number;
  coverUrl?: string | null;
  active?: boolean;
  featured?: boolean;
  items?: { material: MaterialDTO }[];
};

export function splitHighlights(h?: string | null): string[] {
  if (!h) return [];
  return h.split(/[|\n]/).map((x) => x.trim()).filter(Boolean);
}

export function absoluteMedia(url?: string | null): string | undefined {
  return resolveAssetUrl(url);
}

function staticFallback(): MaterialDTO[] {
  return STATIC_MATERIALS.map((m: any) => ({
    slug: m.slug,
    title: m.title,
    description: m.description,
    category: m.category,
    pages: m.pages,
    price: m.price,
    rating: m.rating,
    coverUrl: m.coverUrl || `/images/materials/${m.slug}.svg`,
    highlights: (m.highlights || []).join("|"),
    active: true,
    featured: m.slug === "python-interview-notes" || m.slug === "system-design-primer",
  }));
}

function staticBundlesFallback(): BundleDTO[] {
  const all = staticFallback();
  return [
    {
      id: -1,
      slug: "placement-starter-bundle",
      title: "Placement Starter Combo Pack",
      description: "Complete interview preparation pack: Python Interview Notes, DSA Cheatsheet, and ATS Resume Templates.",
      price: 349,
      coverUrl: "/images/materials/placement-starter-bundle.svg",
      active: true,
      featured: true,
      items: all.slice(0, 3).map((material) => ({ material })),
    },
    {
      id: -2,
      slug: "full-stack-architect-bundle",
      title: "Full Stack & System Design Bundle",
      description: "Master production engineering with the System Design Primer, React Patterns in Production, and SQL Handbook.",
      price: 549,
      coverUrl: "/images/materials/full-stack-architect-bundle.svg",
      active: true,
      featured: true,
      items: [all[4], all[5], all[2]].filter(Boolean).map((material) => ({ material })),
    },
  ];
}

async function tryFetch(path: string, init?: RequestInit): Promise<Response | null> {
  return tryBackendFetch(path, init);
}

export async function listMaterials(params?: { category?: string; q?: string }): Promise<MaterialDTO[]> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== "all") qs.set("category", params.category);
  if (params?.q) qs.set("q", params.q);
  const r = await tryFetch(`/api/materials${qs.toString() ? `?${qs}` : ""}`);
  if (!r || !r.ok) {
    const all = staticFallback();
    return all.filter((m) => {
      if (params?.category && params.category !== "all" && m.category !== params.category) return false;
      if (params?.q) {
        const q = params.q.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      }
      return true;
    });
  }
  const j = await r.json();
  const rows: MaterialDTO[] = j.materials || [];
  return rows.length ? rows : staticFallback();
}

export async function getMaterial(slug: string): Promise<MaterialDTO | null> {
  const r = await tryFetch(`/api/materials/detail/${encodeURIComponent(slug)}`);
  if (r && r.ok) return (await r.json()).material ?? null;
  return staticFallback().find((m) => m.slug === slug) ?? null;
}

export async function listBundles(): Promise<BundleDTO[]> {
  const r = await tryFetch("/api/materials/bundles");
  if (!r || !r.ok) return staticBundlesFallback();
  const rows: BundleDTO[] = (await r.json()).bundles || [];
  return rows.length ? rows : staticBundlesFallback();
}

export async function getBundle(slug: string): Promise<BundleDTO | null> {
  const r = await tryFetch(`/api/materials/bundles/${encodeURIComponent(slug)}`);
  if (!r || !r.ok) return staticBundlesFallback().find((b) => b.slug === slug) ?? null;
  return (await r.json()).bundle ?? null;
}

// ---------- Admin ----------

function authHeaders(): HeadersInit {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function adminListMaterials(): Promise<MaterialDTO[]> {
  const r = await adminFetch("/api/materials/admin/all", { headers: authHeaders() }, "Failed to load materials");
  return (await r.json()).materials || [];
}
export async function adminCreateMaterial(fd: FormData): Promise<MaterialDTO> {
  const r = await adminFetch("/api/materials/admin/materials", { method: "POST", headers: authHeaders(), body: fd }, "Create failed");
  return (await r.json()).material;
}
export async function adminUpdateMaterial(id: number, fd: FormData): Promise<MaterialDTO> {
  const r = await adminFetch(`/api/materials/admin/materials/${id}`, { method: "PATCH", headers: authHeaders(), body: fd }, "Update failed");
  return (await r.json()).material;
}
export async function adminToggleMaterial(id: number): Promise<MaterialDTO> {
  const r = await adminFetch(`/api/materials/admin/materials/${id}/toggle`, { method: "PATCH", headers: authHeaders() }, "Toggle failed");
  return (await r.json()).material;
}
export async function adminDeleteMaterial(id: number): Promise<void> {
  await adminFetch(`/api/materials/admin/materials/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}

export async function adminListBundles(): Promise<BundleDTO[]> {
  const r = await adminFetch("/api/materials/admin/bundles/all", { headers: authHeaders() }, "Failed to load bundles");
  return (await r.json()).bundles || [];
}
export async function adminCreateBundle(fd: FormData): Promise<BundleDTO> {
  const r = await adminFetch("/api/materials/admin/bundles", { method: "POST", headers: authHeaders(), body: fd }, "Create failed");
  return (await r.json()).bundle;
}
export async function adminUpdateBundle(id: number, fd: FormData): Promise<BundleDTO> {
  const r = await adminFetch(`/api/materials/admin/bundles/${id}`, { method: "PATCH", headers: authHeaders(), body: fd }, "Update failed");
  return (await r.json()).bundle;
}
export async function adminToggleBundle(id: number): Promise<BundleDTO> {
  const r = await adminFetch(`/api/materials/admin/bundles/${id}/toggle`, { method: "PATCH", headers: authHeaders() }, "Toggle failed");
  return (await r.json()).bundle;
}
export async function adminDeleteBundle(id: number): Promise<void> {
  await adminFetch(`/api/materials/admin/bundles/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}

// ---------- Admin: order timeline ----------

export type OrderEvent = { at: string; type: string; message?: string; data?: any };
export type OrderRow = {
  id: number;
  kind: "material" | "bundle" | string;
  slug: string;
  email: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded" | string;
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  webhookEventId?: string | null;
  paidAt?: string | null;
  downloadTokenIssuedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
};

export async function adminListMaterialOrders(params: { q?: string; status?: string } = {}): Promise<OrderRow[]> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.status) qs.set("status", params.status);
  const r = await adminFetch(`/api/materials/admin/orders?${qs.toString()}`, { headers: authHeaders() }, "Failed to load orders");
  return (await r.json()).orders || [];
}
