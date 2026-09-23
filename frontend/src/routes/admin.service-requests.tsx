import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  LogOut,
  Mail,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Upload,
  X,
  XCircle,
  CircleDot,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { adminLogin, getAdminToken, setAdminToken, absoluteMedia } from "@/lib/services-api";
import {
  listServiceRequests,
  updateServiceRequest,
  type ServiceRequestDTO,
  type ServiceRequestStatus,
} from "@/lib/service-requests-api";

export const Route = createFileRoute("/admin/service-requests")({
  head: () => ({
    meta: [
      { title: "Admin · Service Requests — TRI CUBE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminServiceRequestsPage,
});

const STATUS_FLOW: ServiceRequestStatus[] = ["pending", "paid", "in_review", "delivered"];

const STATUS_META: Record<ServiceRequestStatus, { label: string; className: string; dot: string }> =
  {
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800 border-amber-200",
      dot: "bg-amber-500",
    },
    paid: {
      label: "Paid",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
    },
    in_review: {
      label: "In review",
      className: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
    },
    delivered: {
      label: "Delivered",
      className: "bg-violet-100 text-violet-800 border-violet-200",
      dot: "bg-violet-500",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-rose-100 text-rose-800 border-rose-200",
      dot: "bg-rose-500",
    },
  };

function AdminServiceRequestsPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(!!getAdminToken());
  }, []);
  return (
    <>
      <PageHero
        eyebrow="Admin"
        title={
          <>
            Service <span className="gold-text">Requests</span>
          </>
        }
        subtitle="Review paid requests, track their status timeline, attach deliverables, and email clients."
      />
      {authed ? <AdminTabs /> : null}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {authed ? (
          <RequestsManager
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

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-soft)]";

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
        Requires the backend to be running locally.
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

function RequestsManager({ onSignOut }: { onSignOut: () => void }) {
  const [items, setItems] = useState<ServiceRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ServiceRequestStatus>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      setItems(await listServiceRequests());
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (status !== "all" && it.status !== status) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.email.toLowerCase().includes(q) ||
        it.serviceTitle.toLowerCase().includes(q) ||
        it.serviceSlug.toLowerCase().includes(q) ||
        (it.razorpayPaymentId || "").toLowerCase().includes(q) ||
        String(it.id).includes(q)
      );
    });
  }, [items, query, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => {
      c[i.status] = (c[i.status] || 0) + 1;
    });
    return c;
  }, [items]);

  const active = openId != null ? items.find((i) => i.id === openId) : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, service, payment id…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(["all", ...STATUS_FLOW, "cancelled"] as const).map((s) => {
          const isActive = status === s;
          const label = s === "all" ? "All" : STATUS_META[s as ServiceRequestStatus].label;
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? "border-[var(--gold)] bg-[var(--gold-soft)] text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {label} <span className="opacity-60">({counts[s] || 0})</span>
            </button>
          );
        })}
      </div>

      {err && (
        <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it.id} className="border-t border-border/60 hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{it.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{it.serviceTitle}</div>
                      <div className="text-xs text-muted-foreground">{it.serviceSlug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">{it.email}</div>
                    </td>
                    <td className="px-4 py-3">₹{it.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(it.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setOpenId(it.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                      >
                        <Eye className="h-3.5 w-3.5" /> Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {active && (
        <RequestDrawer
          request={active}
          onClose={() => setOpenId(null)}
          onSaved={(updated) => {
            setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function RequestDrawer({
  request,
  onClose,
  onSaved,
}: {
  request: ServiceRequestDTO;
  onClose: () => void;
  onSaved: (r: ServiceRequestDTO) => void;
}) {
  const [note, setNote] = useState(request.adminNote || "");
  const [urlInput, setUrlInput] = useState(request.deliveryFileUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save(status?: ServiceRequestStatus, tag = "save") {
    setBusy(tag);
    setErr(null);
    try {
      const updated = await updateServiceRequest(request.id, {
        status,
        adminNote: note,
        deliveryFileUrl: urlInput && /^https?:\/\//i.test(urlInput) ? urlInput : undefined,
        deliveryFile: file,
      });
      onSaved(updated);
      setFile(null);
      if (status === "delivered") onClose();
    } catch (e: any) {
      setErr(e.message || "Update failed");
    } finally {
      setBusy(null);
    }
  }

  const timeline = buildTimeline(request);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-y-auto bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Request #{request.id}
            </div>
            <h3 className="text-lg font-semibold">{request.serviceTitle}</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <div>
              <div className="text-xs text-muted-foreground">Current status</div>
              <div className="mt-1">
                <StatusBadge status={request.status} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="text-lg font-semibold">₹{request.amount.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Client</h4>
            <dl className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-4 text-sm sm:grid-cols-2">
              <Field label="Name" value={request.name} />
              <Field
                label="Email"
                value={
                  <a
                    href={`mailto:${request.email}`}
                    className="text-[var(--gold-dark)] hover:underline"
                  >
                    {request.email}
                  </a>
                }
              />
              <Field label="Phone" value={request.phone || "—"} />
              <Field label="Target role" value={request.targetRole || "—"} />
              <Field
                label="Payment ID"
                value={
                  <span className="font-mono text-xs">{request.razorpayPaymentId || "—"}</span>
                }
              />
              <Field
                label="Order ID"
                value={<span className="font-mono text-xs">{request.razorpayOrderId || "—"}</span>}
              />
            </dl>
          </section>

          {request.notes && (
            <section>
              <h4 className="mb-2 text-sm font-semibold">Client notes</h4>
              <p className="whitespace-pre-wrap rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                {request.notes}
              </p>
            </section>
          )}

          <section>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Paperclip className="h-4 w-4" /> Client attachment
            </h4>
            {request.fileUrl ? (
              <a
                href={absoluteMedia(request.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                <FileText className="h-4 w-4" /> Open uploaded file
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No file uploaded.</p>
            )}
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Timeline</h4>
            <ol className="space-y-3 rounded-xl border border-border bg-card p-4">
              {timeline.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${t.done ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <CircleDot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t.label}</div>
                    {t.detail && <div className="text-xs text-muted-foreground">{t.detail}</div>}
                  </div>
                  {t.at && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(t.at).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Admin note to client</h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="A short message that goes into the delivery email."
              className={inputCls}
            />
          </section>

          <section>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Upload className="h-4 w-4" /> Delivery attachment
            </h4>
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              {request.deliveryFileUrl && (
                <a
                  href={absoluteMedia(request.deliveryFileUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  <FileText className="h-3.5 w-3.5" /> Current delivery file
                </a>
              )}
              <label className="block text-xs">
                <span className="mb-1 block font-medium uppercase tracking-widest text-muted-foreground">
                  Upload new file
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
                {file && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Selected: {file.name}
                  </span>
                )}
              </label>
              <label className="block text-xs">
                <span className="mb-1 block font-medium uppercase tracking-widest text-muted-foreground">
                  Or paste external URL
                </span>
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://…"
                  className={inputCls}
                />
              </label>
            </div>
          </section>

          {err && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </p>
          )}

          <section className="sticky bottom-0 -mx-6 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => save(undefined, "save")}
                disabled={!!busy}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60"
              >
                {busy === "save" ? "Saving…" : "Save changes"}
              </button>
              <button
                onClick={() => save("in_review", "in_review")}
                disabled={!!busy}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-100 disabled:opacity-60"
              >
                <Clock className="h-4 w-4" /> Mark in review
              </button>
              <button
                onClick={() => save("delivered", "delivered")}
                disabled={!!busy}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />{" "}
                {busy === "delivered" ? "Delivering…" : "Deliver & email client"}
              </button>
              <button
                onClick={() => save("cancelled", "cancelled")}
                disabled={!!busy}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" /> Cancel request
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" /> "Deliver" sends the client an email with your note and
              the attached file.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

function buildTimeline(r: ServiceRequestDTO) {
  const created = r.createdAt;
  const paid = !!r.razorpayPaymentId;
  const inReview = r.status === "in_review" || r.status === "delivered";
  const delivered = r.status === "delivered";
  const cancelled = r.status === "cancelled";
  return [
    { label: "Request created", detail: `${r.name} · ${r.email}`, done: true, at: created },
    {
      label: "Payment received",
      detail: paid ? `Razorpay · ${r.razorpayPaymentId}` : "Awaiting payment",
      done: paid,
    },
    {
      label: "In review by admin",
      detail: inReview ? (r.adminNote ? "Notes attached" : "Being processed") : "Not started yet",
      done: inReview,
    },
    {
      label: "Delivered to client",
      detail: delivered
        ? r.deliveryFileUrl
          ? "File shared via email"
          : "Email sent"
        : "Pending delivery",
      done: delivered,
      at: delivered ? r.updatedAt : undefined,
    },
    ...(cancelled
      ? [
          {
            label: "Cancelled",
            detail: r.adminNote || "Marked cancelled",
            done: true,
            at: r.updatedAt,
          },
        ]
      : []),
  ];
}
