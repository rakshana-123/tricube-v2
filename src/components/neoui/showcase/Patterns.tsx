import { useState } from "react";
import { Section } from "./Foundations";
import { NeoButton } from "../NeoButton";
import { NeoIcon } from "../NeoIcon";
import { NeoToggle } from "../NeoToggle";
import { useHaptics, type HapticPattern } from "../useHaptics";

const HAPTIC_ROWS: { pattern: HapticPattern; uikit: string; web: string }[] = [
  { pattern: "selection", uikit: "UISelectionFeedbackGenerator", web: "vibrate(8)" },
  { pattern: "light", uikit: "UIImpactFeedbackGenerator(.light)", web: "vibrate(12)" },
  { pattern: "medium", uikit: "UIImpactFeedbackGenerator(.medium)", web: "vibrate(20)" },
  { pattern: "heavy", uikit: "UIImpactFeedbackGenerator(.heavy)", web: "vibrate(30)" },
  { pattern: "success", uikit: "UINotificationFeedbackGenerator(.success)", web: "vibrate([10,40,18])" },
  { pattern: "warning", uikit: "UINotificationFeedbackGenerator(.warning)", web: "vibrate([22,40,22])" },
  { pattern: "error", uikit: "UINotificationFeedbackGenerator(.error)", web: "vibrate([30,60,30,60,30])" },
];

export function MotionSection() {
  const { trigger } = useHaptics();
  const [spring, setSpring] = useState(false);

  return (
    <Section
      id="motion"
      index="07 · Patterns"
      title="Micro-interactions & Haptics"
      alt
      desc={
        <>
          Press physics are shared by every control: snap down in 120ms on an ease-out,
          release on a 420ms over-damped spring — the CSS analogue of UIKit's{" "}
          <code className="tokenBadge">spring(stiffness: 500, damping: 30)</code> — while
          the neomorphic shadow inverts so the element reads as pushed into the surface.
        </>
      }
    >
      <div className="padGrid">
        <button type="button" className="bigPad" onPointerDown={() => trigger("medium")}>
          <NeoIcon name="sparkle" size={26} style={{ color: "var(--accent-bg)" }} />
          <span className="type-body-strong">Press me</span>
          <span className="type-fine-print">snap-down · spring-release · shadow inversion</span>
        </button>

        <div className="bigPad" style={{ gap: "var(--space-md)" }}>
          <NeoToggle checked={spring} onCheckedChange={setSpring} label="Spring" />
          <span className="type-fine-print">
            The thumb rides the spring token —{" "}
            <code className="tokenBadge">cubic-bezier(.34,1.56,.64,1)</code>
          </span>
        </div>

        <div className="bigPad" style={{ gap: "var(--space-sm)" }}>
          <div
            style={{
              display: "flex",
              gap: "var(--space-xs)",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {(["selection", "light", "medium", "heavy"] as const).map((p) => (
              <NeoButton key={p} size="small" variant="secondary" haptic={p}>
                {p}
              </NeoButton>
            ))}
          </div>
          <span className="type-fine-print">
            Haptics map to the Vibration API where supported (Android/Chrome); they are a
            silent no-op on iOS Safari — never a crash, never a delay.
          </span>
        </div>
      </div>

      <h3 className="subhead type-tagline">Haptic mapping table</h3>
      <table className="hapticTable">
        <thead>
          <tr>
            <th className="type-fine-print">Semantic</th>
            <th className="type-fine-print">UIKit generator (SwiftUI port)</th>
            <th className="type-fine-print">Web Vibration API</th>
            <th className="type-fine-print">Try</th>
          </tr>
        </thead>
        <tbody>
          {HAPTIC_ROWS.map((r) => (
            <tr key={r.pattern}>
              <td className="type-caption-strong">{r.pattern}</td>
              <td className="type-caption">{r.uikit}</td>
              <td className="type-caption">{r.web}</td>
              <td>
                <NeoButton size="small" variant="ghost" haptic={r.pattern}>
                  fire
                </NeoButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="type-fine-print" style={{ marginTop: "var(--space-sm)" }}>
        The <code className="tokenBadge">fire</code> buttons trigger via the same{" "}
        <code className="tokenBadge">useHaptics()</code> hook every component uses.
      </p>
    </Section>
  );
}

export function LayoutSection() {
  return (
    <Section
      id="layout"
      index="08 · Patterns"
      title="Layout · Safe Areas, Dynamic Type, Adaptivity"
      desc={
        <>
          The responsive grid uses the source breakpoints (1440 / 1068 / 834 / 734 / 640 /
          480) with 44px minimum touch targets. Content respects{" "}
          <code className="tokenBadge">env(safe-area-inset-*)</code> on all edges, and the
          type ladder scales through the Dynamic Type control in the header — the same
          system the live <a className="type-caption" href="/studio" style={{ color: "var(--accent-bg)" }}>Studio app</a> uses.
        </>
      }
    >
      <h3 className="subhead type-tagline">Grid collapse · 5 → 4 → 3 → 2 → 1</h3>
      <div className="neo-grid-tiles">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="gridDemoTile">
            <span className="type-caption-strong">0{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="type-fine-print" style={{ marginTop: "var(--space-sm)" }}>
        Resize the window — tiles collapse exactly at the source breakpoints.
      </p>

      <h3 className="subhead type-tagline">Safe area insets</h3>
      <div className="safeStrip">
        <div className="safeCell">
          <p className="type-micro-legal">inset-left</p>
          <p className="type-fine-print">env(safe-area-inset-left)</p>
        </div>
        <div className="safeCell">
          <p className="type-micro-legal">content</p>
          <p className="type-fine-print">viewport-fit=cover</p>
        </div>
        <div className="safeCell">
          <p className="type-micro-legal">inset-right</p>
          <p className="type-fine-print">env(safe-area-inset-right)</p>
        </div>
      </div>
      <p className="type-fine-print" style={{ marginTop: "var(--space-sm)" }}>
        In production these clear the notch and home indicator on device.
      </p>
    </Section>
  );
}
