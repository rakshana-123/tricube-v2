import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star, PlayCircle, CheckCircle2, MapPin } from "lucide-react";
import { COMPANY, STATS, WHY_US, EVENTS, PARTNERS } from "@/lib/site-data";
import { listEvents, type EventDTO } from "@/lib/events-api";
import { listCourses, type CourseDTO } from "@/lib/courses-api";
import { listTestimonials, listFaqs, listGallery, listBlogs, type TestimonialDTO, type FAQDTO, type GalleryDTO, type BlogDTO } from "@/lib/content-api";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatCounter } from "@/components/site/StatCounter";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRI CUBE Digital Solutions — Premium IT Training & LMS" },
      { name: "description", content: "Live cohort training, real internships, verified certificates. Learn Python, MERN, Data Science, AI and more at TRI CUBE." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <VisionMission />
      <WhyUs />
      <PopularCourses />
      <EventsSection />
      <Testimonials />
      <LatestBlog />
      <GalleryPreview />
      <FAQSection />
      <Newsletter />
      <ContactMap />
    </>
  );
}

function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <FloatingShapes />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl px-6 py-28 text-center md:py-36"
      >
        <div className="relative mx-auto mb-8 h-20 w-20 md:h-24 md:w-24">
          <div className="absolute inset-0 rounded-full bg-[var(--gold-soft)] blur-2xl" />
          <img
            src={logoAsset.url}
            alt="TRI CUBE logo"
            className="relative h-full w-full object-contain drop-shadow-[0_10px_30px_rgba(200,150,0,0.35)]"
          />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
          <Sparkles className="h-3 w-3 text-primary" /> New cohorts open · Aug 2026
        </span>
        <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Learn. Build. <span className="gold-text">Launch.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Premium IT training, real client-grade internships, and verified certificates. TRI CUBE turns curious learners into industry-ready professionals.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/courses" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.03]">
            Explore courses <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary">
            <PlayCircle className="h-4 w-4" /> Our services
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}
          </div>
          <span className="font-semibold">4.9/5</span>
          <span className="text-muted-foreground">· from 4,200+ students</span>
        </div>
      </motion.div>
    </section>
  );
}

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--gold-soft)] blur-3xl" animate={{ y: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" animate={{ y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity }} />
    </div>
  );
}

