import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const courses = [
  {
    title: "Web Development Bootcamp",
    category: "Development",
    duration: "12 weeks",
    students: "2.5K",
    rating: "4.9",
    price: "₹9,999",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "UI/UX Design Mastery",
    category: "Design",
    duration: "8 weeks",
    students: "1.8K",
    rating: "4.8",
    price: "₹7,999",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Data Science & AI",
    category: "Data Science",
    duration: "16 weeks",
    students: "3.2K",
    rating: "4.9",
    price: "₹12,999",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Digital Marketing Pro",
    category: "Marketing",
    duration: "6 weeks",
    students: "1.5K",
    rating: "4.7",
    price: "₹5,999",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Python for Everyone",
    category: "Development",
    duration: "8 weeks",
    students: "4.1K",
    rating: "4.9",
    price: "₹6,999",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Cloud Architecture",
    category: "Cloud",
    duration: "10 weeks",
    students: "1.2K",
    rating: "4.8",
    price: "₹11,999",
    gradient: "from-sky-500 to-blue-600",
  },
];

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
});

function CoursesPage() {
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
              Courses
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Our Courses
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Industry-leading courses designed by experts for real-world impact.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div
                    className={`h-48 bg-gradient-to-br ${c.gradient} transition-transform duration-500 group-hover:scale-105`}
                  />
                  <CardContent className="p-6">
                    <Badge variant="teal" className="mb-3 text-xs">
                      {c.category}
                    </Badge>
                    <h3 className="font-heading text-lg font-semibold text-navy">{c.title}</h3>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {c.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {c.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-teal" />
                        {c.rating}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-teal">{c.price}</span>
                      <Button variant="teal" size="sm">
                        Enroll <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
