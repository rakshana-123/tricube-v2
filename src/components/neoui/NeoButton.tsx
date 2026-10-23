import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { NeoIcon, type IconName } from "./NeoIcon";
import { useHaptics, type HapticPattern } from "./useHaptics";
import styles from "./NeoButton.module.css";

export type NeoButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "pearl";
export type NeoButtonSize = "large" | "regular" | "small";

export interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeoButtonVariant;
  size?: NeoButtonSize;
  icon?: IconName;
  iconPosition?: "leading" | "trailing";
  shape?: "auto" | "pill" | "rounded";
  fullwidth?: boolean;
  /** Showcase pinning: forces a visual state without interaction */
  forcedState?: "default" | "hover" | "active" | "focus";
  haptic?: HapticPattern;
  children?: ReactNode;
}

/**
 * NeoButton — soft-extruded push control.
 * MD anatomy: primary Action-Blue pill (11px 22px padding, scale(0.95) press);
 * dark utility tile-1 with radius 8px; pearl capsule #fafafc radius 11px.
 * Neomorphic layer: dual-shadow extrusion, inset inversion while pressed.
 */
export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  function NeoButton(
    {
      variant = "secondary",
      size = "regular",
      icon,
      iconPosition = "leading",
      shape = "auto",
      fullwidth = false,
      forcedState,
      haptic = "light",
      className,
      children,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const { trigger } = useHaptics();

    return (
      <button
        ref={ref}
        type={rest.type ?? "button"}
        className={[
          styles.button,
          styles[variant],
          styles[size],
          shape === "pill" ? styles.pill : "",
          shape === "rounded" ? styles.rounded : "",
          fullwidth ? styles.fullWidth : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-state={forcedState}
        onPointerDown={(e) => {
          trigger(haptic);
          onPointerDown?.(e);
        }}
        {...rest}
      >
        {icon && iconPosition === "leading" && (
          <NeoIcon name={icon} size={size === "small" ? 16 : 19} className={styles.icon} />
        )}
        {children}
        {icon && iconPosition === "trailing" && (
          <NeoIcon name={icon} size={size === "small" ? 16 : 19} className={styles.icon} />
        )}
      </button>
    );
  },
);
