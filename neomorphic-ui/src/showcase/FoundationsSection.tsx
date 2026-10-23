import type { ReactNode } from "react";
import { contrastRatio, wcagGrade } from "../utils/contrast";
import type { Theme } from "../hooks/useTheme";

export function Section({
  id,
  index,
  title,
  desc,
  children,
  alt = false,
}: {
  id: string;
  index: string;
  title: string;
  desc?: ReactNode;
  children: ReactNode;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`section ${alt ? "sectionAlt" : ""}`}>
      <div className="neo-container">
        <header className="sectionHead">
          <p className={`sectionIndex type-caption-strong`}>{index}</p>
          <h2 className="type-display-lg">{title}</h2>
          {desc && <p className="sectionDesc type-lead-airy">{desc}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

interface SwatchDef {
  name: string;
  hex: string;
  /** text token this surface is designed to carry */
  fg: string;
  note: string;
  /** light mode only (dark tiles are inverted out of the theme) */
  lightOnly?: boolean;
}

const LIGHT_SWATCHES: SwatchDef[] = [
  { name: "canvas-parchment", hex: "#f5f5f7", fg: "#1d1d1f", note: "Global app canvas" },
  { name: "canvas-white", hex: "#ffffff", fg: "#1d1d1f", note: "Alternating section band" },
  { name: "surface-pearl", hex: "#fafafc", fg: "#1d1d1f", note: "Raised component surface" },
  { name: "surface-tile-1", hex: "#272729", fg: "#f5f5f7", note: "Dark utility / inverse tile" },
  { name: "primary · Action Blue", hex: "#0066cc", fg: "#ffffff", note: "All interaction" },
  { name: "primary-focus", hex: "#0071e3", fg: "#ffffff", note: "Hover + focus ring" },
  { name: "ink", hex: "#1d1d1f", fg: "#f5f5f7", note: "Headlines, body — 15.4:1 on canvas" },
  { name: "ink-muted-80", hex: "#333333", fg: "#f5f5f7", note: "Secondary text" },
  { name: "ink-muted-48", hex: "#7a7a7a", fg: "#f5f5f7", note: "Tertiary — large text only" },
  { name: "hairline", hex: "#e0e0e0", fg: "#1d1d1f", note: "1px dividers at 8% black" },
];

const DARK_SWATCHES: SwatchDef[] = [
  { name: "canvas · tile-3", hex: "#252527", fg: "#f5f5f7", note: "Dark app canvas" },
  { name: "surface-raised · tile-2", hex: "#2a2a2c", fg: "#f5f5f7", note: "Raised components" },
  { name: "surface-sunken", hex: "#212123", fg: "#f5f5f7", note: "Recessed wells" },
  { name: "canvas-contrast · ink", hex: "#1d1d1f", fg: "#f5f5f7", note: "Alternating band" },
  { name: "primary-on-dark · Sky Blue", hex: "#2997ff", fg: "#ffffff", note: "Interaction on dark" },
  { name: "text-primary", hex: "#f5f5f7", fg: "#252527", note: "Body on dark — 13.9:1" },
  { name: "text-secondary", hex: "#cccccc", fg: "#252527", note: "Secondary copy" },
  { name: "error (lifted)", hex: "#ff6359", fg: "#ffffff", note: "Form errors — 4.9:1" },
];

function Swatch({ s }: { s: SwatchDef }) {
  const ratio = contrastRatio(s.fg, s.hex);
  const grade = wcagGrade(ratio);
  return (
    <div className="swatchCard">
      <div className="swatchChip" style={{ background: s.hex }} />
      <div className="swatchMeta">
        <p className="type-caption-strong">{s.name}</p>
        <p className="type-micro-legal">{s.hex.toUpperCase()} · {s.note}</p>
        <span className={`contrastBadge ${grade.aaa ? "contrastPass" : grade.aa ? "contrastPass" : "contrastWarn"}`}>
          {grade.label} {grade.aaa ? "AAA" : grade.aa ? "AA" : "AA-L"}
        </span>
      </div>
    </div>
  );
}

export function ColorSection({ theme }: { theme: Theme }) {
  const swatches = theme === "dark" ? DARK_SWATCHES : LIGHT_SWATCHES;
  return (
    <Section
      id="color"
      index="01 · Foundations"
      title="Color"
      desc={
        <>
          Parchment canvas, pearl surfaces, one blue accent for every interaction — no
          gradients, no borders. Neomorphic depth is built entirely from{" "}
          <code className="tokenBadge">rgba(0,0,0,α)</code> shadows and near-white speculars.
          The badge on each swatch is the live WCAG ratio for its intended pairing.
        </>
      }
    >
      <div className="swatchGrid">
        {swatches.map((s) => (
          <Swatch key={s.name} s={s} />
        ))}
      </div>
    </Section>
  );
}

const TYPE_LADDER: { cls: string; label: string; spec: string }[] = [
  { cls: "type-hero-display", label: "Hero Display", spec: "SF Pro Display · 56 / 600 / 1.07 / −0.28" },
  { cls: "type-display-lg", label: "Display LG", spec: "40 / 600 / 1.1 / 0" },
  { cls: "type-display-md", label: "Display MD", spec: "34 / 600 / 1.47 / −0.374" },
  { cls: "type-lead", label: "Lead", spec: "28 / 400 / 1.14 / 0.196" },
  { cls: "type-lead-airy", label: "Lead Airy", spec: "24 / 300 / 1.5 / 0" },
  { cls: "type-tagline", label: "Tagline", spec: "21 / 600 / 1.19 / 0.231" },
  { cls: "type-body-strong", label: "Body Strong", spec: "17 / 600 / 1.24 / −0.374" },
  { cls: "type-body", label: "Body", spec: "17 / 400 / 1.47 / −0.374" },
  { cls: "type-caption", label: "Caption", spec: "14 / 400 / 1.43 / −0.224" },
  { cls: "type-caption-strong", label: "Caption Strong", spec: "14 / 600 / 1.29 / −0.224" },
  { cls: "type-button-large", label: "Button Large", spec: "18 / 300 / 1 / 0" },
  { cls: "type-fine-print", label: "Fine Print", spec: "12 / 400 / 1 / −0.12" },
  { cls: "type-micro-legal", label: "Micro Legal", spec: "10 / 400 / 1.3 / −0.08" },
  { cls: "type-nav-link", label: "Nav Link", spec: "12 / 400 / 1 / −0.12" },
];

export function TypographySection() {
  return (
    <Section
      id="typography"
      index="02 · Foundations"
      title="Typography"
      alt
      desc={
        <>
          The full SF Pro ladder, verbatim from the source file: body sits at 17px — never
          16 — negative tracking only at ≥17px, and the weight ladder skips 500 entirely
          (300 / 400 / 600 / 700). Resize it live with the Dynamic Type control in the
          header; every step scales like <code className="tokenBadge">UIFontMetrics</code>.
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {TYPE_LADDER.map((t) => (
          <div key={t.cls} className="typeRow">
            <span className={t.cls} style={{ overflowWrap: "anywhere" }}>
            {t.label}
          </span>
            <span className="typeSpec type-micro-legal">{t.spec}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function TokensSection() {
  return (
    <Section
      id="tokens"
      index="03 · Foundations"
      title="Spacing, Radii & Elevation"
      desc={
        <>
          A 4px base grid with the source file's exact stops, five working radii, and the
          neomorphic elevation ladder — each step is a dual shadow: alpha-blended black
          below-right, specular white above-left. No value between steps; nothing is
          eyeballed.
        </>
      }
    >
      <div className="specGrid">
        <div className="controlGroup" style={{ gap: "var(--space-md)" }}>
          <p className="type-caption-strong">Spacing · 4px base</p>
          <div className="spacingStack">
            {[
              ["xxs", 4],
              ["xs", 8],
              ["sm", 12],
              ["md", 17],
              ["lg", 24],
              ["xl", 32],
              ["xxl", 48],
              ["section", 80],
            ].map(([name, px]) => (
              <div key={name as string} className="spacingRow">
                <span className="type-micro-legal" style={{ width: 56 }}>{name}</span>
                <span className="spacingBar" style={{ width: px as number }} />
                <span className="type-micro-legal">{px}px</span>
              </div>
            ))}
          </div>
        </div>

        <div className="controlGroup" style={{ gap: "var(--space-md)" }}>
          <p className="type-caption-strong">Radii</p>
          <div className="radiusDemo">
            {[
              ["xs", 5],
              ["sm", 8],
              ["md", 11],
              ["lg", 18],
              ["pill", 9999],
            ].map(([name, r]) => (
              <div key={name as string} className="radiusChip" style={{ borderRadius: r === 9999 ? "9999px" : r }}>
                <span className="type-micro-legal">{name}</span>
                <span className="type-micro-legal">{r === 9999 ? "∞" : `${r}px`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="controlGroup" style={{ gap: "var(--space-md)" }}>
          <p className="type-caption-strong">Elevation · dual-shadow ladder</p>
          <div className="elevationRow" style={{ padding: "var(--space-md)" }}>
            {(["raised-xs", "raised-sm", "raised-md", "raised-lg"] as const).map((step) => (
              <div key={step} className="elevationChip" style={{ boxShadow: `var(--neo-${step})` }}>
                <span className="type-micro-legal">{step}</span>
              </div>
            ))}
          </div>
          <div className="elevationRow" style={{ padding: "var(--space-md)" }}>
            {(["inset-xs", "inset-sm", "inset-md"] as const).map((step) => (
              <div key={step} className="elevationChip" style={{ boxShadow: `var(--neo-${step})` }}>
                <span className="type-micro-legal">{step}</span>
              </div>
            ))}
            <div className="elevationChip" style={{ boxShadow: "var(--neo-product)" }}>
              <span className="type-micro-legal">product</span>
            </div>
          </div>
          <p className="type-fine-print">
            Product shadow is the source's single hero-render shadow —{" "}
            <code className="tokenBadge">3px 5px 30px rgba(0,0,0,.22)</code> — reserved for
            media, never cards or buttons.
          </p>
        </div>
      </div>
    </Section>
  );
}
