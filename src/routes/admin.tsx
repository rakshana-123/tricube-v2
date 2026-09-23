import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  LogIn,
  MessageSquare,
  Newspaper,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { AdminTabs } from "@/components/site/AdminTabs";
import { BackendStatusProvider } from "@/components/site/BackendStatusBanner";
import { AdminDashboardStats } from "@/components/site/AdminDashboardStats";
import { adminLogin, getAdminToken } from "@/lib/services-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard â€” TRI CUBE" },
      { name: "description", content: "TRI CUBE admin dashboard for managing courses, services, materials, and service requests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getAdminToken());
  }, []);

  if (pathname !== "/admin") {
    return (
      <BackendStatusProvider>
        <Outlet />
      </BackendStatusProvider>
    );
  }

  return (
    <BackendStatusProvider>
      <PageHero
        eyebrow="Admin dashboard"
        title={<>TRI CUBE <span className="teal-text">Control Panel</span></>}
        subtitle="Manage your education website, LMS content, paid materials, and service requests from one place."
      />
      {authed ? <AdminTabs /> : null}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {authed ? <DashboardGrid /> : <AdminLoginCard onSuccess={() => setAuthed(true)} />}
      </section>
    </BackendStatusProvider>
  );
}

function DashboardGrid() {
  return (
    <div className="space-y-8">
      <AdminDashboardStats />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal)]">
              <ShieldCheck className="h-4 w-4" /> Admin access active
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Choose what you want to manage</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For adding or editing courses, open Courses and use the New course button.
            </p>
          </div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--gradient-cta)] px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]"
          >
            <Plus className="h-4 w-4" /> Add course
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard
          to="/admin/courses"
          icon={<BookOpen className="h-5 w-5" />}
          title="Courses"
          desc="Add courses, edit pricing, upload thumbnails, and build modules/videos."
        />
        <AdminCard
          to="/admin/services"
          icon={<Briefcase className="h-5 w-5" />}
          title="Services"
          desc="Create resume review, resume revision, portfolio, and custom paid services."
        />
        <AdminCard
          to="/admin/materials"
          icon={<FileText className="h-5 w-5" />}
          title="Materials"
          desc="Manage paid PDFs, bundles, unlocks, and material order timelines."
        />
        <AdminCard
          to="/admin/service-requests"
          icon={<MessageSquare className="h-5 w-5" />}
          title="Requests"
          desc="Review uploads, update status, attach delivery files, and email users."
        />
        <AdminCard
          to="/admin/events"
          icon={<CalendarDays className="h-5 w-5" />}
          title="Events"
          desc="Publish bootcamps, hackathons, workshops and announcements shown on the home page."
        />
        <AdminCard
          to="/admin/blog"
          icon={<Newspaper className="h-5 w-5" />}
          title="Blog"
          desc="Create, edit and publish blog posts shown on the public /blog page."
        />
        <AdminCard
          to="/admin/gallery"
          icon={<ImageIcon className="h-5 w-5" />}
          title="Gallery"
          desc="Add, edit and remove gallery images shown on the public /gallery page."
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-[var(--teal)]" /> Quick flow
        </h3>
        <ol className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <li className="rounded-xl border border-border p-4"><b className="text-foreground">1.</b> Add course details and price.</li>
          <li className="rounded-xl border border-border p-4"><b className="text-foreground">2.</b> Add modules and video URLs.</li>
          <li className="rounded-xl border border-border p-4"><b className="text-foreground">3.</b> Publish so students can buy and watch.</li>
        </ol>
      </div>
    </div>
  );
}

function AdminCard({ to, icon, title, desc }: { to: string; icon: ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-[var(--teal)] hover:shadow-md"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex text-sm font-semibold text-[var(--teal)] group-hover:underline">Open</span>
    </Link>
  );
}

function AdminLoginCard({ onSuccess }: { onSuccess: () => void }) {
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
        } catch (error: any) {
          setErr(error.message || "Admin login failed");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">
        <LogIn className="h-5 w-5" />
      </div>
      <h2 className="text-xl font-semibold">Admin sign in</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sign in with your seeded admin account to open the dashboard.</p>
      <label className="mt-5 block text-sm">
        <span className="mb-1 block text-muted-foreground">Email</span>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-muted-foreground">Password</span>
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      <button disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--gradient-cta)] px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
        {busy ? "Signing inâ€¦" : "Open admin dashboard"}
      </button>
    </form>
  );
}
