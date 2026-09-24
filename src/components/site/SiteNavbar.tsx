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
  { to: "/my-materials", label: "My Materials" },
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("tc-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tc-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoAsset.url}
            alt="TRI CUBE logo"
            className="h-10 w-10 rounded-lg object-contain shadow-[var(--shadow-elegant)]"
          />
          <span className="text-lg font-semibold tracking-tight">
            TRI <span className="gold-text">CUBE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isAuthenticated ? (
            <Link
              to="/me"
              className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm hover:bg-secondary md:inline-flex"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--gold-soft)] text-xs font-bold text-[var(--gold-dark)]">
                {(user?.name || "?").trim().charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[100px] truncate">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full bg-[var(--gradient-gold)] px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.03] md:inline-flex"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium text-foreground"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                to="/me"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold"
              >
                <UserIcon className="h-4 w-4" /> {user?.name?.split(" ")[0] || "My account"}
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gradient-gold)] px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                <LogIn className="h-4 w-4" /> Sign in / Register
              </Link>
            )}
            <p className="mt-4 text-xs text-muted-foreground">{COMPANY.phone}</p>
          </div>
        </div>
      )}
    </header>
  );
}
