import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { absoluteMedia, listCourses, type CourseDTO } from "@/lib/courses-api";
import { Star } from "lucide-react";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — TRI CUBE Digital Solutions" },
      {
        name: "description",
        content:
          "Live cohorts and self-paced LMS courses in Python, MERN, Data Science, AI, Power BI, SQL and more.",
      },
      { property: "og:title", content: "TRI CUBE Courses" },
      { property: "og:description", content: "Live cohorts and self-paced LMS courses." },
    ],
  }),
  component: CoursesPage,
});

const CATS = ["All", "Programming", "Web", "Data", "AI", "Marketing"] as const;

function CoursesPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    listCourses({ category: cat, q })
      .then((rows) => {
        if (alive) setCourses(rows);
      })
      .catch((e: any) => {
        if (alive) {
          setCourses([]);
          setErr(e.message || "Courses could not be loaded.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [cat, q]);

  const categories = useMemo(() => {
    const found = courses.map((c) => c.category).filter(Boolean);
    return Array.from(new Set([...CATS, ...found])) as string[];
  }, [courses]);

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title={
          <>
            Cohorts and self-paced <span className="gold-text">LMS</span>
          </>
        }
        subtitle="Live weekly sessions, mentors, real capstones, verified certificates."
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium border ${cat === c ? "bg-[var(--gradient-gold)] text-primary-foreground border-transparent" : "border-border bg-card hover:bg-secondary"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Loading courses…
          </div>
        ) : err ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {err}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center text-sm text-muted-foreground">
            No published courses found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
              const thumbnail = absoluteMedia(c.thumbnailUrl);
              return (
                <div key={c.slug} className="glass overflow-hidden rounded-2xl">
                  <div className="relative aspect-video bg-[var(--gradient-hero)]">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={c.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center px-4 text-center text-xl font-semibold">
                        {c.title}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                      <span>{c.category}</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" /> {c.rating}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.trainer} · {c.duration} · {c.level}
                    </p>
                    {c.students > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.students.toLocaleString()} students enrolled
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold gold-text">
                          ₹{c.price.toLocaleString()}
                        </span>
                        {c.discount && c.discount > 0 ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{(c.price + c.discount).toLocaleString()}
                            </span>
                            <span className="rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--gold-dark)]">
                              Save ₹{c.discount.toLocaleString()}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <Link
                        to="/courses/$slug"
                        params={{ slug: c.slug }}
                        className="rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
