// Public + admin API for /api/content — gallery, blogs, testimonials, faqs.
// Falls back to static site-data when the local backend is offline.
import { API_BASE } from "./payments";
import { TESTIMONIALS as STATIC_TESTIMONIALS, FAQS as STATIC_FAQS, BLOG as STATIC_BLOG } from "./site-data";
import { adminFetch, getAdminToken } from "./services-api";

export type GalleryDTO = { id: number; url: string; caption?: string | null; kind?: string; createdAt?: string };
export type BlogDTO = { id: number; slug: string; title: string; excerpt: string; content: string; coverUrl?: string | null; category: string; authorName: string; published: boolean; createdAt?: string };
export type TestimonialDTO = { id: number; name: string; role: string; quote: string; photoUrl?: string | null; rating: number; videoUrl?: string | null; published: boolean };
export type FAQDTO = { id: number; question: string; answer: string; category: string; position: number };

async function tryFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: ctrl.signal,
      cache: "no-store",
      headers: { ...(init?.headers || {}), "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
  }
  catch { return null; }
  finally { clearTimeout(t); }
}

function authHeaders(): HeadersInit {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// -------- Public --------
export async function listGallery(): Promise<GalleryDTO[]> {
  const r = await tryFetch(`/api/content/gallery?_=${Date.now()}`);
  if (!r || !r.ok) return [];
  const rows: GalleryDTO[] = (await r.json()).gallery || [];
  return rows.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function listBlogs(): Promise<BlogDTO[]> {
  const r = await tryFetch(`/api/content/blogs?_=${Date.now()}`);
  if (!r || !r.ok) {
    return STATIC_BLOG.map((b, i) => ({
      id: -(i + 1), slug: b.slug, title: b.title, excerpt: b.excerpt,
      content: "", coverUrl: null, category: b.category, authorName: "TRI CUBE",
      published: true, createdAt: b.date,
    }));
  }
  const rows: BlogDTO[] = (await r.json()).blogs || [];
  return rows
    .filter((b) => b.published)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function listTestimonials(): Promise<TestimonialDTO[]> {
  const r = await tryFetch(`/api/content/testimonials?_=${Date.now()}`);
  if (!r || !r.ok) {
    return STATIC_TESTIMONIALS.map((t, i) => ({
      id: -(i + 1), name: t.name, role: t.role, quote: t.quote,
      photoUrl: null, rating: t.rating, videoUrl: null, published: true,
    }));
  }
  const rows: TestimonialDTO[] = (await r.json()).testimonials || [];
  return rows
    .filter((t) => t.published)
    .sort((a, b) => b.id - a.id);
}

export async function listFaqs(): Promise<FAQDTO[]> {
  const r = await tryFetch("/api/content/faqs");
  if (!r || !r.ok) {
    return STATIC_FAQS.map((f, i) => ({
      id: -(i + 1), question: f.q, answer: f.a, category: "General", position: i,
    }));
  }
  return (await r.json()).faqs || [];
}

// -------- Admin: Gallery --------
export async function adminListGallery(): Promise<GalleryDTO[]> {
  const r = await adminFetch("/api/content/admin/gallery", { headers: authHeaders() }, "Failed to load gallery");
  return (await r.json()).gallery || [];
}
export async function adminCreateGallery(input: Partial<GalleryDTO>): Promise<GalleryDTO> {
  const r = await adminFetch("/api/content/gallery", { method: "POST", headers: authHeaders(), body: JSON.stringify(input) }, "Create failed");
  return (await r.json()).item;
}
export async function adminUpdateGallery(id: number, input: Partial<GalleryDTO>): Promise<GalleryDTO> {
  const r = await adminFetch(`/api/content/gallery/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) }, "Update failed");
  return (await r.json()).item;
}
export async function adminDeleteGallery(id: number): Promise<void> {
  await adminFetch(`/api/content/gallery/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}

// -------- Admin: Blog --------
export async function adminListBlogs(): Promise<BlogDTO[]> {
  const r = await adminFetch("/api/content/admin/blogs", { headers: authHeaders() }, "Failed to load blogs");
  return (await r.json()).blogs || [];
}
export async function adminCreateBlog(input: Partial<BlogDTO>): Promise<BlogDTO> {
  const r = await adminFetch("/api/content/blogs", { method: "POST", headers: authHeaders(), body: JSON.stringify(input) }, "Create failed");
  return (await r.json()).blog;
}
export async function adminUpdateBlog(id: number, input: Partial<BlogDTO>): Promise<BlogDTO> {
  const r = await adminFetch(`/api/content/blogs/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) }, "Update failed");
  return (await r.json()).blog;
}
export async function adminDeleteBlog(id: number): Promise<void> {
  await adminFetch(`/api/content/blogs/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}

// -------- Admin: Testimonials --------
export async function adminListTestimonials(): Promise<TestimonialDTO[]> {
  const r = await adminFetch("/api/content/admin/testimonials", { headers: authHeaders() }, "Failed to load testimonials");
  return (await r.json()).testimonials || [];
}
export async function adminCreateTestimonial(input: Partial<TestimonialDTO>): Promise<TestimonialDTO> {
  const r = await adminFetch("/api/content/testimonials", { method: "POST", headers: authHeaders(), body: JSON.stringify(input) }, "Create failed");
  return (await r.json()).item;
}
export async function adminUpdateTestimonial(id: number, input: Partial<TestimonialDTO>): Promise<TestimonialDTO> {
  const r = await adminFetch(`/api/content/testimonials/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) }, "Update failed");
  return (await r.json()).item;
}
export async function adminDeleteTestimonial(id: number): Promise<void> {
  await adminFetch(`/api/content/testimonials/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}

// -------- Admin: FAQs --------
export async function adminListFaqs(): Promise<FAQDTO[]> {
  const r = await adminFetch("/api/content/admin/faqs", { headers: authHeaders() }, "Failed to load FAQs");
  return (await r.json()).faqs || [];
}
export async function adminCreateFaq(input: Partial<FAQDTO>): Promise<FAQDTO> {
  const r = await adminFetch("/api/content/faqs", { method: "POST", headers: authHeaders(), body: JSON.stringify(input) }, "Create failed");
  return (await r.json()).item;
}
export async function adminUpdateFaq(id: number, input: Partial<FAQDTO>): Promise<FAQDTO> {
  const r = await adminFetch(`/api/content/faqs/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) }, "Update failed");
  return (await r.json()).item;
}
export async function adminDeleteFaq(id: number): Promise<void> {
  await adminFetch(`/api/content/faqs/${id}`, { method: "DELETE", headers: authHeaders() }, "Delete failed");
}