function Marquee() {
  return (
    <section className="border-y border-border bg-secondary/40 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <span>Hiring partners</span>
        {PARTNERS.map(p => (<span key={p} className="text-foreground/80">{p}</span>))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6 text-center">
            <div className="text-4xl font-semibold tracking-tight gold-text md:text-5xl">
              <StatCounter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading eyebrow="Who we are" title={<>Built for the <span className="gold-text">next generation</span> of builders</>} subtitle={COMPANY.motto + ". " + "We combine mentor-led cohorts with real projects and lifetime access."} />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Vision</span>
          <p className="mt-3 text-lg text-foreground">{COMPANY.vision}</p>
        </div>
        <div className="glass rounded-3xl p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mission</span>
          <p className="mt-3 text-lg text-foreground">{COMPANY.mission}</p>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading eyebrow="Why TRI CUBE" title={<>Everything you need to <span className="gold-text">land the role</span></>} />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {WHY_US.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--gradient-gold)] text-primary-foreground"><CheckCircle2 className="h-5 w-5" /></div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PopularCourses() {
  const [rows, setRows] = useState<CourseDTO[] | null>(null);
  useEffect(() => { listCourses().then(setRows).catch(() => setRows([])); }, []);
  const top = (rows || []).slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading align="left" eyebrow="Popular courses" title={<>Learn the skills <span className="gold-text">companies hire for</span></>} />
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">All courses <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {rows === null ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading courses…</p>
      ) : top.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No courses published yet.</p>
      ) : (
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {top.map((c) => (
          <motion.div key={c.slug} whileHover={{ y: -4 }} className="glass overflow-hidden rounded-2xl">
            <div className="relative aspect-video overflow-hidden">
              {c.thumbnailUrl ? (
                <img src={c.thumbnailUrl} alt={c.title} className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
                  <div className="absolute inset-0 grid place-items-center text-2xl font-semibold">{c.title}</div>
                </>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>{c.category}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {c.rating}</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.trainer} · {c.duration} · {c.level}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold gold-text">₹{c.price.toLocaleString()}</span>
                <Link to="/courses" className="text-sm font-semibold text-primary hover:underline">View →</Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </section>
  );
}

function EventsSection() {
  const [live, setLive] = useState<EventDTO[] | null>(null);
  useEffect(() => { listEvents().then((rows) => setLive(rows)).catch(() => setLive([])); }, []);
  const published = (live && live.length ? live : EVENTS.map((e, i) => ({
    id: -(i + 1), slug: e.slug, title: e.title, description: e.description,
    bannerUrl: e.banner, date: e.date, time: e.time, venue: e.venue,
    status: e.status as EventDTO["status"], published: true,
  } as EventDTO))).slice(0, 3);
  return (
    <section className="border-y border-border bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Latest updates" title={<>Workshops, bootcamps & <span className="gold-text">hackathons</span></>} />
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">All events <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {published.map((e) => (
            <div key={e.slug} className="glass overflow-hidden rounded-2xl">
              <div className="relative aspect-video overflow-hidden">
                {e.bannerUrl ? <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[var(--gradient-gold)]/20" />}
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${e.status === 'live' ? 'bg-destructive text-destructive-foreground' : e.status === 'upcoming' ? 'bg-[var(--gradient-gold)] text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{e.status}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{new Date(e.date).toDateString()} · {e.time}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.venue}</p>
                <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
                <Link to="/events" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Register <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [rows, setRows] = useState<TestimonialDTO[] | null>(null);
  useEffect(() => { listTestimonials().then(setRows).catch(() => setRows([])); }, []);
  const items = rows || [];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading eyebrow="Student stories" title={<>Careers, <span className="gold-text">reshaped</span></>} />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-6">
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
  );
}

function LatestBlog() {
  const [rows, setRows] = useState<BlogDTO[] | null>(null);
  useEffect(() => { listBlogs().then(setRows).catch(() => setRows([])); }, []);
  const posts = (rows || []).slice(0, 3);
  if (rows !== null && posts.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading align="left" eyebrow="From the blog" title={<>Fresh <span className="gold-text">playbooks</span> & guides</>} />
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">All posts <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {rows === null ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading posts…</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((b) => (
            <article key={b.id} className="glass overflow-hidden rounded-2xl">
              {b.coverUrl && <img src={b.coverUrl} alt={b.title} className="aspect-video w-full object-cover" loading="lazy" />}
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{b.category}</span>
                <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{b.createdAt ? new Date(b.createdAt).toDateString() : ""} · {b.authorName}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function GalleryPreview() {
  const [rows, setRows] = useState<GalleryDTO[] | null>(null);
  useEffect(() => { listGallery().then(setRows).catch(() => setRows([])); }, []);
  const items = (rows || []).slice(0, 8);
  if (rows !== null && items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading align="left" eyebrow="Gallery" title={<>Moments from <span className="gold-text">TRI CUBE</span></>} />
        <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">See all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {rows === null ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading gallery…</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((g) => (
            <img key={g.id} src={g.url} alt={g.caption || "Gallery"} className="aspect-square w-full rounded-2xl object-cover transition-transform hover:scale-[1.02]" loading="lazy" />
          ))}
        </div>
      )}
    </section>
  );
}

function FAQSection() {
  const [rows, setRows] = useState<FAQDTO[] | null>(null);
  useEffect(() => { listFaqs().then(setRows).catch(() => setRows([])); }, []);
  const items = rows || [];
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading eyebrow="Questions" title={<>Frequently <span className="gold-text">asked</span></>} />
      <div className="mt-10 space-y-3">
        {items.map((f) => (
          <details key={f.id} className="group glass rounded-2xl p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
              {f.question}
              <span className="text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass rounded-3xl bg-[var(--gradient-hero)] p-10 text-center md:p-16">
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">Get the <span className="gold-text">TRI CUBE</span> newsletter</h3>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">New cohorts, career tips, and free workshops — twice a month.</p>
        <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="your@email.com" className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button className="rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function ContactMap() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <h3 className="text-2xl font-semibold tracking-tight">Visit our campus</h3>
          <p className="mt-2 text-muted-foreground">{COMPANY.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">{COMPANY.hours}</p>
          <div className="mt-6 space-y-2 text-sm">
            <p>📞 {COMPANY.phone}</p>
            <p>✉️ {COMPANY.email}</p>
          </div>
          <Link to="/contact" className="mt-6 inline-flex rounded-full bg-[var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold text-primary-foreground">Get in touch</Link>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border">
          <iframe title="map" className="h-full min-h-[300px] w-full" src="https://www.google.com/maps?q=Bengaluru&output=embed" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
