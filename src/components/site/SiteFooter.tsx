import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Twitter } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";

export function SiteFooter() {
  const socials = [
    { href: COMPANY.socials.linkedin, icon: <Linkedin size={15} />, label: "LinkedIn" },
    { href: COMPANY.socials.instagram, icon: <Instagram size={15} />, label: "Instagram" },
    { href: COMPANY.socials.youtube, icon: <Youtube size={15} />, label: "YouTube" },
    { href: COMPANY.socials.x, icon: <Twitter size={15} />, label: "X" },
  ];

  return (
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid var(--color-border)",
        marginTop: "6rem",
      }}
    >
      {/* Brand accent strip */}
      <div style={{ height: 4, background: "var(--gradient-brand)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ background: "#FFFFFF", border: "1.5px solid var(--color-border)", borderRadius: "0.75rem", padding: 6, display: "inline-flex", boxShadow: "0 2px 8px rgba(13,31,60,0.08)" }}>
              <img src={logoAsset.url} alt="TRI CUBE" style={{ height: 32, width: 32, borderRadius: 6, objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--navy)" }}>
                TRI<span style={{ color: "var(--teal)" }}>&middot;</span>CUBE
              </span>
              <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted-foreground)" }}>Digital Solutions</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--color-muted-foreground)", lineHeight: 1.65, maxWidth: "22ch" }}>
            {COMPANY.motto}. Premium training, real internships, verified certificates.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: 36, height: 36, display: "grid", placeItems: "center",
                  borderRadius: "50%", border: "1.5px solid var(--color-border)",
                  color: "var(--color-muted-foreground)", background: "#FFFFFF",
                  boxShadow: "0 1px 4px rgba(13,31,60,0.07)",
                  transition: "all 0.2s ease", textDecoration: "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--teal)";
                  (e.currentTarget as HTMLElement).style.color = "var(--teal)";
                  (e.currentTarget as HTMLElement).style.background = "var(--teal-soft)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-muted-foreground)";
                  (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "1rem" }}>Explore</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[["Courses","/courses"],["Services","/services"],["Events","/events"],["Blog","/blog"],["Gallery","/gallery"]].map(([l,h]) => (
              <li key={h}><Link to={h as any} style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>(e.currentTarget.style.color="var(--teal)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--color-muted-foreground)")}>{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "1rem" }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[["About","/about"],["Testimonials","/testimonials"],["FAQ","/faq"],["Contact","/contact"]].map(([l,h]) => (
              <li key={h}><Link to={h as any} style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e=>(e.currentTarget.style.color="var(--teal)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--color-muted-foreground)")}>{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "1rem" }}>Reach us</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.82rem", color: "var(--color-muted-foreground)" }}><MapPin size={14} style={{ color: "var(--teal)", marginTop: 2, flexShrink: 0 }} />{COMPANY.address}</li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "var(--color-muted-foreground)" }}><Phone size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />{COMPANY.phone}</li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "var(--color-muted-foreground)" }}><Mail size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />{COMPANY.email}</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "1.25rem 1.5rem",
        borderTop: "1px solid var(--color-border)",
        display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem",
        fontSize: "0.75rem", color: "var(--color-muted-foreground)"
      }}>
        <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
        <span>Crafted with care · {COMPANY.hours}</span>
      </div>
    </footer>
  );
}
