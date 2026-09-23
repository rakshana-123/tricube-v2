import { useEffect, useState } from "react";
import {
  Users, BookOpen, Briefcase, FileText, Package, CalendarDays, Newspaper,
  Image as ImageIcon, MessageSquare, IndianRupee, ShoppingCart, Mail,
  Award, Star, HelpCircle, Loader2, RefreshCw,
} from "lucide-react";
import { adminFetch } from "@/lib/services-api";
import { StatCounter } from "@/components/site/StatCounter";

type Stats = {
  students: number; admins: number;
  courses: number; publishedCourses: number;
  services: number; materials: number; bundles: number;
  events: number; upcomingEvents: number;
  blogs: number; galleryItems: number; testimonials: number; faqs: number;
  orders: number; paidOrders: number; materialOrdersPaid: number;
  serviceRequests: number; pendingRequests: number;
  contactMessages: number; unreadMessages: number;
  newsletter: number; certificates: number;
  revenue: number; courseRevenue: number; materialRevenue: number; serviceRevenue: number;
};

type Recent = {
  payments: any[]; orders: any[]; requests: any[]; users: any[];
};

function fmtINR(n: number) {
  return `â‚¹${(n / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function AdminDashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await adminFetch("/api/admin/dashboard", {}, "Failed to load dashboard");
      const j = await r.json();
      setStats(j.stats);
      setRecent(j.recent || null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading live counts from backendâ€¦
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {err}
        <button onClick={load} className="ml-3 inline-flex items-center gap-1 rounded-md border border-red-300 bg-white px-2 py-1 text-xs font-semibold text-red-700">
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Live counts</h2>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-[var(--teal)]">
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* Revenue row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RevenueCard label="Total revenue" value={stats.revenue} icon={<IndianRupee className="h-5 w-5" />} highlight />
        <RevenueCard label="Courses" value={stats.courseRevenue} icon={<BookOpen className="h-5 w-5" />} />
        <RevenueCard label="Materials" value={stats.materialRevenue} icon={<FileText className="h-5 w-5" />} />
        <RevenueCard label="Services" value={stats.serviceRevenue} icon={<Briefcase className="h-5 w-5" />} />
      </div>

      {/* Content counts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Students" value={stats.students} sub={`${stats.admins} admins`} />
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Courses" value={stats.courses} sub={`${stats.publishedCourses} published`} />
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="Services" value={stats.services} />
        <StatCard icon={<FileText className="h-5 w-5" />} label="Materials" value={stats.materials} sub={`${stats.bundles} bundles`} />
        <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Events" value={stats.events} sub={`${stats.upcomingEvents} upcoming`} />
        <StatCard icon={<Newspaper className="h-5 w-5" />} label="Blog posts" value={stats.blogs} />
        <StatCard icon={<ImageIcon className="h-5 w-5" />} label="Gallery" value={stats.galleryItems} />
        <StatCard icon={<Star className="h-5 w-5" />} label="Testimonials" value={stats.testimonials} />
      </div>

      {/* Operational counts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ShoppingCart className="h-5 w-5" />} label="Course orders" value={stats.orders} sub={`${stats.paidOrders} paid`} />
        <StatCard icon={<Package className="h-5 w-5" />} label="Material orders" value={stats.materialOrdersPaid} sub="paid" />
        <StatCard icon={<MessageSquare className="h-5 w-5" />} label="Service requests" value={stats.serviceRequests} sub={`${stats.pendingRequests} open`} />
        <StatCard icon={<Mail className="h-5 w-5" />} label="Contact messages" value={stats.contactMessages} sub={`${stats.unreadMessages} unread`} />
        <StatCard icon={<Mail className="h-5 w-5" />} label="Newsletter" value={stats.newsletter} />
        <StatCard icon={<Award className="h-5 w-5" />} label="Certificates" value={stats.certificates} />
        <StatCard icon={<HelpCircle className="h-5 w-5" />} label="FAQs" value={stats.faqs} />
      </div>

      {/* Recent activity */}
      {recent ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <RecentPanel title="Recent payments">
            {recent.payments.length === 0 ? <EmptyRow /> : recent.payments.map((p: any) => (
              <RecentRow key={p.id}
                title={p.order?.course?.title || `Order #${p.orderId}`}
                sub={`${p.user?.name || ""} Â· ${p.user?.email || ""}`}
                right={<span className="font-semibold text-[var(--teal)]">{fmtINR(p.amount)}</span>}
                date={p.createdAt}
              />
            ))}
          </RecentPanel>
          <RecentPanel title="Recent service requests">
            {recent.requests.length === 0 ? <EmptyRow /> : recent.requests.map((r: any) => (
              <RecentRow key={r.id}
                title={r.serviceTitle}
                sub={`${r.name} Â· ${r.email}`}
                right={<span className="rounded-full bg-[var(--teal-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--teal)]">{r.status}</span>}
                date={r.createdAt}
              />
            ))}
          </RecentPanel>
          <RecentPanel title="Recent orders">
            {recent.orders.length === 0 ? <EmptyRow /> : recent.orders.map((o: any) => (
              <RecentRow key={o.id}
                title={o.course?.title || `Order #${o.id}`}
                sub={`${o.user?.name || ""} Â· ${o.user?.email || ""}`}
                right={<span className="text-xs font-semibold uppercase text-muted-foreground">{o.status}</span>}
                date={o.createdAt}
              />
            ))}
          </RecentPanel>
          <RecentPanel title="New students">
            {recent.users.length === 0 ? <EmptyRow /> : recent.users.map((u: any) => (
              <RecentRow key={u.id} title={u.name} sub={u.email} right={null} date={u.createdAt} />
            ))}
          </RecentPanel>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--teal-soft)] text-[var(--teal)]">{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">
        <StatCounter value={value} />
      </div>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function RevenueCard({ label, value, icon, highlight }: { label: string; value: number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${highlight ? "border-[var(--teal)] bg-[var(--teal-soft)]" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[var(--teal)]">{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--teal)]">
        {fmtINR(value)}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Lifetime, paid only</p>
    </div>
  );
}

function RecentPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold tracking-tight">{title}</h3>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function RecentRow({ title, sub, right, date }: { title: string; sub?: string; right: React.ReactNode; date?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        {sub ? <p className="truncate text-xs text-muted-foreground">{sub}</p> : null}
      </div>
      <div className="flex flex-col items-end gap-1 whitespace-nowrap">
        {right}
        {date ? <span className="text-[10px] text-muted-foreground">{new Date(date).toLocaleString()}</span> : null}
      </div>
    </div>
  );
}

function EmptyRow() {
  return <p className="py-2 text-xs text-muted-foreground">No records yet.</p>;
}
