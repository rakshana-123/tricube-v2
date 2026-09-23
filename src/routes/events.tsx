import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { MapPin } from "lucide-react";
import { listEvents, type EventDTO } from "@/lib/events-api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Bootcamps, hackathons, workshops and career summits â€” hosted by TRI CUBE." },
      { property: "og:title", content: "TRI CUBE Events" },
      { property: "og:description", content: "Bootcamps, hackathons and workshops." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  useEffect(() => { listEvents().then(setEvents).catch(() => setEvents([])); }, []);
  return (
    <>
      <PageHero eyebrow="Events" title={<>Bootcamps, hackathons & <span className="teal-text">meetups</span></>} subtitle="Level up in a weekend. Meet mentors, ship projects, meet recruiters." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map(e => (
            <div key={e.slug} className="glass overflow-hidden rounded-2xl">
              <div className="relative aspect-video overflow-hidden">
                {e.bannerUrl ? <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[var(--gradient-gold)]/20" />}
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${e.status === 'live' ? 'bg-destructive text-destructive-foreground' : e.status === 'upcoming' ? 'bg-[var(--gradient-gold)] text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{e.status}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{new Date(e.date).toDateString()} Â· {e.time}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.venue}</p>
                <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
                {e.registrationUrl
                  ? <a href={e.registrationUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground">Register</a>
                  : <button className="mt-4 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground">Register</button>}
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground">No events yet â€” check back soon.</p>}
        </div>
      </section>
    </>
  );
}

