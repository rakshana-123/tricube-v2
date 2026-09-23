import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import {
  adminLogin,
  getAdminToken,
  setAdminToken,
  absoluteMedia,
} from "@/lib/services-api";
import {
  createCourse,
  deleteCourse,
  listAdminCourses,
  listCategories,
  togglePublishCourse,
  updateCourse,
  uploadCourseThumbnail,
  type AdminCourse,
  type AdminModule,
  type CourseCategory,
} from "@/lib/courses-admin-api";

export const Route = createFileRoute("/admin/courses")({
  head: () => ({
    meta: [
      { title: "Admin Â· Courses â€” TRI CUBE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCoursesPage,
});

function AdminCoursesPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => setAuthed(!!getAdminToken()), []);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title={<>Manage <span className="teal-text">Courses</span></>}
        subtitle="Create courses, upload thumbnails, build the curriculum with modules and videos, publish, or archive."
      />
      {authed ? <AdminTabs /> : null}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {authed ? (
          <CoursesManager onSignOut={() => { setAdminToken(null); setAuthed(false); }} />
        ) : (
          <LoginForm onSuccess={() => setAuthed(true)} />
        )}
      </section>
    </>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("tricubedigitalsolutions@gmail.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(null);
        try { await adminLogin(email, password); onSuccess(); }
        catch (e: any) { setErr(e.message || "Login failed"); }
        finally { setBusy(false); }
      }}
    >
      <h2 className="mb-4 text-xl font-semibold">Admin sign in</h2>
      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-muted-foreground">Email</span>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="mb-4 block text-sm">
        <span className="mb-1 block text-muted-foreground">Password</span>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {err && <p className="mb-3 text-sm text-red-500">{err}</p>}
      <button disabled={busy} className="w-full rounded-lg bg-[var(--gradient-gold)] px-4 py-2 font-medium text-black disabled:opacity-60">
        {busy ? "Signing inâ€¦" : "Sign in"}
      </button>
    </form>
  );
}

function CoursesManager({ onSignOut }: { onSignOut: () => void }) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [cats, setCats] = useState<CourseCategory[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [c, cs] = await Promise.all([listAdminCourses(), listCategories()]);
      setCourses(c); setCats(cs);
    } finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(t) || c.slug.toLowerCase().includes(t));
  }, [q, courses]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search coursesâ€¦" className="flex-1 min-w-[220px] rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-gold)] px-4 py-2 text-sm font-medium text-black">
          <Plus className="h-4 w-4" /> New course
        </button>
        <button onClick={onSignOut} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">Sign out</button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loadingâ€¦</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No courses yet. Click <b>New course</b> to add one.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Modules</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const videoCount = c.modules.reduce((n, m) => n + m.videos.length, 0);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.thumbnailUrl ? (
                          <img src={absoluteMedia(c.thumbnailUrl)} alt="" className="h-10 w-16 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-16 rounded bg-muted" />
                        )}
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-muted-foreground">/{c.slug} Â· {c.trainer || "â€”"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">â‚¹{c.price}{c.discount ? <span className="ml-1 text-xs text-muted-foreground line-through">â‚¹{c.price + c.discount}</span> : null}</td>
                    <td className="px-4 py-3">{c.modules.length} Â· {videoCount} videos</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${c.published ? "bg-green-500/10 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {c.published ? <><Eye className="h-3 w-3" /> Published</> : <><EyeOff className="h-3 w-3" /> Draft</>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button title="Edit" onClick={() => setEditing(c)} className="rounded p-2 hover:bg-muted/50"><Pencil className="h-4 w-4" /></button>
                        <button title={c.published ? "Unpublish" : "Publish"} onClick={async () => { await togglePublishCourse(c.id); refresh(); }} className="rounded p-2 hover:bg-muted/50">
                          {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button title="Delete" onClick={async () => {
                          if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
                          try { await deleteCourse(c.id); refresh(); } catch (e: any) { alert(e.message); }
                        }} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <CourseEditor
          initial={editing}
          categories={cats}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refresh(); }}
        />
      )}
    </div>
  );
}

function emptyCourse(): AdminCourse {
  return {
    id: 0, slug: "", title: "", trainer: "", description: "", duration: "",
    level: "beginner", price: 0, discount: 0, learningOutcomes: "",
    thumbnailUrl: null, categoryId: null, published: true, modules: [], updatedAt: "",
  };
}

