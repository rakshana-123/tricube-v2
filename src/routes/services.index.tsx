import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Code2,
  Image as ImageIcon,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Magnet } from "@/components/react-bits/Magnet";
import { ScrollVelocity } from "@/components/react-bits/ScrollVelocity";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import {
  absoluteMedia,
  listServices,
  splitFeatures,
  type ServiceDTO,
} from "@/lib/services-api";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — TRI CUBE Digital Solutions | End-to-End Training & IT" },
      {
        name: "description",
        content:
          "End-to-end training, client-grade internships, career acceleration, and custom IT services — Python, MERN, Data Science, AI, Web & Mobile Apps.",
      },
      { property: "og:title", content: "TRI CUBE End-to-End Training & IT Services" },
      {
        property: "og:description",
        content:
          "From your first line of code to your first client project — one campus, one team.",
      },
      {
        property: "og:image",
        content: "/images/services/end-to-end-training-it-services.png",
      },
    ],
  }),
  component: ServicesPage,
});

const STAGE_W = 1920;
const STAGE_H = 1080;

type StudioCardTarget =
  | { kind: "courses" }
  | { kind: "service"; slug: string };

type StudioStageCardSpec = {
  id: string;
  title: string;
  ariaLabel: string;
  imageSrc: string;
  x: number;
  y: number;
  w: number;
  h: number;
  btn: { x: number; y: number; w: number; h: number };
  target: StudioCardTarget;
};

const STUDIO_STAGE_CARDS: StudioStageCardSpec[] = [
  {
    id: "cohort-studios",
    title: "Cohort Engineering Studios",
    ariaLabel:
      "Cohort Engineering Studios — Python, MERN, Java Full Stack, Data Science, AI, SQL & BI. Open Courses page",
    imageSrc: "/images/services/studios/studio-card-1.png",
    x: 94,
    y: 516,
    w: 423,
    h: 303,
    btn: { x: 33, y: 225, w: 61, h: 61 },
    target: { kind: "courses" },
  },
  {
    id: "custom-it-delivery",
    title: "Custom Web, App & IT Delivery",
    ariaLabel:
      "Custom Web, App & IT Delivery — Production websites, iOS/Android apps & bespoke digital builds. Open Website & IT Delivery page",
    imageSrc: "/images/services/studios/studio-card-2.png",
    x: 535,
    y: 516,
    w: 415,
    h: 303,
    btn: { x: 34, y: 225, w: 62, h: 61 },
    target: { kind: "service", slug: "web-dev" },
  },
  {
    id: "career-readiness",
    title: "ATS Resume & Career Readiness",
    ariaLabel:
      "ATS Resume & Career Readiness — Expert resume writing, LinkedIn setups & placement prep. Open ATS Resume & Career Readiness page",
    imageSrc: "/images/services/studios/studio-card-3.png",
    x: 968,
    y: 516,
    w: 417,
    h: 303,
    btn: { x: 34, y: 226, w: 62, h: 60 },
    target: { kind: "service", slug: "resume-writing" },
  },
  {
    id: "internships-capstones",
    title: "Client Internships & Capstones",
    ariaLabel:
      "Client Internships & Capstones — Agile sprint internships, IoT hardware labs & final-year builds. Open Client Internship Program page",
    imageSrc: "/images/services/studios/studio-card-4.png",
    x: 1403,
    y: 516,
    w: 431,
    h: 303,
    btn: { x: 37, y: 226, w: 62, h: 61 },
    target: { kind: "service", slug: "internship" },
  },
];

const FLAGSHIP_STAGE_CARD = {
  id: "flagship-resume-review",
  title: "Resume Review by Expert — ₹99",
  ariaLabel:
    "Flagship Fast-Track Save 80% — Resume Review by Expert for ₹99. Start Now",
  imageSrc: "/images/services/studios/studio-card-5-flagship.png",
  x: 94,
  y: 837,
  w: 1731,
  h: 203,
  btn: { x: 1325, y: 107, w: 314, h: 62 },
  slug: "resume-review",
} as const;

