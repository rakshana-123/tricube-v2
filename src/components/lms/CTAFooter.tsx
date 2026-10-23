import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Github, Linkedin, Instagram, Youtube } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import { MagneticButton, Reveal, motionConfig } from "./motion";

/** CTA — dark navy band with teal accents (spec §31). */
export function CTA() {
  return (
    <section id="cta" className="scroll-mt-20 bg-white px-4 py-24 md:px-6 md:py-32">
      <Reveal>
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[#0E263A] px-6 py-16 text-center md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#2EA5A1]/20 blur-3xl"
          />
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#2EA5A1] uppercase">
            Your move
          </p>
          <h2 className="mx-auto mt-4 max-w-[24ch] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-white md:text-[48px]">
            Learn. Build. Launch your career.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-white/70">
            Join {new Intl.NumberFormat("en-IN").format(4200)}+ learners who turned
            consistency into offer letters. Your first week is free.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#247F7C] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1D6865]"
              >
                Start free week <ArrowRight size={17} aria-hidden />
              </Link>
            </MagneticButton>
            <a
              href="#pricing"
              className="inline-flex items-center rounded-[10px] border border-white/25 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-[#2EA5A1] hover:text-[#2EA5A1]"
            >
              Compare plans
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Features", "Courses", "Pricing", "Dashboard", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Events", "Blog", "Gallery"] },
  { title: "Resources", links: ["Documentation", "Community", "Tutorials", "FAQ"] },
  { title: "Support", links: ["Contact", "WhatsApp", "Email", "Office hours"] },
];

/** Footer — navy, staggered columns, socials. Spec §32. */
export function Footer() {
  return (
    <footer className="bg-[#0E263A] pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <motion.div
          className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/tricube-logo-square.jpg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-[10px] object-cover"
              />
              <div>
                <p className="text-[15px] font-bold text-white">TRI CUBE</p>
                <p className="text-[11px] font-medium text-white/50">Digital Solutions</p>
              </div>
            </div>
            <p className="mt-4 max-w-[32ch] text-[13px] leading-[1.6] text-white/55">
              {COMPANY.motto} — premium, mentor-led training for careers in tech.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Linkedin, label: "LinkedIn", href: COMPANY.socials.linkedin },
                { icon: Instagram, label: "Instagram", href: COMPANY.socials.instagram },
                { icon: Youtube, label: "YouTube", href: COMPANY.socials.youtube },
                { icon: Github, label: "X", href: COMPANY.socials.x },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/15 text-white/70 transition-colors hover:border-[#2EA5A1] hover:text-[#2EA5A1]"
                >
                  <s.icon size={16} aria-hidden />
                </a>
              ))}
            </div>
          </motion.div>

          {COLUMNS.map((col) => (
            <motion.nav
              key={col.title}
              aria-label={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
            >
              <p className="text-[12px] font-bold tracking-[0.12em] text-white/40 uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-[13.5px] font-medium text-white/70 transition-colors hover:text-[#2EA5A1]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </motion.div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12px] text-white/40">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-white/40">{COMPANY.address}</p>
        </div>
      </div>
    </footer>
  );
}
