import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Star,
  PlayCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Laptop,
  Briefcase,
  Users,
  Code2,
  Cloud,
  ChevronDown,
  ShieldCheck,
  Send,
  Building2,
  ExternalLink,
  Award,
  Headphones,
  Infinity as InfinityIcon,
} from "lucide-react";
import {
  COMPANY,
  STATS,
  WHY_US,
  PARTNERS,
  COURSES,
  EVENTS,
  TESTIMONIALS,
  BLOG,
  FAQS,
} from "@/lib/site-data";
import { listEvents, type EventDTO } from "@/lib/events-api";
import { listCourses, type CourseDTO } from "@/lib/courses-api";
import {
  listTestimonials,
  listFaqs,
  listBlogs,
  type TestimonialDTO,
  type FAQDTO,
  type BlogDTO,
} from "@/lib/content-api";
import { StatCounter } from "@/components/site/StatCounter";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { CompanyLogosMarquee } from "@/components/site/CompanyLogosMarquee";
import { LearnerCarouselCards } from "@/components/site/LearnerCarouselCards";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { Magnet } from "@/components/react-bits/Magnet";
import { ShinyText } from "@/components/react-bits/ShinyText";
import { DepthCarousel } from "@/components/react-bits/DepthCarousel";
import { AccordionGallery } from "@/components/react-bits/AccordionGallery";
import { FlexCarousel } from "@/components/react-bits/FlexCarousel";
import { ScrollExpand } from "@/components/react-bits/ScrollExpand";
import { ScrollVelocity } from "@/components/react-bits/ScrollVelocity";
import { MaskedHeading } from "@/components/react-bits/MaskedHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRI CUBE Digital Solutions — Next-Gen IT Training, Internships & Software" },
      {
        name: "description",
        content:
          "Live cohort IT training, authentic client-grade internships, verified certificates, and enterprise digital solutions. Learn Full Stack, Python, AI, Cloud and more at TRI CUBE.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-[#FFFFFF] text-zinc-900 selection:bg-[#E09A3B]/20 selection:text-[#E09A3B] dark:bg-zinc-950 dark:text-zinc-100">
      {/* 1. Full-Viewport 5-Slide Hero (with SwarmCursor & CircularText) */}
      <HeroSlideshow />

      {/* 2. Hiring & Network Partners Infinite Marquee */}
      <CompanyLogosMarquee />

      {/* 2b. Kinetic Typography ScrollVelocity Banner */}
      <KineticVelocityBanner />

      {/* 3. Core Impact Metrics (Stats) */}
      <ImpactStats />

      {/* 4. Why TriCube — Pillars of Excellence (with MaskedHeading) */}
      <WhyTriCubeSection />

      {/* 5. Flagship Programs & Courses with Filter Tabs */}
      <PopularCoursesSection />

      {/* 6. Client-Grade Production Internships Spotlight (with DepthCarousel) */}
      <InternshipSpotlight />

      {/* 7. Live Cohorts, Bootcamps & Workshops (Events) */}
      <UpcomingEventsSection />

      {/* 8. Enterprise Digital Solutions Showcase */}
      <EnterpriseServicesShowcase />

      {/* 9. Verified Student & Alumni Testimonials */}
      <TestimonialsSection />

      {/* 10. Engineering Insights & Blog */}
      <LatestBlogSection />

      {/* 11. Campus & Platform Moments (with FlexCarousel & Gallery) */}
      <CampusGallerySection />

      {/* 12. Interactive Knowledge Hub / FAQ */}
      <FAQAccordionSection />

      {/* 13. Newsletter & Campus Location */}
      <NewsletterAndCampusMap />
    </div>
  );
}

/* =========================================================================
   2b. Kinetic Typography ScrollVelocity Banner
   ========================================================================= */
function KineticVelocityBanner() {
  return (
    <div className="w-full py-6 border-b border-zinc-100 bg-[#FFFFFF] dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden">
      <ScrollVelocity
        texts={[
          "LIVE COHORT TRAINING • IN-BROWSER CLOUD IDE •",
          "CLIENT SPRINT INTERNSHIPS • VERIFIED CREDENTIALS •",
        ]}
        velocity={65}
        fontSize={32}
        fontWeight={900}
        color="#E09A3B"
        skewWithVelocity={10}
        scaleWithVelocity={0.1}
        outlineAlternate
        fadeEdges
        pauseOnHover
        draggable
        gap={28}
      />
    </div>
  );
}

