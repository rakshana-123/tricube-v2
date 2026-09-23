import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { absoluteMedia, listCourses, type CourseDTO } from "@/lib/courses-api";
import { Star } from "lucide-react";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Live cohorts and self-paced LMS courses in Python, MERN, Data Science, AI, Power BI, SQL and more." },
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
    return () => { alive = false; };
  }, [cat, q]);

  const categories = useMemo(() => {
    const found = courses.map((c) => c.category).filter(Boolean);
    return Array.from(new Set([...CATS, ...found])) as string[];
  }, [courses]);

  return (
    <>
      <PageHero eyebrow="Courses" title={<>Cohorts and self-paced <span className="teal-text">LMS</span></>} subtitle="Live weekly sessions, mentors, real capstones, verified certificates." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col md:flex-row flex-wrap items-center gap-4 rounded-3xl md:rounded-full neo-inset p-3">
          <input 
            value={q} 
            onChange={(e)=>setQ(e.target.value)} 
            placeholder="Search coursesâ€¦" 
            className="w-full md:w-auto md:flex-1 rounded-full neo-input px-5 py-3 text-sm outline-none" 
          />
          <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setCat(c)} 
                className={`px-4 py-2 text-sm font-medium transition-all ${cat===c ? "neo-btn-primary rounded-full text-white" : "neo-btn rounded-full text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="neo-card animate-pulse bg-secondary/20 py-16 text-center text-sm text-muted-foreground">Loading coursesâ€¦</div>
        ) : err ? (
          <div className="neo-card border-l-4 border-l-destructive p-6 text-sm text-destructive">{err}</div>
        ) : courses.length === 0 ? (
          <div className="neo-card flex justify-center py-16 text-sm border-dashed border-2 border-muted-foreground/30 text-muted-foreground">No published courses found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(c => {
              const thumbnail = absoluteMedia(c.thumbnailUrl);
              return (
                <div key={c.slug} className="neo-card overflow-hidden !p-0">
                  <div className="relative aspect-video bg-[var(--gradient-hero)]">
                    {thumbnail ? (
                      <img src={thumbnail} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center px-4 text-center text-xl font-bold text-foreground/80">{c.title}</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between uppercase tracking-widest text-muted-foreground">
                      <span className="neo-badge text-[10px] py-1 px-2">{c.category}</span>
                      <span className="flex items-center gap-1 font-semibold text-xs"><Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {c.rating}</span>
                    </div>
                    <h3 className="mt-4 text-[1.1rem] font-bold leading-tight">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.trainer} Â· {c.duration} Â· {c.level}</p>
                    {c.students > 0 && <p className="mt-1 text-[11px] text-muted-foreground font-medium">{c.students.toLocaleString()} students enrolled</p>}
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold teal-text">â‚¹{c.price.toLocaleString()}</span>
                        {c.discount && c.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through">â‚¹{(c.price + c.discount).toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-green-500">Save â‚¹{c.discount.toLocaleString()}</span>
                          </div>
                        ) : null}
                      </div>
                      <Link
                        to="/courses/$slug"
                        params={{ slug: c.slug }}
                        className="neo-btn-primary rounded-full px-5 py-2 text-sm font-semibold"
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

