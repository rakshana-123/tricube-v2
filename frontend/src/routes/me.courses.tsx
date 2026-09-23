import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Clock,
  GraduationCap,
  Loader2,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { PageHero } from "@/components/site/SectionHeading";
import { getToken, useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/payments";

export const Route = createFileRoute("/me/courses")({
  head: () => ({
    meta: [{ title: "My courses — TRI CUBE" }, { name: "robots", content: "noindex" }],
  }),
  component: MyCoursesPage,
});

type EnrolledCourse = {
  id: number;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  trainer: string;
  duration: string;
  level: string;
  category: string | null;
  enrolledAt: string;
  totalVideos: number;
  completedVideos: number;
  percent: number;
  lastActivityAt: string | null;
  nextVideo: {
    id: number;
    title: string;
    moduleTitle: string | null;
    position: number;
    durationSec: number;
  } | null;
};

function MyCoursesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<EnrolledCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (opts: { silent?: boolean } = {}) => {
    const token = getToken();
    if (!token) return;
    if (opts.silent) setRefreshing(true);
    else setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/courses/me/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
      setCourses(j.enrolled || []);
    } catch (e: any) {
      setErr(e.message || "Could not load your courses. Is the backend running?");
      setCourses((prev) => prev ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !getToken()) {
      navigate({ to: "/auth", search: { redirect: "/me/courses" } });
      return;
    }
    load();
    const onFocus = () => load({ silent: true });
    const onVisible = () => {
      if (document.visibilityState === "visible") load({ silent: true });
    };
    const onPageShow = () => load({ silent: true });
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    // Short poll for ~30s after mount to catch webhook-driven unlocks
    let ticks = 0;
    const interval = window.setInterval(() => {
      ticks += 1;
      load({ silent: true });
      if (ticks >= 10) window.clearInterval(interval);
    }, 3000);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
      window.clearInterval(interval);
    };
  }, [isAuthenticated, navigate, load]);

  return (
    <>
      <PageHero
        eyebrow="Learner dashboard"
        title={
          <>
            My <span className="gold-text">courses</span>
          </>
        }
        subtitle="Continue where you left off. Track progress across every module and jump straight into the next video."
      />
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => load({ silent: true })}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your courses…
          </div>
        ) : err && (!courses || courses.length === 0) ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {err}
          </div>
        ) : !courses || courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CourseCard({ course: c }: { course: EnrolledCourse }) {
  const done = c.percent >= 100;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {c.thumbnailUrl ? (
          <img
            src={c.thumbnailUrl}
            alt={c.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full border border-border bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {c.category ?? c.level}
        </div>
        {done && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--gold-soft)]/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--gold-dark)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{c.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            By {c.trainer} · {c.duration}
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {c.completedVideos} / {c.totalVideos} lessons
            </span>
            <span className="font-semibold text-foreground">{c.percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[var(--gradient-gold)] transition-[width]"
              style={{ width: `${Math.min(100, Math.max(0, c.percent))}%` }}
            />
          </div>
        </div>

        {c.nextVideo && !done ? (
          <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs">
            <div className="mb-0.5 flex items-center gap-1.5 text-muted-foreground">
              <PlayCircle className="h-3.5 w-3.5" />
              <span>{c.completedVideos > 0 ? "Up next" : "Start here"}</span>
              {c.nextVideo.moduleTitle && (
                <span className="text-muted-foreground/70">· {c.nextVideo.moduleTitle}</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="line-clamp-1 font-medium text-foreground">{c.nextVideo.title}</p>
              {c.nextVideo.durationSec > 0 && (
                <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> {formatDuration(c.nextVideo.durationSec)}
                </span>
              )}
            </div>
          </div>
        ) : done ? (
          <div className="rounded-xl border border-[var(--gold-soft)] bg-[var(--gold-soft)]/20 px-3 py-2.5 text-xs text-[var(--gold-dark)]">
            You've completed every lesson. Revisit anytime.
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground">
            {c.lastActivityAt
              ? `Last watched ${timeAgo(c.lastActivityAt)}`
              : `Enrolled ${timeAgo(c.enrolledAt)}`}
          </span>
          <Link
            to="/courses/$slug"
            params={{ slug: c.slug }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            {done ? "Review" : c.completedVideos > 0 ? "Continue" : "Start"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="rounded-full bg-[var(--gold-soft)]/40 p-4 text-[var(--gold-dark)]">
        <BookOpen className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">No enrolled courses yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Browse our catalog to find a course that fits your goals. Your progress will appear here
          once you enroll.
        </p>
      </div>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
      >
        Browse courses <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function formatDuration(sec: number): string {
  if (!sec || sec < 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}:${String(s).padStart(2, "0")}`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "recently";
  const diff = Math.max(0, Date.now() - d);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
