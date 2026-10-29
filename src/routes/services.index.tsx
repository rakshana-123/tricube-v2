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
  Cpu,
  FileCheck2,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
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

type DomainKey =
  | "All"
  | "Training & Cohorts"
  | "IT & App Solutions"
  | "Career & Resume"
  | "Projects & Internships";

const CORE_DOMAINS: {
  key: Exclude<DomainKey, "All">;
  code: string;
  title: string;
  tagline: string;
  icon: typeof GraduationCap;
}[] = [
  {
    key: "Training & Cohorts",
    code: "01 // ACADEMY",
    title: "Cohort Engineering Studios",
    tagline: "Python, MERN, Java Full Stack, Data Science, AI, SQL & BI.",
    icon: GraduationCap,
  },
  {
    key: "IT & App Solutions",
    code: "02 // ENTERPRISE",
    title: "Custom Web, App & IT Delivery",
    tagline: "Production websites, iOS/Android apps & bespoke digital builds.",
    icon: Cpu,
  },
  {
    key: "Career & Resume",
    code: "03 // ACCELERATOR",
    title: "ATS Resume & Career Readiness",
    tagline: "₹99 expert resume reviews, LinkedIn setups & placement prep.",
    icon: FileCheck2,
  },
  {
    key: "Projects & Internships",
    code: "04 // LAUNCHPAD",
    title: "Client Internships & Capstones",
    tagline: "Agile sprint internships, IoT hardware labs & final-year builds.",
    icon: Rocket,
  },
];

