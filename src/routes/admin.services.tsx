import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  adminCreate,
  adminDelete,
  adminListAll,
  adminLogin,
  adminToggle,
  adminUpdate,
  absoluteMedia,
  getAdminToken,
  setAdminToken,
  splitFeatures,
  parseSections,
  type ServiceDTO,
  type ServiceSection,
} from "@/lib/services-api";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  Star,
  X,
  Upload,
  LogOut,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [{ title: "Admin · Services — TRI CUBE" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminServicesPage,
});

function AdminServicesPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  useEffect(() => {
    setAuthed(!!getAdminToken());
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title={
          <>
            Manage <span className="gold-text">Services</span>
          </>
        }
        subtitle="Add, edit, toggle visibility, and upload images for the public services page."
      />
      {authed ? <AdminTabs /> : null}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {authed ? (
          <ServicesManager
            onSignOut={() => {
              setAdminToken(null);
              setAuthed(false);
            }}
          />
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
        setBusy(true);
        setErr(null);
        try {
          await adminLogin(email, password);
          onSuccess();
        } catch (e: any) {
          setErr(e.message || "Login failed");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-lg font-semibold">Admin sign in</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Use your TRI CUBE admin credentials. Requires the backend to be running.
      </p>
      <label className="mt-5 block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Email
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Password
        </span>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </label>
      {err && (
        <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {err}
        </p>
      )}
      <button
        disabled={busy}
        className="mt-5 w-full rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function ServicesManager({ onSignOut }: { onSignOut: () => void }) {
  const [rows, setRows] = useState<ServiceDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ServiceDTO | null>(null);
  const [creating, setCreating] = useState(false);

  async function reload() {
    try {
      setRows(await adminListAll());
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  }
  useEffect(() => {
    reload();
  }, []);

  async function onToggle(s: ServiceDTO) {
    if (!s.id) return;
    setRows((rs) => rs?.map((r) => (r.id === s.id ? { ...r, active: !r.active } : r)) ?? rs);
    try {
      await adminToggle(s.id);
    } catch {
      await reload();
    }
  }
  async function onDelete(s: ServiceDTO) {
    if (!s.id || !confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      await adminDelete(s.id);
      reload();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All services</h2>
          <p className="text-xs text-muted-foreground">
            {rows?.length ?? 0} total · inactive rows are hidden from the public page.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add service
          </button>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((s) => (
              <tr key={s.id ?? s.slug} className="border-t border-border/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.imageUrl ? (
                      <img
                        src={absoluteMedia(s.imageUrl)}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-secondary" />
                    )}
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        {s.title}
                        {s.featured && <Star className="h-3 w-3 fill-current text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">/{s.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.category || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold">₹{(s.offerPrice ?? s.price).toLocaleString()}</div>
                  {s.price > (s.offerPrice ?? s.price) && (
                    <div className="text-xs text-muted-foreground line-through">
                      ₹{s.price.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{s.duration}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggle(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}
                  >
                    <Power className="h-3 w-3" /> {s.active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => setEditing(s)}
                      className="rounded-lg border border-border p-2 hover:bg-secondary"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No services yet — click <b>Add service</b>.
                </td>
              </tr>
            )}
            {!rows && !error && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ServiceDialog
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function ServiceDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: ServiceDTO | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial?.id;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Training");
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [offerPrice, setOfferPrice] = useState<number>(initial?.offerPrice ?? 0);
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [rating, setRating] = useState<number>(initial?.rating ?? 4.9);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [longDescription, setLongDescription] = useState(initial?.longDescription ?? "");
  const [features, setFeatures] = useState<string>(splitFeatures(initial?.features).join("\n"));
  const [featured, setFeatured] = useState<boolean>(!!initial?.featured);
  const [active, setActive] = useState<boolean>(initial?.active ?? true);
  const [image, setImage] = useState<File | null>(null);
  const [sections, setSections] = useState<ServiceSection[]>(parseSections(initial?.sections));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function autoSlug(t: string) {
    return t
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (image && image.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");
      const fd = new FormData();
      fd.append("title", title);
      fd.append("slug", slug || autoSlug(title));
      fd.append("category", category);
      fd.append("price", String(price));
      fd.append("offerPrice", String(offerPrice || price));
      fd.append("duration", duration);
      fd.append("rating", String(rating));
      fd.append("description", description);
      fd.append("longDescription", longDescription);
      fd.append("features", features);
      fd.append("sections", JSON.stringify(sections));
      fd.append("featured", String(featured));
      fd.append("active", String(active));
      if (image) fd.append("image", image);
      if (isEdit && initial?.id) await adminUpdate(initial.id, fd);
      else await adminCreate(fd);
      onSaved();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold">{isEdit ? "Edit service" : "Add a new service"}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title *">
              <input
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isEdit) setSlug(autoSlug(e.target.value));
                }}
                className={inputCls}
              />
            </Field>
            <Field label="Slug *">
              <input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={inputCls}
                placeholder="resume-review"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {["Training", "Career", "Development", "Marketing", "Data", "AI", "Other"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Duration">
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputCls}
                placeholder="e.g. 3–4 working days"
              />
            </Field>
            <Field label="Price (₹) *">
              <input
                required
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Offer price (₹)">
              <input
                type="number"
                min={0}
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Rating (0–5)">
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Image (jpg / png / webp, max 5 MB)">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-2.5 text-sm hover:bg-secondary">
                <Upload className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate">
                  {image?.name || (initial?.imageUrl ? "Replace current image" : "Choose image")}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
            </Field>
          </div>

          <Field label="Short description (shown on card)">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Long description (shown on detail page)">
            <textarea
              rows={4}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Features — one per line">
            <textarea
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className={inputCls + " resize-none"}
              placeholder={"Line-by-line expert notes\nATS-friendly rewrite\nEmailed to your inbox"}
            />
          </Field>

          <SectionsEditor sections={sections} onChange={setSections} />

          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />{" "}
              Active (visible publicly)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />{" "}
              Featured (pinned first)
            </label>
          </div>

          {err && (
            <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-border bg-secondary/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            className="rounded-full bg-[var(--gradient-gold)] px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create service"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

// ---------- Section builder ----------

const SECTION_TYPES: { type: ServiceSection["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "steps", label: "Steps (numbered)" },
  { type: "benefits", label: "Benefits (checklist)" },
  { type: "highlights", label: "Highlights (stat cards)" },
  { type: "faq", label: "FAQ" },
  { type: "cta", label: "Call-to-action banner" },
];

function newSection(type: ServiceSection["type"]): ServiceSection {
  switch (type) {
    case "heading":
      return { type, text: "New section", level: 2 };
    case "paragraph":
      return { type, text: "" };
    case "steps":
      return { type, title: "How it works", items: [{ title: "Step 1", body: "" }] };
    case "benefits":
      return { type, title: "What you get", items: [""] };
    case "highlights":
      return { type, title: "Highlights", items: [{ label: "Delivery", value: "3–4 days" }] };
    case "faq":
      return { type, title: "FAQ", items: [{ q: "", a: "" }] };
    case "cta":
      return { type, text: "Ready to get started?" };
  }
}

function SectionsEditor({
  sections,
  onChange,
}: {
  sections: ServiceSection[];
  onChange: (s: ServiceSection[]) => void;
}) {
  const update = (i: number, next: ServiceSection) => {
    const copy = sections.slice();
    copy[i] = next;
    onChange(copy);
  };
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const copy = sections.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">Page sections</h4>
          <span className="text-xs text-muted-foreground">
            Customize the layout below the hero on the public service page.
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((sec, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest">
                {SECTION_TYPES.find((t) => t.type === sec.type)?.label ?? sec.type}
              </span>
              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded-md border border-border p-1 hover:bg-secondary"
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, +1)}
                  className="rounded-md border border-border p-1 hover:bg-secondary"
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md border border-border p-1 text-destructive hover:bg-destructive/10"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <SectionFields section={sec} onChange={(n) => update(i, n)} />
          </div>
        ))}
        {sections.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No custom sections yet. Add one below to control the layout of this service's page.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SECTION_TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => onChange([...sections, newSection(t.type)])}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            <Plus className="h-3 w-3" /> {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionFields({
  section,
  onChange,
}: {
  section: ServiceSection;
  onChange: (s: ServiceSection) => void;
}) {
  const ta = inputCls + " resize-none";

  if (section.type === "heading") {
    return (
      <div className="grid gap-2 md:grid-cols-[1fr_120px]">
        <input
          value={section.text}
          onChange={(e) => onChange({ ...section, text: e.target.value })}
          className={inputCls}
          placeholder="Heading text"
        />
        <select
          value={section.level ?? 2}
          onChange={(e) => onChange({ ...section, level: Number(e.target.value) as 2 | 3 })}
          className={inputCls}
        >
          <option value={2}>H2 (large)</option>
          <option value={3}>H3 (small)</option>
        </select>
      </div>
    );
  }
  if (section.type === "paragraph") {
    return (
      <textarea
        rows={3}
        value={section.text}
        onChange={(e) => onChange({ ...section, text: e.target.value })}
        className={ta}
        placeholder="Paragraph text"
      />
    );
  }
  if (section.type === "cta") {
    return (
      <input
        value={section.text}
        onChange={(e) => onChange({ ...section, text: e.target.value })}
        className={inputCls}
        placeholder="CTA banner text"
      />
    );
  }
  if (section.type === "benefits") {
    return (
      <div className="space-y-2">
        <input
          value={section.title ?? ""}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className={inputCls}
          placeholder="Section title (optional)"
        />
        <textarea
          rows={4}
          value={section.items.join("\n")}
          onChange={(e) =>
            onChange({
              ...section,
              items: e.target.value
                .split("\n")
                .map((x) => x)
                .filter((x, idx, arr) => idx < arr.length - 1 || x.length > 0),
            })
          }
          className={ta}
          placeholder={"One benefit per line\nATS-friendly rewrite\nDelivered to your inbox"}
        />
      </div>
    );
  }
  if (section.type === "steps") {
    return (
      <div className="space-y-2">
        <input
          value={section.title ?? ""}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className={inputCls}
          placeholder="Section title (optional)"
        />
        {section.items.map((it, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
            <input
              value={it.title}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, title: e.target.value } : x,
                  ),
                })
              }
              className={inputCls}
              placeholder={`Step ${i + 1} title`}
            />
            <input
              value={it.body ?? ""}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, body: e.target.value } : x,
                  ),
                })
              }
              className={inputCls}
              placeholder="Short description"
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...section, items: section.items.filter((_, idx) => idx !== i) })
              }
              className="rounded-md border border-border p-2 text-destructive hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ ...section, items: [...section.items, { title: "", body: "" }] })
          }
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
        >
          <Plus className="h-3 w-3" /> Add step
        </button>
      </div>
    );
  }
  if (section.type === "highlights") {
    return (
      <div className="space-y-2">
        <input
          value={section.title ?? ""}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className={inputCls}
          placeholder="Section title (optional)"
        />
        {section.items.map((it, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={it.label}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, label: e.target.value } : x,
                  ),
                })
              }
              className={inputCls}
              placeholder="Label (e.g. Delivery)"
            />
            <input
              value={it.value}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, value: e.target.value } : x,
                  ),
                })
              }
              className={inputCls}
              placeholder="Value (e.g. 3–4 days)"
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...section, items: section.items.filter((_, idx) => idx !== i) })
              }
              className="rounded-md border border-border p-2 text-destructive hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ ...section, items: [...section.items, { label: "", value: "" }] })
          }
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
        >
          <Plus className="h-3 w-3" /> Add highlight
        </button>
      </div>
    );
  }
  if (section.type === "faq") {
    return (
      <div className="space-y-2">
        <input
          value={section.title ?? ""}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className={inputCls}
          placeholder="Section title (optional)"
        />
        {section.items.map((it, i) => (
          <div key={i} className="space-y-1 rounded-lg border border-border/70 p-2">
            <input
              value={it.q}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, q: e.target.value } : x,
                  ),
                })
              }
              className={inputCls}
              placeholder="Question"
            />
            <textarea
              rows={2}
              value={it.a}
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((x, idx) =>
                    idx === i ? { ...x, a: e.target.value } : x,
                  ),
                })
              }
              className={ta}
              placeholder="Answer"
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...section, items: section.items.filter((_, idx) => idx !== i) })
              }
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...section, items: [...section.items, { q: "", a: "" }] })}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
        >
          <Plus className="h-3 w-3" /> Add Q&A
        </button>
      </div>
    );
  }
  return null;
}
