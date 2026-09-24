import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  Receipt,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  FileText,
  Package,
  LifeBuoy,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { getToken, getStoredUser } from "@/lib/auth";
import { API_BASE } from "@/lib/payments";

type OrderItem = {
  id: string;
  kind: "course" | "material" | "bundle" | "service";
  title: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  accessUrl: string | null;
  accessLabel: string | null;
};

export const Route = createFileRoute("/me/orders")({
  head: () => ({
    meta: [{ title: "My orders — TRI CUBE" }, { name: "robots", content: "noindex" }],
  }),
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | OrderItem["kind"]>("all");

  const load = async () => {
    const token = getToken();
    if (!token) {
      navigate({ to: "/auth", search: { redirect: "/me/orders" } });
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/me/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.status === 401) {
        navigate({ to: "/auth", search: { redirect: "/me/orders" } });
        return;
      }
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to load orders");
      setOrders(j.orders as OrderItem[]);
    } catch (e: any) {
      setErr(e.message || "Could not load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: "/me/orders" } });
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = (orders ?? []).filter((o) => filter === "all" || o.kind === filter);
  const totalPaid = (orders ?? [])
    .filter((o) => o.status === "paid" || o.paidAt)
    .reduce((s, o) => s + o.amount, 0);

  return (
    <>
      <PageHero
        eyebrow="Student dashboard"
        title={
          <>
            Orders &amp; <span className="gold-text">payments</span>
          </>
        }
        subtitle="A complete history of everything you've purchased — courses, materials, bundles, and services."
      />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/me"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs font-medium text-[var(--gold-dark)]">
              Lifetime paid: ₹{totalPaid.toLocaleString("en-IN")}
            </div>
            <button
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["course", "Courses"],
              ["material", "Materials"],
              ["bundle", "Bundles"],
              ["service", "Services"],
            ] as const
          ).map(([k, label]) => {
            const count =
              k === "all"
                ? (orders?.length ?? 0)
                : (orders ?? []).filter((o) => o.kind === k).length;
            const active = filter === k;
            return (
              <button
                key={k}
                onClick={() => setFilter(k as any)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold-dark)]"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {label} <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {err && (
          <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {err}
          </p>
        )}

        {loading && !orders && (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your orders…
          </div>
        )}

        {orders && filtered.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Receipt className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No orders yet {filter !== "all" ? `in ${filter}` : ""}.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-block rounded-full bg-[var(--gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[var(--gold-dark)]"
            >
              Browse courses
            </Link>
          </div>
        )}

        <div className="grid gap-3">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      </section>
    </>
  );
}

function OrderCard({ order: o }: { order: OrderItem }) {
  const created = new Date(o.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const paid = o.paidAt
    ? new Date(o.paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)]">
            <KindIcon kind={o.kind} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {kindLabel(o.kind)}
            </div>
            <div className="truncate font-semibold">{o.title}</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Placed {created}</span>
              {paid && <span>· Paid {paid}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="font-mono text-sm font-semibold">
            ₹{o.amount.toLocaleString("en-IN")}{" "}
            <span className="text-[10px] font-normal text-muted-foreground">{o.currency}</span>
          </div>
          <StatusPill status={o.status} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="grid gap-0.5 text-[11px] text-muted-foreground">
          {o.razorpayOrderId && (
            <span>
              Order ID: <span className="font-mono text-foreground/80">{o.razorpayOrderId}</span>
            </span>
          )}
          {o.razorpayPaymentId && (
            <span>
              Payment ID:{" "}
              <span className="font-mono text-foreground/80">{o.razorpayPaymentId}</span>
            </span>
          )}
        </div>
        {o.accessUrl && (
          <a
            href={o.accessUrl}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[var(--gold-dark)]"
          >
            {o.accessLabel || "Open"} <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function KindIcon({ kind }: { kind: OrderItem["kind"] }) {
  const cls = "h-5 w-5";
  if (kind === "course") return <BookOpen className={cls} />;
  if (kind === "material") return <FileText className={cls} />;
  if (kind === "bundle") return <Package className={cls} />;
  return <LifeBuoy className={cls} />;
}

function kindLabel(k: OrderItem["kind"]) {
  return k === "course"
    ? "Course"
    : k === "material"
      ? "Material"
      : k === "bundle"
        ? "Bundle"
        : "Service";
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s === "paid" || s === "delivered" || s === "completed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "failed"
        ? "bg-red-50 text-red-700 border-red-200"
        : s === "refunded" || s === "partially_refunded"
          ? "bg-slate-100 text-slate-700 border-slate-200"
          : s === "in_review" || s === "in_progress"
            ? "bg-sky-50 text-sky-700 border-sky-200"
            : "bg-amber-50 text-amber-700 border-amber-200";
  const label = s === "partially_refunded" ? "Partially refunded" : s.replace(/_/g, " ");
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {label}
    </span>
  );
}
