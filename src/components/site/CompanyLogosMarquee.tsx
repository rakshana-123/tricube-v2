import React from "react";
import { Building2, Sparkles, CheckCircle2 } from "lucide-react";

export interface CompanyItem {
  name: string;
  role: string;
  logo: React.ReactNode;
}

export const COMPANIES: CompanyItem[] = [
  {
    name: "Google",
    role: "Cloud & SWE",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.09 3.66-5.17 3.66-9.12z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.26 21.3 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.27 6.58l4.01 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
        />
      </svg>
    ),
  },
  {
    name: "Microsoft",
    role: "Full Stack SDE",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    role: "SDE & DevOps",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
        <path
          fill="#FF9900"
          d="M19.4 17.6c-4.2 3.1-10.4 4.7-15.6 1.6-.2-.1-.3-.4-.1-.6.5-.7 1.5-1.9 2-2.5.1-.1.3-.2.4-.1 3.9 2.2 8.7 1.2 12.3-1.1.3-.2.6.1.7.3.2.7.3 1.8.3 2.4z"
        />
        <path
          fill="#FF9900"
          d="M20.8 14.5c.3-.4 1.7-1.1 2.3-1.4.2-.1.4.1.3.3-.5 1.1-1.3 3.2-1.7 4.2-.1.3-.4.3-.6.1-.8-1-2.2-2.7-2.6-3.2-.2-.2 0-.4.2-.4.7.1 1.7.2 2.1.4z"
        />
        <path
          fill="#1A1D20"
          className="dark:fill-white"
          d="M13.5 8.1c-.2-.7-.6-1.5-1.2-1.9-.9-.6-2.1-.6-3.1-.2-1.1.4-1.9 1.4-2.2 2.5-.1.3.1.5.4.5l1.6-.2c.2 0 .4-.2.5-.4.2-.6.6-1.1 1.2-1.3.5-.2 1.1-.1 1.5.2.3.2.5.6.5 1-.8.2-2 .5-2.8 1-.9.5-1.5 1.3-1.5 2.4 0 .9.5 1.8 1.3 2.2.8.4 1.7.4 2.5.1.7-.2 1.3-.7 1.7-1.3v1c0 .2.2.4.4.4h1.5c.2 0 .4-.2.4-.4V9.6c0-.5-.1-1-.5-1.5zm-1.8 4.2c-.2.4-.5.7-.9.8-.5.2-1 .1-1.4-.1-.3-.2-.5-.6-.5-1 0-.6.4-1.1.9-1.3.6-.3 1.3-.5 1.9-.6v2.2z"
        />
      </svg>
    ),
  },
  {
    name: "Infosys",
    role: "System Engineer",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#007CC3">
        <rect x="2" y="5" width="4" height="14" rx="1.5" />
        <path d="M9 12c0-3.9 3.1-7 7-7v3.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5V19c-3.9 0-7-3.1-7-7z" />
        <circle cx="19" cy="8.5" r="2.5" />
      </svg>
    ),
  },
  {
    name: "TCS",
    role: "Digital & Ninja",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#004884">
        <path d="M2 7h20v3H13v7h-3v-7H2V7z" />
        <circle cx="19" cy="16" r="2" fill="#E09A3B" />
      </svg>
    ),
  },
  {
    name: "Wipro",
    role: "Project Engineer",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <circle cx="6" cy="12" r="3.5" fill="#E05A47" />
        <circle cx="12" cy="6" r="3.5" fill="#F29100" />
        <circle cx="18" cy="12" r="3.5" fill="#00A3E0" />
        <circle cx="12" cy="18" r="3.5" fill="#DF1995" />
      </svg>
    ),
  },
  {
    name: "Accenture",
    role: "Associate SDE",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#A100FF"
          d="M13.5 2L5 12h5.5l-2 10 10.5-12h-5.5l2-8z"
        />
      </svg>
    ),
  },
  {
    name: "Deloitte",
    role: "Analyst & Tech",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <rect x="2" y="7" width="16" height="10" rx="2" fill="#1A1D20" className="dark:fill-zinc-300" />
        <circle cx="21" cy="15" r="2.5" fill="#86BC25" />
      </svg>
    ),
  },
  {
    name: "Capgemini",
    role: "Software Analyst",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#0070AD">
        <path d="M12 2C9 7 4 10.5 4 15a8 8 0 0014.5 4.5l-3-4.5h4c2.5 0 3.5-3 1.5-6-3-4.5-7-7-9-7z" />
      </svg>
    ),
  },
  {
    name: "Zoho",
    role: "Full Stack Dev",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <rect x="2" y="2" width="9" height="9" rx="2" fill="#E83D3D" />
        <rect x="13" y="2" width="9" height="9" rx="2" fill="#33A852" />
        <rect x="2" y="13" width="9" height="9" rx="2" fill="#3370FF" />
        <rect x="13" y="13" width="9" height="9" rx="2" fill="#FFC107" />
      </svg>
    ),
  },
  {
    name: "Razorpay",
    role: "Backend & Payments",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#0C2340">
        <path fill="#3395FF" d="M14 2L4 14h6l-2 8 12-12h-6l2-8z" />
      </svg>
    ),
  },
  {
    name: "Swiggy",
    role: "Frontend Engineer",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#FC8019">
        <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
      </svg>
    ),
  },
  {
    name: "Freshworks",
    role: "Product Developer",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <circle cx="8" cy="12" r="5" fill="#FF6A00" />
        <circle cx="16" cy="12" r="5" fill="#10847E" opacity="0.85" />
      </svg>
    ),
  },
  {
    name: "Cognizant",
    role: "GenC Developer",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#0033A0">
        <path d="M12 3a9 9 0 00-6.4 15.3l2.1-2.1A6 6 0 1118 12h3a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    name: "Oracle",
    role: "Database & Cloud",
    logo: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#C74634">
        <path d="M12 6C7.58 6 4 8.69 4 12s3.58 6 8 6 8-2.69 8-6-3.58-6-8-6zm0 9.5c-3 0-5.5-1.57-5.5-3.5s2.5-3.5 5.5-3.5 5.5 1.57 5.5 3.5-2.5 3.5-5.5 3.5z" />
      </svg>
    ),
  },
];

