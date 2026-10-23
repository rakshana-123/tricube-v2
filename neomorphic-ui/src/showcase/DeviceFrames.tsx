import { useState } from "react";
import { NeoCard } from "../components/NeoCard/NeoCard";
import { NeoChip } from "../components/NeoChip/NeoChip";
import { NeoIcon } from "../components/NeoIcon/NeoIcon";
import { NeoNavBar, NeoTabBar } from "../components/NeoNavBar/NeoNavBar";
import { NeoButton } from "../components/NeoButton/NeoButton";
import { NeoInput } from "../components/NeoInput/NeoInput";
import { NeoSegmented } from "../components/NeoSegmented/NeoSegmented";
import { NeoSlider } from "../components/NeoSlider/NeoSlider";
import { NeoToggle } from "../components/NeoToggle/NeoToggle";

/**
 * DeviceFrames — iPhone (390pt) and iPad-range frames running a miniature
 * adaptive app assembled from the library. Demonstrates: safe-area-inset
 * handling under a notch + home indicator, frosted nav, content grid that
 * reflows between the MD breakpoints, and every control working in situ.
 */
export function PhoneFrame() {
  const [tab, setTab] = useState("home");
  const [notify, setNotify] = useState(true);
  const [brightness, setBrightness] = useState(65);
  const [freq, setFreq] = useState("daily");

  return (
    <div className="device">
      <div className="deviceFrame">
        <div className="deviceScreen">
          <div className="notch" />
          <div className="deviceApp">
            <NeoNavBar
              title="Studio"
              leading={[{ icon: "chevron-left", label: "Back" }]}
              trailing={[{ icon: "bell", label: "Notifications" }]}
            />
            <div
              className="safe-area-x"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-lg)",
                padding: "var(--space-lg)",
              }}
            >
              <p className="type-display-md" style={{ letterSpacing: "-0.374px" }}>
                Good morning.
              </p>
              <NeoCard padding="none">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "var(--space-md)",
                    padding: "var(--space-lg)",
                  }}
                >
                  <div>
                    <NeoIcon name="sparkle" size={22} style={{ color: "var(--accent)" }} />
                    <p className="type-caption-strong" style={{ marginTop: "var(--space-xs)" }}>
                      Focus streak
                    </p>
                    <p className="type-fine-print">12 days</p>
                  </div>
                  <div>
                    <NeoIcon name="grid" size={22} style={{ color: "var(--accent)" }} />
                    <p className="type-caption-strong" style={{ marginTop: "var(--space-xs)" }}>
                      Projects
                    </p>
                    <p className="type-fine-print">4 active</p>
                  </div>
                </div>
              </NeoCard>
              <NeoSegmented
                full
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                ]}
                value={freq}
                onValueChange={setFreq}
              />
              <NeoSlider
                label="Brightness"
                value={brightness}
                onValueChange={setBrightness}
                ticks={[0, 25, 50, 75, 100]}
              />
              <NeoToggle
                checked={notify}
                onCheckedChange={setNotify}
                label="Quiet notifications"
                helper="Deliver as a single digest"
              />
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <NeoChip icon="heart" selected>
                  Favorites
                </NeoChip>
                <NeoChip icon="sparkle">For you</NeoChip>
              </div>
              <NeoButton variant="primary" fullwidth icon="play">
                Start session
              </NeoButton>
            </div>
            <div style={{ marginTop: "auto", padding: "var(--space-md) var(--space-lg)" }}>
              <NeoTabBar
                tabs={[
                  { icon: "house", label: "Home", active: tab === "home", onClick: () => setTab("home") },
                  { icon: "grid", label: "Work", active: tab === "work", onClick: () => setTab("work") },
                  { icon: "person", label: "Profile", active: tab === "me", onClick: () => setTab("me") },
                ]}
              />
            </div>
          </div>
          <div className="homeIndicator" />
        </div>
      </div>
      <p className="type-caption">iPhone · 390pt · safe areas + floating tab bar</p>
    </div>
  );
}

export function TabletFrame() {
  const [query, setQuery] = useState("");

  return (
    <div className="device deviceTablet">
      <div className="deviceFrame">
        <div className="deviceScreen">
          <div className="deviceApp">
            <NeoNavBar title="Design System" global />
            <NeoNavBar
              title="Components"
              leading={[{ icon: "house", label: "Home" }]}
              trailing={[
                { icon: "search", label: "Search" },
                { icon: "sliders", label: "Filters" },
              ]}
            />
            <div
              className="safe-area-x"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-lg)",
                padding: "var(--space-lg)",
              }}
            >
              <NeoCard variant="sunken" padding="md">
                <NeoInput
                  label="Search the library"
                  placeholder="Buttons, tokens, motion…"
                  leadingIcon="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                  <NeoButton variant="primary" size="small">
                    Search
                  </NeoButton>
                  <NeoButton variant="ghost" size="small">
                    Reset
                  </NeoButton>
                </div>
              </NeoCard>
              {["Surfaces", "Controls", "Motion", "Layout"].map((t, i) => (
                <NeoCard key={t} data-interactive>
                  <p className="type-tagline">0{i + 1}</p>
                  <p className="type-body" style={{ color: "var(--text-secondary)" }}>
                    {t}
                  </p>
                  <p className="type-fine-print" style={{ marginTop: "var(--space-xs)" }}>
                    Two-column grid · 24px gutter
                  </p>
                </NeoCard>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="type-caption">iPad · 2-column adaptive grid · global + sub nav</p>
    </div>
  );
}
