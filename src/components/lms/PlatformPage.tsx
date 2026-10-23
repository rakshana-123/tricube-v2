import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { TrustedBy, Features, Benefits, HowItWorks } from "./Sections";
import { CourseCatalog } from "./CourseCatalog";
import { DashboardShowcase } from "./DashboardShowcase";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { CTA, Footer } from "./CTAFooter";

/**
 * PlatformPage — the TRI CUBE LMS product website per the design spec:
 * white primary surface, teal #2EA5A1 interaction (dark teal #247F7C for
 * text-bearing fills), navy #0E263A text/dark sections, warm neutrals
 * #F8F6F4 / #E8E1DD / #6B625D, Plus Jakarta Sans, 1280px grid,
 * single reveal easing [0.22, 1, 0.36, 1].
 */
export function PlatformPage() {
  const reduce = useReducedMotion();

  /* Smooth anchor scrolling, disabled under reduced motion (spec §36). */
  useEffect(() => {
    if (reduce) return;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, [reduce]);

  return (
    <div className="bg-white font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-[#0E263A] antialiased">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Benefits />
        <CourseCatalog />
        <DashboardShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
