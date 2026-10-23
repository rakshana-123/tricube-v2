import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import "./neoui.css";

export type NeoTheme = "light" | "dark";

/**
 * MD material-frosted recipe, verbatim. Applied as an inline style because
 * host CSS pipelines (Tailwind v4 → LightningCSS) strip `backdrop-filter`
 * declarations that reference unsubstituted var() during prefix transforms.
 */
export const FROSTED_RECIPE = "saturate(180%) blur(20px)";

/** iOS content-size ladder — every type token scales through --dt-scale. */
export const NEO_TYPE_SIZES = [
  { key: "m", label: "M", scale: 1 },
  { key: "l", label: "L", scale: 1.12 },
  { key: "xl", label: "XL", scale: 1.25 },
  { key: "ax", label: "AX", scale: 1.6 },
] as const;

export type NeoTypeKey = (typeof NEO_TYPE_SIZES)[number]["key"];

interface NeoUIState {
  theme: NeoTheme;
  setTheme(t: NeoTheme): void;
  toggleTheme(): void;
  typeKey: NeoTypeKey;
  setTypeKey(k: NeoTypeKey): void;
}

const NeoUIContext = createContext<NeoUIState | null>(null);

export function useNeoUI(): NeoUIState {
  const ctx = useContext(NeoUIContext);
  if (!ctx) throw new Error("useNeoUI must be used inside <NeoUI>");
  return ctx;
}

/**
 * NeoUI — scoped theme root. Renders the `.neo-ui` wrapper that carries all
 * design tokens, owns light/dark switching (persisted, preferring
 * prefers-color-scheme, overridable via ?neotheme=) and Dynamic Type scaling.
 *
 * SSR-safe: resolves user preferences in an effect, so server and first
 * client render agree (light / M), then settle without hydration mismatch.
 */
export function NeoUI({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NeoTheme>("light");
  const [typeKey, setTypeKey] = useState<NeoTypeKey>("m");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("neotheme");
    const stored = window.localStorage.getItem("neo-ui-theme");
    const storedType = window.localStorage.getItem("neo-ui-dt") as NeoTypeKey | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (param === "light" || param === "dark") setTheme(param);
    else if (stored === "light" || stored === "dark") setTheme(stored);
    else if (prefersDark) setTheme("dark");

    if (storedType && NEO_TYPE_SIZES.some((s) => s.key === storedType)) {
      setTypeKey(storedType);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("neo-ui-theme", theme);
  }, [theme]);
  useEffect(() => {
    window.localStorage.setItem("neo-ui-dt", typeKey);
  }, [typeKey]);

  const value = useMemo<NeoUIState>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      typeKey,
      setTypeKey,
    }),
    [theme, typeKey],
  );

  const scale = NEO_TYPE_SIZES.find((s) => s.key === typeKey)?.scale ?? 1;

  return (
    <NeoUIContext.Provider value={value}>
      <div className="neo-ui" data-theme={theme} style={{ "--dt-scale": scale } as CSSProperties}>
        {children}
      </div>
    </NeoUIContext.Provider>
  );
}
