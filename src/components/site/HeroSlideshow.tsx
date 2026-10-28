import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface HeroSlide {
  id: string
  number: string
  eyebrow: string
  titleLines: string[]
  highlightLine: string
  description: string
  checklist?: string[]
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
  image: string
  imageAlt: string
}

const SLIDES: HeroSlide[] = [
  {
    id: 'empowering-careers',
    number: '01',
    eyebrow: 'EMPOWERING CAREERS',
    titleLines: ['TRI CUBE', 'Digital'],
    highlightLine: 'Solutions.',
    description:
      'Your trusted partner in IT training, live software projects, and career-launching certifications.',
    primaryCta: {
      label: 'Explore Courses',
      href: '/courses',
    },
    secondaryCta: {
      label: 'Get in Touch',
      href: '/contact',
    },
    image: '/hero/slide-1.png',
    imageAlt: 'TRI CUBE Digital Solutions central prism emblem and floating cards',
  },
  {
    id: 'modern-it-skills',
    number: '02',
    eyebrow: 'TRAINING',
    titleLines: ['Modern IT Skills', 'Built for the'],
    highlightLine: 'Real World.',
    description:
      'Master Full-Stack, AI, Cloud, and Cybersecurity with expert-led cohorts designed around what top tech companies actually hire for.',
    checklist: [
      '1-on-1 Live Mentorship',
      'Hands-on Coding Labs',
      'Updated 2025 Curriculum',
      'Flexible Batch Timings',
    ],
    primaryCta: {
      label: 'Browse Courses',
      href: '/courses',
    },
    secondaryCta: {
      label: 'Download Syllabus',
      href: '/materials',
    },
    image: '/hero/slide-2.png',
    imageAlt: 'Student learning Modern IT Skills with floating Full-Stack, AI, Cloud, and Cyber badges',
  },
  {
    id: 'real-projects',
    number: '03',
    eyebrow: 'REAL PROJECTS',
    titleLines: ['Build Real', 'Software. Gain'],
    highlightLine: 'Live Experience.',
    description:
      'Stop building toy apps. Work alongside senior engineers on production-grade client projects, agile sprints, and cloud deployments.',
    checklist: [
      'Agile Sprint Workflows',
      'Production Cloud Deployment',
      'Code Reviews by Seniors',
      'Verified GitHub Portfolio',
    ],
    primaryCta: {
      label: 'View Live Projects',
      href: '/services',
    },
    secondaryCta: {
      label: 'Join Project Hub',
      href: '/contact',
    },
    image: '/hero/slide-3.png',
    imageAlt: 'Engineers collaborating on live software architecture and production deployment',
  },
  {
    id: 'certifications',
    number: '04',
    eyebrow: 'CERTIFICATIONS',
    titleLines: ['Earn Recognised'],
    highlightLine: 'Career Certificates.',
    description:
      'Validate your expertise with industry-verified credentials, global exam preparation, and digital badges that make your resume stand out.',
    checklist: [
      'ISO & Industry Verified',
      'Shareable LinkedIn Credentials',
      'Global Exam Prep Support',
      'Lifetime Verification Portal',
    ],
    primaryCta: {
      label: 'Get Certified',
      href: '/courses',
    },
    secondaryCta: {
      label: 'Verify Certificate',
      href: '/contact',
    },
    image: '/hero/slide-4.png',
    imageAlt: 'Graduate holding TRI CUBE Certificate of Excellence with global verification badges',
  },
  {
    id: 'placements',
    number: '05',
    eyebrow: 'PLACEMENTS',
    titleLines: ['Your Tech Career'],
    highlightLine: 'Starts Here.',
    description:
      'From resume crafting and AI mock interviews to direct referrals across 300+ hiring partners—we stay with you until you sign your offer letter.',
    checklist: [
      '300+ Hiring Partners',
      '1-on-1 Mock Interviews',
      'Resume & LinkedIn Makeover',
      'Dedicated Placement Cell',
    ],
    primaryCta: {
      label: 'Start Your Journey',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Placement Stories',
      href: '/about',
    },
    image: '/hero/slide-5.png',
    imageAlt: 'Tech professional celebrating placement offers with 96% placement rate',
  },
]

const AUTO_ADVANCE_MS = 6500

