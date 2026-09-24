import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Code, Palette, BarChart3, Megaphone, Shield, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const services = [
  {
    icon: Code,
    title: "Web Development",
    desc: "Full-stack development courses from React to Node.js, with real-world projects.",
    price: "₹9,999",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    desc: "Master design thinking, Figma, and create stunning user experiences.",
    price: "₹7,999",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    desc: "Python, ML, AI, and analytics to become a data-driven professional.",
    price: "₹12,999",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "SEO, social media, content marketing, and growth strategies.",
    price: "₹5,999",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    desc: "Ethical hacking, security auditing, and digital protection.",
    price: "₹11,999",
  },
  {
    icon: Rocket,
    title: "Cloud Computing",
    desc: "AWS, Azure, and GCP certifications and hands-on labs.",
    price: "₹10,999",
  },
];

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-block rounded-full bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              Services
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Comprehensive digital education services designed to transform careers and businesses.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:border-teal/20"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 transition-colors group-hover:bg-teal">
                  <s.icon className="h-6 w-6 text-teal transition-colors group-hover:text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-heading text-2xl font-bold text-teal">{s.price}</span>
                  <Button variant="teal" size="sm" asChild>
                    <Link to="/contact">Enroll Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
