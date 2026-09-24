import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const values = [
  {
    icon: Target,
    title: "Mission",
    desc: "To democratize quality education and empower individuals with skills for the digital economy.",
  },
  {
    icon: Eye,
    title: "Vision",
    desc: "To become India's leading digital education platform, bridging the gap between learning and industry.",
  },
  {
    icon: Heart,
    title: "Values",
    desc: "Excellence, innovation, accessibility, and integrity in everything we teach and do.",
  },
];

const milestones = [
  { year: "2020", title: "Founded", desc: "TRI CUBE Digital Solutions established" },
  { year: "2021", title: "First 1K Students", desc: "Reached our first thousand learners" },
  { year: "2022", title: "50+ Courses", desc: "Expanded to 50+ premium courses" },
  { year: "2023", title: "10K Students", desc: "Crossed 10,000 student milestone" },
  { year: "2024", title: "Industry Partners", desc: "Partnerships with 50+ companies" },
];

function AboutPage() {
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();

  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />
        </div>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-block rounded-full bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              About Us
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Transforming Education
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We believe everyone deserves access to world-class education. Since 2020, we've been
              on a mission to make learning accessible, engaging, and effective.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={missionRef} className="section-padding">
        <div className="container-wide">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={missionVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10">
                  <v.icon className="h-6 w-6 text-teal" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="section-padding bg-muted/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">Our Journey</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div className="font-heading text-3xl font-bold text-teal">{m.year}</div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-navy">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
