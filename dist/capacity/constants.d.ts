/**
 * Capacity-Adaptive UI Constants
 *
 * Structural Principles Layer - Mathematical foundations for proportional design
 */
/** Golden ratio φ */
export declare const PHI = 1.618033988749895;
/** Inverse golden ratio (1/φ) */
export declare const PHI_INVERSE = 0.618033988749895;
/** Fibonacci sequence for natural scaling steps */
export declare const FIBONACCI: readonly [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
/**
 * Frequency ranges for optional auditory feedback
 * Used for interaction confirmation and depth signaling
 * Note: These are constrained ranges, not healing claims
 */
export declare const FEEDBACK_FREQUENCIES: {
    readonly low: 396;
    readonly mid: 528;
    readonly high: 741;
};
/** Default field configuration */
export declare const DEFAULT_FIELD_CONFIG: {
    readonly smoothing: 0.15;
    readonly velocityThreshold: 0.05;
    readonly debounceMs: 100;
};
/** Default user capacity (neutral state) */
export declare const DEFAULT_USER_CAPACITY: {
    readonly cognitive: 0.7;
    readonly temporal: 0.7;
    readonly emotional: 0.7;
};
/** Default emotional state (positive to show expressive animations) */
export declare const DEFAULT_EMOTIONAL_STATE: {
    readonly valence: 0.3;
    readonly arousal: 0.5;
};
/** Default capacity field (neutral state) */
export declare const DEFAULT_CAPACITY_FIELD: {
    readonly cognitive: 0.5;
    readonly temporal: 0.5;
    readonly emotional: 0.5;
    readonly valence: 0;
};
/**
 * Intelligent defaults for component responses
 * 90% of components can use these without override
 */
interface ComponentResponse {
    visual: {
        opacityRange: [number, number];
        scaleRange: [number, number];
    };
    spatial: {
        densityRange: [number, number];
        spacingMultiplier: [number, number];
    };
    sonic: {
        enabled: boolean;
    };
    semantic: {
        verbosityLevel: string;
        urgencyFraming: string;
    };
}
export declare const DEFAULT_COMPONENT_RESPONSE: ComponentResponse;
/** Minimum contrast ratio (WCAG AA) - invariant across all states */
export declare const MIN_CONTRAST_RATIO = 4.5;
/** Reduced motion media query key */
export declare const PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Maximum animation duration (ms) for time-sensitive users */
export declare const MAX_ANIMATION_DURATION_MS = 300;
/**
 * Motion tokens by mode
 *
 * "off" means no decorative motion, NOT no transitions at all.
 * You still keep: opacity fades, height/visibility transitions, focus transitions.
 * This preserves usability and avoids "broken UI" feelings.
 *
 * "subtle" = grounded, low-amplitude, slow easing
 * "expressive" = playful, elastic, higher amplitude
 */
export declare const MOTION_TOKENS: {
    readonly off: {
        readonly durationFast: 0;
        readonly durationBase: 0;
        readonly durationSlow: 0;
        readonly easing: "linear";
        readonly essentialDuration: 100;
        readonly essentialEasing: "ease-out";
    };
    readonly soothing: {
        readonly durationFast: 0;
        readonly durationBase: 800;
        readonly durationSlow: 1200;
        readonly easing: "ease-in-out";
        readonly essentialDuration: 200;
        readonly essentialEasing: "ease-in-out";
    };
    readonly subtle: {
        readonly durationFast: 100;
        readonly durationBase: 200;
        readonly durationSlow: 350;
        readonly easing: "ease-out";
        readonly essentialDuration: 150;
        readonly essentialEasing: "ease-out";
    };
    readonly expressive: {
        readonly durationFast: 200;
        readonly durationBase: 400;
        readonly durationSlow: 700;
        readonly easing: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        readonly essentialDuration: 150;
        readonly essentialEasing: "ease-out";
    };
};
export {};
//# sourceMappingURL=constants.d.ts.map