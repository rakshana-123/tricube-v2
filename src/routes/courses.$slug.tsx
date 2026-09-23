import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUser, getToken } from "@/lib/auth";
import { PageHero } from "@/components/site/SectionHeading";
import { Lock, PlayCircle, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { API_BASE, startPayment } from "@/lib/payments";
import { getAdminToken } from "@/lib/services-api";
import { PaymentRetry } from "@/components/site/PaymentRetry";
import { absoluteMedia, getCourse, listUnlockedCourseVideos, type CourseDTO, type CourseVideoDTO } from "@/lib/courses-api";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `${params.slug} â€” TRI CUBE Courses` },
        { name: "description", content: "Enroll in a TRI CUBE course to unlock the full video library." },
      ],
    };
  },
  loader: async ({ params }) => {
    const c = await getCourse(params.slug);
    if (!c) throw notFound();
    return { course: c };
  },
  component: CourseDetail,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Course could not be loaded</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String(error?.message || error)}</p>
      <Link to="/courses" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Course not found</h1>
      <Link to="/courses" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
    </div>
  ),
});

function CourseDetail() {
  const { course } = Route.useLoaderData() as { course: CourseDTO };
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [videos, setVideos] = useState<CourseVideoDTO[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<number | undefined>();

  const publicPreviewVideos = useMemo(
    () => (course.modules?.flatMap((m) => m.videos) ?? course.videos ?? []).filter((v) => v.isFreePreview && v.url),
    [course.modules, course.videos],
  );
  const playableVideos = enrolled ? videos : publicPreviewVideos;
  const activeVideo = playableVideos.find((v) => v.id === activeVideoId) ?? playableVideos[0];
  const thumbnail = absoluteMedia(course.thumbnailUrl);

  async function loadUnlockedVideos(token: string) {
    const rows = await listUnlockedCourseVideos(course.slug, token);
    if (rows.length) {
      setVideos(rows);
      setActiveVideoId(rows[0].id);
      setEnrolled(true);
    }
  }

  useEffect(() => {
    // Only a paying student unlocks playback. Admin tokens must NOT
    // auto-unlock the video library, otherwise admins previewing the site
    // see every video play in full without a purchase.
    const token = getToken();
    if (!token) return;
    loadUnlockedVideos(token).catch(() => undefined);
  }, [course.slug]);

  async function handleEnroll() {
    setErr(null);
    if (!getStoredUser()) {
      navigate({ to: "/auth", search: { redirect: `/courses/${course.slug}` } });
      return;
    }
    setBusy(true);
    setAttempt((n) => n + 1);
    // If a student/admin token exists in localStorage, attach it so the
    // requireAuth-gated backend accepts the request. Student auth UI is not
    // yet built; without a token the backend falls through to demo mode.
    const token =
      getToken() ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);
    console.log("handleEnroll: token", token);
    const authHeader: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};
    const res = await startPayment({
      createOrderPath: "/api/payments/create-order",
      createOrderBody: { courseSlug: course.slug },
      extraHeaders: authHeader,
      title: course.title,
      amountInr: course.price,
      onPaid: async (r) => {
        if (r.razorpay_signature === "demo_signature") return;
        const verify = await fetch(`${API_BASE}/api/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(r),
        });
        if (!verify.ok) throw new Error("Payment verification failed.");
      },
    });
    setBusy(false);
    if (res.status === "paid") {
      setEnrolled(true);
      if (token) {
        try {
          await loadUnlockedVideos(token);
        } catch {
          setErr("Payment succeeded. Refresh this page if videos do not appear immediately.");
        }
      }
      setTimeout(() => {
        document
          .getElementById("course-player")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
    else if (res.status === "demo") setErr(res.message || "Demo mode is enabled â€” no real payment was taken, so the course stays locked.");
    else if (res.status === "failed") setErr(res.message || "Payment failed. Please try again.");
    else if (res.status === "cancelled") setErr(res.message || "Payment was cancelled before it completed.");
  }

  return (
    <>
      <PageHero
        eyebrow={course.category}
        title={<>{course.title}</>}
        subtitle={`${course.trainer} Â· ${course.duration} Â· ${course.level}`}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          {enrolled && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Payment successful â€” video library unlocked.
              </span>
              <Link to="/me/courses" className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
                My courses â†’
              </Link>
            </div>
          )}
          <div id="course-player" className="glass relative aspect-video overflow-hidden rounded-2xl scroll-mt-24">
            {activeVideo?.url ? (
              <>
                <CoursePlayer url={activeVideo.url} title={activeVideo.title} poster={thumbnail} autoPlay={enrolled} />
                {!enrolled && (
                  <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                    Free preview Â· Enroll to unlock full course
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-background/80 backdrop-blur">
                      <Lock className="h-7 w-7 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-foreground">
                      Video library is locked
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enroll to unlock all recordings and live sessions
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold tracking-tight">About this course</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {course.description || `Learn ${course.title} with hands-on capstone projects, weekly live sessions, and lifetime access to recordings.`}
            </p>
            <ul className="mt-6 grid gap-2 md:grid-cols-2">
              {(course.learningOutcomes?.split(/\r?\n/).filter(Boolean) || ["Live weekly sessions", "Lifetime recordings", "Real capstone project", "Verified certificate", "1:1 mentor calls", "Placement support"]).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>

            {course.modules?.length ? (
              <div className="mt-8 rounded-2xl border border-border bg-card p-5">
                <h2 className="text-lg font-semibold">Course videos</h2>
                <div className="mt-4 space-y-4">
                  {course.modules.map((m, mi) => (
                    <div key={m.id ?? m.title}>
                      <h3 className="text-sm font-semibold text-muted-foreground">Module {mi + 1}: {m.title}</h3>
                      <div className="mt-2 space-y-2">
                        {m.videos.map((v) => {
                          const unlockedVideo = videos.find((row) => row.id === v.id);
                          const canPlay = !!(unlockedVideo?.url || v.url);
                          return (
                            <button
                              key={v.id ?? v.title}
                              type="button"
                              disabled={!canPlay}
                              onClick={() => setActiveVideoId(v.id)}
                              className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60 hover:bg-secondary/60"
                            >
                              <span className="flex items-center gap-2">
                                {canPlay ? <PlayCircle className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                                {v.title}
                              </span>
                              {v.isFreePreview && !enrolled ? <span className="text-xs text-primary">Preview</span> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="glass h-fit rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
            <span>{course.category}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" /> {course.rating}
            </span>
          </div>
          <div className="mt-4 flex items-end flex-wrap gap-x-3 gap-y-1">
            <div className="text-3xl font-semibold teal-text">â‚¹{course.price.toLocaleString()}</div>
            {course.discount && course.discount > 0 ? (
              <>
                <div className="text-base text-muted-foreground line-through">
                  â‚¹{(course.price + course.discount).toLocaleString()}
                </div>
                <span className="rounded-full bg-[var(--teal-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--teal)]">
                  Save â‚¹{course.discount.toLocaleString()}
                </span>
              </>
            ) : null}
          </div>
          {course.students > 0 && <p className="mt-1 text-xs text-muted-foreground">{course.students.toLocaleString()} students enrolled</p>}

          <button
            onClick={handleEnroll}
            disabled={busy || enrolled}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <PlayCircle className="h-4 w-4" /> {enrolled ? "Enrolled â€” videos unlocked" : busy ? "Opening checkoutâ€¦" : "Enroll & unlock videos"}
          </button>
          {err && !enrolled && (
            <PaymentRetry
              message={err}
              attempt={attempt}
              busy={busy}
              onRetry={handleEnroll}
              onDismiss={() => setErr(null)}
            />
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" /> Only enrolled students can play course videos.
          </p>
        </aside>
      </section>
    </>
  );
}

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function CoursePlayer({ url, title, poster, autoPlay }: { url: string; title: string; poster?: string; autoPlay: boolean }) {
  const embed = youtubeEmbed(url);
  if (embed) {
    return (
      <iframe
        key={embed}
        src={`${embed}${autoPlay ? "?autoplay=1" : ""}`}
        title={title}
        className="h-full w-full bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video
      key={url}
      controls
      autoPlay={autoPlay}
      className="h-full w-full bg-black"
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      poster={poster || "/placeholder.svg"}
      src={url}
    >
      Your browser does not support the video tag.
    </video>
  );
}