/* =========================================================================
   3. Core Impact Metrics (Stats)
   ========================================================================= */
function ImpactStats() {
  const statsMeta = [
    { label: "Graduated Engineers", desc: "Equipped with live capstones", icon: Users },
    { label: "Curricula Delivered", desc: "Updated for 2026 tech stacks", icon: Code2 },
    { label: "Hiring Tech Partners", desc: "Actively recruiting our talent", icon: Briefcase },
    { label: "Placement Rate", desc: "Dedicated career support cell", icon: ShieldCheck },
  ];

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, index) => {
          const Icon = statsMeta[index]?.icon || Users;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
              className="neo-card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B] shadow-[inset_2px_2px_4px_rgba(224,154,59,0.2)]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full dark:bg-emerald-950/40 dark:text-emerald-400">
                  Verified
                </span>
              </div>

              <div className="mt-6">
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight gold-text">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {s.label}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  {statsMeta[index]?.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================================
   4. Why TriCube Section (with MaskedHeading)
   ========================================================================= */
const WHY_US_ICONS: Record<string, typeof Users> = {
  "Industry Mentors": Users,
  "Live Projects": Code2,
  "Placement Support": Briefcase,
  "Lifetime Access": InfinityIcon,
  "Verified Certificates": Award,
  "1:1 Doubt Clearing": Headphones,
};

function WhyTriCubeSection() {
  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
          <Sparkles className="h-3.5 w-3.5" />
          The TriCube Advantage
        </span>
        <MaskedHeading
          tag="h2"
          text="Engineered to Turn Learners into Industry Leaders"
          src="/lms/lms-course-player.jpg"
          tint="#E09A3B"
          reveal="rise"
          trigger="view"
          stagger={0.03}
          duration={0.9}
          parallax={24}
          spotlight
          spotlightRadius={260}
          outline
          outlineColor="rgba(46, 165, 161, 0.45)"
          outlineWidth={1.2}
          className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl leading-tight dark:text-zinc-100"
        />
        <p className="mt-4 text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
          We strip away obsolete theoretical lectures. Learn by actively writing code, participating in sprint reviews, and deploying scalable applications with industry mentors.
        </p>
      </div>

      {/* 3 Vertical Rectangular Auto-Playing Image Carousel Cards */}
      <LearnerCarouselCards />
    </section>
  );
}

/* =========================================================================
   5. Flagship Programs & Courses Section with Category Filtering
   ========================================================================= */
const INITIAL_COURSES: CourseDTO[] = COURSES.map((c, idx) => ({
  id: idx + 1,
  slug: c.slug,
  title: c.title,
  category: c.category,
  trainer: c.trainer,
  level: c.level,
  duration: c.duration,
  price: c.price,
  rating: c.rating,
  students: c.students,
  thumbnailUrl: c.thumbnailUrl,
  published: true,
  description: "Comprehensive cohort-based program with live mentorship, real capstone projects, and mentor code reviews.",
  syllabus: [],
  highlights: ["Live Projects", "Verified Certificate", "Placement Support"],
}));

