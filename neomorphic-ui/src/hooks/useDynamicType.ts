import { useCallback, useEffect, useState } from "react";

/**
 * Dynamic Type scaling — the web analogue of iOS Dynamic Type / the MD
 * "super-slot" hero fluid rules. Sets --dt-scale on <html>; every type
 * token in tokens.css is defined as calc(size * var(--dt-scale)) so the
 * whole ladder scales proportionally, like UIKit's UIFontMetrics.
 *
 * Steps mirror iOS content size categories (XS…AX) rather than raw
 * percentages, and respect the MD rule that hero tracking stays negative
 * at every size.
 */
export const TYPE_SIZES = [
  { key: "xs", label: "XS", scale: 0.875 },
  { key: "m", label: "M (default)", scale: 1 },
  { key: "l", label: "L", scale: 1.12 },
  { key: "xl", label: "XL", scale: 1.25 },
  { key: "xxl", label: "2XL", scale: 1.4 },
  { key: "ax", label: "AX①", scale: 1.6 },
] as const;

export type TypeSizeKey = (typeof TYPE_SIZES)[number]["key"];

const STORAGE_KEY = "neo-ui-dt";

export function useDynamicType() {
  const [sizeKey, setSizeKey] = useState<TypeSizeKey>(() => {
    const stored =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as TypeSizeKey | null)
        : null;
    return stored && TYPE_SIZES.some((s) => s.key === stored) ? stored : "m";
  });

  useEffect(() => {
    const entry = TYPE_SIZES.find((s) => s.key === sizeKey) ?? TYPE_SIZES[1];
    document.documentElement.style.setProperty("--dt-scale", String(entry.scale));
    window.localStorage.setItem(STORAGE_KEY, sizeKey);
  }, [sizeKey]);

  const cycle = useCallback(() => {
    setSizeKey((k) => {
      const i = TYPE_SIZES.findIndex((s) => s.key === k);
      return TYPE_SIZES[(i + 1) % TYPE_SIZES.length].key;
    });
  }, []);

  return { sizeKey, setSizeKey, cycle };
}
