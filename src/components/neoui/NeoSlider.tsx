import { useCallback, useId, useRef, useState } from "react";
import { useHaptics } from "./useHaptics";
import styles from "./NeoSlider.module.css";

export interface NeoSliderProps {
  value: number;
  onValueChange(value: number): void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Tick marks (e.g. 0/25/50/75/100) that brighten when passed + detent haptics */
  ticks?: number[];
  disabled?: boolean;
  forcedState?: "default" | "hover" | "active" | "focus";
  id?: string;
}

/**
 * NeoSlider — tactile slider. Recessed rail, accent fill, pearl thumb that
 * scales to 1.12 while dragged (spring release); every crossed step fires a
 * selection haptic (UISlider detent analogue). Keyboard + pointer.
 */
export function NeoSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  ticks,
  disabled = false,
  forcedState,
  id: idProp,
}: NeoSliderProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { trigger } = useHaptics();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false); // visual: thumb scale
  const draggingRef = useRef(false); // gate: survives coalesced pointer events
  const lastStep = useRef(value);

  const pct = ((value - min) / (max - min)) * 100;

  const commit = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = min + ((clientX - rect.left) / rect.width) * (max - min);
      const clamped = Math.min(max, Math.max(min, raw));
      const stepped = Math.round(clamped / step) * step;
      const fixed = Number(stepped.toFixed(4));
      if (fixed !== lastStep.current) {
        lastStep.current = fixed;
        trigger("selection");
      }
      if (fixed !== value) onValueChange(fixed);
    },
    [min, max, step, value, onValueChange, trigger],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    draggingRef.current = true;
    setDragging(true);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* untrusted pointer — capture unavailable, drag still works */
    }
    commit(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    commit(e.clientX);
  };
  const stop = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* nothing to release */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const big = step * 5;
    const map: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: big,
      PageDown: -big,
    };
    if (e.key in map) {
      e.preventDefault();
      const next = Math.min(max, Math.max(min, value + map[e.key]));
      const fixed = Number(next.toFixed(4));
      if (fixed !== value) {
        lastStep.current = fixed;
        trigger("selection");
        onValueChange(fixed);
      }
    }
  };

  return (
    <div className={styles.wrap}>
      {label && (
        <div className={styles.head}>
          <label htmlFor={id} className={`${styles.label} type-caption-strong`}>
            {label}
          </label>
          <span className={`${styles.value} type-caption-strong`}>{value}</span>
        </div>
      )}
      <div
        ref={trackRef}
        className={[styles.track, disabled ? styles.disabled : ""].join(" ")}
        data-state={forcedState}
        role="slider"
        id={id}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onKeyDown}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        {ticks?.map((t) => {
          const p = ((t - min) / (max - min)) * 100;
          return (
            <span
              key={t}
              className={[styles.tick, value >= t ? styles.tickPast : ""].join(" ")}
              style={{ left: `${p}%` }}
            />
          );
        })}
        <span
          className={[styles.thumb, dragging ? styles.thumbActive : ""].join(" ")}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
