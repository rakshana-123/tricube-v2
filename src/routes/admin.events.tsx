import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarPlus, Trash2, Save, Edit3, Plus } from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { BackendStatusProvider, useBackendOnline } from "@/components/site/BackendStatusBanner";
import {
  listEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  type EventDTO,
} from "@/lib/events-api";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [
      { title: "Events â€” Admin â€” TRI CUBE" },
      { name: "description", content: "Manage TRI CUBE events, workshops, hackathons and announcements." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <BackendStatusProvider>
      <PageHero
        eyebrow="Admin"
        title={<>Manage <span className="teal-text">Events</span></>}
        subtitle="Create, edit, publish, and remove upcoming bootcamps, hackathons and workshops."
      />
      <AdminTabs />
      <AdminEventsInner />
    </BackendStatusProvider>
  ),
});

type Draft = Partial<EventDTO> & { _isNew?: boolean };

function blank(): Draft {
  return {
    _isNew: true,
    slug: "",
    title: "",
    description: "",
    bannerUrl: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00 AM",
    venue: "Online",
    status: "upcoming",
    published: true,
    speakers: "",
    registrationUrl: "",
  };
}

function AdminEventsInner() {
  const { online } = useBackendOnline();
  const [rows, setRows] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setLoading(true);
    setErr(null);
    try {
      const items = await listEvents();
      setRows(items.filter((e) => e.id > 0));
    } catch (e: any) {
      setErr(e.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  async function handleSave() {
    if (!draft) return;
    setBusy(true);
    setErr(null);
    try {
      if (draft._isNew) {
        await adminCreateEvent(draft);
      } else if (draft.id) {
        const { id, _isNew, createdAt, ...patch } = draft;
        await adminUpdateEvent(id, patch);
      }
      setDraft(null);
      await reload();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setBusy(true);
    try {
      await adminDeleteEvent(id);
      await reload();
    } catch (e: any) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
        <button
          disabled={!online || busy}
          onClick={() => setDraft(blank())}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> New event
        </button>
      </div>

      {err && <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      {draft && (
        <EventEditor
          value={draft}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={handleSave}
          busy={busy || !online}
        />
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading eventsâ€¦</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No events yet. Click "New event" to publish one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">/{e.slug}</div>
                  </td>
                  <td className="px-4 py-3">{new Date(e.date).toLocaleDateString()} Â· {e.time}</td>
                  <td className="px-4 py-3">{e.venue}</td>
                  <td className="px-4 py-3 capitalize">{e.status}</td>
                  <td className="px-4 py-3">{e.published ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={!online || busy}
                      onClick={() => setDraft({ ...e })}
                      className="mr-2 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={!online || busy}
                      onClick={() => handleDelete(e.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarPlus className="h-3.5 w-3.5" /> Events you publish appear on the public /events page and in the "Latest updates" section on the homepage.
      </p>
    </section>
  );
}

function EventEditor({
  value, onChange, onCancel, onSave, busy,
}: {
  value: Draft;
  onChange: (v: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
  busy: boolean;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">{value._isNew ? "New event" : `Edit â€” ${value.title}`}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input className="input" value={value.title || ""} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Slug (URL)">
          <input className="input" value={value.slug || ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} placeholder="e.g. tricube-summit-2026" />
        </Field>
        <Field label="Date">
          <input type="date" className="input" value={String(value.date || "").slice(0, 10)} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="Time">
          <input className="input" value={value.time || ""} onChange={(e) => set("time", e.target.value)} placeholder="10:00 AM â€“ 4:00 PM" />
        </Field>
        <Field label="Venue">
          <input className="input" value={value.venue || ""} onChange={(e) => set("venue", e.target.value)} />
        </Field>
        <Field label="Status">
          <select className="input" value={value.status || "upcoming"} onChange={(e) => set("status", e.target.value as EventDTO["status"])}>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="past">Past</option>
          </select>
        </Field>
        <Field label="Banner image URL">
          <input className="input" value={value.bannerUrl || ""} onChange={(e) => set("bannerUrl", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Registration URL">
          <input className="input" value={value.registrationUrl || ""} onChange={(e) => set("registrationUrl", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Speakers (comma-separated)" full>
          <input className="input" value={value.speakers || ""} onChange={(e) => set("speakers", e.target.value)} placeholder="Jane Doe, John Doe" />
        </Field>
        <Field label="Description" full>
          <textarea rows={4} className="input" value={value.description || ""} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!value.published} onChange={(e) => set("published", e.target.checked)} />
          Publish (visible on public site)
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} disabled={busy} className="rounded-lg border border-border px-4 py-2 text-sm font-medium">Cancel</button>
        <button onClick={onSave} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          <Save className="h-4 w-4" /> {busy ? "Savingâ€¦" : "Save event"}
        </button>
      </div>
      <style>{`.input { width:100%; border:1px solid hsl(var(--border)); background:hsl(var(--background)); border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
