import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit3, Image as ImageIcon } from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { BackendStatusProvider, useBackendOnline } from "@/components/site/BackendStatusBanner";
import {
  adminListGallery,
  adminCreateGallery,
  adminUpdateGallery,
  adminDeleteGallery,
  type GalleryDTO,
} from "@/lib/content-api";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Admin — TRI CUBE" },
      { name: "description", content: "Manage gallery images shown on the public gallery page." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <BackendStatusProvider>
      <PageHero
        eyebrow="Admin"
        title={
          <>
            Manage <span className="gold-text">Gallery</span>
          </>
        }
        subtitle="Add, edit and remove images shown on the public /gallery page."
      />
      <AdminTabs />
      <Inner />
    </BackendStatusProvider>
  ),
});

type Draft = Partial<GalleryDTO> & { _isNew?: boolean };

function Inner() {
  const { online } = useBackendOnline();
  const [rows, setRows] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setLoading(true);
    setErr(null);
    try {
      setRows(await adminListGallery());
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    reload();
  }, []);

  async function save() {
    if (!draft) return;
    setBusy(true);
    setErr(null);
    try {
      if (draft._isNew)
        await adminCreateGallery({
          url: draft.url,
          caption: draft.caption,
          kind: draft.kind || "image",
        });
      else if (draft.id)
        await adminUpdateGallery(draft.id, {
          url: draft.url,
          caption: draft.caption,
          kind: draft.kind,
        });
      setDraft(null);
      await reload();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function del(id: number) {
    if (!confirm("Remove this image?")) return;
    setBusy(true);
    try {
      await adminDeleteGallery(id);
      await reload();
    } catch (e: any) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Gallery</h2>
        <button
          disabled={!online || busy}
          onClick={() => setDraft({ _isNew: true, url: "", caption: "", kind: "image" })}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add image
        </button>
      </div>

      {err && (
        <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      )}

      {draft && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">
            {draft._isNew ? "New image" : "Edit image"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block text-muted-foreground">Image URL</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={draft.url || ""}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                placeholder="https://..."
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block text-muted-foreground">Caption</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={draft.caption || ""}
                onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Kind</span>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={draft.kind || "image"}
                onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            {draft.url && (
              <div className="md:col-span-2">
                <p className="mb-2 text-xs text-muted-foreground">Preview</p>
                <img
                  src={draft.url}
                  alt="preview"
                  className="max-h-48 rounded-lg border border-border object-cover"
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setDraft(null)}
              disabled={busy}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={busy || !online || !draft.url}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading gallery…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 h-6 w-6" />
            No images yet. Click "Add image" to add one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={g.url}
                    alt={g.caption || "Gallery"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium truncate">{g.caption || "(no caption)"}</p>
                  <p className="text-xs text-muted-foreground">{g.kind}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      disabled={!online || busy}
                      onClick={() => setDraft({ ...g })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={!online || busy}
                      onClick={() => del(g.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
