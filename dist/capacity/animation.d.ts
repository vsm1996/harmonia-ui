/**
 * Capacity-aware animation class utilities.
 *
 * Centralizes the repeated pattern of selecting CSS animation classes
 * based on the current motion mode (off / subtle / expressive).
 * Each section was independently deriving the same entranceClass / hoverClass /
 * ambientClass -- this module makes it a single source of truth.
 */
import type { MotionMode, FocusMode } from "./types";
/**
 * Map of named entrance animation presets.
 * Each preset maps a MotionMode to a CSS class name from globals.css.
 * "off" always maps to "" (no animation).
 */
declare const ENTRANCE_PRESETS: {
    /** Liquid organic morph -> gentle scale fade -> soft bloom -> none */
    readonly morph: {
        readonly expressive: "morph-fade-in";
        readonly subtle: "sacred-fade";
        readonly soothing: "bloom";
        readonly off: "";
    };
    /** Spinning vortex -> gentle scale fade -> soft bloom -> none */
    readonly vortex: {
        readonly expressive: "vortex-reveal";
        readonly subtle: "sacred-fade";
        readonly soothing: "bloom";
        readonly off: "";
    };
    /** Spiral in from corner -> soft bloom -> soft bloom -> none */
    readonly spiral: {
        readonly expressive: "spiral-in";
        readonly subtle: "bloom";
        readonly soothing: "bloom";
        readonly off: "";
    };
};
type EntrancePreset = keyof typeof ENTRANCE_PRESETS;
/**
 * Returns the appropriate entrance animation class for the given motion mode.
 * Returns "" when hasPlayed is true, preventing re-render flicker.
 */
export declare function entranceClass(motion: MotionMode, preset: EntrancePreset, hasPlayed: boolean): string;
/**
 * Returns the appropriate hover animation class.
 * "off" mode disables hover animations entirely.
 */
export declare function hoverClass(motion: MotionMode): string;
/**
 * Returns a class for continuous ambient animation (breathing, floating, etc.)
 *
 * - expressive: all ambient types active
 * - soothing: only slow, rhythmic types (breathe, float) -- calms the nervous system
 * - subtle / off: no ambient animation
 */
export declare function ambientClass(motion: MotionMode, type: "breathe" | "float" | "pulse" | "vibrate"): string;
/**
 * Returns the appropriate animation class for list items (staggered entrance).
 * Expressive: helix-rise, Subtle: sacred-fade, Off: none.
 */
export declare function listItemClass(motion: MotionMode): string;
/**
 * Returns attention-beacon class for important container elements (cards, CTAs).
 * - guided: strong warm glow (3s cycle) + border accent
 * - gentle: muted cool glow (5s cycle) + softer border
 * - default: no treatment
 */
export declare function focusBeaconClass(focus: FocusMode): string;
/**
 * Returns attention-text class for important headings / labels.
 * - guided: warm text-shadow pulse (3s)
 * - gentle: cool text-shadow pulse (5s)
 * - default: no treatment
 */
export declare function focusTextClass(focus: FocusMode): string;
export {};
//# sourceMappingURL=animation.d.ts.map