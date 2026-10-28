import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  GraduationCap,
  Headphones,
  Infinity as InfinityIcon,
  Layers,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Users,
} from "lucide-react";
import { COMPANY, WHY_US } from "@/lib/site-data";
import { CompanyLogosMarquee } from "@/components/site/CompanyLogosMarquee";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — TRI CUBE Digital Solutions | Learn. Build. Launch." },
      {
        name: "description",
        content:
          "Turning learners into professionals. Learn. Build. Launch. A studio-style school and enterprise engineering partner built by engineers, for engineers.",
      },
      { property: "og:title", content: "About TRI CUBE Digital Solutions" },
      {
        property: "og:description",
        content:
          "Discover TRI CUBE's company story, 3-pillar engineering ecosystem, technology stack, and 120+ hiring & technology partners.",
      },
    ],
  }),
  component: AboutPage,
});

const THREE_CUBES = [
  {
    number: "01",
    badge: "Cube One · Academy",
    title: "Studio-Style Cohort Training",
    description:
      "We replace passive video lectures with live, mentor-led engineering studios. Learners write production code inside our browser-based Cloud IDE, master system design, and pass automated test suites.",
    highlights: [
      "Live Interactive Architect Sessions",
      "In-Browser Cloud Coding Sandbox",
      "2026 Industry-Aligned Curricula",
    ],
    icon: GraduationCap,
  },
  {
    number: "02",
    badge: "Cube Two · Experience",
    title: "Client-Grade Sprint Internships",
    description:
      "Every learner transitions into an 8-week agile engineering sprint. You participate in daily standups, open pull requests reviewed by senior architects, and deploy real client applications.",
    highlights: [
      "Daily Scrum & Sprint Planning",
      "Strict Senior Architect PR Reviews",
      "QR-Verifiable Experience Letter & LOR",
    ],
    icon: Terminal,
  },
  {
    number: "03",
    badge: "Cube Three · Enterprise",
    title: "Custom Digital & Cloud Solutions",
    description:
      "TRI CUBE operates as a full-cycle technology partner for startups and enterprises — architecting high-concurrency SaaS platforms, AI workflows, cloud infrastructure, and corporate upskilling.",
    highlights: [
      "Custom React, Next.js & Spring Boot SaaS",
      "AWS / GCP Cloud & CI/CD Automation",
      "Dedicated Corporate Engineering Bootcamps",
    ],
    icon: Cpu,
  },
];

const TECH_ECOSYSTEM = [
  {
    category: "Full-Stack & Web Engineering",
    description: "Modern reactive frontends and high-concurrency microservice backends.",
    icon: Code2,
    tools: [
      "React 19",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Java Spring Boot",
      "Python Django",
      "FastAPI",
      "GraphQL & REST",
    ],
  },
  {
    category: "Cloud, DevOps & Infrastructure",
    description: "Resilient cloud-native deployments, container orchestration, and observability.",
    icon: Cloud,
    tools: [
      "Amazon Web Services (AWS)",
      "Google Cloud (GCP)",
      "Microsoft Azure",
      "Docker",
      "Kubernetes",
      "GitHub Actions CI/CD",
      "Terraform",
      "Linux & Nginx",
    ],
  },
  {
    category: "AI, Data Science & Analytics",
    description: "Production LLM agents, retrieval-augmented generation, and executive BI.",
    icon: Cpu,
    tools: [
      "OpenAI & LLM Agents",
      "RAG Pipelines",
      "Python Data Stack",
      "PyTorch & Scikit-Learn",
      "Power BI",
      "Tableau",
      "Prompt Engineering",
      "Vector Databases",
    ],
  },
  {
    category: "Databases & Distributed Storage",
    description: "Relational modeling, query optimization, caching, and real-time data streams.",
    icon: Database,
    tools: [
      "PostgreSQL",
      "MySQL",
      "MongoDB Atlas",
      "Redis",
      "Prisma & Drizzle",
      "Supabase",
      "Firebase",
      "ElasticSearch",
    ],
  },
];

