import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import {
  adminListMaterials, adminCreateMaterial, adminUpdateMaterial, adminToggleMaterial, adminDeleteMaterial,
  adminListBundles, adminCreateBundle, adminUpdateBundle, adminToggleBundle, adminDeleteBundle,
  adminListMaterialOrders,
  absoluteMedia, type MaterialDTO, type BundleDTO, type OrderRow, type OrderEvent,
} from "@/lib/materials-api";
import { adminLogin, getAdminToken, setAdminToken } from "@/lib/services-api";
import { Plus, Pencil, Trash2, Power, LogOut, X, Upload, FileText, Package, Star, Activity, RefreshCw, CheckCircle2, Clock, AlertTriangle, Download, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/materials")({
  head: () => ({ meta: [{ title: "Admin Â· Materials â€” TRI CUBE" }, { name: "robots", content: "noindex" }] }),
  component: AdminMaterialsPage,
});

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function AdminMaterialsPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(!!getAdminToken()); }, []);
  return (
    <>
      <PageHero eyebrow="Admin" title={<>Manage <span className="teal-text">Materials</span></>} subtitle="Add, edit, upload PDFs and covers, and build bundles." />
      {authed ? <AdminTabs /> : null}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {authed ? <Manager onSignOut={() => { setAdminToken(null); setAuthed(false); }} /> : <LoginForm onSuccess={() => setAuthed(true)} />}
      </section>
    </>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("tricubedigitalsolutions@gmail.com"); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  return (
    <form className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr(null);
      try { await adminLogin(email, password); onSuccess(); }
      catch (e: any) { setErr(e.message); } finally { setBusy(false); }
    }}>
      <h2 className="text-lg font-semibold">Admin sign in</h2>
      <label className="mt-5 block text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Email</span>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></label>
      <label className="mt-3 block text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Password</span>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} /></label>
      {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
      <button disabled={busy} className="mt-5 w-full rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {busy ? "Signing inâ€¦" : "Sign in"}
      </button>
    </form>
  );
}

function Manager({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"materials" | "bundles" | "orders">("materials");
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setTab("materials")} className={tabCls(tab === "materials")}><FileText className="h-3.5 w-3.5" /> Materials</button>
          <button onClick={() => setTab("bundles")} className={tabCls(tab === "bundles")}><Package className="h-3.5 w-3.5" /> Bundles</button>
          <button onClick={() => setTab("orders")} className={tabCls(tab === "orders")}><Activity className="h-3.5 w-3.5" /> Orders</button>
        </div>
        <button onClick={onSignOut} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
      </div>
      {tab === "materials" && <MaterialsTab />}
      {tab === "bundles" && <BundlesTab />}
      {tab === "orders" && <OrdersTab />}
    </>
  );
}
const tabCls = (active: boolean) => `inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${active ? "bg-[var(--gradient-gold)] text-primary-foreground" : "border border-border bg-background"}`;

// ---------------- Materials tab ----------------

function MaterialsTab() {
  const [rows, setRows] = useState<MaterialDTO[]>([]);
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<MaterialDTO | null>(null); const [creating, setCreating] = useState(false);
  async function reload() { setLoading(true); setErr(null); try { setRows(await adminListMaterials()); } catch (e: any) { setErr(e.message); } finally { setLoading(false); } }
  useEffect(() => { reload(); }, []);
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add material</button>
      </div>
      {err && <p className="mb-3 text-xs text-destructive">{err}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Loadingâ€¦</p> : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-3 text-left">Cover</th><th className="p-3 text-left">Title</th><th className="p-3 text-left">Category</th><th className="p-3 text-right">Price</th><th className="p-3 text-center">Pages</th><th className="p-3 text-center">Active</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-3">
                    {m.coverUrl ? <img src={absoluteMedia(m.coverUrl)} alt="" className="h-10 w-16 rounded object-cover" /> : <div className="grid h-10 w-16 place-items-center rounded bg-secondary"><FileText className="h-4 w-4 text-muted-foreground" /></div>}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{m.title} {m.featured && <Star className="ml-1 inline h-3 w-3 fill-primary text-primary" />}</div>
                    <div className="text-xs text-muted-foreground">{m.slug}</div>
                  </td>
                  <td className="p-3 text-xs">{m.category}</td>
                  <td className="p-3 text-right">â‚¹{m.price.toLocaleString()}</td>
                  <td className="p-3 text-center text-xs">{m.pages}</td>
                  <td className="p-3 text-center">
                    <button onClick={async () => { await adminToggleMaterial(m.id!); reload(); }} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${m.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Power className="h-3 w-3" /> {m.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setEditing(m)} className="rounded-md border border-border p-1.5 hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={async () => { if (confirm(`Delete "${m.title}"?`)) { await adminDeleteMaterial(m.id!); reload(); } }} className="rounded-md border border-border p-1.5 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No materials yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {(creating || editing) && (
        <MaterialDialog initial={editing || undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }} />
      )}
    </div>
  );
}

