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
      <PageHero eyebrow="About us" title={<>Turning learners into <span className="teal-text">professionals</span></>} subtitle={COMPANY.motto + ". A studio-style school built by engineers, for engineers."} />

      <section className="mx-auto max-w-7xl px-6 py-20 space-y-32">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="neo-card p-8 border-l-4 border-primary rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest teal-text">Our story</span>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              TRI CUBE started as a Slack group of mentors helping college seniors prep for interviews. Four years later, it's a full ecosystem â€” training, internships and services â€” with one obsession: turning learners into professionals who ship.
            </p>
          </div>
          <div className="neo-card p-8 border-l-4 border-primary rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest teal-text">Founder message</span>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              "We built TRI CUBE to be the school we wish we had â€” high standards, real work, real mentors, and lifelong support. If you're willing to put in the reps, we'll make sure you land where you deserve."
            </p>
            <p className="mt-4 text-sm text-muted-foreground font-medium">â€” Founders, TRI CUBE Digital Solutions</p>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="neo-card p-8 border-l-4 border-primary rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest teal-text">Vision</span>
            <p className="mt-4 leading-relaxed">{COMPANY.vision}</p>
          </div>
          <div className="neo-card p-8 border-l-4 border-primary rounded-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest teal-text">Mission</span>
            <p className="mt-4 leading-relaxed">{COMPANY.mission}</p>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Core values" title={<>What we <span className="teal-text">stand for</span></>} />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {VALUES.map(v => (
              <div key={v.title} className="neo-card p-6 rounded-3xl">
                <h3 className="font-semibold teal-text">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Timeline" title={<>Milestones so <span className="teal-text">far</span></>} />
          <div className="mt-12 flex flex-col border-l border-[var(--teal)] pl-6 ml-4 space-y-8">
            {TIMELINE.map(t => (
              <div key={t.year} className="neo-card flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-3xl relative">
                <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--teal)] hidden md:block" />
                <div className="teal-text text-4xl font-bold shrink-0 md:w-32">{t.year}</div>
                <p className="text-foreground/90 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="neo-card p-6 text-center rounded-3xl">
              <div className="text-4xl font-semibold teal-text"><StatCounter value={s.value} suffix={s.suffix} /></div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div>
          <SectionHeading eyebrow="Why us" title={<>What makes us <span className="teal-text">different</span></>} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY_US.map(w => (
              <div key={w.title} className="neo-card p-6 rounded-3xl">
                <h3 className="font-semibold teal-text">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

