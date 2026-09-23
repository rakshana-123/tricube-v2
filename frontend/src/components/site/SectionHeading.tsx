import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gradient-gold)]" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="hero-bg relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[var(--gold-soft)] blur-3xl opacity-70" />
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div>
    </section>
  );
}
