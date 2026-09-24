import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { listServices, absoluteMedia, splitFeatures, type ServiceDTO } from "@/lib/services-api";
import { motion } from "framer-motion";
import { Star, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — TRI CUBE Digital Solutions" },
      {
        name: "description",
        content:
          "Training, internships, projects and IT services — Python, MERN, Data Science, AI, Digital Marketing and more.",
      },
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
    listServices().then((r) => {
      if (alive) setServices(r);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            End-to-end <span className="gold-text">training & IT</span> services
          </>
        }
        subtitle="From your first line of code to your first client project — one campus, one team."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        {services && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No services yet. An admin can add one from{" "}
            <span className="font-medium">/admin/services</span>.
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(services || []).map((s, i) => {
            const rating = (s.rating ?? 4.9).toFixed(1);
            const features = splitFeatures(s.features);
            const desc = s.description || features.slice(0, 2).join(" · ");
            const img = absoluteMedia(s.imageUrl);
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-14px_rgba(0,0,0,0.12)]"
              >
                <div>
                  {img ? (
                    <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-secondary">
                      <img
                        src={img}
                        alt={s.title}
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 grid aspect-[16/9] place-items-center rounded-xl bg-secondary/60 text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug">{s.title}</h3>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current text-primary" /> {rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{desc}</p>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-foreground/80">
                    <Calendar className="h-3.5 w-3.5" /> {s.duration}
                  </span>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold shadow-sm transition group-hover:bg-[var(--gradient-gold)] group-hover:text-primary-foreground group-hover:border-transparent"
                  >
                    ₹{(s.offerPrice ?? s.price).toLocaleString()}{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
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