function CourseEditor({
  initial,
  categories,
  onClose,
  onSaved,
}: {
  initial: AdminCourse | null;
  categories: CourseCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [c, setC] = useState<AdminCourse>(initial ? { ...initial, modules: initial.modules.map((m) => ({ ...m, videos: [...m.videos] })) } : emptyCourse());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isNew = !initial;

  function set<K extends keyof AdminCourse>(k: K, v: AdminCourse[K]) { setC((p) => ({ ...p, [k]: v })); }

  function updateModule(i: number, patch: Partial<AdminModule>) {
    setC((p) => ({ ...p, modules: p.modules.map((m, idx) => idx === i ? { ...m, ...patch } : m) }));
  }
  function moveModule(i: number, dir: -1 | 1) {
    setC((p) => {
      const arr = [...p.modules]; const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, modules: arr };
    });
  }
  function addModule() {
    setC((p) => ({ ...p, modules: [...p.modules, { title: "New module", videos: [] }] }));
  }
  function removeModule(i: number) {
    setC((p) => ({ ...p, modules: p.modules.filter((_, idx) => idx !== i) }));
  }
  function addVideo(mi: number) {
    setC((p) => ({
      ...p,
      modules: p.modules.map((m, idx) => idx === mi
        ? { ...m, videos: [...m.videos, { title: "New video", url: "", durationSec: 0, isFreePreview: false }] }
        : m),
    }));
  }
  function updateVideo(mi: number, vi: number, patch: Partial<AdminModule["videos"][number]>) {
    setC((p) => ({
      ...p,
      modules: p.modules.map((m, idx) => idx === mi
        ? { ...m, videos: m.videos.map((v, j) => j === vi ? { ...v, ...patch } : v) }
        : m),
    }));
  }
  function removeVideo(mi: number, vi: number) {
    setC((p) => ({
      ...p,
      modules: p.modules.map((m, idx) => idx === mi
        ? { ...m, videos: m.videos.filter((_, j) => j !== vi) }
        : m),
    }));
  }
  function moveVideo(mi: number, vi: number, dir: -1 | 1) {
    setC((p) => ({
      ...p,
      modules: p.modules.map((m, idx) => {
        if (idx !== mi) return m;
        const arr = [...m.videos]; const j = vi + dir;
        if (j < 0 || j >= arr.length) return m;
        [arr[vi], arr[j]] = [arr[j], arr[vi]];
        return { ...m, videos: arr };
      }),
    }));
  }

  async function handleSave() {
    setBusy(true); setErr(null);
    try {
      const payload: Partial<AdminCourse> = {
        slug: c.slug.trim(),
        title: c.title.trim(),
        trainer: c.trainer,
        description: c.description,
        duration: c.duration,
        level: c.level,
        price: Number(c.price) || 0,
        discount: Number(c.discount) || 0,
        learningOutcomes: c.learningOutcomes || "",
        categoryId: c.categoryId ? Number(c.categoryId) : null,
        published: c.published,
        modules: c.modules.map((m, i) => ({
          id: m.id,
          title: m.title,
          position: i,
          videos: m.videos.map((v, j) => ({
            id: v.id,
            title: v.title,
            url: v.url,
            durationSec: Number(v.durationSec) || 0,
            position: j,
            isFreePreview: !!v.isFreePreview,
            pdfUrl: v.pdfUrl || null,
          })),
        })),
      };
      const saved = isNew ? await createCourse(payload) : await updateCourse(c.id, payload);
      // If user picked a file that hasn't been uploaded (create path), upload after save
      if (pendingFile) {
        await uploadCourseThumbnail(saved.id, pendingFile);
      }
      onSaved();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (!isNew && c.id) {
      try {
        const updated = await uploadCourseThumbnail(c.id, f);
        set("thumbnailUrl", updated.thumbnailUrl || null);
      } catch (err: any) { alert(err.message); }
    } else {
      setPendingFile(f);
      set("thumbnailUrl", URL.createObjectURL(f));
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <h3 className="text-lg font-semibold">{isNew ? "New course" : `Edit: ${c.title}`}</h3>
          <button onClick={onClose} className="rounded p-2 hover:bg-muted/50"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-6 p-6">
          {/* Meta */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Slug"><input required value={c.slug} onChange={(e) => set("slug", e.target.value)} className="input" placeholder="python-mastery" /></Field>
            <Field label="Title"><input required value={c.title} onChange={(e) => set("title", e.target.value)} className="input" /></Field>
            <Field label="Trainer"><input value={c.trainer} onChange={(e) => set("trainer", e.target.value)} className="input" /></Field>
            <Field label="Duration"><input value={c.duration} onChange={(e) => set("duration", e.target.value)} className="input" placeholder="8 weeks" /></Field>
            <Field label="Level">
              <select value={c.level} onChange={(e) => set("level", e.target.value as any)} className="input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Category">
              <select value={c.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)} className="input">
                <option value="">â€” None â€”</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </Field>
            <Field label="Price (â‚¹)"><input type="number" value={c.price} onChange={(e) => set("price", Number(e.target.value))} className="input" /></Field>
            <Field label="Discount (â‚¹)"><input type="number" value={c.discount} onChange={(e) => set("discount", Number(e.target.value))} className="input" /></Field>
          </div>

          <Field label="Description">
            <textarea rows={3} value={c.description} onChange={(e) => set("description", e.target.value)} className="input" />
          </Field>
          <Field label="Learning outcomes (one per line)">
            <textarea rows={4} value={c.learningOutcomes ?? ""} onChange={(e) => set("learningOutcomes", e.target.value)} className="input" />
          </Field>

          <Field label="Thumbnail">
            <div className="flex items-center gap-3">
              {c.thumbnailUrl ? (
                <img src={absoluteMedia(c.thumbnailUrl)} alt="" className="h-20 w-32 rounded object-cover" />
              ) : (
                <div className="h-20 w-32 rounded bg-muted" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50">
                <Upload className="h-4 w-4" /> Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={c.published} onChange={(e) => set("published", e.target.checked)} />
            Published (visible on the public site)
          </label>

          {/* Curriculum */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold">Curriculum</h4>
              <button onClick={addModule} className="inline-flex items-center gap-1 rounded-lg bg-[var(--gradient-gold)] px-3 py-1.5 text-sm font-medium text-black">
                <Plus className="h-4 w-4" /> Add module
              </button>
            </div>
            {c.modules.length === 0 && <p className="text-sm text-muted-foreground">No modules yet.</p>}
            <div className="space-y-3">
              {c.modules.map((m, mi) => (
                <div key={mi} className="rounded-xl border border-border bg-background p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">M{mi + 1}</span>
                    <input value={m.title} onChange={(e) => updateModule(mi, { title: e.target.value })} className="input flex-1" placeholder="Module title" />
                    <button title="Up" onClick={() => moveModule(mi, -1)} className="rounded p-1.5 hover:bg-muted/50"><ArrowUp className="h-4 w-4" /></button>
                    <button title="Down" onClick={() => moveModule(mi, 1)} className="rounded p-1.5 hover:bg-muted/50"><ArrowDown className="h-4 w-4" /></button>
                    <button title="Remove module" onClick={() => removeModule(mi)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="space-y-2 pl-4">
                    {m.videos.map((v, vi) => (
                      <div key={vi} className="grid grid-cols-12 items-center gap-2">
                        <input value={v.title} onChange={(e) => updateVideo(mi, vi, { title: e.target.value })} className="input col-span-4" placeholder="Video title" />
                        <input value={v.url} onChange={(e) => updateVideo(mi, vi, { url: e.target.value })} className="input col-span-5" placeholder="Video URL (YouTube / mp4)" />
                        <input type="number" value={v.durationSec ?? 0} onChange={(e) => updateVideo(mi, vi, { durationSec: Number(e.target.value) })} className="input col-span-1" title="Duration (sec)" />
                        <label className="col-span-1 flex items-center gap-1 text-xs" title="Free preview">
                          <input type="checkbox" checked={!!v.isFreePreview} onChange={(e) => updateVideo(mi, vi, { isFreePreview: e.target.checked })} />
                          Free
                        </label>
                        <div className="col-span-1 flex justify-end gap-1">
                          <button onClick={() => moveVideo(mi, vi, -1)} className="rounded p-1 hover:bg-muted/50"><ArrowUp className="h-3.5 w-3.5" /></button>
                          <button onClick={() => moveVideo(mi, vi, 1)} className="rounded p-1 hover:bg-muted/50"><ArrowDown className="h-3.5 w-3.5" /></button>
                          <button onClick={() => removeVideo(mi, vi)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addVideo(mi)} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/40">
                      <Plus className="h-3.5 w-3.5" /> Add video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/50">Cancel</button>
          <button disabled={busy} onClick={handleSave} className="rounded-lg bg-[var(--gradient-gold)] px-5 py-2 text-sm font-medium text-black disabled:opacity-60">
            {busy ? "Savingâ€¦" : isNew ? "Create course" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
