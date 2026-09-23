import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/SectionHeading";
import { TESTIMONIALS } from "@/lib/site-data";
import { Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Real stories from students placed via TRI CUBE cohorts and internships." },
      { property: "og:title", content: "TRI CUBE Testimonials" },
      { property: "og:description", content: "Real stories from placed students." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <>
      <PageHero eyebrow="Testimonials" title={<>Careers, <span className="teal-text">reshaped</span></>} subtitle="From first-year students to full-time engineers â€” here's what they say." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doubled.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="flex gap-1">{[...Array(t.rating)].map((_,i)=>(<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}</div>
              <p className="mt-4 text-sm text-foreground/90">"{t.quote}"</p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

