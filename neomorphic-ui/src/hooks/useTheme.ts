import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "neo-ui-theme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  /* Deep link ?theme=light|dark outranks storage — makes both palettes
     screenshot- and share-able. */
  const param = new URLSearchParams(window.location.search).get("theme");
  if (param === "light" || param === "dark") return param;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/dark theme controller. Writes `data-theme` on <html> so the CSS
 * custom-property palettes in tokens.css swap atomically, persists the
 * override, and defaults to `prefers-color-scheme`.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return { theme, setTheme, toggle };
}