export function CompanyLogosMarquee() {
  // Duplicate array for seamless infinite marquee loop
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

  return (
    <section
      className="relative w-full border-y border-zinc-100 bg-[#FAFAFC] py-8 sm:py-10 overflow-hidden dark:bg-zinc-900/50 dark:border-zinc-800"
      aria-label="Hiring Partners and Alumni Network"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-zinc-500 shadow-[2px_2px_6px_rgba(200,208,220,0.35),-2px_-2px_6px_rgba(255,255,255,0.95)] border border-zinc-200/60 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-[#E09A3B]" />
          <span>Our Alumni Network</span>
        </div>
        <h3 className="mt-2 text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-200">
          Our alumni build & innovate at leading technology organizations
        </h3>
      </div>

      {/* Marquee Track Container with Gradient Edge Fade */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div className="flex w-max items-center gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused]">
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="group flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-[4px_4px_12px_rgba(200,208,220,0.4),-4px_-4px_12px_rgba(255,255,255,0.95)] border border-zinc-200/60 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(224,154,59,0.45)] hover:shadow-[6px_8px_20px_rgba(224,154,59,0.18),-6px_-6px_16px_rgba(255,255,255,0.95)] dark:bg-zinc-800/90 dark:border-zinc-700/80"
            >
              {/* Official Brand Logo */}
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F8F9FA] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)] border border-zinc-100 dark:bg-zinc-700/60 dark:border-zinc-600">
                {company.logo}
              </div>

              {/* Company & Role Details */}
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-zinc-900 group-hover:text-[#E09A3B] transition-colors dark:text-zinc-100 leading-none">
                  {company.name}
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 mt-0.5">
                  {company.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
