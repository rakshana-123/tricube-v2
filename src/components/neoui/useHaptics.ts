/**
 * Haptic feedback mapping — web stand-in for UIKit feedback generators.
 * Semantics match a native port one-to-one:
 *
 *   selection → UISelectionFeedbackGenerator           → vibrate(8)
 *   light     → UIImpactFeedbackGenerator(.light)      → vibrate(12)
 *   medium    → UIImpactFeedbackGenerator(.medium)     → vibrate(20)
 *   heavy     → UIImpactFeedbackGenerator(.heavy)      → vibrate(30)
 *   success   → UINotificationFeedbackGenerator(.success) → [10, 40, 18]
 *   warning   → UINotificationFeedbackGenerator(.warning)  → [22, 40, 22]
 *   error     → UINotificationFeedbackGenerator(.error)    → [30, 60, 30, 60, 30]
 *
 * No-op where the Vibration API is unsupported (iOS Safari).
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
      /* never let haptics break the UI */
    }
  };
  return { trigger };
}