const TIMELINE = [
  {
    year: "2022",
    phase: "PHASE 01 // GENESIS",
    title: "The Mentor Circle Origin",
    metric: "First 50 Learners",
    body: "TRI CUBE began as a tight-knit guild of senior software engineers mentoring final-year college students through real system design, DSA, and code reviews.",
    tags: ["1:1 Code Reviews", "System Design Guild", "Bengaluru Cohort #01"],
    icon: Users,
  },
  {
    year: "2023",
    phase: "PHASE 02 // VELOCITY",
    title: "First 12 Live Cohorts Shipped",
    metric: "380+ Placed",
    body: "Launched structured Full Stack and Python cohorts with mandatory live capstones, placing 380+ graduates across high-growth product startups and IT leaders.",
    tags: ["MERN & Python Studios", "Live Capstone Sprints", "380+ Offer Letters"],
    icon: Code2,
  },
  {
    year: "2024",
    phase: "PHASE 03 // EXPANSION",
    title: "AI, Data & 60+ Hiring Partners",
    metric: "60+ Tech Partners",
    body: "Expanded into Data Science, Power BI, and Applied AI tracks while formalizing direct referral pipelines with 60+ technology companies.",
    tags: ["Applied AI & LLMs", "Power BI & Data", "60+ Referral Partners"],
    icon: Cpu,
  },
  {
    year: "2025",
    phase: "PHASE 04 // ENTERPRISE",
    title: "Enterprise Solutions & 3,000+ Alumni",
    metric: "3,000+ Engineers",
    body: "Launched our Enterprise Digital Solutions division, delivering custom SaaS platforms and corporate bootcamps while crossing 3,000 trained engineers.",
    tags: ["Enterprise SaaS Delivery", "Corporate Bootcamps", "3,000+ Alumni Network"],
    icon: Cloud,
  },
  {
    year: "2026",
    phase: "PHASE 05 // ECOSYSTEM",
    title: "Unified Cloud LMS & Studio Ecosystem",
    metric: "4,200+ Alumni · 120+ Partners",
    body: "Now operating Bengaluru's flagship studio-style school — uniting browser-based Cloud IDE labs, client internships, and enterprise software engineering under one roof.",
    tags: ["In-Browser Cloud IDE", "QR-Verified Credentials", "120+ Global Partners"],
    icon: Rocket,
  },
];

const VALUES = [
  {
    title: "Craft Over Hype",
    body: "We teach and ship clean, maintainable architecture that we would proudly present to principal engineers.",
    icon: Layers,
  },
  {
    title: "Learners First",
    body: "Every curriculum update, mentor call, and code review is reverse-engineered from what accelerates a learner's career.",
    icon: Users,
  },
  {
    title: "Real Production Work",
    body: "Zero toy exercises. Every cohort and internship ships tested, deployed software that solves authentic problems.",
    icon: Rocket,
  },
  {
    title: "High Standards, High Support",
    body: "We hold rigorous engineering standards while providing a supportive, 1:1 mentor-guided environment until every concept clicks.",
    icon: ShieldCheck,
  },
];

const WHY_US_ICONS: Record<string, typeof Users> = {
  "Industry Mentors": Users,
  "Live Projects": Code2,
  "Placement Support": Briefcase,
  "Lifetime Access": InfinityIcon,
  "Verified Certificates": Award,
  "1:1 Doubt Clearing": Headphones,
};

function MilestonesTimelineSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 25%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const pulseTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20 overflow-hidden">
      {/* Ambient architectural background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(224,154,59,0.09)_0%,transparent_70%)] blur-3xl"
      />

      {/* Section Header */}
      <div className="relative text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E09A3B] border border-[#E09A3B]/20">
          <Rocket className="h-3.5 w-3.5" />
          Chronological Engineering Ledger · 2022 — 2026
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
          Milestones <span className="gold-text">So Far</span>
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          From an intimate guild of senior mentors in 2022 to Bengaluru&apos;s flagship
          studio-style school and enterprise engineering partner in 2026.
        </p>

        {/* Mini Year-to-Year Connected Stepper Bar */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-white/80 px-4 py-2.5 shadow-sm border border-zinc-200/80 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-800">
          {TIMELINE.map((item, idx) => (
            <div key={item.year} className="flex items-center gap-1.5 sm:gap-2">
              <a
                href={`#milestone-${item.year}`}
                className="group inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-extrabold text-zinc-700 transition-all hover:bg-[rgba(224,154,59,0.14)] hover:text-[#E09A3B] dark:text-zinc-300"
              >
                <span className="h-2 w-2 rounded-full bg-[#E09A3B] group-hover:scale-125 transition-transform" />
                {item.year}
              </a>
              {idx < TIMELINE.length - 1 && (
                <div className="flex items-center">
                  <span className="h-[2px] w-4 sm:w-7 rounded-full bg-gradient-to-r from-[#E09A3B] to-[#E09A3B]/35" />
                  <span className="text-[10px] font-black text-[#E09A3B]/80 -ml-1">›</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Connected Timeline Matrix */}
      <div ref={containerRef} className="relative mt-16 sm:mt-20">
        {/* ===============================================================
            CONTINUOUS VERTICAL SPINE CONNECTING 2022 -> 2023 -> 2024 -> 2025 -> 2026
           =============================================================== */}
        <div
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2 w-[6px] rounded-full bg-zinc-200/90 dark:bg-zinc-800/90 shadow-inner"
        >
          {/* Dashed precision circuit centerline */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-[#E09A3B]/45" />

          {/* Scroll-reactive illuminated gold connection line */}
          <motion.div
            style={{ scaleY: smoothProgress }}
            className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-[#E09A3B] via-[#F5B963] to-[#C88225] shadow-[0_0_20px_rgba(224,154,59,0.75)]"
          />

          {/* Continuous animated energy stream flowing from year to year */}
          <motion.div
            animate={{ y: ["-10%", "110%"] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 -translate-x-1/2 h-24 w-[4px] rounded-full bg-gradient-to-b from-transparent via-amber-200 to-transparent opacity-90 blur-[0.5px]"
          />

          {/* Scroll-tracked glowing laser head */}
          <motion.div
            style={{ top: pulseTop }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#E09A3B] ring-4 ring-[#E09A3B]/30 shadow-[0_0_24px_#E09A3B]"
          />
        </div>

        {/* Milestone Nodes */}
        <div className="relative space-y-12 sm:space-y-16 lg:space-y-20">
          {TIMELINE.map((t, idx) => {
            const Icon = t.icon;
            const isEven = idx % 2 === 0;
            const nextYear = TIMELINE[idx + 1]?.year;

            return (
              <div
                key={t.year}
                id={`milestone-${t.year}`}
                className="relative scroll-mt-28"
              >
                <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-0">
                  {/* =======================================================
                      LEFT COLUMN (Card on Even rows, Year Telemetry on Odd rows)
                     ======================================================= */}
                  <div
                    className={`pl-16 sm:pl-22 lg:pl-0 ${
                      isEven
                        ? "lg:col-span-5 lg:pr-12 lg:order-1"
                        : "lg:col-span-5 lg:pr-12 lg:order-1 hidden lg:flex lg:flex-col lg:items-end lg:text-right"
                    }`}
                  >
                    {isEven ? (
                      <TimelineMilestoneCard
                        item={t}
                        index={idx}
                        align="right"
                        nextYear={nextYear}
                      />
                    ) : (
                      <TimelineOppositeTelemetry
                        item={t}
                        nextYear={nextYear}
                        align="right"
                      />
                    )}
                  </div>

                  {/* =======================================================
                      CENTER SPINE NODE + HORIZONTAL CONNECTOR BRIDGES
                     ======================================================= */}
                  <div className="absolute left-6 sm:left-8 top-8 lg:static lg:col-span-2 lg:order-2 flex flex-col items-center justify-center -translate-x-1/2 lg:translate-x-0 z-20">
                    {/* Mobile horizontal connector bridge (Spine -> Card) */}
                    <div
                      aria-hidden="true"
                      className="lg:hidden absolute left-full top-1/2 -translate-y-1/2 w-6 sm:w-10 h-[2px] bg-gradient-to-r from-[#E09A3B] to-[#E09A3B]/20"
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#E09A3B] shadow-[0_0_8px_#E09A3B]" />
                    </div>

                    {/* Desktop horizontal branch connector bridge (Spine -> Card & Telemetry) */}
                    <div
                      aria-hidden="true"
                      className="hidden lg:flex items-center justify-center w-full relative"
                    >
                      {/* Left horizontal connector arm */}
                      <div
                        className={`absolute right-1/2 mr-8 h-[2px] transition-all duration-500 ${
                          isEven
                            ? "w-16 bg-gradient-to-l from-[#E09A3B] via-[#E09A3B]/80 to-[#E09A3B]/20"
                            : "w-10 border-t border-dashed border-[#E09A3B]/45"
                        }`}
                      >
                        {isEven && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#E09A3B] ring-4 ring-[#E09A3B]/20 shadow-[0_0_10px_#E09A3B]" />
                        )}
                      </div>

                      {/* Right horizontal connector arm */}
                      <div
                        className={`absolute left-1/2 ml-8 h-[2px] transition-all duration-500 ${
                          !isEven
                            ? "w-16 bg-gradient-to-r from-[#E09A3B] via-[#E09A3B]/80 to-[#E09A3B]/20"
                            : "w-10 border-t border-dashed border-[#E09A3B]/45"
                        }`}
                      >
                        {!isEven && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#E09A3B] ring-4 ring-[#E09A3B]/20 shadow-[0_0_10px_#E09A3B]" />
                        )}
                      </div>

                      {/* Central 3D Neomorphic Year Node Medallion */}
                      <motion.div
                        initial={{ scale: 0.75, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: false, amount: 0.4 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="relative group"
                      >
                        {/* Top solder terminal connecting from previous year */}
                        {idx > 0 && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#E09A3B] border-2 border-white dark:border-zinc-900 shadow-sm z-20" />
                        )}

                        {/* Outer pulsing ring */}
                        <span className="absolute -inset-2 rounded-2xl bg-[#E09A3B]/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

                        {/* Medallion body */}
                        <div className="relative flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-[#E09A3B] shadow-[0_10px_28px_rgba(224,154,59,0.28)] group-hover:scale-105 transition-transform">
                          <Icon className="h-4 w-4 text-[#E09A3B]" />
                          <span className="mt-0.5 text-xs font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                            {t.year}
                          </span>
                        </div>

                        {/* Bottom solder terminal connecting to next year */}
                        {nextYear && (
                          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#E09A3B] border-2 border-white dark:border-zinc-900 shadow-sm z-20" />
                        )}
                      </motion.div>
                    </div>

                    {/* Mobile/Tablet Spine Medallion */}
                    <div className="lg:hidden relative flex flex-col items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-[#E09A3B] shadow-[0_8px_22px_rgba(224,154,59,0.28)]">
                      <Icon className="h-3.5 w-3.5 text-[#E09A3B]" />
                      <span className="text-[11px] font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                        {t.year}
                      </span>
                    </div>
                  </div>

                  {/* =======================================================
                      RIGHT COLUMN (Year Telemetry on Even rows, Card on Odd rows)
                     ======================================================= */}
                  <div
                    className={`pl-16 sm:pl-22 lg:pl-0 ${
                      !isEven
                        ? "lg:col-span-5 lg:pl-12 lg:order-3"
                        : "lg:col-span-5 lg:pl-12 lg:order-3 hidden lg:flex lg:flex-col lg:items-start lg:text-left"
                    }`}
                  >
                    {!isEven ? (
                      <TimelineMilestoneCard
                        item={t}
                        index={idx}
                        align="left"
                        nextYear={nextYear}
                      />
                    ) : (
                      <TimelineOppositeTelemetry
                        item={t}
                        nextYear={nextYear}
                        align="left"
                      />
                    )}
                  </div>
                </div>

                {/* =========================================================
                    INTER-YEAR SPINE CONNECTOR BADGE (e.g. 2022 -> 2023)
                   ========================================================= */}
                {nextYear && (
                  <div
                    aria-hidden="true"
                    className="relative mt-6 lg:mt-10 flex items-center pl-6 sm:pl-8 lg:pl-0 lg:justify-center"
                  >
                    <div className="-translate-x-1/2 lg:translate-x-0 z-10 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase text-[#E09A3B] border border-[#E09A3B]/35 shadow-sm">
                      <span>{t.year}</span>
                      <ArrowRight className="h-2.5 w-2.5 animate-pulse" />
                      <span>{nextYear}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineMilestoneCard({
  item,
  index,
  nextYear,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
  align: "left" | "right";
  nextYear?: string;
}) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="group relative neo-card p-6 sm:p-8 overflow-hidden hover:-translate-y-1.5 transition-all duration-300 border border-zinc-200/60 dark:border-zinc-800/80 hover:border-[#E09A3B]/50"
    >
      {/* Top illuminated gold accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E09A3B] via-[#F3B960] to-transparent opacity-85" />

      {/* Giant architectural watermark year in background */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-3 -bottom-6 text-7xl sm:text-8xl font-black tracking-tighter text-zinc-900/[0.045] dark:text-white/[0.045] group-hover:text-[#E09A3B]/10 transition-colors"
      >
        {item.year}
      </span>

      {/* Top Metadata Row: Phase Code + Impact Metric */}
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          <Icon className="h-3.5 w-3.5 text-[#E09A3B]" />
          {item.phase}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.14)] px-3.5 py-1 text-xs font-extrabold text-[#E09A3B] border border-[#E09A3B]/25">
          <Sparkles className="h-3 w-3" />
          {item.metric}
        </span>
      </div>

      {/* Year Pill + Milestone Title */}
      <div className="relative mt-4 flex items-start gap-3.5">
        <div className="grid h-12 w-14 shrink-0 place-items-center rounded-2xl bg-[rgba(224,154,59,0.12)] text-base font-black text-[#E09A3B] border border-[#E09A3B]/20">
          {item.year}
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 group-hover:text-[#E09A3B] transition-colors dark:text-zinc-100">
            {item.title}
          </h3>
          <p className="mt-2 text-sm sm:text-[15px] text-zinc-600 leading-relaxed dark:text-zinc-400">
            {item.body}
          </p>
        </div>
      </div>

      {/* Key Deliverable Pills */}
      <div className="relative mt-5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-50 px-2.5 py-1 text-[11px] font-bold text-zinc-700 border border-zinc-200/80 dark:bg-zinc-800/90 dark:border-zinc-700 dark:text-zinc-300"
            >
              <CheckCircle2 className="h-3 w-3 text-[#E09A3B]" />
              {tag}
            </span>
          ))}
        </div>

        {nextYear ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#E09A3B]">
            Next: {nextYear}
            <ArrowRight className="h-3 w-3" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Active Era · 2026
          </span>
        )}
      </div>
    </motion.div>
  );
}

function TimelineOppositeTelemetry({
  item,
  nextYear,
  align,
}: {
  item: (typeof TIMELINE)[number];
  nextYear?: string;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.5 }}
      className={`select-none flex flex-col ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E09A3B]">
        {item.phase}
      </span>
      <div className="mt-1 text-5xl xl:text-6xl font-black tracking-tighter gold-text leading-none">
        {item.year}
      </div>
      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-800 shadow-2xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E09A3B]" />
        {item.metric}
      </div>
      {nextYear && (
        <span className="mt-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
          Connected to {nextYear} milestone ↓
        </span>
      )}
    </motion.div>
  );
}

function AboutPage() {
  return (
    <div className="bg-[#FFFFFF] text-zinc-900 selection:bg-[#E09A3B]/20 selection:text-[#E09A3B] dark:bg-zinc-950 dark:text-zinc-100">
      {/* =====================================================================
          1. HERO SECTION — Turning Learners into Professionals
         ===================================================================== */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-b from-[#FFFFFF] via-[#FCFDFE] to-[#F8F9FB] pt-14 pb-20 lg:pt-20 lg:pb-28 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:border-zinc-800">
        {/* Ambient Gold & Teal Glows */}
        <div className="pointer-events-none absolute -top-28 right-0 h-[420px] w-[420px] rounded-full bg-[rgba(224,154,59,0.12)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-[360px] w-[360px] rounded-full bg-[rgba(224,154,59,0.08)] blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Core Headline & Company Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E09A3B]">
                <Sparkles className="h-3.5 w-3.5" />
                About Us
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl leading-[1.08] dark:text-zinc-100">
                Turning learners into{" "}
                <span className="gold-text">professionals</span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-200">
                {COMPANY.motto} A studio-style school built by engineers, for
                engineers.
              </p>

              <p className="mt-4 text-base text-zinc-600 leading-relaxed max-w-2xl dark:text-zinc-400">
                Headquartered at Bengaluru's Innovation Hub,{" "}
                <strong className="font-bold text-zinc-900 dark:text-zinc-100">
                  {COMPANY.name}
                </strong>{" "}
                is a next-generation technology academy and software engineering
                partner. We bridge the gap between university classrooms and
                high-growth engineering teams through live mentor-led cohorts,
                authentic client-grade internships, and custom enterprise digital
                solutions.
              </p>

              {/* Trust & Accreditation Pills */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                {[
                  "Studio-Based Engineering School",
                  "120+ Hiring & Tech Partners",
                  "QR-Verifiable Credentials",
                  "Bengaluru Innovation Campus",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-[2px_2px_8px_rgba(200,208,220,0.35),-2px_-2px_8px_rgba(255,255,255,0.95)] border border-zinc-200/70 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E09A3B]" />
                    {pill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/courses"
                  className="neo-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold"
                >
                  <span>Explore Flagship Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="neo-btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold"
                >
                  <span>Enterprise IT Services</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Visual Studio Showcase Card */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="neo-card p-3.5 sm:p-4 bg-white dark:bg-zinc-900 relative"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src="/hero/slide-3.png"
                    alt="TRI CUBE Studio Engineering Team & Mentors"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="inline-block rounded-full bg-[#E09A3B] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                        Bengaluru HQ · Live Studio
                      </span>
                      <h3 className="mt-1.5 text-lg font-extrabold leading-snug">
                        Built by Senior Engineers, for Future Leaders
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Quick Metric Bar inside Hero Card */}
                <div className="mt-3.5 grid grid-cols-3 divide-x divide-zinc-100 pt-1 text-center dark:divide-zinc-800">
                  <div className="px-2">
                    <div className="text-xl font-extrabold gold-text">4,200+</div>
                    <div className="text-[11px] font-semibold text-zinc-500">
                      Engineers Trained
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="text-xl font-extrabold gold-text">120+</div>
                    <div className="text-[11px] font-semibold text-zinc-500">
                      Hiring Partners
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="text-xl font-extrabold gold-text">92%</div>
                    <div className="text-[11px] font-semibold text-zinc-500">
                      Placement Rate
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. INFINITE MARQUEE OF HIRING & TECHNOLOGY PARTNERS
         ===================================================================== */}
      <CompanyLogosMarquee />

      {/* =====================================================================
          3. COMPANY STORY & THE 3-PILLAR "TRI CUBE" ARCHITECTURE
         ===================================================================== */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Layers className="h-3.5 w-3.5" />
            Who We Are
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            The Power of <span className="gold-text">Three Interlocking Cubes</span>
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
            Traditional institutes stop at slide decks. Coding bootcamps stop at toy
            projects.{" "}
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
              TRI CUBE Digital Solutions
            </strong>{" "}
            unites three essential pillars — Academy, Production Internships, and
            Enterprise Software Delivery — into one continuous career launchpad.
          </p>
        </div>

        {/* 3 Cubes Cards */}
        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {THREE_CUBES.map((cube, idx) => {
            const Icon = cube.icon;
            return (
              <motion.div
                key={cube.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                className="neo-card p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E09A3B] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[rgba(224,154,59,0.12)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
                      {cube.badge}
                    </span>
                    <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800">
                      {cube.number}
                    </span>
                  </div>

                  <div className="mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#E09A3B] text-white shadow-[0_8px_20px_-4px_rgba(224,154,59,0.45)]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {cube.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {cube.description}
                  </p>
                </div>

                <ul className="mt-6 pt-5 border-t border-zinc-100 space-y-2.5 dark:border-zinc-800">
                  {cube.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Our Story + Founders Note + Vision & Mission */}
        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="neo-card p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#E09A3B]">
                Our Story
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                From a Weekend Mentor Guild to an Engineering Institution
              </h3>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
                TRI CUBE started in 2022 as a small community of product engineers
                helping college seniors debug code, architect full-stack systems, and
                prepare for technical interviews. We noticed that capable students
                were failing interviews simply because they had never worked in a
                real software engineering environment.
              </p>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
                Four years later, TRI CUBE has grown into a full-scale engineering
                ecosystem — combining live cohort education, a browser-based Cloud
                LMS, 8-week client sprint internships, and an enterprise software
                delivery arm.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500 dark:border-zinc-800">
              <span>Founded in Bengaluru · 2022</span>
              <span className="text-[#E09A3B]">Learn. Build. Launch.</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="neo-card p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-[#FCFDFE] to-[#FFF9F2] dark:from-zinc-900 dark:to-zinc-950"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#E09A3B]">
                Founder's Message
              </span>
              <blockquote className="mt-4 text-lg sm:text-xl font-bold text-zinc-900 leading-relaxed italic dark:text-zinc-100">
                "We built TRI CUBE to be the studio school we wish existed when we
                graduated — demanding standards, real client codebases, senior
                engineers reviewing every pull request, and a career team that stays
                with you until your offer letter arrives."
              </blockquote>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4 dark:border-zinc-800">
              <div className="rounded-2xl bg-white p-4 shadow-xs border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#E09A3B]">
                  <Target className="h-4 w-4" />
                  <span>Our Vision</span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {COMPANY.vision}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-xs border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#E09A3B]">
                  <Rocket className="h-4 w-4" />
                  <span>Our Mission</span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {COMPANY.mission}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          5. TECHNOLOGY STACK & HIRING PARTNERS ECOSYSTEM
         ===================================================================== */}
      <section className="w-full border-y border-zinc-100 bg-[#FAFAFC] py-20 dark:bg-zinc-900/40 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
              <Globe className="h-3.5 w-3.5" />
              Technology & Hiring Ecosystem
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
              Technology Stack &{" "}
              <span className="gold-text">Industry Partners</span>
            </h2>
            <p className="mt-4 text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
              Our curricula and enterprise engineering projects are built on modern
              cloud, AI, and full-stack platforms — directly aligned with the hiring
              requirements of 120+ global technology partners.
            </p>
          </div>

          {/* 4 Technology Stack Domains */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {TECH_ECOSYSTEM.map((domain, idx) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={domain.category}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="neo-card p-7 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                          {domain.category}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {domain.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {domain.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-xl bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 border border-zinc-200/80 transition-colors hover:border-[#E09A3B] hover:text-[#E09A3B] dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CORE VALUES — What We Stand For
         ===================================================================== */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Core Engineering Values
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            What We <span className="gold-text">Stand For</span>
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            The operating principles that guide our mentors, engineering sprints, and
            student outcomes every single day.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="neo-card p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {v.body}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-[#E09A3B] dark:border-zinc-800">
                  Principle 0{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          7. TIMELINE — Milestones So Far (2022 – 2026)
         ===================================================================== */}
      <MilestonesTimelineSection />

      {/* =====================================================================
          8. WHY TRICUBE — What Makes Us Different + Campus CTA
         ===================================================================== */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Award className="h-3.5 w-3.5" />
            The TriCube Advantage
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            What Makes Us <span className="gold-text">Different</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w, idx) => {
            const Icon = WHY_US_ICONS[w.title] || CheckCircle2;
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="neo-card p-6 sm:p-7 flex items-start gap-4 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {w.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Campus & Career Launch CTA */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mt-16 neo-card p-8 sm:p-12 bg-gradient-to-br from-white via-[#FCFDFE] to-[#FFF8EE] dark:from-zinc-900 dark:to-zinc-950 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.14)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
              <MapPin className="h-3.5 w-3.5" />
              {COMPANY.address}
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Ready to Learn, Build & Launch Your Tech Career?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Join our next live engineering cohort, apply for an 8-week production
              internship, or partner with our enterprise engineering team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/courses"
              className="neo-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold"
            >
              <span>Browse Live Cohorts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="neo-btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold"
            >
              <span>Schedule Campus Visit</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