const DELIVERY_STEPS = [
  {
    step: "01",
    code: "STEP 01 // SELECT",
    title: "Pick Your Track or Scope",
    body: "Choose from 22+ fixed-price training cohorts, career services, and IT deliverables — or open a custom request.",
    icon: Layers,
  },
  {
    step: "02",
    code: "STEP 02 // ONBOARD",
    title: "Secure Checkout & Brief",
    body: "Complete instant Razorpay checkout (UPI, cards, netbanking) and attach your resume, project brief, or target role.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    code: "STEP 03 // EXECUTE",
    title: "Architect & Mentor Execution",
    body: "Senior engineers review your submission line-by-line, lead live coding sprints, or build your production software.",
    icon: Code2,
  },
  {
    step: "04",
    code: "STEP 04 // DELIVER",
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

  // Global page scroll progress bar
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
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
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

  const flagshipService = useMemo(() => {
    if (!enrichedServices.length) return null;
    return (
      enrichedServices.find((x) => x.svc.featured) ||
      enrichedServices.find((x) => x.svc.slug === "resume-review") ||
      enrichedServices[0]
    );
  }, [enrichedServices]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedServices.filter(({ svc, domain }) => {
      const matchesDomain = activeDomain === "All" || domain === activeDomain;
      if (!matchesDomain) return false;
      if (!q) return true;
      const hay = `${svc.title} ${svc.description || ""} ${svc.features || ""} ${svc.duration} ${domain}`.toLowerCase();
      return hay.includes(q);
    });
  }, [enrichedServices, activeDomain, searchQuery]);

  return (
    <div className="relative neo-surface text-zinc-900 selection:bg-[#E09A3B]/20 selection:text-[#E09A3B] dark:text-zinc-100">
      {/* Sticky Scroll-Progress Telemetry Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothPageProgress }}
        className="fixed top-[72px] lg:top-[78px] left-0 right-0 z-40 h-[3px] origin-left bg-gradient-to-r from-[#E09A3B] via-[#F4BA63] to-[#C87E20] shadow-[0_2px_10px_rgba(224,154,59,0.55)]"
      />

      {/* =====================================================================
          1. FULL-SCREEN HERO ARTWORK STAGE (Scroll-Linked Parallax & Hotspots)
         ===================================================================== */}
      <FullScreenServicesHero
        totalCount={enrichedServices.length || 22}
        onExploreClick={() => scrollToCatalogue("All")}
      />

      {/* =====================================================================
          2. ASYMMETRIC NEOMORPHIC ARCHITECTURE & FLAGSHIP SPOTLIGHT CONSOLE
         ===================================================================== */}
      <FlagshipArchitectureBento
        flagship={flagshipService}
        domainCounts={domainCounts}
        onSelectDomain={(domain) => scrollToCatalogue(domain)}
      />

      {/* =====================================================================
          3. RECESSED FILTER CONSOLE & TACTILE NEOMORPHIC SERVICE CARDS GRID
         ===================================================================== */}
      <section
        id="services-catalogue"
        className="scroll-mt-24 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 lg:py-24"
      >
        {/* Section Heading */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="neo-orb inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#C87E20] dark:text-[#F0A847]">
              <Sparkles className="h-3.5 w-3.5 text-[#E09A3B]" />
              Service Catalogue
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-50">
              Sculpted around your{" "}
              <span className="gold-text">career & product</span> roadmap.
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Filter by engineering domain or search directly. Every card displays
            transparent turnaround times and instant online onboarding.
          </p>
        </motion.div>

        {/* Recessed Neomorphic Control Console: Search + Category Track */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 neo-extruded p-3.5 sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Concave Search Input Well */}
            <div className="neo-inset relative flex items-center px-4 py-2.5 lg:w-[330px] xl:w-[370px] shrink-0">
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

            {/* Concave Category Switcher Track with Shared-Layout Spring Pill */}
            <div
              role="tablist"
              aria-label="Service categories"
              className="neo-inset flex items-center gap-1.5 overflow-x-auto p-1.5 no-scrollbar"
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
                    className={`relative shrink-0 rounded-xl px-3.5 py-2 text-xs sm:text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09A3B] ${
                      isActive
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="neoActiveServiceTab"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#EA9F3D] to-[#C87E20] shadow-[4px_6px_14px_rgba(200,126,32,0.38),-2px_-2px_8px_rgba(255,255,255,0.6)]"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <span>{tab}</span>
                      <span
                        className={`font-mono-tech rounded-full px-1.5 py-0.5 text-[10px] ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-black/[0.05] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400"
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

        {/* Loading State: Sculpted Neomorphic Skeletons */}
        {services === null && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="neo-extruded p-6 animate-pulse">
                <div className="neo-inset aspect-[16/10] w-full mb-5" />
                <div className="h-4 w-24 rounded-full bg-zinc-300/60 dark:bg-zinc-700/60" />
                <div className="mt-3 h-6 w-3/4 rounded-xl bg-zinc-300/70 dark:bg-zinc-700/70" />
                <div className="mt-3 h-4 w-full rounded-lg bg-zinc-300/50 dark:bg-zinc-700/50" />
                <div className="mt-6 neo-inset h-14 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty / No Match State */}
        {services !== null && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 neo-extruded p-12 text-center"
          >
            <div className="neo-orb mx-auto grid h-14 w-14 place-items-center rounded-2xl text-[#E09A3B]">
              <Search className="h-6 w-6" />
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
                    className="font-bold text-[#E09A3B] underline underline-offset-4"
                  >
                    All Services
                  </button>
                  .
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Sculpted Neomorphic Service Cards Grid */}
        {services !== null && filteredServices.length > 0 && (
          <motion.div
            layout
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map(({ svc, domain, serial }, index) => (
                <ServiceNeomorphicCard
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
          4. SCROLL-DRIVEN 4-STEP EXECUTION PIPELINE
         ===================================================================== */}
      <DeliveryPipelineSection />

      {/* =====================================================================
          5. BESPOKE ENTERPRISE & CUSTOM PROJECT CONSOLE
         ===================================================================== */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pb-24 pt-6">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="neo-extruded relative overflow-hidden p-8 sm:p-12 lg:p-14"
        >
          {/* Top specular amber bar */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E09A3B] via-[#F5C274] to-transparent"
          />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="neo-orb inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#C87E20] dark:text-[#F0A847]">
                <Briefcase className="h-3.5 w-3.5 text-[#E09A3B]" />
                Bespoke Engineering & Custom Scope
              </span>
              <h2 className="font-display mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Need a custom SaaS build, corporate cohort, or specialized capstone?
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Share your architecture brief, reference links, or team upskilling
                goals. Our engineering leads scope deliverables, milestones, and
                timelines within 24 working hours.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
              <Link
                to="/services/$slug"
                params={{ slug: "custom-request" }}
                className="neo-cta-gold inline-flex w-full sm:w-auto lg:w-full items-center justify-center gap-2.5 px-7 py-4 text-sm font-extrabold"
              >
                <span>Submit Custom Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="neo-cta-porcelain inline-flex w-full sm:w-auto lg:w-full items-center justify-center gap-2 px-7 py-3.5 text-sm font-extrabold"
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
   1. FULL-SCREEN HERO ARTWORK STAGE
   Displays "End-to-End Training and IT Services.png" edge-to-edge full screen
   with scroll-scrubbed parallax depth & interactive CTA hotspots.
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

  const stageScale = useTransform(smoothScroll, [0, 1], [1, 0.94]);
  const stageY = useTransform(smoothScroll, [0, 1], [0, 68]);
  const stageOpacity = useTransform(smoothScroll, [0, 0.85, 1], [1, 0.86, 0.68]);
  const cueOpacity = useTransform(smoothScroll, [0, 0.35], [1, 0]);

  return (
    <section
      ref={heroRef}
      aria-label="End-to-end training and IT services hero"
      className="relative w-full min-h-[calc(100svh-72px)] lg:min-h-[calc(100dvh-78px)] bg-[#FEFEFE] flex flex-col justify-between overflow-hidden"
    >
      {/* Accessible semantic heading for SEO and screen readers */}
      <h1 className="sr-only">
        End-to-end training &amp; IT services — From your first line of code to your
        first client project, one campus, one team.
      </h1>

      {/* Full-Screen Responsive Artwork Container */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={
          prefersReduced
            ? undefined
            : {
                scale: stageScale,
                y: stageY,
                opacity: stageOpacity,
              }
        }
        className="relative w-full flex-1 flex items-center justify-center will-change-transform"
      >
        <div className="relative w-full max-w-[1920px] aspect-[1671/941] mx-auto select-none">
          <img
            src="/images/services/end-to-end-training-it-services.png"
            alt="End-to-end training and IT services — TRI CUBE Digital Solutions"
            className="h-full w-full object-contain"
            fetchPriority="high"
            draggable={false}
          />

          {/* Interactive Hotspot 1: Mapped over "Explore services ->" button in artwork */}
          <button
            type="button"
            onClick={onExploreClick}
            aria-label="Explore services"
            title="Explore services"
            className="hidden sm:block absolute left-[4.15%] top-[74.6%] w-[19.3%] h-[8.2%] rounded-full cursor-pointer transition-all duration-300 hover:ring-4 hover:ring-[#E09A3B]/35 hover:shadow-[0_12px_28px_rgba(224,154,59,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E09A3B]"
          />

          {/* Interactive Hotspot 2: Mapped over "Get in touch ->" button in artwork */}
          <Link
            to="/contact"
            aria-label="Get in touch"
            title="Get in touch"
            className="hidden sm:block absolute left-[24.4%] top-[74.6%] w-[17.9%] h-[8.2%] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#E09A3B]/[0.08] hover:ring-4 hover:ring-[#E09A3B]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E09A3B]"
          />
        </div>
      </motion.div>

      {/* Mobile-Only Tactile Command Panel (fills portrait viewport cleanly below 16:9 banner) */}
      <div className="sm:hidden px-5 pb-8 pt-4 bg-gradient-to-b from-[#FEFEFE] to-[var(--neo-canvas)]">
        <div className="neo-extruded p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {["22+ Tracks", "Mentor-Led", "Verified Delivery"].map((chip) => (
              <span
                key={chip}
                className="neo-inset px-3 py-1 text-[11px] font-bold text-zinc-700"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={onExploreClick}
              className="neo-cta-gold inline-flex items-center justify-center gap-2 py-3.5 text-sm font-extrabold"
            >
              <span>Explore {totalCount}+ Services</span>
              <ArrowDown className="h-4 w-4" />
            </button>
            <Link
              to="/contact"
              className="neo-cta-porcelain inline-flex items-center justify-center gap-2 py-3 text-sm font-extrabold"
            >
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Bottom Seam Blend + Floating Neomorphic Scroll Cue */}
      <div className="hidden sm:flex relative z-10 w-full flex-col items-center pb-5 pt-2 bg-gradient-to-b from-transparent via-[#FEFEFE]/80 to-[var(--neo-canvas)]">
        <motion.button
          type="button"
          onClick={onExploreClick}
          style={prefersReduced ? undefined : { opacity: cueOpacity }}
          animate={prefersReduced ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="neo-orb inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-extrabold tracking-wide text-zinc-700 hover:text-[#C87E20] cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-[#E09A3B] animate-ping" />
          <span>Scroll to Explore {totalCount}+ Sculpted Services</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#E09A3B]" />
        </motion.button>
      </div>
    </section>
  );
}

/* ============================================================================
   2. ASYMMETRIC NEOMORPHIC ARCHITECTURE & FLAGSHIP SPOTLIGHT BENTO
   ============================================================================ */
function FlagshipArchitectureBento({
  flagship,
  domainCounts,
  onSelectDomain,
}: {
  flagship: { svc: ServiceDTO; domain: string; serial: string } | null;
  domainCounts: Record<string, number>;
  onSelectDomain: (domain: string) => void;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-14 pb-6">
      <div className="grid gap-8 lg:grid-cols-12 items-stretch">
        {/* Left 7 Cols: 4-Vertical Neomorphic Architecture Matrix */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 neo-extruded p-6 sm:p-8 lg:p-9 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-[#C87E20] dark:text-[#F0A847]">
                ARCHITECTURE // 04 SERVICE PILLARS
              </span>
              <span className="neo-inset px-3 py-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                One Campus · One Engineering Team
              </span>
            </div>

            <h2 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Four Integrated Studios.{" "}
              <span className="gold-text">Zero Handoff Friction.</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Select any vertical below to jump straight into its dedicated service
              modules.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {CORE_DOMAINS.map((d, idx) => {
              const Icon = d.icon;
              const count = domainCounts[d.key] ?? 0;
              return (
                <motion.button
                  key={d.key}
                  type="button"
                  onClick={() => onSelectDomain(d.key)}
                  initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={prefersReduced ? undefined : { y: -4 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  className="group neo-inset p-4 sm:p-5 text-left transition-all duration-300 hover:border-[#E09A3B]/45 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="neo-orb grid h-10 w-10 place-items-center rounded-xl text-[#E09A3B] group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono-tech text-[10px] font-bold tracking-widest text-zinc-400 group-hover:text-[#E09A3B] transition-colors">
                      {count > 0 ? `${count} TRACKS` : d.code}
                    </span>
                  </div>
                  <h3 className="font-display mt-3.5 text-base font-extrabold text-zinc-900 group-hover:text-[#C87E20] dark:text-zinc-100 dark:group-hover:text-[#F0A847] transition-colors">
                    {d.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {d.tagline}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Right 5 Cols: Flagship Express Spotlight Console */}
        {flagship && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 neo-extruded neo-extruded-interactive relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
          >
            {/* Top gold accent */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E09A3B] via-[#F4BC68] to-[#C87E20]"
            />

            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E09A3B]/15 border border-[#E09A3B]/35 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#C87E20] dark:text-[#F0A847]">
                  <Zap className="h-3.5 w-3.5 text-[#E09A3B]" />
                  Flagship Fast-Track
                </span>
                {flagship.svc.price > (flagship.svc.offerPrice ?? flagship.svc.price) && (
                  <span className="font-mono-tech rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                    SAVE{" "}
                    {Math.round(
                      ((flagship.svc.price -
                        (flagship.svc.offerPrice ?? flagship.svc.price)) /
                        flagship.svc.price) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Recessed Media Bezel */}
              {absoluteMedia(flagship.svc.imageUrl) && (
                <div className="mt-5 neo-inset p-2.5">
                  <div className="aspect-[16/9] overflow-hidden rounded-xl">
                    <img
                      src={absoluteMedia(flagship.svc.imageUrl)}
                      alt={flagship.svc.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <h3 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {flagship.svc.title}
              </h3>

              <ul className="mt-4 space-y-2">
                {splitFeatures(flagship.svc.features)
                  .slice(0, 3)
                  .map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                      <span>{feat}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Sunken Pricing & Instant Booking Dock */}
            <div className="mt-7 neo-inset p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Turnaround · {flagship.svc.duration}
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold gold-text">
                    ₹{(flagship.svc.offerPrice ?? flagship.svc.price).toLocaleString()}
                  </span>
                  {flagship.svc.price >
                    (flagship.svc.offerPrice ?? flagship.svc.price) && (
                    <span className="text-xs font-semibold text-zinc-400 line-through">
                      ₹{flagship.svc.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <Link
                to="/services/$slug"
                params={{ slug: flagship.svc.slug }}
                className="neo-cta-gold inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-extrabold"
              >
                <span>Start Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
   3. SCULPTED TACTILE NEOMORPHIC SERVICE CARD
   Features multi-layered dual-directional shadows, recessed media bezel,
   cursor-tracking warm gold specular sheen, and Framer Motion scroll triggers.
   ============================================================================ */
function ServiceNeomorphicCard({
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
  const cardRef = useRef<HTMLElement | null>(null);
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

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      layout="position"
      onMouseMove={handleMouseMove}
      initial={prefersReduced ? false : { opacity: 0, y: 42, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      viewport={{ once: false, amount: 0.14 }}
      transition={{
        duration: 0.58,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: -8,
              transition: { type: "spring", stiffness: 320, damping: 22 },
            }
      }
      className="group neo-extruded neo-extruded-interactive relative flex flex-col justify-between overflow-hidden p-5 sm:p-6 will-change-transform"
    >
      {/* Pointer-following warm gold specular sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgba(224, 154, 59, 0.13), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Top Hardware Telemetry Header */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono-tech text-[11px] font-bold text-[#E09A3B]">
              #{serial}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="truncate text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {domain}
            </span>
          </div>

          <span className="neo-orb inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
            <Star className="h-3 w-3 fill-[#E09A3B] text-[#E09A3B]" />
            {rating}
          </span>
        </div>

        {/* Recessed Concave Media Bezel */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          className="block neo-inset p-2.5 transition-transform duration-300"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900/5 dark:bg-zinc-950">
            {img ? (
              <img
                src={img}
                alt={service.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-zinc-400">
                <ImageIcon className="h-7 w-7" />
              </div>
            )}

            {discountPct > 0 && (
              <span className="font-mono-tech absolute top-2.5 right-2.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-[#E09A3B]/45 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#F4BA63] shadow-md">
                {discountPct}% OFF
              </span>
            )}
          </div>
        </Link>

        {/* Card Title & Summary */}
        <div className="mt-5">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="block focus-visible:outline-none"
          >
            <h3 className="font-display text-lg sm:text-[19px] font-extrabold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-[#C87E20] dark:text-zinc-50 dark:group-hover:text-[#F0A847]">
              {service.title}
            </h3>
          </Link>

          {desc && (
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
              {desc}
            </p>
          )}
        </div>

        {/* Tactile Deliverable Feature Chips */}
        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1 rounded-lg bg-white/65 dark:bg-white/[0.04] border border-white/80 dark:border-white/[0.07] px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-[2px_2px_5px_rgba(160,175,198,0.28),-2px_-2px_5px_rgba(255,255,255,0.8)] dark:shadow-none"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[#E09A3B]" />
                <span className="truncate max-w-[190px]">{feat}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recessed Bottom Pricing & Action Dock */}
      <div className="relative z-10 mt-6 neo-inset px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3 w-3 text-[#E09A3B] shrink-0" />
            <span className="truncate">{service.duration}</span>
          </span>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-display text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
              ₹{offerPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[11px] font-semibold text-zinc-400 line-through">
                ₹{service.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          className="neo-cta-gold shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold"
        >
          <span>Explore</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}

/* ============================================================================
   4. SCROLL-DRIVEN 4-STEP DELIVERY PIPELINE
   Links scroll position to an illuminated amber-gold progress spine across 4
   extruded neomorphic execution pods.
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
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 lg:py-20"
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="neo-orb inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#C87E20] dark:text-[#F0A847]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#E09A3B]" />
          Execution Protocol
        </span>
        <h2 className="font-display mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          From Checkout to <span className="gold-text">Production Delivery</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Every cohort seat, resume review, and software engagement follows a
          transparent four-stage pipeline.
        </p>
      </motion.div>

      <div className="relative mt-14">
        {/* Desktop Recessed Connector Track + Scroll-Driven Gold Beam */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-11 left-[10%] right-[10%] h-2.5 rounded-full neo-inset overflow-hidden"
        >
          <motion.div
            style={prefersReduced ? undefined : { scaleX: smoothLine }}
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#E09A3B] via-[#F4BC68] to-[#C87E20] shadow-[0_0_16px_rgba(224,154,59,0.65)]"
          />
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERY_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={prefersReduced ? false : { opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={prefersReduced ? undefined : { y: -6 }}
                className="relative flex flex-col items-start"
              >
                {/* Extruded Step Node Orb */}
                <div className="relative z-10 mb-5 flex items-center gap-3 lg:mx-auto">
                  <div className="neo-extruded grid h-20 w-20 place-items-center rounded-3xl">
                    <div className="neo-inset grid h-12 w-12 place-items-center rounded-2xl text-[#E09A3B]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Extruded Step Card */}
                <div className="neo-extruded neo-extruded-interactive w-full flex-1 p-6">
                  <span className="font-mono-tech text-[10px] font-extrabold tracking-[0.2em] text-[#E09A3B]">
                    {item.code}
                  </span>
                  <h3 className="font-display mt-2 text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
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
    </section>
  );
}
