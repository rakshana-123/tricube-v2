import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Edit3, Newspaper } from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { BackendStatusProvider, useBackendOnline } from "@/components/site/BackendStatusBanner";
import {
  adminListBlogs, adminCreateBlog, adminUpdateBlog, adminDeleteBlog,
  type BlogDTO,
} from "@/lib/content-api";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog â€” Admin â€” TRI CUBE" },
      { name: "description", content: "Write, edit and publish blog posts shown on the public blog page." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <BackendStatusProvider>
      <PageHero
        eyebrow="Admin"
        title={<>Manage <span className="teal-text">Blog</span></>}
        subtitle="Publish playbooks, guides and announcements on the public /blog page."
      />
      <AdminTabs />
      <Inner />
    </BackendStatusProvider>
  ),
});

type Draft = Partial<BlogDTO> & { _isNew?: boolean };

function blank(): Draft {
  return { _isNew: true, slug: "", title: "", excerpt: "", content: "", coverUrl: "", category: "General", authorName: "TRI CUBE", published: true };
}

function Inner() {
  const { online } = useBackendOnline();
  const [rows, setRows] = useState<BlogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setLoading(true); setErr(null);
    try { setRows(await adminListBlogs()); }
    catch (e: any) { setErr(e.message || "Failed to load"); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    if (!draft) return;
    setBusy(true); setErr(null);
    try {
      const payload = {
        slug: draft.slug, title: draft.title, excerpt: draft.excerpt,
        content: draft.content, coverUrl: draft.coverUrl,
        category: draft.category, authorName: draft.authorName, published: draft.published,
      };
      if (draft._isNew) await adminCreateBlog(payload);
      else if (draft.id) await adminUpdateBlog(draft.id, payload);
      setDraft(null); await reload();
    } catch (e: any) { setErr(e.message || "Save failed"); }
    finally { setBusy(false); }
  }

  async function del(id: number) {
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try { await adminDeleteBlog(id); await reload(); }
    catch (e: any) { setErr(e.message || "Delete failed"); }
    finally { setBusy(false); }
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => draft && setDraft({ ...draft, [k]: v });

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Blog posts</h2>
        <button
          disabled={!online || busy}
          onClick={() => setDraft(blank())}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {err && <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      {draft && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">{draft._isNew ? "New post" : `Edit â€” ${draft.title}`}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title"><input className="input" value={draft.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Slug"><input className="input" value={draft.slug || ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} /></Field>
            <Field label="Category"><input className="input" value={draft.category || ""} onChange={(e) => set("category", e.target.value)} /></Field>
            <Field label="Author"><input className="input" value={draft.authorName || ""} onChange={(e) => set("authorName", e.target.value)} /></Field>
            <Field label="Cover image URL" full><input className="input" value={draft.coverUrl || ""} onChange={(e) => set("coverUrl", e.target.value)} placeholder="https://..." /></Field>
            <Field label="Excerpt" full><textarea rows={2} className="input" value={draft.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} /></Field>
            <Field label="Content (HTML or Markdown)" full><textarea rows={10} className="input font-mono text-xs" value={draft.content || ""} onChange={(e) => set("content", e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.published} onChange={(e) => set("published", e.target.checked)} />
              Publish (visible on public /blog)
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setDraft(null)} disabled={busy} className="rounded-lg border border-border px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={save} disabled={busy || !online || !draft.title || !draft.slug} className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              <Save className="h-4 w-4" /> {busy ? "Savingâ€¦" : "Save post"}
            </button>
          </div>
          <style>{`.input { width:100%; border:1px solid hsl(var(--border)); background:hsl(var(--background)); border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading postsâ€¦</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground"><Newspaper className="mx-auto mb-2 h-6 w-6" />No posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-muted-foreground">/{b.slug}</div>
                  </td>
                  <td className="px-4 py-3">{b.category}</td>
                  <td className="px-4 py-3">{b.published ? "Yes" : "Draft"}</td>
                  <td className="px-4 py-3 text-right">
                    <button disabled={!online || busy} onClick={() => setDraft({ ...b })} className="mr-2 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                    <button disabled={!online || busy} onClick={() => del(b.id)} className="inline-flex items-center gap-1 rounded-lg border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
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
