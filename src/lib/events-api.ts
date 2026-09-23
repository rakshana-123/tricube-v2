// Admin + public API for /api/events, with a static fallback for offline preview.
import { API_BASE } from "./payments";
import { EVENTS as STATIC_EVENTS } from "./site-data";
import { adminFetch, getAdminToken } from "./services-api";

export type EventDTO = {
  id: number;
  slug: string;
  title: string;
  description: string;
  bannerUrl?: string | null;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "live" | "past";
  published: boolean;
  registrationUrl?: string | null;
  speakers?: string | null;
  createdAt?: string;
};

function staticFallback(): EventDTO[] {
  return STATIC_EVENTS.map((e, i) => ({
    id: -(i + 1),
    slug: e.slug,
    title: e.title,
    description: e.description,
    bannerUrl: e.banner,
    date: e.date,
    time: e.time,
    venue: e.venue,
    status: e.status as EventDTO["status"],
    published: true,
  }));
}

async function tryFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try { return await fetch(`${API_BASE}${path}`, { ...init, signal: ctrl.signal }); }
  catch { return null; }
  finally { clearTimeout(t); }
}

export async function listEvents(): Promise<EventDTO[]> {
  const r = await tryFetch("/api/events");
  if (!r || !r.ok) return staticFallback();
  const j = await r.json();
  const rows: EventDTO[] = j.events || [];
  return rows.length ? rows : staticFallback();
}

function authHeaders(): HeadersInit {
  const t = getAdminToken();
  return t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function adminCreateEvent(input: Partial<EventDTO>): Promise<EventDTO> {
  const r = await adminFetch("/api/events", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ ...input, date: new Date(input.date!).toISOString() }),
  }, "Failed to create event");
  return (await r.json()).event;
}

export async function adminUpdateEvent(id: number, input: Partial<EventDTO>): Promise<EventDTO> {
  const body: any = { ...input };
  if (body.date) body.date = new Date(body.date).toISOString();
  const r = await adminFetch(`/api/events/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  }, "Failed to update event");
  return (await r.json()).event;
}

export async function adminDeleteEvent(id: number): Promise<void> {
  await adminFetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }, "Failed to delete event");
}