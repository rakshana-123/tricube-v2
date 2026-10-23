import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionHeading } from "@/components/site/SectionHeading";
import { COMPANY, STATS, WHY_US } from "@/lib/site-data";
import { StatCounter } from "@/components/site/StatCounter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TRI CUBE Digital Solutions" },
      { name: "description", content: "Our story, vision, mission, values, timeline and the team behind TRI CUBE Digital Solutions." },
      { property: "og:title", content: "About TRI CUBE" },
      { property: "og:description", content: "Founders, values, and the team building TRI CUBE." },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "2022", body: "TRI CUBE founded as a small mentor circle for engineering students." },
  { year: "2023", body: "First 12 cohorts shipped. 380 students placed across product companies." },
  { year: "2024", body: "Expanded to Data, AI and Full Stack tracks. Partnered with 60+ hiring companies." },
  { year: "2025", body: "Crossed 3,000 trained students and launched enterprise upskilling." },
  { year: "2026", body: "Now delivering premium LMS, internships and IT services under one roof." },
];

const VALUES = [
  { title: "Craft over hype", body: "We ship work we would proudly show our mentors." },
  { title: "Learners first", body: "Every decision starts from what compounds a learner's career." },
  { title: "Real projects", body: "No toy exercises. Every cohort ships something real." },
  { title: "Kindness matters", body: "We are demanding but never harsh. Growth needs safety." },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title={<>Turning learners into <span className="gold-text">professionals</span></>} subtitle={COMPANY.motto + ". A studio-style school built by engineers, for engineers."} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our story</span>
            <p className="mt-3 text-foreground/90">TRI CUBE started as a Slack group of mentors helping college seniors prep for interviews. Four years later, it's a full ecosystem — training, internships and services — with one obsession: turning learners into professionals who ship.</p>
          </div>
          <div className="glass rounded-3xl p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Founder message</span>
            <p className="mt-3 text-foreground/90">"We built TRI CUBE to be the school we wish we had — high standards, real work, real mentors, and lifelong support. If you're willing to put in the reps, we'll make sure you land where you deserve."</p>
            <p className="mt-3 text-sm text-muted-foreground">— Founders, TRI CUBE Digital Solutions</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-3xl p-8"><span className="text-xs font-semibold uppercase tracking-widest text-primary">Vision</span><p className="mt-3">{COMPANY.vision}</p></div>
          <div className="glass rounded-3xl p-8"><span className="text-xs font-semibold uppercase tracking-widest text-primary">Mission</span><p className="mt-3">{COMPANY.mission}</p></div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Core values" title={<>What we <span className="gold-text">stand for</span></>} />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {VALUES.map(v => (
              <div key={v.title} className="glass rounded-2xl p-6">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Timeline" title={<>Milestones so <span className="gold-text">far</span></>} />
          <div className="mt-10 space-y-4">
            {TIMELINE.map(t => (
              <div key={t.year} className="glass flex items-start gap-6 rounded-2xl p-6">
                <div className="text-2xl font-semibold gold-text">{t.year}</div>
                <p className="text-foreground/90">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl font-semibold gold-text"><StatCounter value={s.value} suffix={s.suffix} /></div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Why us" title={<>What makes us <span className="gold-text">different</span></>} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {WHY_US.map(w => (
              <div key={w.title} className="glass rounded-2xl p-6">
                <h3 className="font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}