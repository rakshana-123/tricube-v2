import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { FAQS } from "@/lib/site-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Answers to common questions about TRI CUBE courses, internships, placements and fees." },
      { property: "og:title", content: "TRI CUBE FAQ" },
      { property: "og:description", content: "Common questions answered." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const [q, setQ] = useState("");
  const list = FAQS.filter(f => f.q.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHero eyebrow="FAQ" title={<>Everything you might <span className="teal-text">ask</span></>} subtitle="Can't find your answer? Reach us via the contact page." />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search questionsâ€¦" className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-8 space-y-3">
          {list.map(f => (
            <details key={f.q} className="group glass rounded-2xl p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

