import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Twitter } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={logoAsset.url}
              alt="TRI CUBE logo"
              className="h-10 w-10 rounded-lg object-contain"
            />
            <span className="text-lg font-semibold">
              TRI <span className="gold-text">CUBE</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {COMPANY.motto}. Premium training, real internships, verified certificates.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={COMPANY.socials.linkedin}
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={COMPANY.socials.instagram}
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={COMPANY.socials.youtube}
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a
              href={COMPANY.socials.x}
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/courses" className="hover:text-foreground">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-foreground">
                Events
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-foreground">
                Gallery
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/testimonials" className="hover:text-foreground">
                Testimonials
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" /> {COMPANY.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> {COMPANY.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> {COMPANY.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <span>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </span>
          <span>Crafted with care. {COMPANY.hours}</span>
        </div>
      </div>
    </footer>
  );
}
