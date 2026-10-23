// Admin API client for /api/courses. Reuses the admin token stored under
// tricube_admin_token by services-api.
import { adminFetch, getAdminToken } from "./services-api";

export type AdminVideo = {
  id?: number;
  title: string;
  url: string;
  durationSec?: number;
  position?: number;
  isFreePreview?: boolean;
  pdfUrl?: string | null;
};

export type AdminModule = {
  id?: number;
  title: string;
  position?: number;
  videos: AdminVideo[];
};

export type AdminCourse = {
  id: number;
  slug: string;
  title: string;
  trainer: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  discount: number;
  learningOutcomes?: string | null;
  thumbnailUrl?: string | null;
  categoryId?: number | null;
  category?: { id: number; name: string; slug: string } | null;
  published: boolean;
  modules: AdminModule[];
  updatedAt: string;
};

export type CourseCategory = { id: number; name: string; slug: string };

function authHeaders(json = true): HeadersInit {
  const t = getAdminToken();
  const h: Record<string, string> = {};
  if (t) h.Authorization = `Bearer ${t}`;
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export async function listAdminCourses(): Promise<AdminCourse[]> {
  const r = await adminFetch("/api/courses/admin/all", { headers: authHeaders(false) }, "Failed to load courses");
  return (await r.json()).courses || [];
}

export async function listCategories(): Promise<CourseCategory[]> {
  const r = await adminFetch("/api/courses/admin/categories", { headers: authHeaders(false) }, "Failed to load categories");
  return (await r.json()).categories || [];
}

export async function createCourse(payload: Partial<AdminCourse>): Promise<AdminCourse> {
  const r = await adminFetch("/api/courses", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }, "Create failed");
  return (await r.json()).course;
}

export async function updateCourse(id: number, payload: Partial<AdminCourse>): Promise<AdminCourse> {
  const r = await adminFetch(`/api/courses/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }, "Update failed");
  return (await r.json()).course;
}

export async function togglePublishCourse(id: number): Promise<AdminCourse> {
  const r = await adminFetch(`/api/courses/${id}/publish`, {
    method: "PATCH",
    headers: authHeaders(false),
  }, "Toggle failed");
  return (await r.json()).course;
}

export async function uploadCourseThumbnail(id: number, file: File): Promise<AdminCourse> {
  const fd = new FormData();
  fd.append("image", file);
  const r = await adminFetch(`/api/courses/${id}/thumbnail`, {
    method: "POST",
    headers: authHeaders(false),
    body: fd,
  }, "Upload failed");
  return (await r.json()).course;
}

export async function deleteCourse(id: number): Promise<void> {
  await adminFetch(`/api/courses/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  }, "Delete failed");
}