function MaterialDialog({ initial, onClose, onSaved }: { initial?: MaterialDTO; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    slug: initial?.slug || "", title: initial?.title || "", category: initial?.category || "Interview Prep",
    price: initial?.price?.toString() || "199", pages: initial?.pages?.toString() || "20",
    rating: initial?.rating?.toString() || "4.9", description: initial?.description || "",
    longDescription: initial?.longDescription || "", highlights: (initial?.highlights || "").replaceAll("|", "\n"),
    active: initial?.active ?? true, featured: initial?.featured ?? false,
  });
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);

  async function submit() {
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, typeof v === "boolean" ? String(v) : String(v)));
      // Convert highlights lines to pipe-separated
      fd.set("highlights", f.highlights.split(/\n/).map((s) => s.trim()).filter(Boolean).join("|"));
      if (cover) fd.append("cover", cover);
      if (pdf) fd.append("pdf", pdf);
      if (preview) fd.append("preview", preview);
      if (initial?.id) await adminUpdateMaterial(initial.id, fd); else await adminCreateMaterial(fd);
      onSaved();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{initial ? "Edit material" : "Add material"}</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Slug"><input className={inputCls} value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="python-notes" /></Field>
          <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Category"><input className={inputCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
          <Field label="Price (â‚¹)"><input type="number" className={inputCls} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></Field>
          <Field label="Pages"><input type="number" className={inputCls} value={f.pages} onChange={(e) => setF({ ...f, pages: e.target.value })} /></Field>
          <Field label="Rating"><input type="number" step="0.1" className={inputCls} value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })} /></Field>
        </div>
        <Field label="Short description"><textarea rows={2} className={inputCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Long description"><textarea rows={4} className={inputCls} value={f.longDescription} onChange={(e) => setF({ ...f, longDescription: e.target.value })} /></Field>
        <Field label="Highlights (one per line)"><textarea rows={4} className={inputCls} value={f.highlights} onChange={(e) => setF({ ...f, highlights: e.target.value })} /></Field>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <FileField label="Cover image" file={cover} onFile={setCover} accept="image/*" existing={initial?.coverUrl} />
          <FileField label="PDF (paid)" file={pdf} onFile={setPdf} accept="application/pdf" existing={initial?.pdfUrl} />
          <FileField label="Preview PDF (free)" file={preview} onFile={setPreview} accept="application/pdf" existing={initial?.previewUrl} />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active</label>
          <label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        </div>
        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-xs">Cancel</button>
          <button disabled={busy} onClick={submit} className="rounded-full bg-[var(--gradient-gold)] px-5 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Savingâ€¦" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Orders / timeline tab ----------------

function OrdersTab() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  async function reload() {
    setLoading(true); setErr(null);
    try { setRows(await adminListMaterialOrders({ q: q.trim() || undefined, status: status || undefined })); }
    catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") reload(); }}
          placeholder="Search email, slug, Razorpay idâ€¦"
          className={inputCls + " max-w-xs"}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls + " max-w-[160px]"}>
          <option value="">All statuses</option>
          <option value="created">Created</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button onClick={reload} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} order{rows.length === 1 ? "" : "s"}</span>
      </div>

      {err && <p className="mb-3 text-xs text-destructive">{err}</p>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loadingâ€¦</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <>
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="p-3">
                      <div className="font-mono text-[11px] text-foreground">{o.razorpayOrderId}</div>
                      {o.razorpayPaymentId && <div className="mt-1 font-mono text-[11px] text-muted-foreground">{o.razorpayPaymentId}</div>}
                    </td>
                    <td className="p-3 text-xs">{o.email}</td>
                    <td className="p-3 text-xs">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest">{o.kind}</span>
                      <div className="mt-1 font-medium">{o.slug}</div>
                    </td>
                    <td className="p-3 text-right text-xs">â‚¹{o.amount.toLocaleString()}</td>
                    <td className="p-3 text-center"><StatusPill status={o.status} /></td>
                    <td className="p-3 text-xs text-muted-foreground">{fmt(o.createdAt)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold"
                      >
                        {expanded === o.id ? "Hide" : "Timeline"}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr key={`${o.id}-tl`} className="border-t border-border bg-secondary/20">
                      <td colSpan={7} className="p-4">
                        <Timeline order={o} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    created: "bg-secondary text-foreground",
    paid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    failed: "bg-destructive/15 text-destructive",
    refunded: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${map[status] || "bg-secondary"}`}>{status}</span>;
}

function fmt(iso?: string | null) {
  if (!iso) return "â€”";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function Timeline({ order }: { order: OrderRow }) {
  // Merge synthetic milestones (from column data) with the eventsLog stream so
  // even legacy orders without events still show a useful timeline.
  const stages: OrderEvent[] = [
    { at: order.createdAt, type: "order.created", message: `Razorpay order ${order.razorpayOrderId} created` },
    ...order.events,
  ];
  if (order.paidAt && !order.events.some((e) => e.type === "webhook.paid")) {
    stages.push({ at: order.paidAt, type: "webhook.paid", message: `Marked paid${order.razorpayPaymentId ? ` (${order.razorpayPaymentId})` : ""}` });
  }
  if (order.downloadTokenIssuedAt && !order.events.some((e) => e.type.startsWith("download."))) {
    stages.push({ at: order.downloadTokenIssuedAt, type: "download.issued", message: "Signed 24h download URL issued" });
  }
  stages.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <ol className="relative ml-2 border-l border-border">
      {stages.map((ev, i) => (
        <li key={i} className="mb-4 ml-4 last:mb-0">
          <span className="absolute -left-[9px] mt-1 grid h-4 w-4 place-items-center rounded-full bg-background ring-1 ring-border">
            <EventIcon type={ev.type} />
          </span>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{fmt(ev.at)}</div>
          <div className="mt-0.5 text-sm font-medium">{ev.type}</div>
          {ev.message && <div className="text-xs text-muted-foreground">{ev.message}</div>}
        </li>
      ))}
      {stages.length === 0 && <li className="ml-4 text-xs text-muted-foreground">No events recorded.</li>}
    </ol>
  );
}

function EventIcon({ type }: { type: string }) {
  const cls = "h-3 w-3";
  if (type === "order.created") return <Clock className={cls + " text-muted-foreground"} />;
  if (type === "verify.pending") return <Clock className={cls + " text-amber-500"} />;
  if (type === "verify.failed" || type === "webhook.failed") return <AlertTriangle className={cls + " text-destructive"} />;
  if (type === "webhook.paid") return <CheckCircle2 className={cls + " text-emerald-500"} />;
  if (type === "webhook.duplicate" || type === "webhook.ignored") return <RefreshCw className={cls + " text-muted-foreground"} />;
  if (type.startsWith("download.")) return <Download className={cls + " text-primary"} />;
  if (type.startsWith("email.")) return <Mail className={cls + " text-primary"} />;
  return <Activity className={cls + " text-muted-foreground"} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block text-sm">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FileField({ label, file, onFile, accept, existing }: { label: string; file: File | null; onFile: (f: File | null) => void; accept: string; existing?: string | null }) {
  return (
    <label className="block cursor-pointer rounded-xl border border-dashed border-border bg-background/60 p-4 text-center text-xs">
      <Upload className="mx-auto mb-1 h-4 w-4 text-primary" />
      <div className="font-semibold">{label}</div>
      <div className="mt-1 text-muted-foreground">{file ? file.name : existing ? "Replace file" : "Choose file"}</div>
      <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
    </label>
  );
}

// ---------------- Bundles tab ----------------

function BundlesTab() {
  const [rows, setRows] = useState<BundleDTO[]>([]); const [materials, setMaterials] = useState<MaterialDTO[]>([]);
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<BundleDTO | null>(null); const [creating, setCreating] = useState(false);
  async function reload() {
    setLoading(true); setErr(null);
    try { const [b, m] = await Promise.all([adminListBundles(), adminListMaterials()]); setRows(b); setMaterials(m); }
    catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add bundle</button>
      </div>
      {err && <p className="mb-3 text-xs text-destructive">{err}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Loadingâ€¦</p> : (
        <div className="grid gap-3">
          {rows.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              {b.coverUrl ? <img src={absoluteMedia(b.coverUrl)} alt="" className="h-14 w-24 rounded object-cover" /> : <div className="grid h-14 w-24 place-items-center rounded bg-secondary"><Package className="h-5 w-5 text-primary" /></div>}
              <div className="flex-1">
                <div className="font-semibold">{b.title} {b.featured && <Star className="ml-1 inline h-3 w-3 fill-primary text-primary" />}</div>
                <div className="text-xs text-muted-foreground">{b.slug} Â· {(b.items || []).length} items Â· â‚¹{b.price.toLocaleString()}</div>
              </div>
              <button onClick={async () => { await adminToggleBundle(b.id!); reload(); }} className={`rounded-full px-2 py-1 text-[10px] font-semibold ${b.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{b.active ? "Active" : "Hidden"}</button>
              <button onClick={() => setEditing(b)} className="rounded-md border border-border p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={async () => { if (confirm(`Delete "${b.title}"?`)) { await adminDeleteBundle(b.id!); reload(); } }} className="rounded-md border border-border p-1.5 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          {!rows.length && <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">No bundles yet.</div>}
        </div>
      )}
      {(creating || editing) && (
        <BundleDialog initial={editing || undefined} materials={materials}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }} />
      )}
    </div>
  );
}

