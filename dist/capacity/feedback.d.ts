/**
 * Multimodal Feedback - Phase 3
 *
 * Opt-in haptic and sonic feedback tied to capacity state.
 * Both channels are disabled by default (see DEFAULT_COMPONENT_RESPONSE.sonic.enabled).
 *
 * Haptic: Web Vibration API — short patterns on interaction
 * Sonic:  Web Audio API — sub-audible tones from FEEDBACK_FREQUENCIES
 *
 * Design constraints:
 * - Opt-in only: never fires without explicit user enablement
 * - Degrades silently on unsupported browsers
 * - Volume capped at 0.08 to keep tones sub-audible (felt, not heard prominently)
 * - Arousal-aware: higher arousal → higher frequency feedback
 */
import type { ArousalMode } from "./types";
/** Haptic patterns (ms on/off durations) for different interaction types */
export declare const HAPTIC_PATTERNS: {
    /** Short tap — confirm/select */
    readonly tap: readonly [8];
    /** Two pulses — toggle/switch */
    readonly toggle: readonly [8, 50, 8];
    /** Gentle pulse — ambient/ambient confirmation */
    readonly pulse: readonly [15, 30, 15];
    /** Error/warning — three quick */
    readonly error: readonly [50, 30, 50, 30, 50];
};
export type HapticPatternName = keyof typeof HAPTIC_PATTERNS;
/**
 * Trigger a haptic vibration pattern.
 * Silently no-ops on unsupported browsers (desktop, iOS Safari).
 */
export declare function triggerHaptic(pattern?: HapticPatternName): void;
/**
 * Play a short sine-wave tone for interaction confirmation.
 *
 * @param frequency - Hz from FEEDBACK_FREQUENCIES (396/528/741)
 * @param duration  - Tone length in ms (default 120)
 * @param volume    - Peak gain, 0–1 (default 0.06 — sub-audible)
 */
export declare function playSonicFeedback(frequency: number, duration?: number, volume?: number): void;
/**
 * Select the appropriate frequency for the current arousal level.
 *
 * calm      → 396 Hz (low/root — grounding)
 * neutral   → 528 Hz (mid — balanced)
 * activated → 741 Hz (high — energetic)
 */
export declare function getFrequencyForPace(pace: ArousalMode): number;
/**
 * Play sonic feedback tuned to the current arousal/pace level.
 * Convenience wrapper over playSonicFeedback + getFrequencyForPace.
 */
export declare function playPacedSonic(pace: ArousalMode, duration?: number): void;
//# sourceMappingURL=feedback.d.ts.map