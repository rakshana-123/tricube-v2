import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  User, Mail, Phone, ShieldCheck, LogOut, GraduationCap, BookOpen, FileText, LifeBuoy, Loader2,
  Receipt, ShieldAlert,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { fetchMe, getStoredUser, signOut, useAuth, type AuthUser } from "@/lib/auth";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "My account â€” TRI CUBE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MePage,
});

function MePage() {
  const { user: cached, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(cached ?? getStoredUser());
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: "/me" } });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const fresh = await fetchMe();
        if (!cancelled) {
          if (fresh) setUser(fresh);
          else navigate({ to: "/auth", search: { redirect: "/me" } });
        }
      } catch (e: any) {
        if (!cancelled) setErr(e.message || "Could not load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <section className="mx-auto flex max-w-md items-center justify-center px-6 py-24 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your accountâ€¦
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Student dashboard"
        title={<>Welcome, <span className="teal-text">{user.name.split(" ")[0]}</span></>}
        subtitle="Your account, purchases, and quick links live here."
      />
      <section className="mx-auto max-w-5xl px-6 py-12">
        {err && <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</p>}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--teal-soft)] text-lg font-bold text-[var(--teal)]">
                {user.name.trim().charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.role}</div>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <Row icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
              <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || "â€”"} />
              <Row
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Verified"
                value={user.emailVerified
                  ? <span className="inline-flex items-center gap-1 text-emerald-700">Yes</span>
                  : <span className="text-amber-700">Pending OTP</span>}
              />
            </dl>
            <button
              onClick={() => { signOut(); navigate({ to: "/auth" }); }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>

          <div className="grid gap-4 md:col-span-2">
            {(user.role === "admin" || user.role === "super_admin") && (
              <QuickCard to="/admin" icon={<ShieldAlert className="h-5 w-5" />} title="Admin panel"
                desc="Add & edit courses, services, materials, and service requests." />
            )}
            <QuickCard to="/me/courses" icon={<BookOpen className="h-5 w-5" />} title="My courses"
              desc="Browse your enrolled courses and continue where you left off." />
            <QuickCard to="/me/orders" icon={<Receipt className="h-5 w-5" />} title="Orders & payments"
              desc="View every purchase, payment status, receipts, and access links." />
            <QuickCard to="/my-materials" icon={<FileText className="h-5 w-5" />} title="My materials"
              desc="Download PDFs and bundles you've purchased." />
            <QuickCard to="/services" icon={<LifeBuoy className="h-5 w-5" />} title="Services"
              desc="Order resume review, portfolio setup, and more." />
            {user.student && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><GraduationCap className="h-4 w-4" /> Student profile</h3>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <SmallField label="College" value={user.student.college} />
                  <SmallField label="Branch" value={user.student.branch} />
                  <SmallField label="Year" value={user.student.yearOfStudy ? String(user.student.yearOfStudy) : null} />
                  <SmallField label="City" value={user.student.city} />
                  <SmallField label="LinkedIn" value={user.student.linkedin} />
                  <SmallField label="GitHub" value={user.student.github} />
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">Profile editing coming soon. Contact us if you need to update any of these fields.</p>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Refreshing profile from serverâ€¦
          </p>
        )}
      </section>
    </>
  );
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
        <dd className="truncate">{value}</dd>
      </div>
    </div>
  );
}

function SmallField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm">{value || "â€”"}</div>
    </div>
  );
}

function QuickCard({ to, icon, title, desc }: { to: string; icon: ReactNode; title: string; desc: string }) {
  return (
    <Link to={to} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-[var(--teal)] hover:shadow-md">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <User className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}

