import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { motionConfig } from "./motion";

const LINKS = [
  { href: "#features", label: "Product" },
  { href: "#courses", label: "Courses" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Platform navbar — transparent at top; after 8px of scroll it frosts
 * (82% white + 16px blur + hairline). Hides on scroll-down, returns on
 * scroll-up, spring (400, 35). Mobile menu collapses into a sheet.
 */
export function Navbar() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  let last = 0;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
    const delta = y - last;
    if (delta > 6 && y > 160) setHidden(true);
    else if (delta < -6) setHidden(false);
    last = y;
  });

  return (
    <motion.header
      initial={false}
      animate={reduce ? {} : { y: hidden ? -100 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-[#E8E1DD] bg-white/82 backdrop-blur-[16px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-6 px-4 md:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label="TRI CUBE home">
          <img
            src="/tricube-logo-square.jpg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-[10px] object-cover"
          />
          <span className="text-[15px] font-bold tracking-tight text-[#0E263A]">
            TRI CUBE <span className="font-medium text-[#6B625D]">LMS</span>
          </span>
        </a>

        <ul className="ml-4 hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-[#6B625D] transition-colors hover:text-[#0E263A] focus-visible:text-[#0E263A]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link
            to="/auth"
            className="rounded-[10px] px-4 py-2 text-sm font-semibold text-[#265CA0] transition-colors hover:bg-[#F8F6F4]"
          >
            Sign in
          </Link>
          <MagneticLink />
        </div>

        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-[10px] text-[#0E263A] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionConfig.fast, ease: motionConfig.ease }}
          className="border-t border-[#E8E1DD] bg-white px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[15px] font-medium text-[#0E263A]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-3">
            <Link
              to="/auth"
              className="flex-1 rounded-[10px] border border-[#E8E1DD] px-4 py-2.5 text-center text-sm font-semibold text-[#265CA0]"
            >
              Sign in
            </Link>
            <Link
              to="/studio"
              className="flex-1 rounded-[10px] bg-[#247F7C] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function MagneticLink() {
  return (
    <a
      href="#pricing"
      className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#247F7C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D6865]"
    >
      <GraduationCap size={16} aria-hidden />
      Get started
    </a>
  );
}
