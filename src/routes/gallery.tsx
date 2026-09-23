import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { listGallery, type GalleryDTO } from "@/lib/content-api";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Campus, workshops, hackathons and student moments from TRI CUBE." },
      { property: "og:title", content: "TRI CUBE Gallery" },
      { property: "og:description", content: "Campus and student moments." },
    ],
  }),
  component: GalleryPage,
});

const FALLBACK_IDS = [
  "photo-1522202176988-66273c2fd55f",
  "photo-1523240795612-9a054b0db644",
  "photo-1531482615713-2afd69097998",
  "photo-1517245386807-bb43f82c33c4",
  "photo-1524178232363-1fb2b075b655",
  "photo-1540575467063-178a50c2df87",
  "photo-1552664730-d307ca884978",
  "photo-1515169067868-5387ec356754",
  "photo-1516321318423-f06f85e504b3",
];

function GalleryPage() {
  const [items, setItems] = useState<GalleryDTO[] | null>(null);
  useEffect(() => { listGallery().then(setItems).catch(() => setItems([])); }, []);
  const rows: { url: string; caption?: string | null }[] = items && items.length
    ? items.map((g) => ({ url: g.url, caption: g.caption }))
    : FALLBACK_IDS.map((id) => ({ url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80` }));
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>Moments from <span className="teal-text">TRI CUBE</span></>} subtitle="Workshops, hackathons, campus days and shipping nights." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="columns-2 gap-4 md:columns-3">
          {rows.map((g, i) => (
            <img key={g.url + i} src={g.url} alt={g.caption || "Campus moment"} className="mb-4 w-full rounded-2xl object-cover transition-transform hover:scale-[1.02]" loading="lazy" />
          ))}
        </div>
      </section>
    </>
  );
}

