import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Code2,
  Briefcase,
  Infinity as InfinityIcon,
  Award,
  Headphones,
  type LucideIcon,
} from "lucide-react";

interface FeatureSlide {
  src: string;
  alt: string;
  title: string;
  body: string;
  icon: LucideIcon;
  objectPosition?: string;
}

interface LearnerCardConfig {
  id: string;
  slides: [FeatureSlide, FeatureSlide];
}

const SYNC_INTERVAL_MS = 6000;
const SCROLL_TRANSITION_SECONDS = 2.0;

const LEARNER_CARDS: LearnerCardConfig[] = [
  {
    id: "card-mentors-projects",
    slides: [
      {
        src: "/learners/learner-1.jpg",
        alt: "Industry Mentors — Learn from engineers actively shipping at product companies",
        title: "Industry Mentors",
        body: "Learn from engineers actively shipping at product companies.",
        icon: Users,
      },
      {
        src: "/learners/learner-2.jpg",
        alt: "Live Projects — Every course ends with a real client-grade capstone",
        title: "Live Projects",
        body: "Every course ends with a real client-grade capstone.",
        icon: Code2,
      },
    ],
  },
  {
    id: "card-placement-lifetime",
    slides: [
      {
        src: "/learners/learner-3.jpg",
        alt: "Placement Support — Resume reviews, mock interviews, and referrals into 120+ partners",
        title: "Placement Support",
        body: "Resume reviews, mock interviews, and referrals into 120+ partners.",
        icon: Briefcase,
      },
      {
        src: "/learners/learner-5.jpg",
        alt: "Lifetime Access — Recordings, notes, and community access forever",
        title: "Lifetime Access",
        body: "Recordings, notes, and community access — forever.",
        icon: InfinityIcon,
      },
    ],
  },
  {
    id: "card-certificates-doubt",
    slides: [
      {
        src: "/learners/learner-4.jpg",
        alt: "Verified Certificates — QR-verifiable certificates recognised by hiring partners",
        title: "Verified Certificates",
        body: "QR-verifiable certificates recognised by hiring partners.",
        icon: Award,
        objectPosition: "object-[50%_75%]",
      },
      {
        src: "/learners/learner-6.jpg",
        alt: "1:1 Doubt Clearing — Personal mentor calls until every concept clicks",
        title: "1:1 Doubt Clearing",
        body: "Personal mentor calls until every concept clicks.",
        icon: Headphones,
      },
    ],
  },
];

interface AutoCarouselCardProps {
  card: LearnerCardConfig;
  index: number;
  step: number;
}

function AutoCarouselCard({ card, index, step }: AutoCarouselCardProps) {
  const currentIndex = step % 2;
  const activeSlide = card.slides[currentIndex];
  const Icon = activeSlide.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-900 shadow-[0_18px_45px_-15px_rgba(24,24,27,0.22),0_4px_16px_-4px_rgba(224,154,59,0.14)] ring-1 ring-zinc-200/80 dark:ring-zinc-800/90 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_28px_60px_-15px_rgba(224,154,59,0.32)] hover:ring-[#E09A3B]/50"
    >
      {/* Preload both images in DOM to prevent any decode flicker */}
      <div className="sr-only" aria-hidden="true">
        <img src={card.slides[0].src} alt="" />
        <img src={card.slides[1].src} alt="" />
      </div>

      {/* Smooth zoom-in effect when hovering over the card */}
      <div className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
        <AnimatePresence initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: "26%", scale: 1.08, zIndex: 20 }}
            animate={{ opacity: 1, y: "0%", scale: 1, zIndex: 20 }}
            exit={{ opacity: 1, y: "-8%", scale: 1.1, zIndex: 10 }}
            transition={{
              duration: SCROLL_TRANSITION_SECONDS,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={activeSlide.src}
              alt={activeSlide.alt}
              className={`h-full w-full object-cover ${
                activeSlide.objectPosition ?? "object-top"
              } select-none`}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top badge bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between p-5 bg-gradient-to-b from-black/60 via-black/20 to-transparent">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#E09A3B]/90 text-zinc-950 shadow-md backdrop-blur-md border border-white/25 transition-transform duration-500 group-hover:scale-110">
          <Icon className="h-5 w-5 stroke-[2.25]" />
        </div>

        <span className="inline-flex items-center rounded-full bg-zinc-950/75 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F5B963] backdrop-blur-md border border-white/15 shadow-sm">
          100% Included
        </span>
      </div>

      {/* Bottom dark gradient overlay with synchronized feature content (no timeline bar) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end bg-gradient-to-t from-zinc-950/95 via-zinc-950/75 to-transparent p-6 pt-28 sm:p-7 sm:pt-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#E09A3B]">
              <span>Standard Feature</span>
              <span>100% Included</span>
            </div>

            <h3 className="mt-2 text-2xl sm:text-[26px] font-extrabold tracking-tight text-white leading-tight group-hover:text-[#F5B963] transition-colors duration-300">
              {activeSlide.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-200/90 leading-relaxed min-h-[2.75rem] line-clamp-2">
              {activeSlide.body}
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span>Standard Feature</span>
              <span className="text-[#E09A3B] font-bold">100% Included</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export function LearnerCarouselCards() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStep((prev) => prev + 1);
    }, SYNC_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3 lg:gap-8">
      {LEARNER_CARDS.map((card, index) => (
        <AutoCarouselCard
          key={card.id}
          card={card}
          index={index}
          step={step}
        />
      ))}
    </div>
  );
}
