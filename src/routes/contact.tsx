import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SectionHeading";
import { COMPANY } from "@/lib/site-data";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact â€” TRI CUBE Digital Solutions" },
      { name: "description", content: "Reach TRI CUBE via form, phone, WhatsApp or email. Bengaluru office details and business hours." },
      { property: "og:title", content: "Contact TRI CUBE" },
      { property: "og:description", content: "Reach us via form, phone, WhatsApp or email." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let's <span className="teal-text">talk</span></>} subtitle="Enquiries, admissions, corporate training, projects â€” we usually reply within a day." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <h3 className="text-2xl font-semibold">Send us a message</h3>
            {sent ? (
              <p className="mt-6 rounded-2xl bg-secondary/60 p-4 text-sm">Thanks â€” we'll be in touch shortly.</p>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={(e)=>{e.preventDefault(); setSent(true);}}>
                <div className="grid gap-4 md:grid-cols-2">
                  <input required placeholder="Full name" className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <input required type="email" placeholder="Email" className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <input placeholder="Phone (optional)" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder="Subject" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <textarea required rows={5} placeholder="Message" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <button className="w-full rounded-full bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground">Send message</button>
              </form>
            )}
          </div>
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 flex items-start gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground"><MapPin /></span><div><p className="font-semibold">Office</p><p className="text-sm text-muted-foreground">{COMPANY.address}</p><p className="mt-1 text-xs text-muted-foreground">{COMPANY.hours}</p></div></div>
            <div className="glass rounded-2xl p-6 flex items-start gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground"><Phone /></span><div><p className="font-semibold">Phone</p><p className="text-sm text-muted-foreground">{COMPANY.phone}</p></div></div>
            <div className="glass rounded-2xl p-6 flex items-start gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground"><MessageCircle /></span><div><p className="font-semibold">WhatsApp</p><p className="text-sm text-muted-foreground">{COMPANY.whatsapp}</p></div></div>
            <div className="glass rounded-2xl p-6 flex items-start gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground"><Mail /></span><div><p className="font-semibold">Email</p><p className="text-sm text-muted-foreground">{COMPANY.email}</p></div></div>
            <div className="overflow-hidden rounded-2xl border border-border"><iframe title="map" className="h-64 w-full" src="https://www.google.com/maps?q=Bengaluru&output=embed" loading="lazy" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
