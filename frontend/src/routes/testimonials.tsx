import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    text: "TRI CUBE transformed my career. The web development bootcamp gave me the skills and confidence to land my dream job.",
    rating: 5,
  },
  {
    name: "Rahul Patel",
    role: "UI/UX Designer at Microsoft",
    text: "The design program was exceptional. Real-world projects, amazing mentors, and a supportive community.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    role: "Data Scientist at Amazon",
    text: "From zero to data science hero in 16 weeks. The curriculum is perfectly structured for practical learning.",
    rating: 5,
  },
  {
    name: "Vikram Kumar",
    role: "Marketing Lead at Flipkart",
    text: "The digital marketing course was comprehensive and practical. I saw results within weeks of implementing what I learned.",
    rating: 5,
  },
  {
    name: "Meera Nair",
    role: "Full Stack Developer at Startup",
    text: "Best investment in my career. The instructors are approachable and the curriculum is always up-to-date.",
    rating: 5,
  },
  {
    name: "Arjun Singh",
    role: "Cloud Architect at AWS",
    text: "The cloud computing program prepared me perfectly for AWS certifications. Highly recommend!",
    rating: 5,
  },
];

export const Route = createFileRoute("/testimonials")({
  component: TestimonialsPage,
});

function TestimonialsPage() {
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
              Testimonials
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Student Stories
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Real stories from real students who transformed their careers.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-teal/20" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-teal text-teal" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 font-heading text-sm font-bold text-teal">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
