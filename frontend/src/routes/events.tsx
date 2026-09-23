import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    title: "Web Dev Workshop",
    date: "Oct 15, 2026",
    time: "10:00 AM",
    location: "Online",
    attendees: "500+",
    type: "Workshop",
  },
  {
    title: "AI/ML Summit",
    date: "Nov 5, 2026",
    time: "9:00 AM",
    location: "Hyderabad",
    attendees: "1000+",
    type: "Conference",
  },
  {
    title: "Design Sprint",
    date: "Nov 20, 2026",
    time: "2:00 PM",
    location: "Online",
    attendees: "300+",
    type: "Hackathon",
  },
  {
    title: "Career Fair",
    date: "Dec 1, 2026",
    time: "11:00 AM",
    location: "Bangalore",
    attendees: "2000+",
    type: "Networking",
  },
];

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

function EventsPage() {
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
              Events
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Upcoming Events
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Join our workshops, conferences, and networking events.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="space-y-6">
            {events.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-center">
                  <div>
                    <div className="font-heading text-lg font-bold text-teal">
                      {e.date.split(",")[0].split(" ")[0]}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {e.date.split(",")[0].split(" ")[1]}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold text-navy">{e.title}</h3>
                    <Badge variant="teal" className="text-xs">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {e.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {e.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {e.attendees}
                    </span>
                  </div>
                </div>
                <Button variant="teal" size="sm" className="shrink-0">
                  Register
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
