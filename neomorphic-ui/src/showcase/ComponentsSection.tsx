import { useState } from "react";
import { Section } from "./FoundationsSection";
import { NeoButton, type NeoButtonVariant } from "../components/NeoButton/NeoButton";
import { NeoCard } from "../components/NeoCard/NeoCard";
import { NeoChip } from "../components/NeoChip/NeoChip";
import { NeoIcon } from "../components/NeoIcon/NeoIcon";
import { NeoInput } from "../components/NeoInput/NeoInput";
import { NeoNavBar, NeoTabBar } from "../components/NeoNavBar/NeoNavBar";
import { NeoSegmented } from "../components/NeoSegmented/NeoSegmented";
import { NeoSlider } from "../components/NeoSlider/NeoSlider";
import { NeoToggle } from "../components/NeoToggle/NeoToggle";

const FORCED_STATES = ["default", "hover", "active", "focus"] as const;
type Forced = (typeof FORCED_STATES)[number];

const BUTTON_MATRIX: { variant: NeoButtonVariant; label: string }[] = [
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost" },
  { variant: "dark", label: "Dark utility" },
  { variant: "pearl", label: "Pearl capsule" },
];

export function ButtonsSection() {
  return (
    <Section
      id="buttons"
      index="04 · Components"
      title="Buttons"
      alt
      desc={
        <>
          Every variant across the five canonical states — the last column is the real{" "}
          <code className="tokenBadge">:disabled</code> attribute. Press anything: pressed
          controls invert to inset shadows and scale to 0.95 (the source file's exact press
          spec), then release on the spring curve with a light haptic.
        </>
      }
    >
      <div className="matrixRow matrixHeader">
        <span className="type-caption">Variant</span>
        {FORCED_STATES.map((s) => (
          <span key={s} className="type-caption" style={{ paddingLeft: "var(--space-sm)" }}>
            {s}
          </span>
        ))}
        <span className="type-caption" style={{ paddingLeft: "var(--space-sm)" }}>disabled</span>
      </div>

      {BUTTON_MATRIX.map(({ variant, label }) => (
        <div key={variant} className="matrixRow">
          <span className="type-caption-strong">{label}</span>
          {FORCED_STATES.map((state) => (
            <div key={state} className="matrixCell">
              <NeoButton
                variant={variant}
                forcedState={state === "default" ? undefined : (state as Forced)}
              >
                {label}
              </NeoButton>
            </div>
          ))}
          <div className="matrixCell">
            <NeoButton variant={variant} disabled>
              {label}
            </NeoButton>
          </div>
        </div>
      ))}

      <h3 className="subhead type-tagline">Sizes & icons</h3>
      <div className="matrixCell" style={{ minHeight: 0, gap: "var(--space-lg)", flexWrap: "wrap" }}>
        <NeoButton variant="primary" size="large" icon="play">
          Start free trial
        </NeoButton>
        <NeoButton variant="secondary" size="regular" icon="chevron-right" iconPosition="trailing">
          Learn more
        </NeoButton>
        <NeoButton variant="dark" size="small" icon="search">
          Search
        </NeoButton>
        <NeoButton variant="ghost" size="small" icon="close">
          Cancel
        </NeoButton>
      </div>
    </Section>
  );
}

export function FormsSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("not-an-email");
  const [plan, setPlan] = useState("pro");
  const [sync, setSync] = useState(true);
  const [beta, setBeta] = useState(false);
  const [volume, setVolume] = useState(40);
  const [chips, setChips] = useState<string[]>(["storage"]);

  return (
    <Section
      id="forms"
      index="05 · Components"
      title="Forms & Controls"
      desc={
        <>
          Inputs sit in recessed wells instead of boxes — structure from shadow, not
          borders. Focus keeps Apple's exact <code className="tokenBadge">2px solid</code>{" "}
          ring, layered over a bloom of the focus tint. The first row pins states for
          inspection; everything below is live.
        </>
      }
    >
      <div className="controlStack">
        <div className="controlGroup">
          <p className="type-caption-strong">Input states</p>
          <NeoInput label="Default" placeholder="Ada Lovelace" forcedState="default" />
          <NeoInput label="Hover" placeholder="Ada Lovelace" forcedState="hover" />
          <NeoInput label="Focus" placeholder="Ada Lovelace" forcedState="focus" />
          <NeoInput
            label="Error"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage="Enter a valid email address."
            leadingIcon="person"
            trailingIcon="close"
          />
          <NeoInput label="Disabled" placeholder="Unavailable" disabled />
        </div>

        <div className="controlGroup">
          <p className="type-caption-strong">Live inputs</p>
          <NeoInput
            label="Full name"
            placeholder="Ada Lovelace"
            leadingIcon="person"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helper="As it should appear on certificates."
          />
          <NeoInput
            label="Search"
            placeholder="Components, tokens, motion…"
            leadingIcon="search"
            size="large"
          />
          <NeoSegmented
            label="Plan"
            full
            options={[
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
              { value: "team", label: "Team" },
            ]}
            value={plan}
            onValueChange={setPlan}
          />
        </div>

        <div className="controlGroup">
          <p className="type-caption-strong">Toggles & sliders</p>
          <NeoToggle
            checked={sync}
            onCheckedChange={setSync}
            label="Sync over cellular"
            helper="Spring animation + selection haptic"
          />
          <NeoToggle
            checked={beta}
            onCheckedChange={setBeta}
            label="Join beta channel"
            helper="Ride the spring release curve"
          />
          <NeoToggle checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
          <NeoSlider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            ticks={[0, 25, 50, 75, 100]}
          />
          <NeoSlider label="Disabled slider" value={72} onValueChange={() => {}} disabled />
        </div>

        <div className="controlGroup">
          <p className="type-caption-strong">Chips · configurator</p>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            {[
              { id: "storage", label: "512GB", icon: "grid" as const },
              { id: "color", label: "Graphite", icon: "sparkle" as const },
              { id: "care", label: "Care+", icon: "heart" as const },
            ].map((c) => (
              <NeoChip
                key={c.id}
                icon={c.icon}
                selected={chips.includes(c.id)}
                onClick={() =>
                  setChips((prev) =>
                    prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                  )
                }
              >
                {c.label}
              </NeoChip>
            ))}
            <NeoChip disabled>Unavailable</NeoChip>
          </div>
          <p className="type-fine-print">
            Selected chips carry the source's verbatim selection treatment — a 2px solid{" "}
            <code className="tokenBadge">#0071e3</code> border — over the raised pearl body.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginTop: "var(--space-xs)" }}>
            {(["house", "search", "heart", "gear", "person", "bell", "sun", "moon", "sliders", "sparkle", "wifi", "battery", "play", "pause", "plus", "check", "close", "grid", "chevron-left", "chevron-right"] as const).map((n) => (
              <NeoIcon key={n} name={n} size={22} style={{ color: "var(--icon-stroke)" }} />
            ))}
          </div>
          <p className="type-fine-print">
            Iconography: 24pt grid · 1.75pt stroke · round caps — one weight everywhere.
          </p>
        </div>
      </div>
    </Section>
  );
}

