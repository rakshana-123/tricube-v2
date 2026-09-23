import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw, ScrollText, Search } from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { adminFetch, getAdminToken } from "@/lib/services-api";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Admin Audit â€” TRI CUBE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuditPage,
});

type LogUser = { id: number; name?: string | null; email?: string | null; role?: string | null };
type LogRow = {
  id: number;
  action: string;
  meta?: string | null;
  ip?: string | null;
  createdAt: string;
  user?: LogUser | null;
};

type Category = "all" | "create" | "edit" | "delete" | "publish" | "upload";

const CATEGORIES: { key: Category; label: string; hint: string }[] = [
  { key: "all", label: "All", hint: "Everything" },
  { key: "create", label: "Create", hint: "New records" },
  { key: "edit", label: "Edit", hint: "Updates" },
  { key: "delete", label: "Delete", hint: "Removals" },
  { key: "publish", label: "Publish", hint: "Toggle / publish" },
  { key: "upload", label: "Upload", hint: "Files & media" },
];

function classify(action: string): Category {
  const a = action.toLowerCase();
  if (a.startsWith("delete")) return "delete";
  if (a.startsWith("upload")) return "upload";
  if (a.startsWith("publish")) return "publish";
  if (a.startsWith("create")) return "create";
  if (a.startsWith("edit")) return "edit";
  return "all";
}

const CAT_STYLES: Record<Category, string> = {
  all: "bg-muted text-foreground",
  create: "bg-emerald-100 text-emerald-800",
  edit: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  publish: "bg-[var(--teal-soft)] text-[var(--teal)]",
  upload: "bg-violet-100 text-violet-800",
};

function AuditPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [cat, setCat] = useState<Category>("all");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const token = getAdminToken();
      if (!token) throw new Error("Sign in as an admin to view the audit log.");
      const r = await adminFetch("/api/admin/activity", {
        headers: { Authorization: `Bearer ${token}` },
      }, "Failed to load audit log");
      const j = await r.json();
      setLogs(j.logs || []);
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return logs.filter((l) => {
      if (cat !== "all" && classify(l.action) !== cat) return false;
      if (!needle) return true;
      const hay = [
        l.action,
        l.meta || "",
        l.user?.email || "",
        l.user?.name || "",
        l.ip || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [logs, cat, q]);

  const counts = useMemo(() => {
    const c: Record<Category, number> = { all: logs.length, create: 0, edit: 0, delete: 0, publish: 0, upload: 0 };
    for (const l of logs) {
      const k = classify(l.action);
      if (k !== "all") c[k] += 1;
    }
    return c;
  }, [logs]);

  return (
    <>
      <PageHero
        eyebrow="Admin audit"
        title={<>Recent <span className="teal-text">admin activity</span></>}
        subtitle="Every create, edit, delete, publish, and upload action performed by admins, with who did it and when."
      />
      <AdminTabs />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  cat === c.key
                    ? "border-[var(--teal)] bg-[var(--teal-soft)] text-[var(--teal)]"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Filter className="h-3 w-3" />
                {c.label}
                <span className="rounded-full bg-background/60 px-1.5 text-[10px]">{counts[c.key]}</span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search action, user, IPâ€¦"
                className="w-64 rounded-lg border border-border bg-background pl-8 pr-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted/50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[110px_1fr_180px_140px_160px] gap-3 border-b border-border bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div>Type</div>
            <div>Action</div>
            <div>User</div>
            <div>IP</div>
            <div>When</div>
          </div>
          {loading && !logs.length ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">Loading audit logâ€¦</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center text-sm text-muted-foreground">
              <ScrollText className="h-6 w-6" />
              No admin actions match this filter yet.
            </div>
          ) : (
            filtered.map((l) => {
              const k = classify(l.action);
              return (
                <div
                  key={l.id}
                  className="grid grid-cols-[110px_1fr_180px_140px_160px] gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-b-0"
                >
                  <div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${CAT_STYLES[k]}`}>
                      {k === "all" ? "action" : k}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs text-foreground">{l.action}</div>
                    {l.meta && (
                      <div className="mt-1 line-clamp-2 break-all text-[11px] text-muted-foreground">{l.meta}</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{l.user?.name || "â€”"}</div>
                    <div className="truncate text-xs text-muted-foreground">{l.user?.email || `#${l.user?.id ?? "?"}`}</div>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{l.ip || "â€”"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(l.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing the last 200 admin actions. Passwords, tokens, and OTPs are automatically redacted.
        </p>
      </section>
    </>
  );
}