function PopularCoursesSection() {
  const [courses, setCourses] = useState<CourseDTO[]>(INITIAL_COURSES);
  const [activeTab, setActiveTab] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    listCourses()
      .then((data) => {
        if (data && data.length > 0) {
          setCourses(data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ["All", "Programming", "Web", "Data", "AI"];

  const filteredCourses = courses.filter((c) => {
    if (activeTab === "All") return true;
    return c.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.35;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Code2 className="h-3.5 w-3.5" />
            Curated Programs
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            Skills That Companies <span className="gold-text">Hire For</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl dark:text-zinc-400">
            Select a learning track to view syllabus, live schedule, and hands-on capstone details.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === cat
                  ? "bg-[#E09A3B] text-white shadow-[0_4px_14px_rgba(224,154,59,0.4)]"
                  : "bg-white text-zinc-600 shadow-[2px_2px_6px_rgba(200,208,220,0.35),-2px_-2px_6px_rgba(255,255,255,0.95)] border border-zinc-200/60 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Manual Scroll Track (No Arrows, Exact Cards) */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="mt-10 -mx-2 px-2 py-4 flex items-stretch gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {filteredCourses.map((c, index) => {
          const imgSrc = c.thumbnailUrl || `/images/courses/${c.slug}.svg`;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, x: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.06, 0.25),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="neo-card shrink-0 w-[85vw] sm:w-[340px] lg:w-[370px] snap-start flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              {/* Thumbnail Header */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={imgSrc}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
                {/* Status pill overlay */}
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-zinc-800 shadow-sm backdrop-blur-md">
                  Live Cohort
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#E09A3B]" />
                      {c.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#E09A3B]" />
                      Mentor: {c.trainer}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-zinc-900 group-hover:text-[#E09A3B] transition-colors dark:text-zinc-100">
                    {c.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {c.description || "Comprehensive hands-on training with real capstone projects and mentor code reviews."}
                  </p>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      Tuition
                    </div>
                    <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                      ₹{c.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <Link
                    to="/courses"
                    className="neo-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/courses"
          className="neo-btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
        >
          <span>View All 40+ Certified Courses</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* =========================================================================
   6. Authentic Production Internships Spotlight (with AccordionGallery)
   ========================================================================= */
const INTERNSHIP_ACCORDION_ITEMS = [
  {
    image: "/lms/lms-collaboration.jpg",
    label: "Daily Agile Standups & Sprint Planning",
    alt: "Agile Sprint Board & Peer PR Reviews",
  },
  {
    image: "/lms/lms-coding-lab.jpg",
    label: "Cloud IDE & Automated Unit Testing",
    alt: "Cloud IDE & Automated Unit Testing",
  },
  {
    image: "/lms/lms-ai-solutions.jpg",
    label: "AI & Enterprise Microservices Delivery",
    alt: "AI & Enterprise Microservices Delivery",
  },
  {
    image: "/lms/lms-live-classroom.jpg",
    label: "Strict Senior Architect PR Reviews",
    alt: "Mentor-Led Architecture Teardowns",
  },
  {
    image: "/lms/lms-course-player.jpg",
    label: "Live Client Production Deployments",
    alt: "Production Client Dashboard Delivery",
  },
  {
    image: "/lms/lms-certificate.jpg",
    label: "Verified Experience Letter & LOR",
    alt: "QR-Verifiable Internship Credential",
  },
];

function InternshipSpotlight() {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20">
      <div className="neo-card p-8 sm:p-12 lg:p-16 relative overflow-hidden bg-gradient-to-br from-white via-[#FCFDFE] to-[#F8F9FA] dark:from-zinc-900 dark:to-zinc-950">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[rgba(224,154,59,0.08)] blur-3xl" />

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
              <Briefcase className="h-3.5 w-3.5" />
              Workplace Experience
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl leading-tight dark:text-zinc-100">
              Real Client Internships. <br />
              <span className="gold-text">Not Toy Practice Code.</span>
            </h2>
            <p className="mt-4 text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
              The primary reason fresh graduates struggle in tech interviews is zero real-world delivery experience. At TriCube, you spend 8 weeks embedded in active client projects under experienced tech leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/courses"
              className="neo-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold"
            >
              <span>Apply for Internship</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/gallery"
              className="neo-btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold"
            >
              <span>View Past Deliveries</span>
            </Link>
          </div>
        </div>

        {/* Interactive 3D AccordionGallery Showcase */}
        <div className="mt-10 rounded-3xl bg-zinc-950/95 p-3 sm:p-4 shadow-[10px_14px_30px_rgba(200,208,220,0.45),-10px_-10px_30px_rgba(255,255,255,0.95)] border border-[rgba(224,154,59,0.28)] overflow-hidden">
          <AccordionGallery
            items={INTERNSHIP_ACCORDION_ITEMS}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            height={460}
            gap={10}
            radius={18}
            accentColor="#E09A3B"
            overlayColor="#060010"
            textColor="#ffffff"
            grayscale
            showLabels
          />
        </div>

        <div className="mt-3 px-2 w-full flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>Production Sprint #14 · Interactive 3D Accordion Gallery</span>
          <span className="text-[#E09A3B] font-bold">● Hover or Click Panels to Expand</span>
        </div>

        {/* 4 Core Internship Pillars */}
        <div className="mt-10 pt-8 border-t border-zinc-200/70 dark:border-zinc-800 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.15)] text-[#E09A3B] mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Daily Agile Standups</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Experience genuine Scrum workflows and sprint planning.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.15)] text-[#E09A3B] mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Strict PR Reviews</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Senior architects review and critique every commit before merge.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.15)] text-[#E09A3B] mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Verified Experience Letter</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Official Letter of Recommendation (LOR) recognized by HRs.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.15)] text-[#E09A3B] mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Live Client Showcase</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Ship features that real paying users interact with.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. Live Cohorts & Upcoming Events
   ========================================================================= */
const INITIAL_EVENTS: EventDTO[] = EVENTS.map((e, idx) => ({
  id: -(idx + 1),
  slug: e.slug,
  title: e.title,
  description: e.description,
  bannerUrl: e.banner,
  date: e.date,
  time: e.time,
  venue: e.venue,
  status: e.status as EventDTO["status"],
  published: true,
}));

function UpcomingEventsSection() {
  const [events, setEvents] = useState<EventDTO[]>(INITIAL_EVENTS);

  useEffect(() => {
    listEvents()
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {});
  }, []);

  const items = events.slice(0, 3);

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Calendar className="h-3.5 w-3.5" />
            Live Learning
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            Workshops, Bootcamps & <span className="gold-text">Hackathons</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl dark:text-zinc-400">
            Join weekend intensives and community hackathons hosted by industry architects.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E09A3B] hover:underline"
        >
          <span>All Upcoming Events</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
        {items.map((e) => (
          <div
            key={e.slug}
            className="neo-card flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
              {e.bannerUrl ? (
                <img
                  src={e.bannerUrl}
                  alt={e.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#E09A3B] to-[#C88225] flex items-center justify-center p-6 text-white text-center font-bold">
                  {e.title}
                </div>
              )}

              {/* Status Badge */}
              <span
                className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                  e.status === "live"
                    ? "bg-rose-500 text-white animate-pulse"
                    : e.status === "upcoming"
                    ? "bg-[#E09A3B] text-white"
                    : "bg-zinc-700 text-zinc-200"
                }`}
              >
                {e.status}
              </span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E09A3B]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(e.date).toDateString()} · {e.time}</span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-zinc-900 group-hover:text-[#E09A3B] transition-colors dark:text-zinc-100">
                  {e.title}
                </h3>

                <p className="mt-2 text-xs flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E09A3B]" />
                  <span className="truncate">{e.venue}</span>
                </p>

                <p className="mt-3 text-xs text-zinc-600 line-clamp-3 leading-relaxed dark:text-zinc-400">
                  {e.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  to="/events"
                  className="neo-btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                >
                  <span>Reserve Free Seat</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   8. Enterprise Digital Solutions Showcase (Vertical Upward & Downward Scroll)
   ========================================================================= */
const ENTERPRISE_FEATURES = [
  {
    icon: Code2,
    title: "Custom Web & SaaS Platforms",
    desc: "React, Next.js, Spring Boot, and Node.js microservices engineered for high concurrency.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure & DevOps",
    desc: "AWS / GCP cloud architectures, automated CI/CD pipelines, Docker containerization, and monitoring.",
  },
  {
    icon: Users,
    title: "Corporate Engineering Training",
    desc: "Tailored multi-week bootcamps upskilling client engineering teams in modern AI and cloud tools.",
  },
];

function EnterpriseServicesShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth vertical upward & downward scroll movement as the user scrolls up and down
  const leftColumnY = useTransform(scrollYProgress, [0, 0.5, 1], [48, 0, -48]);
  const rightImageY = useTransform(scrollYProgress, [0, 0.5, 1], [-56, 0, 56]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 44, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="neo-card p-8 sm:p-12 lg:p-16 bg-[#FFFFFF] dark:bg-zinc-900 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Text & Features with Vertical Up/Down Scroll Animation */}
          <motion.div style={{ y: leftColumnY }} className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]"
            >
              <Laptop className="h-3.5 w-3.5" />
              Software Engineering & IT
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
              className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl leading-tight dark:text-zinc-100"
            >
              Custom Digital Solutions <br />
              <span className="gold-text">for Modern Enterprises</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="mt-4 text-base text-zinc-600 leading-relaxed dark:text-zinc-400"
            >
              Beyond career training, TriCube acts as an engineering partner for startups and growing enterprises. We architect custom SaaS web applications, mobile platforms, and provide dedicated corporate engineering upskilling.
            </motion.p>

            <div className="mt-8 space-y-4">
              {ENTERPRISE_FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.16 + idx * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-3.5"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{feat.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/services"
                className="neo-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold"
              >
                <span>Explore Enterprise Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="neo-btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold"
              >
                <span>Request Project Proposal</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Girl Image with Vertical Upward & Downward Animation */}
          <motion.div
            style={{ y: rightImageY }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [-14, 14, -14] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full max-w-md lg:max-w-lg rounded-3xl bg-white p-3 sm:p-4 shadow-[12px_16px_36px_rgba(200,208,222,0.45),-12px_-12px_36px_rgba(255,255,255,0.95)] border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700"
            >
              <div className="relative aspect-[4/4] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <img
                  src="/learners/learner-5.jpg"
                  alt="TriCube Learner & Engineering Partner"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   9. Student Testimonials Section
   ========================================================================= */
const INITIAL_TESTIMONIALS: TestimonialDTO[] = TESTIMONIALS.map((t, idx) => ({
  id: idx + 1,
  name: t.name,
  role: t.role,
  quote: t.quote,
  rating: t.rating,
  published: true,
}));

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    listTestimonials()
      .then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(() => {});
  }, []);

  const items = testimonials;

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
          <Star className="h-3.5 w-3.5 fill-[#E09A3B]" />
          Alumni Stories
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
          Careers, Reshaped with <span className="gold-text">TriCube</span>
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          Real feedback from engineers who broke into high-growth tech roles after graduating our cohorts.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="neo-card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
          >
            <div>
              <div className="flex gap-1 text-[#E09A3B]">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#E09A3B]" />
                ))}
              </div>
              <p className="mt-4 text-sm text-zinc-700 italic leading-relaxed dark:text-zinc-300">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-3 dark:border-zinc-800">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#E09A3B] to-[#C88225] text-white font-bold text-xs shadow-md">
                {t.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.name}</h4>
                <p className="text-xs font-semibold text-[#E09A3B]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   10. Engineering Insights & Blog
   ========================================================================= */
const INITIAL_BLOGS: BlogDTO[] = BLOG.map((b, idx) => ({
  id: idx + 1,
  slug: b.slug,
  title: b.title,
  excerpt: b.excerpt,
  content: b.excerpt,
  coverUrl: b.cover,
  category: b.category,
  createdAt: b.date,
  authorName: "TriCube Engineering",
  published: true,
}));

function LatestBlogSection() {
  const [blogs, setBlogs] = useState<BlogDTO[]>(INITIAL_BLOGS);

  useEffect(() => {
    listBlogs()
      .then((data) => {
        if (data && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(() => {});
  }, []);

  const posts = blogs.slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Code2 className="h-3.5 w-3.5" />
            Engineering Playbooks
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            Fresh Guides & <span className="gold-text">Career Playbooks</span>
          </h2>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E09A3B] hover:underline"
        >
          <span>All Playbooks</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
        {posts.map((post) => {
          const coverSrc = post.coverUrl || `/images/blog/${post.slug}.svg`;
          return (
            <article
              key={post.id}
              className="neo-card flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={coverSrc}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <span className="rounded-full bg-[rgba(224,154,59,0.12)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E09A3B]">
                    {post.category}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-zinc-900 group-hover:text-[#E09A3B] transition-colors leading-snug dark:text-zinc-100">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600 line-clamp-3 leading-relaxed dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 dark:border-zinc-800">
                  <span>{post.createdAt ? new Date(post.createdAt).toDateString() : "Updated 2026"}</span>
                  <Link
                    to="/blog"
                    className="font-bold text-[#E09A3B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================================
   11. Campus & Platform Moments (with FlexCarousel & Gallery)
   ========================================================================= */
const CAMPUS_FLEX_ITEMS = [
  {
    src: "/lms/lms-course-player.jpg",
    title: "Interactive LMS Course Player",
    subtitle: "HD Mentor Lectures & Notes",
    aspectRatio: 1.4,
  },
  {
    src: "/lms/lms-coding-lab.jpg",
    title: "Cloud Coding Lab",
    subtitle: "Browser IDE & Test Suites",
    aspectRatio: 1.4,
  },
  {
    src: "/lms/lms-live-classroom.jpg",
    title: "Live Virtual Classrooms",
    subtitle: "Real-Time Architecture Sessions",
    aspectRatio: 1.4,
  },
  {
    src: "/lms/lms-collaboration.jpg",
    title: "Client Sprint Delivery",
    subtitle: "Agile Boards & PR Reviews",
    aspectRatio: 1.4,
  },
  {
    src: "/showcase/platform-hero.png",
    title: "Enterprise SaaS Engineering",
    subtitle: "Production Web Platforms",
    aspectRatio: 1.4,
  },
  {
    src: "/lms/lms-certificate.jpg",
    title: "Verified Credentials",
    subtitle: "Tamper-Proof QR Certificates",
    aspectRatio: 1.4,
  },
];

function CampusGallerySection() {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
            <Sparkles className="h-3.5 w-3.5" />
            Campus & Platform Showcase
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
            Moments from the <span className="gold-text">TriCube Campus</span>
          </h2>
        </div>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E09A3B] hover:underline"
        >
          <span>View Campus Gallery</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Interactive WebGL Liquid Lens FlexCarousel */}
      <div className="mt-10 h-[440px] sm:h-[500px] w-full neo-card overflow-hidden p-2">
        <FlexCarousel
          items={CAMPUS_FLEX_ITEMS}
          preset="liquid"
          intro="rise"
          cardHeight={0.58}
          gap={16}
          radius={18}
          squeeze={0.2}
          liquid={0.65}
          dispersion={0.35}
          focusOnClick
          captions
          autoplay
          interval={3.5}
        />
      </div>
    </section>
  );
}

/* =========================================================================
   12. Interactive FAQ Section
   ========================================================================= */
const INITIAL_FAQS: FAQDTO[] = FAQS.map((f, idx) => ({
  id: idx + 1,
  question: f.q,
  answer: f.a,
  category: "Admissions",
  position: idx + 1,
  published: true,
}));

function FAQAccordionSection() {
  const [faqs, setFaqs] = useState<FAQDTO[]>(INITIAL_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    listFaqs()
      .then((data) => {
        if (data && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch(() => {});
  }, []);

  const items = faqs;

  return (
    <section className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-20 py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
          Help & Guidance
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          Frequently <span className="gold-text">Asked Questions</span>
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Everything you need to know about our courses, internships, and admissions.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.id}
              className="neo-card overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {item.question}
                </span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full bg-[#FFFFFF] shadow-[2px_2px_6px_rgba(200,208,220,0.35),-2px_-2px_6px_rgba(255,255,255,0.95)] border border-zinc-200/50 text-[#E09A3B] transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-[#E09A3B] text-white" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 sm:px-6 pb-6 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {item.answer}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================================
   13. Newsletter & Campus Location Section
   ========================================================================= */
function NewsletterAndCampusMap() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 pb-24">
      {/* Newsletter Box */}
      <div className="neo-card p-8 sm:p-12 mb-12 text-center bg-gradient-to-br from-white via-[#FCFDFE] to-[#F9FAFB] dark:from-zinc-900 dark:to-zinc-950 relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(224,154,59,0.12)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
          Stay in the Loop
        </span>
        <h3 className="mt-3 text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight dark:text-zinc-100">
          Subscribe to the <span className="gold-text">TriCube Tech Dispatch</span>
        </h3>
        <p className="mt-2 text-sm text-zinc-600 max-w-lg mx-auto dark:text-zinc-400">
          Receive syllabus updates, free weekend masterclasses, and curated developer playbooks twice a month.
        </p>

        {subscribed ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            Thank you! You are subscribed to our developer dispatch.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full sm:flex-1 rounded-full border border-zinc-200 bg-white px-5 py-3.5 text-sm outline-none focus:border-[#E09A3B] focus:ring-2 focus:ring-[#E09A3B]/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.04)] dark:bg-zinc-800 dark:border-zinc-700"
            />
            <button
              type="submit"
              className="neo-btn-primary w-full sm:w-auto px-7 py-3.5 text-sm font-bold shrink-0 flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Campus Map & Direct Contact Card */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-5 neo-card p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
              Campus Experience
            </span>
            <h3 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Visit Our Innovation Campus
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Meet mentors, tour our high-tech labs, and attend an interactive counseling session.
            </p>

            <div className="mt-6 space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#E09A3B] mt-0.5" />
                <span className="text-zinc-700 dark:text-zinc-300 leading-snug">{COMPANY.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-[#E09A3B]" />
                <span className="text-zinc-700 dark:text-zinc-300">{COMPANY.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center text-sm font-bold text-[#E09A3B]">📞</span>
                <span className="text-zinc-700 dark:text-zinc-300">{COMPANY.phone}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              to="/contact"
              className="neo-btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-bold"
            >
              <span>Schedule In-Person Campus Visit</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="md:col-span-7 neo-card p-3 overflow-hidden min-h-[340px]">
          <iframe
            title="TriCube Bengaluru Campus Location"
            className="h-full min-h-[320px] w-full rounded-2xl border-0"
            src="https://www.google.com/maps?q=Bengaluru&output=embed"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
