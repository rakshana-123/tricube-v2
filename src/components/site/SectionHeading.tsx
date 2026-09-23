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
        <span className="neo-badge mb-1" style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gradient-gold)", display: "inline-block", flexShrink: 0 }} />
          {eyebrow}
        </span>
      )}
      <h2
        className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground md:text-lg" style={{ lineHeight: 1.65, maxWidth: "56ch", margin: align === "center" ? "1rem auto 0" : "1rem 0 0" }}>
          {subtitle}
        </p>
      )}
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
    <section className="hero-bg relative overflow-hidden" style={{ borderBottom: "none" }}>
      {/* Neo floating blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-6rem",
          right: "-4rem",
          width: "28rem",
          height: "28rem",
          borderRadius: "50%",
          background: "var(--teal-soft)",
          filter: "blur(72px)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-4rem",
          left: "-2rem",
          width: "20rem",
          height: "20rem",
          borderRadius: "50%",
          background: "var(--navy)",
          filter: "blur(80px)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div>
    </section>
  );
}