export function CardsNavSection() {
  const [tab, setTab] = useState("home");
  return (
    <Section
      id="cards"
      index="06 · Components"
      title="Cards & Navigation"
      alt
      desc={
        <>
          Cards are 18px-radius, 24px-padded surfaces on the elevation ladder. Navigation
          is frosted exactly per the source recipe —{" "}
          <code className="tokenBadge">saturate(180%) blur(20px)</code> at 72% canvas — in
          the 44px dark global and 52px frosted sub-nav heights.
        </>
      }
    >
      <div className="cardGallery">
        <NeoCard>
          <p className="type-tagline">Raised</p>
          <p className="type-body" style={{ color: "var(--text-secondary)" }}>
            The primary content container — extruded one step above the canvas.
          </p>
        </NeoCard>
        <NeoCard variant="pearl">
          <p className="type-tagline">Pearl</p>
          <p className="type-body" style={{ color: "var(--text-secondary)" }}>
            Lighter lift for dense lists and repeated tiles.
          </p>
        </NeoCard>
        <NeoCard variant="sunken">
          <p className="type-tagline">Sunken</p>
          <p className="type-body" style={{ color: "var(--text-secondary)" }}>
            A recessed well for embedded groups and media.
          </p>
        </NeoCard>
        <NeoCard variant="outlined">
          <p className="type-tagline">Outlined</p>
          <p className="type-body" style={{ color: "var(--text-secondary)" }}>
            The store-utility card — the one shipped border, a 1px hairline.
          </p>
        </NeoCard>
        <NeoCard variant="dark">
          <p className="type-tagline">Inverse tile</p>
          <p className="type-body" style={{ color: "rgba(245,245,247,0.8)" }}>
            Tile-1 #272729 for edge-to-edge dark sections on light canvases.
          </p>
        </NeoCard>
        <NeoCard data-interactive>
          <p className="type-tagline">Interactive</p>
          <p className="type-body" style={{ color: "var(--text-secondary)" }}>
            Hover lifts one elevation step; press inverts. Try it.
          </p>
        </NeoCard>
      </div>

      <h3 className="subhead type-tagline">Frosted navigation</h3>
      <div className="navDemo">
        <NeoNavBar
          global
          title="Global · 44px"
          leading={[{ icon: "chevron-left", label: "Back" }]}
          trailing={[{ icon: "search", label: "Search" }, { icon: "person", label: "Account" }]}
        />
        <NeoNavBar
          title="Sub-nav frosted · 52px"
          leading={[{ icon: "house", label: "Home" }]}
          trailing={[{ icon: "bell", label: "Notifications" }, { icon: "gear", label: "Settings" }]}
        />
        <div className="navDemoBody">
          <div className="navScroll" aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="navScrollRow" />
            ))}
          </div>
          <p className="type-fine-print">
            Scroll the well — the bars above stay frosted over passing content, and both
            clear <code className="tokenBadge">env(safe-area-inset-top)</code> on devices
            with a notch.
          </p>
          <NeoTabBar
            tabs={[
              { icon: "house", label: "Home", active: tab === "home", onClick: () => setTab("home") },
              { icon: "grid", label: "Browse", active: tab === "browse", onClick: () => setTab("browse") },
              { icon: "heart", label: "Saved", active: tab === "saved", onClick: () => setTab("saved") },
              { icon: "person", label: "Profile", active: tab === "me", onClick: () => setTab("me") },
            ]}
          />
        </div>
      </div>
    </Section>
  );
}
