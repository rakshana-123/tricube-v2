import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, User as UserIcon } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/courses", label: "Courses" },
  { to: "/materials", label: "Material" },
  { to: "/events", label: "Event" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FFFFFF] transition-all duration-300 ${
        scrolled
          ? "shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-zinc-200/70"
          : "border-b border-zinc-100"
      }`}
    >
      <div className="flex w-full items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 h-[72px] lg:h-[78px]">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/hero/tricube-logo-nav.png"
            alt="TRI CUBE Digital Solutions"
            className="h-11 sm:h-12 lg:h-[54px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative py-2 text-[15px] xl:text-[16px] font-medium text-[#091326] transition-colors duration-200 hover:text-[#E09A3B]"
              activeProps={{
                className:
                  "relative py-2 text-[15px] xl:text-[16px] font-semibold text-[#E09A3B] after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#E09A3B]",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="relative py-2 text-[15px] xl:text-[16px] font-medium text-[#091326] transition-colors hover:text-[#E09A3B]"
              activeProps={{
                className:
                  "relative py-2 text-[15px] xl:text-[16px] font-semibold text-[#E09A3B] after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#E09A3B]",
              }}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/me"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#E09A3B] hover:bg-[#cf892c] px-6 lg:px-7 py-2.5 lg:py-3 text-[15px] font-medium text-white shadow-[0_6px_18px_rgba(224,154,59,0.32)] transition-all"
            >
              <UserIcon className="h-4 w-4" />
              <span className="max-w-[120px] truncate">{user?.name?.split(" ")[0] || "Account"}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-2.5 rounded-full bg-[#E09A3B] hover:bg-[#cf892c] px-6 lg:px-7 py-2.5 lg:py-3 text-[15px] lg:text-[15.5px] font-medium text-white shadow-[0_6px_18px_rgba(224,154,59,0.32)] transition-all hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2]" />
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#091326] border border-zinc-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-zinc-200/80 bg-white lg:hidden shadow-xl">
          <div className="flex w-full flex-col px-6 py-5 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-[#091326] hover:bg-[#FDF5EA] flex items-center justify-between"
                activeProps={{ className: "text-[#E09A3B] bg-[#FDF5EA] font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span>{l.label}</span>
                <span className="text-xs text-[#E09A3B]">→</span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-[#091326] hover:bg-[#FDF5EA]"
              >
                Admin Panel
              </Link>
            )}

            <div className="pt-4 border-t border-zinc-100">
              {isAuthenticated ? (
                <Link
                  to="/me"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#E09A3B] px-5 py-3.5 text-base font-semibold text-white shadow-sm"
                >
                  <UserIcon className="h-4 w-4" /> {user?.name?.split(" ")[0] || "My account"}
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#E09A3B] px-5 py-3.5 text-base font-semibold text-white shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <div className="mt-3 text-center text-xs text-zinc-500">
                Support: {COMPANY.phone} · {COMPANY.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
