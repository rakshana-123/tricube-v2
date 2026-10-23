import type { ReactNode } from "react";
import { NeoIcon, type IconName } from "../NeoIcon/NeoIcon";
import { useHaptics } from "../../hooks/useHaptics";
import styles from "./NeoChip.module.css";

export interface NeoChipProps {
  selected?: boolean;
  onClick?(): void;
  icon?: IconName;
  disabled?: boolean;
  /** Showcase pinning */
  forcedState?: "default" | "hover" | "active";
  children: ReactNode;
}

/**
 * NeoChip — configurator chip (MD component-configurator-chip).
 *
 * MD selection treatment kept verbatim: selected chips carry a 2px solid
 * #0071e3 border; unselected chips rest on radius-xs hairline surfaces.
 * The neomorphic read comes from the raised shadow + inset press.
 */
export function NeoChip({
  selected = false,
  onClick,
  icon,
  disabled = false,
  forcedState,
  children,
}: NeoChipProps) {
  const { trigger } = useHaptics();

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      data-state={forcedState}
      className={[styles.chip, selected ? styles.selected : ""].join(" ")}
      onClick={() => {
        trigger("selection");
        onClick?.();
      }}
    >
      {icon && <NeoIcon name={icon} size={16} className={styles.icon} />}
      {children}
    </button>
  );
}
