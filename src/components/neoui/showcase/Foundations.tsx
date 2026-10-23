import type { ReactNode } from "react";
import { contrastRatio, wcagGrade } from "../utils/contrast";
import { useNeoUI } from "../NeoUI";

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
          <p className="sectionIndex type-caption-strong">{index}</p>
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
  fg: string;
  note: string;
}

const LIGHT_SWATCHES: SwatchDef[] = [
  { name: "canvas · white primary", hex: "#ffffff", fg: "#1d1d1f", note: "Dominant background — all screens" },
  { name: "surface-sunken", hex: "#f5f5f7", fg: "#1d1d1f", note: "Recessed wells + section bands" },
  { name: "brand-blue · accent", hex: "#265ca0", fg: "#ffffff", note: "All interaction — 6.73:1 on white (AA)" },
  { name: "brand-blue-deep", hex: "#1c4680", fg: "#ffffff", note: "Hover + pressed states" },
  { name: "brand-navy · inverse", hex: "#0e263a", fg: "#f5f7fa", note: "Inverse tiles + dark ground — 15.5:1" },
  { name: "ink", hex: "#1d1d1f", fg: "#ffffff", note: "Headlines, body — 16.7:1 on canvas" },
  { name: "ink-muted-80", hex: "#333333", fg: "#ffffff", note: "Secondary text — 12.6:1" },
  { name: "ink-muted", hex: "#6b6b70", fg: "#ffffff", note: "Tertiary — 5.3:1 (AA)" },
  { name: "brand-teal · badge", hex: "#2ea5a1", fg: "#ffffff", note: "Live dots, badges — decorative" },
  { name: "brand-gold · premium", hex: "#c9962e", fg: "#ffffff", note: "Premium markers — decorative" },
];

const DARK_SWATCHES: SwatchDef[] = [
  { name: "canvas · brand navy", hex: "#0e263a", fg: "#f5f7fa", note: "Logo navy as dark canvas" },
  { name: "surface-raised", hex: "#142e52", fg: "#f5f7fa", note: "Raised components — 13:1" },
  { name: "surface-sunken", hex: "#0b1c33", fg: "#f5f7fa", note: "Recessed wells" },
  { name: "accent · sky blue", hex: "#26a4e6", fg: "#0e263a", note: "Interaction on dark — 5.55:1 (AA)" },
  { name: "text-primary", hex: "#f5f7fa", fg: "#0e263a", note: "Body on dark — 15.5:1" },
  { name: "text-secondary", hex: "#c8d4e2", fg: "#0e263a", note: "Secondary copy" },
  { name: "badge-teal (dark)", hex: "#3fc0bb", fg: "#0e263a", note: "Live dots on dark" },
  { name: "badge-gold (dark)", hex: "#dcae4e", fg: "#0e263a", note: "Premium on dark" },
  { name: "error (dark)", hex: "#ff6f66", fg: "#0e263a", note: "Form errors — 5:1" },
];

function Swatch({ s }: { s: SwatchDef }) {
  const ratio = contrastRatio(s.fg, s.hex);
  const grade = wcagGrade(ratio);
  return (
    <div className="swatchCard">
      <div className="swatchChip" style={{ background: s.hex }} />
      <div className="swatchMeta">
        <p className="type-caption-strong">{s.name}</p>
        <p className="type-micro-legal">
          {s.hex.toUpperCase()} · {s.note}
        </p>
        <span className={`contrastBadge ${grade.aa ? "contrastPass" : "contrastWarn"}`}>
          {grade.label} {grade.aaa ? "AAA" : grade.aa ? "AA" : "AA-L"}
        </span>
      </div>
    </div>
  );
}

export function ColorSection() {
  const { theme } = useNeoUI();
  const swatches = theme === "dark" ? DARK_SWATCHES : LIGHT_SWATCHES;
  return (
    <Section
      id="color"
      index="01 · Foundations"
      title="Color"
      desc={
        <>
          White-primary canvas with the TRI CUBE brand system pixel-sampled from the logo
          set: brand blue #265CA0 carries every interaction, navy #0E263A is the inverse
          and dark ground, teal marks live states, gold marks premium. Depth comes from{" "}
          <code className="tokenBadge">rgba(14,38,58,α)</code> navy-tinted shadows — no
          gradients, no borders. Each swatch badge is its live WCAG ratio.
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
          header.
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
                <span className="type-micro-legal" style={{ width: 56 }}>
                  {name}
                </span>
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
              <div
                key={name as string}
                className="radiusChip"
                style={{ borderRadius: r === 9999 ? "9999px" : (r as number) }}
              >
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
