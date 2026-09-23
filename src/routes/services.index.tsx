import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { listServices, absoluteMedia, splitFeatures, type ServiceDTO } from "@/lib/services-api";
import { motion } from "framer-motion";
import { Star, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Training, internships, projects and IT services â€” Python, MERN, Data Science, AI, Digital Marketing and more." },
      { property: "og:title", content: "TRI CUBE Services" },
      { property: "og:description", content: "End-to-end training and IT services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [services, setServices] = useState<ServiceDTO[] | null>(null);
  
  useEffect(() => {
    let alive = true;
    listServices().then((r) => { if (alive) setServices(r); });
    return () => { alive = false; };
  }, []);

  return (
    <>
      <PageHero eyebrow="Services" title={<>End-to-end <span className="teal-text">training & IT</span> services</>} subtitle="From your first line of code to your first client project â€” one campus, one team." />
      <section className="mx-auto max-w-7xl px-6 py-20">
        {services && services.length === 0 && (
          <div className="neo-card border-dashed p-12 text-center text-sm text-muted-foreground flex justify-center">
            No services yet. An admin can add one from <span className="font-medium ml-1">/admin/services</span>.
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services || []).map((s, i) => {
            const rating = (s.rating ?? 4.9).toFixed(1);
            const features = splitFeatures(s.features);
            const desc = s.description || features.slice(0, 2).join(" Â· ");
            const img = absoluteMedia(s.imageUrl);
            
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group flex flex-col justify-between neo-card p-6"
              >
                <div>
                  {img ? (
                    <div className="mb-5 aspect-[16/9] overflow-hidden rounded-xl bg-secondary neo-inset">
                      <img src={img} alt={s.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]" />
                    </div>
                  ) : (
                    <div className="mb-5 grid aspect-[16/9] place-items-center rounded-xl bg-secondary/40 text-muted-foreground neo-inset">
                      <ImageIcon className="h-8 w-8 opacity-50" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-[1.1rem] font-bold leading-tight">{s.title}</h3>
                    <span className="neo-badge py-1 px-2 flex items-center gap-1 text-[10px] font-bold">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{desc}</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {s.duration}
                  </span>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="neo-btn-primary rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-1.5"
                  >
                    â‚¹{(s.offerPrice ?? s.price).toLocaleString()} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}

