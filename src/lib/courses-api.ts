import { API_BASE } from "./payments";
import { COURSES as STATIC_COURSES } from "./site-data";

export type CourseVideoDTO = {
  id?: number;
  title: string;
  url?: string | null;
  durationSec?: number;
  position?: number;
  isFreePreview?: boolean;
  pdfUrl?: string | null;
  moduleId?: number | null;
};

export type CourseModuleDTO = {
  id?: number;
  title: string;
  position?: number;
  videos: CourseVideoDTO[];
};

export type CourseDTO = {
  id?: number;
  slug: string;
  title: string;
  category: string;
  trainer: string;
  description?: string;
  thumbnailUrl?: string | null;
  duration: string;
  level: string;
  price: number;
  discount?: number;
  learningOutcomes?: string | null;
  published?: boolean;
  rating: number;
  students: number;
  modules?: CourseModuleDTO[];
  videos?: CourseVideoDTO[];
};

function levelLabel(level?: string | null): string {
  if (!level) return "All levels";
  if (level === "beginner") return "Beginner";
  if (level === "intermediate") return "Intermediate";
  if (level === "advanced") return "Advanced";
  return level;
}

function normalizeCourse(row: any): CourseDTO {
  const category =
    typeof row.category === "string"
      ? row.category
      : row.category?.name || row.category?.title || "General";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category,
    trainer: row.trainer || "TRI CUBE Mentor",
    description: row.description || "",
    thumbnailUrl: row.thumbnailUrl ?? null,
    duration: row.duration || "Self-paced",
    level: levelLabel(row.level),
    price: Number(row.price ?? 0),
    discount: Number(row.discount ?? 0),
    learningOutcomes: row.learningOutcomes ?? null,
    published: row.published,
    rating: Number(row.rating ?? 4.9),
    students: Number(row.students ?? 0),
    modules: Array.isArray(row.modules)
      ? row.modules.map((m: any) => ({
          id: m.id,
          title: m.title,
          position: m.position,
          videos: Array.isArray(m.videos)
            ? m.videos.map((v: any) => ({
                id: v.id,
                title: v.title,
                url: v.url ?? null,
                durationSec: Number(v.durationSec ?? 0),
                position: v.position,
                isFreePreview: !!v.isFreePreview,
                pdfUrl: v.pdfUrl ?? null,
                moduleId: v.moduleId ?? m.id ?? null,
              }))
            : [],
        }))
      : [],
    videos: Array.isArray(row.videos)
      ? row.videos.map((v: any) => ({
          id: v.id,
          title: v.title,
          url: v.url ?? null,
          durationSec: Number(v.durationSec ?? 0),
          position: v.position,
          isFreePreview: !!v.isFreePreview,
          pdfUrl: v.pdfUrl ?? null,
          moduleId: v.moduleId ?? null,
        }))
      : [],
  };
}

function staticFallback(): CourseDTO[] {
  return STATIC_COURSES.map((c) => ({
    ...c,
    description: "Mentor-led training with projects, recordings, and certificate support.",
    discount: 0,
    published: true,
    modules: [],
    videos: [],
  }));
}

async function tryFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    return await fetch(`${API_BASE}${path}`, { ...init, signal: ctrl.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export function absoluteMedia(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function listCourses(params?: { category?: string; q?: string }): Promise<CourseDTO[]> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== "All") qs.set("category", params.category);
  if (params?.q) qs.set("q", params.q);

  const r = await tryFetch(`/api/courses${qs.toString() ? `?${qs}` : ""}`);
  if (!r) {
    const q = params?.q?.toLowerCase() || "";
    return staticFallback().filter((c) => {
      if (params?.category && params.category !== "All" && c.category !== params.category) return false;
      return !q || c.title.toLowerCase().includes(q);
    });
  }
  if (!r.ok) return [];
  const j = await r.json();
  return Array.isArray(j.courses) ? j.courses.map(normalizeCourse) : [];
}

export async function getCourse(slug: string): Promise<CourseDTO | null> {
  const r = await tryFetch(`/api/courses/${encodeURIComponent(slug)}`);
  if (!r) return staticFallback().find((c) => c.slug === slug) ?? null;
  if (!r.ok) return null;
  const j = await r.json();
  return j.course ? normalizeCourse(j.course) : null;
}

export async function listUnlockedCourseVideos(slug: string, token: string): Promise<CourseVideoDTO[]> {
  const r = await fetch(`${API_BASE}/api/courses/${encodeURIComponent(slug)}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return Array.isArray(j.videos) ? j.videos.map((v: any) => normalizeCourse({ slug, title: "", videos: [v] }).videos![0]) : [];
}