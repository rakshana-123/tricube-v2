import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Twitter, ShieldCheck, Award, Sparkles } from "lucide-react";
import { COMPANY } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-[#FFFFFF] dark:bg-zinc-950 dark:border-zinc-800">
      {/* Top Banner / Trust Proof */}
      <div className="border-b border-zinc-100 bg-[#F9FAFB] py-8 dark:bg-zinc-900/50 dark:border-zinc-800/80">
        <div className="w-full px-6 sm:px-12 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Verified Certifications</h4>
                <p className="text-xs text-zinc-500">QR-verifiable and recognized across 120+ partners</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Live Client Internships</h4>
                <p className="text-xs text-zinc-500">Real production sprints, code reviews & official LOR</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(224,154,59,0.12)] text-[#E09A3B]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">1-on-1 Mentor Guidance</h4>
                <p className="text-xs text-zinc-500">Senior architects actively coaching every student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full px-6 sm:px-12 lg:px-20 xl:px-28 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-[2px_2px_6px_rgba(200,208,220,0.4),-2px_-2px_6px_rgba(255,255,255,0.95)] border border-[rgba(224,154,59,0.25)] flex items-center justify-center p-1">
                <img src="/tricube-logo-192.png" alt="TRI CUBE logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                TRI <span className="gold-text">CUBE</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {COMPANY.motto}. Delivering industry-led IT training, client-grade internships, and bespoke digital engineering solutions.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={COMPANY.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFFFF] text-zinc-600 shadow-[3px_3px_8px_rgba(200,208,220,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] border border-zinc-200/60 hover:text-[#E09A3B] hover:border-[rgba(224,154,59,0.4)] transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFFFF] text-zinc-600 shadow-[3px_3px_8px_rgba(200,208,220,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] border border-zinc-200/60 hover:text-[#E09A3B] hover:border-[rgba(224,154,59,0.4)] transition-all"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFFFF] text-zinc-600 shadow-[3px_3px_8px_rgba(200,208,220,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] border border-zinc-200/60 hover:text-[#E09A3B] hover:border-[rgba(224,154,59,0.4)] transition-all"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.socials.x}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFFFF] text-zinc-600 shadow-[3px_3px_8px_rgba(200,208,220,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] border border-zinc-200/60 hover:text-[#E09A3B] hover:border-[rgba(224,154,59,0.4)] transition-all"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Academics & Tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Academics
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link to="/courses" className="hover:text-[#E09A3B] transition-colors">All Courses</Link></li>
              <li><Link to="/courses" className="hover:text-[#E09A3B] transition-colors">Java Full Stack</Link></li>
              <li><Link to="/courses" className="hover:text-[#E09A3B] transition-colors">MERN Stack Pro</Link></li>
              <li><Link to="/courses" className="hover:text-[#E09A3B] transition-colors">Python & AI Agents</Link></li>
              <li><Link to="/courses" className="hover:text-[#E09A3B] transition-colors">Internship Program</Link></li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link to="/materials" className="hover:text-[#E09A3B] transition-colors">Study Materials & Notes</Link></li>
              <li><Link to="/events" className="hover:text-[#E09A3B] transition-colors">Workshops & Bootcamps</Link></li>
              <li><Link to="/blog" className="hover:text-[#E09A3B] transition-colors">Tech Blog & Playbooks</Link></li>
              <li><Link to="/gallery" className="hover:text-[#E09A3B] transition-colors">Campus Gallery</Link></li>
              <li><Link to="/testimonials" className="hover:text-[#E09A3B] transition-colors">Student Stories</Link></li>
            </ul>
          </div>

          {/* Contact / Campus Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Campus & Office
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span className="leading-snug">{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span>{COMPANY.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#E09A3B]" />
                <span className="truncate">{COMPANY.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-100 bg-[#FAFAFC] py-6 dark:bg-zinc-950 dark:border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 md:flex-row">
          <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-zinc-800 dark:hover:text-zinc-300">About Us</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-zinc-800 dark:hover:text-zinc-300">FAQ</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-zinc-800 dark:hover:text-zinc-300">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