const DELIVERY_STEPS = [
  {
    step: "01",
    code: "STEP 01",
    title: "Pick Your Track or Scope",
    body: "Choose from 22+ fixed-price training cohorts, career services, and IT deliverables — or open a custom request.",
    icon: Layers,
  },
  {
    step: "02",
    code: "STEP 02",
    title: "Secure Checkout & Brief",
    body: "Complete instant Razorpay checkout (UPI, cards, netbanking) and attach your resume, project brief, or target role.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    code: "STEP 03",
    title: "Architect & Mentor Execution",
    body: "Senior engineers review your submission line-by-line, lead live coding sprints, or build your production software.",
    icon: Code2,
  },
  {
    step: "04",
    code: "STEP 04",
    title: "Verified Delivery & Support",
    body: "Receive deliverables straight to your inbox with QR-verifiable credentials, mentor notes, and follow-up support.",
    icon: Zap,
  },
];

function resolveServiceDomain(s: ServiceDTO): string {
  const rawCat = (s.category || "").trim();
  if (rawCat && rawCat.toLowerCase() !== "general") {
    return rawCat;
  }

  const hay = `${s.slug} ${s.title}`.toLowerCase();

  if (
    /resume|linkedin|portfolio|placement|soft-skills|soft skills|interview|career/.test(
      hay
    )
  ) {
    return "Career & Resume";
  }

  if (/internship|final-year|iot|capstone|project/.test(hay)) {
    return "Projects & Internships";
  }

  if (/web-dev|website|mobile-dev|mobile app|custom-request|custom|saas/.test(hay)) {
    return "IT & App Solutions";
  }

  return "Training & Cohorts";
}

