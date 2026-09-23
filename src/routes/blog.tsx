import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { listBlogs, type BlogDTO } from "@/lib/content-api";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Career playbooks, engineering guides, and inside-the-cohort essays from TRI CUBE mentors." },
      { property: "og:title", content: "TRI CUBE Blog" },
      { property: "og:description", content: "Career playbooks and engineering guides." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [rows, setRows] = useState<BlogDTO[] | null>(null);
  useEffect(() => { listBlogs().then(setRows).catch(() => setRows([])); }, []);
  const posts = rows || [];
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Playbooks from <span className="teal-text">the field</span></>} subtitle="Career, engineering, and industry deep-dives from our mentors." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {rows === null ? (
          <p className="text-sm text-muted-foreground">Loading postsâ€¦</p>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(b => (
              <article key={b.slug} className="glass overflow-hidden rounded-2xl">
                {b.coverUrl && <img src={b.coverUrl} alt={b.title} className="aspect-video w-full object-cover" />}
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{b.category}</span>
                  <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{b.createdAt ? new Date(b.createdAt).toDateString() : ""} Â· {b.authorName}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

