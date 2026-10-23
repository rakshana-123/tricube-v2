import { useId } from "react";
import type { ReactNode } from "react";
import { useHaptics } from "./useHaptics";
import styles from "./NeoToggle.module.css";

export interface NeoToggleProps {
  checked: boolean;
  onCheckedChange(checked: boolean): void;
  label?: ReactNode;
  helper?: ReactNode;
  disabled?: boolean;
  forcedState?: "default" | "hover" | "focus";
  id?: string;
}

/**
 * NeoToggle — switch, Apple 51×31 proportions. Recessed track floods with
 * the accent when on; pearl thumb rides the spring; selection haptic on flip.
 */
export function NeoToggle({
  checked,
  onCheckedChange,
  label,
  helper,
  disabled = false,
  forcedState,
  id: idProp,
}: NeoToggleProps) {
  const { trigger } = useHaptics();
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={label ? `${id}-label` : undefined}
        disabled={disabled}
        data-state={forcedState}
        className={[styles.track, checked ? styles.on : ""].join(" ")}
        onClick={() => {
          trigger("selection");
          onCheckedChange(!checked);
        }}
      >
        <span className={styles.thumb} />
      </button>
      {(label || helper) && (
        <div className={styles.text}>
          {label && (
            <label htmlFor={id} id={`${id}-label`} className={`${styles.label} type-body`}>
              {label}
            </label>
          )}
          {helper && <p className={`${styles.helper} type-fine-print`}>{helper}</p>}
        </div>
      )}
    </div>
  );
}
