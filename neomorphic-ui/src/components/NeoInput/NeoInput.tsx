import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { NeoIcon, type IconName } from "../NeoIcon/NeoIcon";
import styles from "./NeoInput.module.css";

export interface NeoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: ReactNode;
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  size?: "regular" | "large";
  /** Showcase pinning */
  forcedState?: "default" | "hover" | "focus";
}

/**
 * NeoInput — recessed text field.
 *
 * A sunken well (inset dual shadow) instead of a boxed outline: the MD's
 * "no borders, surfaces imply structure" rule applied to forms. Focus
 * keeps Apple's exact recipe — a 2px solid #0071e3 ring — layered over
 * the recess so the well visibly brightens as it gains focus.
 */
export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(function NeoInput(
  {
    label,
    helper,
    error = false,
    errorMessage,
    leadingIcon,
    trailingIcon,
    size = "regular",
    forcedState,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const helperId = `${id}-helper`;
  const describedBy = error && errorMessage ? helperId : rest["aria-describedby"];

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={id} className={`${styles.label} type-caption-strong`}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.well,
          styles[size],
          error ? styles.error : "",
        ].join(" ")}
        data-state={forcedState}
      >
        {leadingIcon && (
          <NeoIcon name={leadingIcon} size={18} className={styles.leadIcon} />
        )}
        <input
          ref={ref}
          id={id}
          className={styles.input}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailingIcon && (
          <NeoIcon
            name={trailingIcon}
            size={18}
            className={error ? styles.trailIconError : styles.trailIcon}
          />
        )}
      </div>
      {error && errorMessage ? (
        <p id={helperId} className={`${styles.helper} ${styles.helperError} type-fine-print`}>
          {errorMessage}
        </p>
      ) : helper ? (
        <p id={helperId} className={`${styles.helper} type-fine-print`}>
          {helper}
        </p>
      ) : null}
    </div>
  );
});
