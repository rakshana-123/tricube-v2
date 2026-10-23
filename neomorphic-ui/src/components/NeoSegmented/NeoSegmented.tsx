import { useId } from "react";
import { useHaptics } from "../../hooks/useHaptics";
import styles from "./NeoSegmented.module.css";

export interface SegmentOption {
  value: string;
  label: string;
}

export interface NeoSegmentedProps {
  options: SegmentOption[];
  value: string;
  onValueChange(value: string): void;
  label?: string;
  disabled?: boolean;
  full?: boolean;
}

/**
 * NeoSegmented — UISegmentedControl.
 *
 * The whole control is one recessed well; the selected segment is a raised
 * pearl cap that slides between slots on the spring token with a selection
 * haptic. Keyboard: arrow keys move selection (Radio-group semantics).
 */
export function NeoSegmented({
  options,
  value,
  onValueChange,
  label,
  disabled = false,
  full = false,
}: NeoSegmentedProps) {
  const { trigger } = useHaptics();
  const id = useId();
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const select = (v: string) => {
    if (disabled || v === value) return;
    trigger("selection");
    onValueChange(v);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = options[(index + 1) % options.length];
      select(next.value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = options[(index - 1 + options.length) % options.length];
      select(next.value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      className={[styles.group, full ? styles.full : ""].join(" ")}
      data-disabled={disabled || undefined}
    >
      <span
        className={styles.cap}
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(calc(${index} * 100%))`,
        }}
        aria-hidden="true"
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          id={`${id}-${o.value}`}
          aria-checked={o.value === value}
          tabIndex={-1}
          disabled={disabled}
          className={[styles.option, o.value === value ? styles.selected : ""].join(" ")}
          onClick={() => select(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
