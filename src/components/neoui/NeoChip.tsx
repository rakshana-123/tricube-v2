import type { ReactNode, HTMLAttributes } from "react";
import { NeoIcon, type IconName } from "./NeoIcon";
import { useHaptics } from "./useHaptics";
import styles from "./NeoChip.module.css";

export interface NeoChipProps extends HTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onClick?(): void;
  icon?: IconName;
  disabled?: boolean;
  forcedState?: "default" | "hover" | "active";
  children: ReactNode;
}

/**
 * NeoChip — configurator chip. MD selection treatment verbatim: selected
 * chips carry a 2px solid focus-blue border; unselected chips rest on
 * radius-md raised surfaces.
 */
export function NeoChip({
  selected = false,
  onClick,
  icon,
  disabled = false,
  forcedState,
  className,
  children,
  ...rest
}: NeoChipProps) {
  const { trigger } = useHaptics();

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      data-state={forcedState}
      className={[styles.chip, selected ? styles.selected : "", className ?? ""].filter(Boolean).join(" ")}
      onClick={() => {
        trigger("selection");
        onClick?.();
      }}
      {...rest}
    >
      {icon && <NeoIcon name={icon} size={16} className={styles.icon} />}
      {children}
    </button>
  );
}
