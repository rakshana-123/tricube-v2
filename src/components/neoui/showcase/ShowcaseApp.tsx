import { FROSTED_RECIPE, NEO_TYPE_SIZES, NeoUI, useNeoUI } from "../NeoUI";
import { NeoButton } from "../NeoButton";
import { NeoIcon } from "../NeoIcon";
import { NeoCard } from "../NeoCard";
import { Section, ColorSection, TypographySection, TokensSection } from "./Foundations";
import { ButtonsSection, FormsSection, CardsNavSection } from "./Gallery";
import { MotionSection, LayoutSection } from "./Patterns";
import "./showcase.css";

const SECTIONS = [
  { id: "color", label: "Color" },
  { id: "typography", label: "Type" },
  { id: "tokens", label: "Tokens" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "cards", label: "Cards" },
  { id: "motion", label: "Motion" },
  { id: "layout", label: "Layout" },
  { id: "dark", label: "Dark" },
];

export function ShowcaseApp() {
  return (
    <NeoUI>
      <ShowcaseInner />
    </NeoUI>
  );
}

function ShowcaseInner() {
  const { theme, toggleTheme, typeKey, setTypeKey } = useNeoUI();

  return (
    <div className="showcase">
      <header
        className="showcaseHeader"
        style={{ backdropFilter: FROSTED_RECIPE, WebkitBackdropFilter: FROSTED_RECIPE }}
      >
        <div className="brand">
          <img src="/tricube-logo-square.jpg" alt="" className="brandMarkImg" />
          <span className="type-body-strong">Neomorphic UI</span>
          <span className="type-fine-print only-ipad">· TRI CUBE brand on Apple tokens</span>
        </div>

        <label
          className="type-fine-print"
          style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}
        >
          <NeoIcon name="sliders" size={15} style={{ color: "var(--text-tertiary)" }} />
          <span className="only-ipad">Dynamic Type</span>
          <select
            aria-label="Dynamic Type size"
            className="dtSelect"
            value={typeKey}
            onChange={(e) => setTypeKey(e.target.value as typeof typeKey)}
          >
            {NEO_TYPE_SIZES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <a href="/studio" className="type-nav-link" style={{ color: "var(--accent-bg)", textDecoration: "none" }}>
          Studio ↗
        </a>

        <NeoButton
          variant="secondary"
          size="small"
          icon={theme === "light" ? "moon" : "sun"}
          onClick={toggleTheme}
        >
          {theme === "light" ? "Dark" : "Light"}
        </NeoButton>
      </header>

      <section className="section" style={{ paddingTop: "var(--space-xxl)" }}>
        <div
          className="neo-container"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}
        >
          <p className="type-caption-strong" style={{ color: "var(--accent-bg)" }}>
            Design system · v1.0
          </p>
          <h1 className="type-hero-display fluid-hero">Depth, without borders.</h1>
          <p
            className="type-lead"
            style={{ maxWidth: "62ch", lineHeight: 1.42, color: "var(--text-secondary)" }}
          >
            A white-primary neomorphic theme carrying the TRI CUBE brand — structure and
            motion from the <span className="tokenBadge">apple/DESIGN.md</span> token
            source, color from the logo: brand blue for interaction, navy depth shadows,
            teal and gold accents. See it running as a product in{" "}
            <a href="/studio" style={{ color: "var(--accent-bg)" }}>
              Studio
            </a>
            .
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <NeoButton
              variant="primary"
              icon="play"
              onClick={() => document.getElementById("buttons")?.scrollIntoView()}
            >
              Explore components
            </NeoButton>
            <NeoButton
              variant="secondary"
              icon="chevron-right"
              iconPosition="trailing"
              onClick={() => document.getElementById("color")?.scrollIntoView()}
            >
              Foundations
            </NeoButton>
          </div>
          <nav
            aria-label="Sections"
            style={{
              display: "flex",
              gap: "var(--space-md)",
              flexWrap: "wrap",
              marginTop: "var(--space-xs)",
            }}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="type-nav-link"
                style={{ color: "var(--accent-bg)", textDecoration: "none" }}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <ColorSection />
      <TypographySection />
      <TokensSection />
      <ButtonsSection />
      <FormsSection />
      <CardsNavSection />
      <MotionSection />
      <LayoutSection />

      <Section
        id="dark"
        index="09 · Themes"
        title="Dark Mode"
        alt
        desc={
          <>
            Dark mode inverts into the logo's navy: canvas #0E263A is the brand ground,
            surfaces step up through #142E52, and the accent brightens to the logo's sky
            blue #26A4E6 (5.55:1 AA). Shadows go near-black navy with faint sky
            speculars so neomorphic depth survives without a single border.
          </>
        }
      >
        <div className="cardGallery">
          <NeoCard>
            <p className="type-tagline">Shadows</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              <code className="tokenBadge">rgba(2,10,20,.5)</code> navy-black shades,{" "}
              <code className="tokenBadge">rgba(120,180,235,.06)</code> sky speculars —
              depth that reads on navy.
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Surfaces</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Canvas #0E263A, raised #142E52, sunken #0B1C33 — the logo navy extended
              into an elevation ramp.
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Accent</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Brand blue yields to logo sky blue <code className="tokenBadge">#26A4E6</code>{" "}
              — 5.55:1 on the navy canvas (AA).
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Frost</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Frosted bars rebase to 74% navy while keeping the exact{" "}
              <code className="tokenBadge">saturate(180%) blur(20px)</code> recipe.
            </p>
          </NeoCard>
        </div>
      </Section>

      <footer className="showcaseFooter">
        <p className="type-caption">
          Tokens extracted from VoltAgent/awesome-design-md · design-md/apple/DESIGN.md v2.2
        </p>
        <p className="type-micro-legal">
          SF Pro cascade · 4px grid · WCAG AA verified pairings · spring micro-interactions
        </p>
      </footer>
    </div>
  );
}
