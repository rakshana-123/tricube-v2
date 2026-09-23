import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Features } from "@/components/sections/Features";
import { Benefits } from "@/components/sections/Benefits";
import { CourseCatalog } from "@/components/sections/CourseCatalog";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trial } from "@/components/sections/Trial";
import { FAQ } from "@/components/sections/FAQ";
import { CampusLocation } from "@/components/sections/CampusLocation";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <Benefits />
      <CourseCatalog />
      <HowItWorks />
      <Testimonials />
      <Trial />
      <FAQ />
      <CampusLocation />
      <CTA />
    </>
  );
}
