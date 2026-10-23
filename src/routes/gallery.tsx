import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { listGallery, type GalleryDTO } from "@/lib/content-api";
import { GALLERY } from "@/lib/site-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — TRI CUBE Digital Solutions" },
      { name: "description", content: "Campus, workshops, hackathons and student moments from TRI CUBE." },
      { property: "og:title", content: "TRI CUBE Gallery" },
      { property: "og:description", content: "Campus and student moments." },
    ],
  }),
  component: GalleryPage,
});

const INITIAL_GALLERY: GalleryDTO[] = GALLERY.map((g) => ({
  id: g.id,
  url: g.src,
  caption: g.alt,
  published: true,
}));

function GalleryPage() {
  const [items, setItems] = useState<GalleryDTO[]>(INITIAL_GALLERY);
  useEffect(() => {
    listGallery()
      .then((data) => {
        if (data && data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments from <span className="gold-text">TRI CUBE</span>
          </>
        }
        subtitle="Workshops, hackathons, campus days and shipping nights."
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g, i) => (
            <div
              key={g.url + i}
              className="neo-card overflow-hidden rounded-2xl group relative bg-zinc-900"
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={g.url}
                  alt={g.caption || "Campus moment"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {g.caption && (
                <div className="p-4 bg-white dark:bg-zinc-900">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {g.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
