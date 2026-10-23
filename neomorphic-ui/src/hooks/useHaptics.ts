/**
 * Haptic feedback mapping.
 *
 * Web has no first-class haptics API; the Vibration API is the closest
 * equivalent and is a graceful no-op where unsupported (iOS Safari).
 * Patterns below approximate UIKit feedback generators so a single call
 * site works across platforms and drops onto native without changes:
 *
 *   neo haptic      → UIKit generator                        → Web Vibration
 *   selection       → UISelectionFeedbackGenerator           → 8ms
 *   light impact    → UIImpactFeedbackGenerator(.light)      → 12ms
 *   medium impact   → UIImpactFeedbackGenerator(.medium)     → 20ms
 *   heavy impact    → UIImpactFeedbackGenerator(.heavy)      → 30ms
 *   success         → UINotificationFeedbackGenerator(.success) → [10, 40, 18]
 *   warning         → UINotificationFeedbackGenerator(.warning)  → [22, 40, 22]
 *   error           → UINotificationFeedbackGenerator(.error)    → [30, 60, 30, 60, 30]
 *
 * In a SwiftUI port, swap `trigger(pattern)` for the generator call and
 * keep the same semantic names at call sites.
 */

export type HapticPattern =
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 8,
  light: 12,
  medium: 20,
  heavy: 30,
  success: [10, 40, 18],
  warning: [22, 40, 22],
  error: [30, 60, 30, 60, 30],
};

export function useHaptics() {
  const trigger = (pattern: HapticPattern) => {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
    try {
      navigator.vibrate(PATTERNS[pattern]);
    } catch {
      /* no-op: permission or support issues must never break the UI */
    }
  };
  return { trigger };
}
