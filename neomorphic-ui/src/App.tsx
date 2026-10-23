import { useDynamicType, TYPE_SIZES } from "./hooks/useDynamicType";
import { useTheme } from "./hooks/useTheme";
import { NeoButton } from "./components/NeoButton/NeoButton";
import { NeoIcon } from "./components/NeoIcon/NeoIcon";
import { NeoCard } from "./components/NeoCard/NeoCard";
import {
  Section,
  ColorSection,
  TypographySection,
  TokensSection,
} from "./showcase/FoundationsSection";
import {
  ButtonsSection,
  FormsSection,
  CardsNavSection,
} from "./showcase/ComponentsSection";
import { MotionSection, LayoutSection } from "./showcase/PatternsSection";
import "./showcase/showcase.css";

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

export default function App() {
  const { theme, toggle } = useTheme();
  const { sizeKey, setSizeKey } = useDynamicType();

  return (
    <div className="showcase">
      <header className="showcaseHeader">
        <div className="brand">
          <span className="brandMark">
            <NeoIcon name="sparkle" size={18} />
          </span>
          <span className="type-body-strong">Neomorphic UI</span>
          <span className="type-fine-print only-ipad">· Apple design tokens</span>
        </div>

        <label className="type-fine-print" style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
          <NeoIcon name="sliders" size={15} style={{ color: "var(--text-tertiary)" }} />
          <span className="only-ipad">Dynamic Type</span>
          <select
            aria-label="Dynamic Type size"
            value={sizeKey}
            onChange={(e) => setSizeKey(e.target.value as typeof sizeKey)}
            style={{
              border: "none",
              borderRadius: "var(--radius-xs)",
              background: "var(--surface-sunken)",
              boxShadow: "var(--neo-inset-xs)",
              color: "var(--text-primary)",
              padding: "6px 10px",
              font: "var(--type-fine-print)",
            }}
          >
            {TYPE_SIZES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <NeoButton
          variant="secondary"
          size="small"
          icon={theme === "light" ? "moon" : "sun"}
          onClick={toggle}
        >
          {theme === "light" ? "Dark" : "Light"}
        </NeoButton>
      </header>

      {/* ---- Hero ---------------------------------------------------------------- */}
      <section className="section" style={{ paddingTop: "var(--space-xxl)" }}>
        <div className="neo-container" style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <p className="type-caption-strong" style={{ color: "var(--accent)" }}>
            Design system · v1.0
          </p>
          <h1 className="type-hero-display fluid-hero">
            Depth, without borders.
          </h1>
          <p
            className="type-lead"
            style={{ maxWidth: "62ch", lineHeight: 1.42, color: "var(--text-secondary)" }}
          >
            A neomorphic UI theme built on Apple's design language — every color, radius,
            shadow offset and type stop extracted from the{" "}
            <span className="tokenBadge">apple/DESIGN.md</span> token source. Soft extruded
            surfaces, recessed wells, frosted navigation, spring micro-interactions.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <NeoButton variant="primary" icon="play" onClick={() => document.getElementById("buttons")?.scrollIntoView()}>
              Explore components
            </NeoButton>
            <NeoButton variant="secondary" icon="chevron-right" iconPosition="trailing" onClick={() => document.getElementById("color")?.scrollIntoView()}>
              Foundations
            </NeoButton>
          </div>
          <nav aria-label="Sections" style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginTop: "var(--space-xs)" }}>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="type-nav-link" style={{ color: "var(--accent)", textDecoration: "none" }}>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <ColorSection theme={theme} />
      <TypographySection />
      <TokensSection />
      <ButtonsSection />
      <FormsSection />
      <CardsNavSection />
      <MotionSection />
      <LayoutSection />

      {/* ---- Dark mode deep dive --------------------------------------------------- */}
      <Section
        id="dark"
        index="09 · Themes"
        title="Dark Mode"
        alt
        desc={
          <>
            The showcase you're reading is the dark variant — flip the header toggle. Dark
            neomorphism survives by rebalancing the physics: shadows go near-black at
            higher alpha, highlights become ~5% white speculars, and surfaces step through
            the source's tile ladder (#252527 → #272729 → #2a2a2c) so elevation is still
            legible without a single border.
          </>
        }
      >
        <div className="cardGallery">
          <NeoCard>
            <p className="type-tagline">Shadows</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              <code className="tokenBadge">rgba(0,0,0,.5)</code> shades,{" "}
              <code className="tokenBadge">rgba(255,255,255,.05)</code> speculars — deeper
              contrast to read as depth on dark canvases.
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Surfaces</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Canvas #252527, raised #2a2a2c, sunken #212123 — the source's dark tile set
              extended into an elevation ramp.
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Accent</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Action Blue yields to Sky Blue <code className="tokenBadge">#2997ff</code>{" "}
              (6.3:1 on canvas), per the source's primary-on-dark token.
            </p>
          </NeoCard>
          <NeoCard>
            <p className="type-tagline">Frost</p>
            <p className="type-body" style={{ color: "var(--text-secondary)" }}>
              Frosted bars rebase to 72% tile-3 while keeping the exact{" "}
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
