// Client wrapper around the /api/services endpoints. Falls back to the
// static SERVICES catalogue when the backend is unreachable so the preview
// still renders offline.
import { API_BASE } from "./payments";
import { SERVICES as STATIC_SERVICES } from "./site-data";

export type ServiceDTO = {
  id?: number;
  slug: string;
  title: string;
  description?: string;
  longDescription?: string | null;
  category?: string | null;
  rating?: number;
  imageUrl?: string | null;
  price: number;
  offerPrice: number;
  duration: string;
  features: string; // "a|b|c" or "a\nb\nc"
  sections?: string | null; // JSON string of Section[]
  active?: boolean;
  featured?: boolean;
};

export type ServiceSection =
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "steps"; title?: string; items: { title: string; body?: string }[] }
  | { type: "benefits"; title?: string; items: string[] }
  | { type: "highlights"; title?: string; items: { label: string; value: string }[] }
  | { type: "faq"; title?: string; items: { q: string; a: string }[] }
  | { type: "cta"; text: string };

export function parseSections(raw?: string | null): ServiceSection[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as ServiceSection[]) : [];
  } catch {
    return [];
  }
}

export function splitFeatures(f?: string): string[] {
  if (!f) return [];
  return f
    .split(/[|\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function staticFallback(): ServiceDTO[] {
  return STATIC_SERVICES.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: (s.features || []).slice(0, 2).join(" · "),
    price: s.price,
    offerPrice: s.offer,
    duration: s.duration,
    features: s.features.join("|"),
    active: true,
    featured: s.slug === "resume-review",
    category: "General",
    rating: 4.9,
  }));
}

function backendUnavailableMessage() {
  return `Backend is not reachable at ${API_BASE}. Start the local backend with: cd backend && npm run dev, then refresh this page.`;
}

export function absoluteMedia(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function tryFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    return await fetch(`${API_BASE}${path}`, { ...init, signal: ctrl.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function listServices(): Promise<ServiceDTO[]> {
  const r = await tryFetch("/api/services");
  if (!r || !r.ok) return staticFallback();
  const j = await r.json();
  const rows: ServiceDTO[] = j.services || [];
  return rows.length ? rows : staticFallback();
}

export async function getService(slug: string): Promise<ServiceDTO | null> {
  const r = await tryFetch(`/api/services/${encodeURIComponent(slug)}`);
  if (r && r.ok) {
    const j = await r.json();
    return j.service ?? null;
  }
  return staticFallback().find((s) => s.slug === slug) ?? null;
}

// ---------- Admin ----------

const TOKEN_KEY = "tricube_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  const admin = localStorage.getItem(TOKEN_KEY);
  if (admin) return admin;
  // Fallback: if the signed-in student token belongs to an admin user,
  // reuse it so admins don't need a separate admin sign-in.
  try {
    const rawUser = localStorage.getItem("tricube_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const role = user?.role as string | undefined;
    if (role === "admin" || role === "super_admin") {
      return localStorage.getItem("tricube_token");
    }
  } catch {}
  return null;
}
export function setAdminToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Throws a clear error when an admin request comes back 401/403 and
 * clears the cached admin token so the login card is shown again.
 * Call at the top of every admin API wrapper before parsing the body.
 */
export async function ensureAdminOk(r: Response, fallbackMsg = "Request failed"): Promise<void> {
  if (r.ok) return;
  if (r.status === 401 || r.status === 403) {
    setAdminToken(null);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("tricube:auth"));
    throw new Error("Your admin session expired. Please sign in again.");
  }
  let msg = fallbackMsg;
  try { msg = (await r.json())?.error || msg; } catch {}
  throw new Error(msg);
}

export async function adminFetch(path: string, init: RequestInit = {}, fallbackMsg = "Request failed"): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAdminToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  let r: Response;
  try {
    r = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (error: any) {
    if (error?.message === "Failed to fetch" || error?.name === "TypeError" || error?.name === "AbortError") {
      throw new Error(backendUnavailableMessage());
    }
    throw error;
  }
  await ensureAdminOk(r, fallbackMsg);
  return r;
}

function authHeaders(): HeadersInit {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function adminLogin(email: string, password: string): Promise<string> {
  let r: Response;
  try {
    r = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error: any) {
    if (error?.message === "Failed to fetch" || error?.name === "TypeError" || error?.name === "AbortError") {
      throw new Error(backendUnavailableMessage());
    }
    throw error;
  }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Login failed");
  const j = await r.json();
  const token = j.access || j.accessToken || j.token;
  if (!token) throw new Error("No token in login response");
  const user = j.user;
  const role = user?.role;
  if (role !== "admin" && role !== "super_admin") {
    throw new Error("This account does not have admin access.");
  }
  if (typeof window !== "undefined") {
    // Persist as BOTH the admin token AND the shared student token/user
    // so admin API clients + SiteNavbar + /me all agree on the session.
    localStorage.setItem("tricube_token", token);
    if (j.refresh) localStorage.setItem("tricube_refresh", j.refresh);
    if (user) localStorage.setItem("tricube_user", JSON.stringify(user));
    window.dispatchEvent(new Event("tricube:auth"));
  }
  setAdminToken(token);
  return token;
}

export async function adminListAll(): Promise<ServiceDTO[]> {
  const r = await adminFetch("/api/services/admin/all", { headers: authHeaders() }, "Failed to load services");
  return (await r.json()).services || [];
}

export async function adminCreate(fd: FormData): Promise<ServiceDTO> {
  const r = await adminFetch("/api/services", {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  }, "Create failed");
  return (await r.json()).service;
}

export async function adminUpdate(id: number, fd: FormData): Promise<ServiceDTO> {
  const r = await adminFetch(`/api/services/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: fd,
  }, "Update failed");
  return (await r.json()).service;
}

export async function adminToggle(id: number): Promise<ServiceDTO> {
  const r = await adminFetch(`/api/services/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  }, "Toggle failed");
  return (await r.json()).service;
}

export async function adminDelete(id: number): Promise<void> {
  await adminFetch(`/api/services/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }, "Delete failed");
}