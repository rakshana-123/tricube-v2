import type { HTMLAttributes, ReactNode } from "react";
import styles from "./NeoCard.module.css";

export type NeoCardVariant = "raised" | "pearl" | "sunken" | "outlined" | "dark";

export interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: NeoCardVariant;
  /** MD store-utility-card padding token: 24px */
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * NeoCard — content grouping on a soft-extruded surface.
 * MD geometry: radius 18px, 24px padding. Variants map to the MD surface
 * ladder — pearl raised, sunken well, hairline-outlined utility card,
 * inverse tile.
 */
export function NeoCard({
  variant = "raised",
  padding = "md",
  className,
  children,
  ...rest
}: NeoCardProps) {
  return (
    <div
      className={[styles.card, styles[variant], styles["pad-" + padding], className ?? ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