export function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = SLIDES.length
  const activeSlide = SLIDES[activeIndex]
  const hasChecklist = Boolean(activeSlide.checklist && activeSlide.checklist.length > 0)

  const goToSlide = useCallback(
    (index: number) => {
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides
      setActiveIndex(normalized)
    },
    [totalSlides],
  )

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slideParam = Number(params.get('slide'))
    if (slideParam >= 1 && slideParam <= totalSlides) {
      setActiveIndex(slideParam - 1)
    }
  }, [totalSlides])

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [isPaused, totalSlides])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNext, handlePrev])

  return (
    <section
      aria-label="TRI CUBE Digital Solutions Hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[calc(100dvh-72px)] lg:h-[calc(100dvh-78px)] lg:max-h-[calc(100dvh-78px)] overflow-hidden bg-[#FFFFFF] select-none"
    >
      {/* Right-Side Full-View Artwork (Desktop) — seamlessly connected to the left canvas */}
      <div
        className="hidden lg:flex pointer-events-none absolute inset-y-0 right-0 w-[60%] xl:w-[62%] h-full items-center justify-end overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 96%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 96%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            alt={activeSlide.imageAlt}
            initial={{ opacity: 0, scale: 1.01, x: 14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.99, x: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-contain object-right"
            draggable={false}
          />
        </AnimatePresence>

        {/* Smooth white blend on the left & top edges of the artwork */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-28 xl:w-36 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/90 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent"
        />
      </div>

      {/* Main Single-Screen Content Container */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 sm:px-10 lg:px-16 xl:px-20 py-4 sm:py-5 lg:py-[2.6dvh]">
        {/* Left Column Copy + Checkmarks + CTAs (centered vertically in the available space) */}
        <div className="my-auto w-full lg:max-w-[48%] xl:max-w-[46%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start"
            >
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FDF3E6] border border-[#E09A3B]/25 px-4 py-1.5 mb-[1.6dvh]">
                <span className="h-2 w-2 rounded-full bg-[#E09A3B]" />
                <span className="text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.2em] text-[#E09A3B]">
                  {activeSlide.eyebrow}
                </span>
              </div>

              {/* Main Display Heading — sized to fit 100% inside one screen on all 5 slides */}
              <h1
                className={`font-display font-extrabold tracking-[-0.032em] text-[#081226] leading-[1.05] ${
                  hasChecklist
                    ? 'text-[clamp(2rem,3.3vw,3.25rem)]'
                    : 'text-[clamp(2.35rem,4.1vw,4rem)]'
                }`}
              >
                {activeSlide.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block text-[#E09A3B] mt-0.5">
                  {activeSlide.highlightLine}
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="mt-[1.6dvh] max-w-[530px] text-[clamp(0.92rem,1.02vw,1.06rem)] leading-[1.55] text-[#4A5568] font-normal">
                {activeSlide.description}
              </p>

              {/* Vertical Checkmark List (Slides 02 - 05) */}
              {hasChecklist && activeSlide.checklist && (
                <ul className="mt-[1.6dvh] space-y-[0.85dvh]">
                  {activeSlide.checklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[clamp(0.88rem,0.98vw,1rem)] font-semibold text-[#1E293B]"
                    >
                      <Check
                        className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-[#E09A3B]"
                        strokeWidth={2.75}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Buttons */}
              <div className="mt-[2.2dvh] flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  to={activeSlide.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E09A3B] px-7 sm:px-8 py-3 sm:py-3.5 text-[0.92rem] sm:text-[0.98rem] font-bold text-[#FFFFFF] shadow-[0_12px_28px_-6px_rgba(224,154,59,0.55)] transition-all duration-200 hover:bg-[#cf892b] hover:-translate-y-0.5"
                >
                  <span>{activeSlide.primaryCta.label}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>

                <Link
                  to={activeSlide.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border-[1.75px] border-[#E09A3B] bg-[#FFFFFF] px-7 sm:px-8 py-3 sm:py-3.5 text-[0.92rem] sm:text-[0.98rem] font-bold text-[#1E293B] transition-all duration-200 hover:bg-[#FDF3E6] hover:-translate-y-0.5"
                >
                  {activeSlide.secondaryCta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile / Tablet Artwork Preview */}
          <div className="mt-6 block lg:hidden w-full overflow-hidden rounded-2xl border border-[#E09A3B]/20 bg-[#FFFFFF] shadow-md">
            <img
              src={activeSlide.image}
              alt={activeSlide.imageAlt}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar: Student Avatars Rating (Left), Pagination Dots (Center), Slide Counter (Right) */}
        <div className="relative z-20 mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Student Avatars + 4.9/5 Rating */}
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
              <strong className="font-bold text-[#0F172A]">4.9/5</strong> from 4,200+ students
            </p>
          </div>

          {/* Center Pagination Dots */}
          <div
            role="tablist"
            aria-label="Hero slides"
            className="flex items-center gap-3 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
          >
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${slide.number}: ${slide.eyebrow}`}
                  onClick={() => goToSlide(idx)}
                  className="group relative flex flex-col items-center justify-center py-1 focus:outline-none"
                >
                  {/* Active top indicator bar matching the reference design */}
                  <span
                    className={`mb-1 h-[2.5px] rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 bg-[#0F172A]'
                        : 'w-0 bg-transparent group-hover:w-3.5 group-hover:bg-[#94A3B8]/50'
                    }`}
                  />
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#E09A3B] scale-110'
                        : 'bg-[#CBD5E1] hover:bg-[#94A3B8]'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Bottom-Right Slide Number Counter (01 / 05) */}
          <div className="hidden sm:flex items-baseline gap-1 font-display text-[0.92rem] sm:text-[0.98rem] tracking-[0.08em] text-[#64748B]">
            <span className="font-extrabold text-[#0F172A]">{activeSlide.number}</span>
            <span className="text-[#94A3B8]">/</span>
            <span className="font-semibold text-[#64748B]">05</span>
          </div>
        </div>
      </div>

      {/* Left Navigation Arrow Button */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className={`hidden md:inline-flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-30 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#FFFFFF]/90 text-[#1E293B] shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-200 hover:border-[#E09A3B] hover:text-[#E09A3B] hover:scale-105 ${
          activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-95'
        }`}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
      </button>

      {/* Right Navigation Arrow Button (matches the exact circle '>' button on right edge of reference images) */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden md:inline-flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#FFFFFF]/95 text-[#1E293B] shadow-[0_8px_24px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all duration-200 hover:border-[#E09A3B] hover:text-[#E09A3B] hover:scale-105"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </section>
  )
}

export default HeroSlideshow
