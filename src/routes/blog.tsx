import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "The Future of Web Development in 2026",
    category: "Technology",
    date: "Sep 10, 2026",
    readTime: "5 min",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "How AI is Transforming Education",
    category: "AI",
    date: "Sep 5, 2026",
    readTime: "7 min",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "UI/UX Design Trends to Watch",
    category: "Design",
    date: "Aug 28, 2026",
    readTime: "4 min",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Building a Career in Data Science",
    category: "Career",
    date: "Aug 20, 2026",
    readTime: "6 min",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
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
              Blog
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Our Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Insights, tutorials, and updates from our team.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div
                    className={`h-40 bg-gradient-to-br ${p.gradient} transition-transform duration-500 group-hover:scale-105`}
                  />
                  <CardContent className="p-5">
                    <Badge variant="teal" className="mb-2 text-xs">
                      {p.category}
                    </Badge>
                    <h3 className="font-heading text-base font-semibold text-navy line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {p.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.readTime}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 px-0">
                      Read More <ArrowRight className="h-3 w-3" />
                    </Button>
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