function ServicesPage() {
  const [services, setServices] = useState<ServiceDTO[] | null>(null);
  const [activeDomain, setActiveDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReduced = useReducedMotion();

  const { scrollYProgress: pageProgress } = useScroll();
  const smoothPageProgress = useSpring(pageProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    let alive = true;
    listServices().then((rows) => {
      if (alive) setServices(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  const scrollToCatalogue = (domain?: string) => {
    if (domain) setActiveDomain(domain);
    const el = document.getElementById("services-catalogue");
    if (el) {
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const enrichedServices = useMemo(() => {
    return (services || []).map((svc, idx) => ({
      svc,
      domain: resolveServiceDomain(svc),
      serial: String(idx + 1).padStart(2, "0"),
    }));
  }, [services]);

  const filterTabs = useMemo(() => {
    const base: string[] = [
      "All",
      "Training & Cohorts",
      "IT & App Solutions",
      "Career & Resume",
      "Projects & Internships",
    ];
    for (const item of enrichedServices) {
      if (!base.includes(item.domain)) {
        base.push(item.domain);
      }
    }
    return base;
  }, [enrichedServices]);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { All: enrichedServices.length };
    for (const item of enrichedServices) {
      counts[item.domain] = (counts[item.domain] || 0) + 1;
    }
    return counts;
  }, [enrichedServices]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedServices.filter(({ svc, domain }) => {
      const matchesDomain = activeDomain === "All" || domain === activeDomain;
      if (!matchesDomain) return false;
      if (!q) return true;
      const hay =
        `${svc.title} ${svc.description || ""} ${svc.features || ""} ${svc.duration} ${domain}`.toLowerCase();
      return hay.includes(q);
    });
  }, [enrichedServices, activeDomain, searchQuery]);

  return (
    <div className="relative bg-[#FFFFFF] text-zinc-900 selection:bg-[#E09A3B]/20 selection:text-[#E09A3B] dark:bg-zinc-950 dark:text-zinc-100">
      {/* Sticky Scroll-Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothPageProgress }}
        className="fixed top-[72px] lg:top-[78px] left-0 right-0 z-40 h-[2.5px] origin-left bg-gradient-to-r from-[#E09A3B] via-[#F4BA63] to-[#C87E20]"
      />

      {/* =====================================================================
          1. FULL-SCREEN HERO SECTION (Refined Smaller Right Artwork Proportion)
         ===================================================================== */}
      <FullScreenServicesHero
        totalCount={enrichedServices.length || 22}
        onExploreClick={() => scrollToCatalogue("All")}
      />

      {/* =====================================================================
          2. SECOND DESKTOP PAGE — INTERACTIVE FOUR INTEGRATED STUDIOS STAGE
         ===================================================================== */}
      <FourStudiosInteractiveStage />

      {/* =====================================================================
          3. KINETIC SCROLL-VELOCITY TICKER RIBBON
         ===================================================================== */}
      <div className="w-full py-5 border-y border-zinc-100 bg-[#FAFAFC] dark:bg-zinc-900/50 dark:border-zinc-800/80 overflow-hidden">
        <ScrollVelocity
          texts={[
            "LIVE COHORT TRAINING • ₹99 EXPERT RESUME REVIEW • CLIENT SPRINT INTERNSHIPS •",
            "CUSTOM WEB & MOBILE APPS • APPLIED AI & DATA SCIENCE • VERIFIED QR CREDENTIALS •",
          ]}
          velocity={55}
          fontSize={26}
          fontWeight={800}
          color="#E09A3B"
          skewWithVelocity={8}
          scaleWithVelocity={0.08}
          outlineAlternate
          fadeEdges
          pauseOnHover
          draggable
          gap={26}
        />
      </div>

      {/* =====================================================================
          4. INTERACTIVE SERVICE CATALOGUE & PROXIMITY SPOTLIGHT CARDS
         ===================================================================== */}
      <section
        id="services-catalogue"
        className="scroll-mt-24 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-16 lg:py-24"
      >
        {/* Section Heading */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FDF3E6] border border-[#E09A3B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#E09A3B]">
              <Sparkles className="h-3.5 w-3.5" />
              Service Catalogue
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold tracking-tight leading-[1.1] text-[#081226] dark:text-zinc-50">
              Engineered around your{" "}
              <span className="gold-text">career &amp; product</span> roadmap.
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Filter by engineering domain or search directly. Hover any card to
            inspect deliverables, turnaround times, and instant onboarding.
          </p>
        </motion.div>

        {/* Clean Modern Filter & Search Bar */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-2xl border border-zinc-200/80 bg-[#FAFAFC] p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex items-center rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 lg:w-[320px] xl:w-[360px] shrink-0 transition-all focus-within:border-[#E09A3B] focus-within:ring-2 focus-within:ring-[#E09A3B]/20 dark:border-zinc-800 dark:bg-zinc-950">
              <Search className="h-4 w-4 text-[#E09A3B] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MERN, Python, Resume, App…"
                aria-label="Search services"
                className="w-full bg-transparent pl-3 pr-7 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 grid h-6 w-6 place-items-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs with Shared-Layout Spring Morph */}
            <div
              role="tablist"
              aria-label="Service categories"
              className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-zinc-200/80 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {filterTabs.map((tab) => {
                const isActive = activeDomain === tab;
                const count = domainCounts[tab] ?? 0;
                return (
                  <button
                    key={tab}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setActiveDomain(tab)}
                    className={`relative shrink-0 rounded-lg px-3.5 py-2 text-xs sm:text-[13px] font-bold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09A3B] ${
                      isActive
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="serviceTabActiveIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-lg bg-[#081226] dark:bg-[#E09A3B]"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <span>{tab}</span>
                      <span
                        className={`font-mono-tech rounded-full px-1.5 py-0.5 text-[10px] ${
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/25"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Loading Skeletons */}
        {services === null && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-200/80 bg-white p-6 animate-pulse dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="aspect-[16/10] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5" />
                <div className="h-4 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="mt-3 h-6 w-3/4 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="mt-3 h-4 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                <div className="mt-6 h-12 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {/* Empty / No Match State */}
        {services !== null && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-[#FAFAFC] p-12 text-center dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#FDF3E6] text-[#E09A3B]">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-display mt-4 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {services.length === 0
                ? "No services published yet"
                : "No matching services found"}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {services.length === 0 ? (
                <>
                  An administrator can publish services from{" "}
                  <span className="font-mono-tech font-semibold text-[#E09A3B]">
                    /admin/services
                  </span>
                  .
                </>
              ) : (
                <>
                  Try clearing your search filter or switching back to{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDomain("All");
                      setSearchQuery("");
                    }}
                    className="font-bold text-[#E09A3B] underline underline-offset-4 cursor-pointer"
                  >
                    All Services
                  </button>
                  .
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Interactive Proximity Spotlight Service Cards Grid */}
        {services !== null && filteredServices.length > 0 && (
          <motion.div
            layout
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map(({ svc, domain, serial }, index) => (
                <ServiceSpotlightCard
                  key={svc.slug}
                  service={svc}
                  domain={domain}
                  serial={serial}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* =====================================================================
          5. SCROLL-DRIVEN 4-STEP EXECUTION PIPELINE
         ===================================================================== */}
      <DeliveryPipelineSection />

      {/* =====================================================================
          6. BESPOKE ENTERPRISE & CUSTOM PROJECT BANNER
         ===================================================================== */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 pb-24 pt-6">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-[#081226] px-8 py-12 sm:px-12 lg:px-16 lg:py-14 text-white shadow-[0_24px_60px_-20px_rgba(8,18,38,0.35)]"
        >
          {/* Ambient radial gold & teal accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-[#E09A3B]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"
          />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E09A3B]/15 border border-[#E09A3B]/35 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F4BA63]">
                <Briefcase className="h-3.5 w-3.5 text-[#E09A3B]" />
                Bespoke Engineering &amp; Custom Scope
              </span>
              <h2 className="font-display mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Need a custom SaaS build, corporate cohort, or specialized capstone?
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                Share your architecture brief, reference links, or team upskilling
                goals. Our engineering leads scope deliverables, milestones, and
                timelines within 24 working hours.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 lg:items-end">
              <Magnet padding={50} magnetStrength={3.5} maxOffset={8}>
                <Link
                  to="/services/$slug"
                  params={{ slug: "custom-request" }}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#E09A3B] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(224,154,59,0.55)] transition-all hover:bg-[#cf892b]"
                >
                  <span>Submit Custom Request</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnet>
              <Link
                to="/contact"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-[#E09A3B] hover:bg-white/10"
              >
                <span>Talk to Engineering Team</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ============================================================================
   1. FULL-SCREEN HERO SECTION
   Full-viewport single-screen hero matching Home HeroSlideshow layout,
   with slightly reduced right-side artwork scale (78-80% height inside 50-52%
   width) for balanced, airy visual proportion.
   ============================================================================ */
function FullScreenServicesHero({
  totalCount,
  onExploreClick,
}: {
  totalCount: number;
  onExploreClick: () => void;
}) {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  const copyY = useTransform(smoothScroll, [0, 1], [0, -32]);
  const copyOpacity = useTransform(smoothScroll, [0, 0.85], [1, 0.25]);
  const artworkY = useTransform(smoothScroll, [0, 1], [0, 36]);
  const artworkScale = useTransform(smoothScroll, [0, 1], [1, 0.96]);

  return (
    <section
      ref={heroRef}
      aria-label="TRI CUBE End-to-End Training and IT Services Hero"
      className="relative w-full min-h-[calc(100dvh-72px)] lg:h-[calc(100dvh-78px)] lg:max-h-[calc(100dvh-78px)] overflow-hidden bg-[#FFFFFF] select-none"
    >
      {/* Right-Side Full-Screen Hero Artwork — slightly reduced scale for balanced breathing room */}
      <motion.div
        style={{
          ...(prefersReduced ? {} : { y: artworkY, scale: artworkScale }),
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 96%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 96%, transparent 100%)",
          WebkitMaskComposite: "source-in",
        }}
        className="hidden lg:flex pointer-events-none absolute inset-y-0 right-0 w-[50%] xl:w-[52%] h-full items-center justify-end pr-6 xl:pr-14 overflow-hidden will-change-transform"
      >
        <motion.img
          src="/images/services/services-hero-artwork.png"
          alt="End-to-end training and IT services — TRI CUBE engineer at workspace"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.96, x: 20 }}
          animate={
            prefersReduced
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [-5, 5, -5],
                }
          }
          transition={{
            opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="h-[76%] xl:h-[79%] w-auto max-w-full object-contain object-right"
          fetchPriority="high"
          draggable={false}
        />

        {/* Soft white blend on the left edge */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-20 xl:w-28 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/85 to-transparent"
        />
      </motion.div>

      {/* Main Single-Screen Content Container */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 sm:px-10 lg:px-16 xl:px-20 py-4 sm:py-5 lg:py-[2.6dvh]">
        {/* Left Column Copy + Staggered Entrance + Magnetic CTAs */}
        <motion.div
          style={prefersReduced ? undefined : { y: copyY, opacity: copyOpacity }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
          }}
          className="my-auto w-full lg:max-w-[49%] xl:max-w-[47%]"
        >
          <div className="flex flex-col items-start">
            {/* Eyebrow Pill Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#FDF3E6] border border-[#E09A3B]/25 px-4 py-1.5 mb-[1.6dvh]"
            >
              <span className="h-2 w-2 rounded-full bg-[#E09A3B]" />
              <span className="text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.2em] text-[#E09A3B]">
                Services
              </span>
            </motion.div>

            {/* Main Display Heading */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="font-display font-extrabold tracking-[-0.032em] text-[#081226] leading-[1.05] text-[clamp(2.35rem,4.1vw,4rem)]"
            >
              <span className="block">End-to-end</span>
              <span className="block text-[#E09A3B] mt-0.5">training &amp;</span>
              <span className="block text-[#E09A3B] mt-0.5">IT services.</span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="mt-[1.6dvh] max-w-[520px] text-[clamp(0.92rem,1.02vw,1.06rem)] leading-[1.55] text-[#4A5568] font-normal"
            >
              From your first line of code to your first client project — one
              campus, one team.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="mt-[2.4dvh] flex flex-wrap items-center gap-3.5 sm:gap-4"
            >
              <Magnet padding={55} magnetStrength={3.5} maxOffset={9}>
                <button
                  type="button"
                  onClick={onExploreClick}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E09A3B] px-7 sm:px-8 py-3 sm:py-3.5 text-[0.92rem] sm:text-[0.98rem] font-bold text-[#FFFFFF] shadow-[0_12px_28px_-6px_rgba(224,154,59,0.55)] transition-all duration-200 hover:bg-[#cf892b] cursor-pointer"
                >
                  <span>Explore services</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </Magnet>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-[1.75px] border-[#E09A3B] bg-[#FFFFFF] px-7 sm:px-8 py-3 sm:py-3.5 text-[0.92rem] sm:text-[0.98rem] font-bold text-[#E09A3B] transition-all duration-200 hover:bg-[#FDF3E6] hover:-translate-y-0.5"
              >
                <span>Get in touch</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile / Tablet Artwork Preview — compact & well-proportioned */}
          <div className="mt-6 block lg:hidden w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-[#E09A3B]/20 bg-[#FFFFFF] p-2 shadow-sm">
            <img
              src="/images/services/services-hero-artwork.png"
              alt="End-to-end training and IT services — TRI CUBE engineer at workspace"
              className="w-full max-h-[280px] object-contain mx-auto"
            />
          </div>
        </motion.div>

        {/* Bottom Bar: Student Avatars Rating (Left) + Scroll Cue (Right) */}
        <div className="relative z-20 mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img
                src="/hero/student-avatars.png"
                alt="4,200+ TRI CUBE students"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <span className="-ml-2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#FFFFFF] bg-[#F1F5F9] text-xs sm:text-sm font-bold text-[#475569] shadow-sm">
                +
              </span>
            </div>
            <p className="text-[0.88rem] sm:text-[0.95rem] text-[#64748B]">
              <strong className="font-bold text-[#0F172A]">4.9/5</strong> from
              4,200+ students
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onExploreClick}
            animate={prefersReduced ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold text-[#475569] hover:border-[#E09A3B] hover:text-[#E09A3B] transition-colors cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E09A3B]" />
            <span>{totalCount}+ Services Below</span>
            <ArrowDown className="h-3.5 w-3.5 text-[#E09A3B]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. SECOND DESKTOP PAGE — FOUR INTEGRATED STUDIOS INTERACTIVE IMAGE STAGE
   Displays the exact Four Integrated Studios artwork fitted to desktop page
   size (calc(100dvh - 78px)), with all 5 cards and their action buttons
   independently animated and wired to redirect to their respective pages.
   ============================================================================ */
function StudioCardLink({
  target,
  ariaLabel,
  className,
  children,
}: {
  target: StudioCardTarget;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  if (target.kind === "courses") {
    return (
      <Link to="/courses" aria-label={ariaLabel} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link
      to="/services/$slug"
      params={{ slug: target.slug }}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </Link>
  );
}

function FourStudiosInteractiveStage() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="four-studios-stage"
      aria-label="Four Integrated Studios and Resume Review Fast-Track"
      className="relative w-full aspect-[1920/1080] scroll-mt-[72px] lg:scroll-mt-[78px] overflow-hidden select-none"
    >
      {/* Exact 1920 × 1080 (16:9) Full HD Stage — preserves 100% undistorted reference UI */}
      <div className="relative h-full w-full">
        {/* Exact 1920 × 1080 Original Artwork Backdrop (untouched design & clean card beds) */}
        <img
          src="/images/services/studios/four-studios-stage-bg.png"
          alt="One Campus · One Engineering Team — Four Integrated Studios. Zero Handoff Friction."
          width={1920}
          height={1080}
          decoding="async"
          className="block h-full w-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* 4 Exact Sliced Interactive Animated Domain Studio Cards */}
        {STUDIO_STAGE_CARDS.map((card, idx) => {
          const leftPct = `${(card.x / STAGE_W) * 100}%`;
          const topPct = `${(card.y / STAGE_H) * 100}%`;
          const widthPct = `${(card.w / STAGE_W) * 100}%`;
          const heightPct = `${(card.h / STAGE_H) * 100}%`;

          const btnLeftPct = `${(card.btn.x / card.w) * 100}%`;
          const btnTopPct = `${(card.btn.y / card.h) * 100}%`;
          const btnWidthPct = `${(card.btn.w / card.w) * 100}%`;
          const btnHeightPct = `${(card.btn.h / card.h) * 100}%`;

          return (
            <motion.div
              key={card.id}
              style={{
                left: leftPct,
                top: topPct,
                width: widthPct,
                height: heightPct,
              }}
              initial={
                prefersReduced ? false : { opacity: 0, y: 26, scale: 0.95 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.18 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 22,
                delay: 0.06 + idx * 0.075,
              }}
              whileHover={
                prefersReduced
                  ? undefined
                  : {
                      y: -10,
                      scale: 1.03,
                      zIndex: 30,
                      transition: {
                        type: "spring",
                        stiffness: 360,
                        damping: 22,
                      },
                    }
              }
              whileTap={prefersReduced ? undefined : { scale: 0.985 }}
              className="group absolute z-10 will-change-transform"
            >
              <StudioCardLink
                target={card.target}
                ariaLabel={card.ariaLabel}
                className="relative block h-full w-full rounded-[1.2vw] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EA580C]/60"
              >
                <img
                  src={card.imageSrc}
                  alt={card.title}
                  draggable={false}
                  className="block h-full w-full object-fill transition-[filter] duration-300 group-hover:drop-shadow-[0_22px_28px_rgba(234,88,12,0.28)]"
                />

                {/* Diagonal Specular Light Sweep on Hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.15vw]"
                >
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />
                </span>

                {/* Interactive Animated Circular Arrow Button */}
                <span
                  style={{
                    left: btnLeftPct,
                    top: btnTopPct,
                    width: btnWidthPct,
                    height: btnHeightPct,
                  }}
                  className="absolute block rounded-full"
                >
                  {!prefersReduced && (
                    <motion.span
                      aria-hidden="true"
                      animate={{
                        scale: [1, 1.24, 1],
                        opacity: [0.42, 0, 0.42],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: idx * 0.35,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#EA580C]"
                    />
                  )}

                  <span className="relative block h-full w-full rounded-full transition-all duration-300 ease-out group-hover:scale-110 hover:!scale-[1.18] group-hover:drop-shadow-[0_8px_16px_rgba(234,88,12,0.48)]">
                    <img
                      src="/images/services/studios/studio-btn-circle.png"
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className="block h-full w-full object-fill"
                    />
                  </span>
                </span>
              </StudioCardLink>
            </motion.div>
          );
        })}

        {/* 5th Bottom Flagship Fast-Track Card (Resume Review by Expert · ₹99 · Start Now →) */}
        <motion.div
          style={{
            left: `${(FLAGSHIP_STAGE_CARD.x / STAGE_W) * 100}%`,
            top: `${(FLAGSHIP_STAGE_CARD.y / STAGE_H) * 100}%`,
            width: `${(FLAGSHIP_STAGE_CARD.w / STAGE_W) * 100}%`,
            height: `${(FLAGSHIP_STAGE_CARD.h / STAGE_H) * 100}%`,
          }}
          initial={
            prefersReduced ? false : { opacity: 0, y: 22, scale: 0.975 }
          }
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 23,
            delay: 0.34,
          }}
          whileHover={
            prefersReduced
              ? undefined
              : {
                  y: -7,
                  scale: 1.014,
                  zIndex: 30,
                  transition: {
                    type: "spring",
                    stiffness: 340,
                    damping: 24,
                  },
                }
          }
          whileTap={prefersReduced ? undefined : { scale: 0.992 }}
          className="group absolute z-10 will-change-transform"
        >
          <Link
            to="/services/$slug"
            params={{ slug: FLAGSHIP_STAGE_CARD.slug }}
            aria-label={FLAGSHIP_STAGE_CARD.ariaLabel}
            className="relative block h-full w-full rounded-[1.25vw] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EA580C]/60"
          >
            <img
              src={FLAGSHIP_STAGE_CARD.imageSrc}
              alt={FLAGSHIP_STAGE_CARD.title}
              draggable={false}
              className="block h-full w-full object-fill transition-[filter] duration-300 group-hover:drop-shadow-[0_22px_30px_rgba(234,88,12,0.26)]"
            />

            {/* Diagonal Specular Light Sweep across Banner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.2vw]"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[125%] group-hover:opacity-100" />
            </span>

            {/* Interactive Animated "Start Now →" Pill Button */}
            <span
              style={{
                left: `${(FLAGSHIP_STAGE_CARD.btn.x / FLAGSHIP_STAGE_CARD.w) * 100}%`,
                top: `${(FLAGSHIP_STAGE_CARD.btn.y / FLAGSHIP_STAGE_CARD.h) * 100}%`,
                width: `${(FLAGSHIP_STAGE_CARD.btn.w / FLAGSHIP_STAGE_CARD.w) * 100}%`,
                height: `${(FLAGSHIP_STAGE_CARD.btn.h / FLAGSHIP_STAGE_CARD.h) * 100}%`,
              }}
              className="absolute block rounded-full"
            >
              {!prefersReduced && (
                <motion.span
                  aria-hidden="true"
                  animate={{
                    scaleX: [1, 1.07, 1],
                    scaleY: [1, 1.22, 1],
                    opacity: [0.45, 0, 0.45],
                  }}
                  transition={{
                    duration: 2.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#EA580C]"
                />
              )}

              <span className="relative block h-full w-full overflow-hidden rounded-full transition-all duration-300 ease-out group-hover:scale-[1.055] hover:!scale-[1.09] group-hover:drop-shadow-[0_10px_22px_rgba(234,88,12,0.5)]">
                <img
                  src="/images/services/studios/studio-btn-start-now.png"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="block h-full w-full object-fill"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:left-[135%] group-hover:opacity-100"
                />
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   4. SERVICE SPOTLIGHT CARD
   Clean editorial card with proximity-reactive SpotlightCard border beam,
   blur-to-crisp scroll reveal, and spring elevation hover choreography.
   ============================================================================ */
function ServiceSpotlightCard({
  service,
  domain,
  serial,
  index,
}: {
  service: ServiceDTO;
  domain: string;
  serial: string;
  index: number;
}) {
  const prefersReduced = useReducedMotion();

  const rating = (service.rating ?? 4.9).toFixed(1);
  const features = splitFeatures(service.features);
  const desc = service.description || features.slice(0, 2).join(" · ");
  const img = absoluteMedia(service.imageUrl);
  const offerPrice = service.offerPrice ?? service.price;
  const hasDiscount = service.price > offerPrice;
  const discountPct = hasDiscount
    ? Math.round(((service.price - offerPrice) / service.price) * 100)
    : 0;

  return (
    <motion.article
      layout="position"
      initial={
        prefersReduced
          ? false
          : { opacity: 0, y: 32, scale: 0.97, filter: "blur(5px)" }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      viewport={{ once: false, amount: 0.14 }}
      transition={{
        duration: 0.52,
        delay: (index % 3) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: -7,
              transition: { type: "spring", stiffness: 340, damping: 24 },
            }
      }
      className="group h-full will-change-transform"
    >
      <SpotlightCard
        theme="light"
        spotlightColor="#E09A3B"
        intensity={0.2}
        borderGlow={0.85}
        spotlightSize={270}
        proximity={85}
        className="h-full !p-5 sm:!p-6 flex flex-col justify-between dark:![background-color:#18181b]"
      >
        <div>
          {/* Top Metadata Row */}
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono-tech text-[11px] font-bold text-[#E09A3B]">
                #{serial}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="truncate text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {domain}
              </span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200/80 bg-[#FAFAFC] px-2.5 py-0.5 text-xs font-bold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              <Star className="h-3 w-3 fill-[#E09A3B] text-[#E09A3B]" />
              {rating}
            </span>
          </div>

          {/* Media Preview Frame */}
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="block relative aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
          >
            {img ? (
              <img
                src={img}
                alt={service.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-zinc-400">
                <ImageIcon className="h-7 w-7" />
              </div>
            )}

            {discountPct > 0 && (
              <span className="font-mono-tech absolute top-2.5 right-2.5 rounded-full bg-[#081226]/85 backdrop-blur-md border border-[#E09A3B]/40 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#F4BA63]">
                {discountPct}% OFF
              </span>
            )}
          </Link>

          {/* Title & Description */}
          <div className="mt-4">
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="block focus-visible:outline-none"
            >
              <h3 className="font-display text-lg font-extrabold leading-snug tracking-tight text-[#081226] transition-colors group-hover:text-[#E09A3B] dark:text-zinc-50">
                {service.title}
              </h3>
            </Link>

            {desc && (
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
                {desc}
              </p>
            )}
          </div>

          {/* Feature Pills */}
          {features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {features.slice(0, 3).map((feat) => (
                <span
                  key={feat}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-[#FAFAFC] px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-[#E09A3B]" />
                  <span className="truncate max-w-[190px]">{feat}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Pricing & CTA Row */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              <Calendar className="h-3 w-3 text-[#E09A3B] shrink-0" />
              <span className="truncate">{service.duration}</span>
            </span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-display text-lg sm:text-xl font-extrabold text-[#081226] dark:text-zinc-50">
                ₹{offerPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[11px] font-medium text-zinc-400 line-through">
                  ₹{service.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#081226] px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 group-hover:bg-[#E09A3B] group-hover:shadow-[0_8px_20px_-6px_rgba(224,154,59,0.55)] dark:bg-zinc-800"
          >
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

/* ============================================================================
   5. SCROLL-DRIVEN 4-STEP DELIVERY PIPELINE
   Clean architectural timeline with live scroll-linked gold progress line.
   ============================================================================ */
function DeliveryPipelineSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 35%"],
  });

  const smoothLine = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      className="border-t border-zinc-100 bg-[#FAFAFC] py-16 lg:py-22 dark:border-zinc-800/80 dark:bg-zinc-900/40"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FDF3E6] border border-[#E09A3B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#E09A3B]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Execution Protocol
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#081226] dark:text-zinc-50">
            From Checkout to{" "}
            <span className="gold-text">Production Delivery</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Every cohort seat, resume review, and software engagement follows a
            transparent four-stage pipeline.
          </p>
        </motion.div>

        <div className="relative mt-14">
          {/* Desktop Scroll-Linked Connector Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-[2px] rounded-full bg-zinc-200 overflow-hidden dark:bg-zinc-800"
          >
            <motion.div
              style={prefersReduced ? undefined : { scaleX: smoothLine }}
              className="h-full w-full origin-left bg-gradient-to-r from-[#E09A3B] via-[#F4BC68] to-[#C87E20]"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERY_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={prefersReduced ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    prefersReduced
                      ? undefined
                      : {
                          y: -5,
                          transition: { type: "spring", stiffness: 350, damping: 24 },
                        }
                  }
                  className="group relative flex flex-col items-start lg:items-center"
                >
                  {/* Step Circle Node */}
                  <div className="relative z-10 mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-zinc-200 bg-white text-[#E09A3B] shadow-sm transition-all duration-300 group-hover:border-[#E09A3B] group-hover:bg-[#E09A3B] group-hover:text-white dark:border-zinc-800 dark:bg-zinc-950">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Step Card */}
                  <div className="w-full flex-1 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-300 group-hover:border-[#E09A3B]/45 group-hover:shadow-[0_16px_32px_-16px_rgba(224,154,59,0.2)] dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="font-mono-tech text-[10px] font-extrabold tracking-[0.2em] text-[#E09A3B]">
                      {item.code}
                    </span>
                    <h3 className="font-display mt-2 text-lg font-extrabold text-[#081226] dark:text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