function BundleDialog({ initial, materials, onClose, onSaved }: { initial?: BundleDTO; materials: MaterialDTO[]; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    slug: initial?.slug || "", title: initial?.title || "", description: initial?.description || "",
    price: initial?.price?.toString() || "0", active: initial?.active ?? true, featured: initial?.featured ?? false,
  });
  const [cover, setCover] = useState<File | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>(initial?.items?.map((it) => (it.material as any).id).filter(Boolean) as number[] || []);

  const originalTotal = useMemo(() => materials.filter((m) => selectedIds.includes(m.id!)).reduce((s, m) => s + m.price, 0), [materials, selectedIds]);

  async function submit() {
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("materialIds", JSON.stringify(selectedIds));
      if (cover) fd.append("cover", cover);
      if (initial?.id) await adminUpdateBundle(initial.id, fd); else await adminCreateBundle(fd);
      onSaved();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{initial ? "Edit bundle" : "Add bundle"}</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Slug"><input className={inputCls} value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></Field>
          <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Price (â‚¹)"><input type="number" className={inputCls} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></Field>
          <Field label="Cover">
            <FileField label="Cover image" file={cover} onFile={setCover} accept="image/*" existing={initial?.coverUrl} />
          </Field>
        </div>
        <Field label="Description"><textarea rows={3} className={inputCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="uppercase tracking-widest text-muted-foreground">Included materials</span>
            <span className="text-muted-foreground">Total if bought individually: â‚¹{originalTotal.toLocaleString()}</span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-border">
            {materials.map((m) => {
              const checked = selectedIds.includes(m.id!);
              return (
                <label key={m.id} className="flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2 text-sm last:border-b-0">
                  <input type="checkbox" checked={checked} onChange={(e) => {
                    setSelectedIds((prev) => e.target.checked ? [...prev, m.id!] : prev.filter((x) => x !== m.id));
                  }} />
                  <span className="flex-1">{m.title}</span>
                  <span className="text-xs text-muted-foreground">â‚¹{m.price.toLocaleString()}</span>
                </label>
              );
            })}
            {!materials.length && <p className="p-4 text-center text-xs text-muted-foreground">Create materials first.</p>}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active</label>
          <label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        </div>
        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-xs">Cancel</button>
          <button disabled={busy} onClick={submit} className="rounded-full bg-[var(--gradient-gold)] px-5 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Savingâ€¦" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

