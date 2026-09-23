import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, User as UserIcon, LogIn } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/courses", label: "Courses" },
  { to: "/materials", label: "Materials" },
  { to: "/events", label: "Events" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("tc-theme");
    if (saved === "dark") { document.documentElement.classList.add("dark"); setDark(true); }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tc-theme", next ? "dark" : "light");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        ...(scrolled ? {
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          boxShadow: "0 1px 20px rgba(13, 31, 60, 0.07)",
        } : {
          background: "#FFFFFF",
        }),
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              borderRadius: "0.75rem",
              padding: 6,
              display: "inline-flex",
              flexShrink: 0,
              border: "1.5px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(13, 31, 60, 0.08)",
              background: "#FFFFFF",
            }}
          >
            <img src={logoAsset.url} alt="TRI CUBE" style={{ height: 36, width: 36, borderRadius: 6, objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--navy)" }}>
              TRI<span style={{ color: "var(--teal)" }}>&middot;</span>CUBE
            </span>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-muted-foreground)", marginTop: 1 }}>Digital Solutions</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "none", gap: 2 }} className="lg:flex">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{ padding: "0.45rem 0.9rem", borderRadius: 9999, fontSize: "0.875rem", color: "var(--color-muted-foreground)", textDecoration: "none", fontWeight: 500, transition: "all 0.2s ease", display: "inline-flex" }}
              activeProps={{
                style: {
                  background: "var(--teal-soft)",
                  color: "var(--teal)",
                  fontWeight: 700,
                }
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" style={{ padding: "0.45rem 0.9rem", borderRadius: 9999, fontSize: "0.875rem", color: "var(--color-muted-foreground)", textDecoration: "none", fontWeight: 500 }} activeProps={{ style: { background: "var(--teal-soft)", color: "var(--teal)", fontWeight: 700 } }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            style={{
              width: 40, height: 40, display: "grid", placeItems: "center",
              borderRadius: "50%", border: "1.5px solid var(--color-border)",
              background: "var(--color-background)", cursor: "pointer", color: "var(--navy)",
              boxShadow: "0 1px 4px rgba(13,31,60,0.08)",
              transition: "all 0.2s ease",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isAuthenticated ? (
            <Link to="/me" className="neo-btn md:inline-flex hidden" style={{ display: "none", alignItems: "center", gap: 8, padding: "0.4rem 1rem 0.4rem 0.4rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", color: "var(--navy)" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--gradient-teal)", display: "grid", placeItems: "center", fontSize: "0.7rem", fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                {(user?.name || "?").trim().charAt(0).toUpperCase()}
              </span>
              {user?.name?.split(" ")[0] || "Account"}
            </Link>
          ) : (
            <Link to="/auth" className="neo-btn-primary md:inline-flex hidden" style={{ display: "none", alignItems: "center", gap: 6, padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", color: "#FFFFFF" }}>
              <LogIn size={15} /> Sign in
            </Link>
          )}
          <button
            className="lg:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
            style={{
              width: 40, height: 40, display: "grid", placeItems: "center",
              border: "1.5px solid var(--color-border)", borderRadius: "0.625rem",
              background: "var(--color-background)", cursor: "pointer", color: "var(--navy)",
            }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "#FFFFFF",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 8px 24px rgba(13,31,60,0.10)",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1rem 1.5rem 1.5rem" }}>
            {[...links, ...(isAdmin ? [{ to: "/admin" as const, label: "Admin" }] : [])].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", padding: "0.75rem 0", fontSize: "0.9rem", fontWeight: 500, color: "var(--navy)", textDecoration: "none", borderBottom: "1px solid var(--color-border)" }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: "1rem" }}>
              {isAuthenticated ? (
                <Link to="/me" onClick={() => setOpen(false)} className="neo-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.75rem 1.5rem", textDecoration: "none", fontWeight: 600, color: "var(--navy)", fontSize: "0.875rem" }}>
                  <UserIcon size={15} /> {user?.name?.split(" ")[0] || "My account"}
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="neo-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.75rem 1.5rem", textDecoration: "none", fontWeight: 600, color: "#FFFFFF", fontSize: "0.875rem" }}>
                  <LogIn size={15} /> Sign in / Register
                </Link>
              )}
            </div>
            <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>{COMPANY.phone}</p>
          </div>
        </div>
      )}
    </header>
  );
}
