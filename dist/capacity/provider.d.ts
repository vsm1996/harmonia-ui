/**
 * Capacity Provider - React Context wrapper for ambient fields
 *
 * Wraps application root and exposes field hooks
 */
import type React from "react";
import { type Dispatch, type SetStateAction } from "react";
import type { AmbientContext, UserCapacity, EmotionalState, MotionMode, CapacityField, InterfaceMode } from "./types";
import { type ConflictWarning } from "./validation";
import { type HapticPatternName } from "./feedback";
import { deriveMode } from "./mode";
import { MOTION_TOKENS } from "./constants";
interface CapacityContextValue {
    context: AmbientContext;
    updateCapacity: (capacity: Partial<UserCapacity>) => void;
    updateEmotionalState: (state: Partial<EmotionalState>) => void;
    isAutoMode: boolean;
    toggleAutoMode: () => void;
    updateCapacityField: (field: CapacityField) => void;
    hapticEnabled: boolean;
    sonicEnabled: boolean;
    setHapticEnabled: Dispatch<SetStateAction<boolean>>;
    setSonicEnabled: Dispatch<SetStateAction<boolean>>;
    conflicts: ConflictWarning[];
}
export declare function CapacityProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Access full ambient context
 * Most components should use specific field hooks instead
 */
export declare function useCapacityContext(): CapacityContextValue;
/**
 * Subscribe to energy field only
 */
export declare function useEnergyField(): import("./types").EnergyFieldValue;
/**
 * Subscribe to attention field only
 */
export declare function useAttentionField(): import("./types").AttentionFieldValue;
/**
 * Subscribe to emotional valence field only
 */
export declare function useEmotionalValenceField(): import("./types").EmotionalValenceFieldValue;
/**
 * Get field update functions (for Phase 1 slider system)
 */
export declare function useFieldControls(): {
    updateCapacity: (capacity: Partial<UserCapacity>) => void;
    updateEmotionalState: (state: Partial<EmotionalState>) => void;
    isAutoMode: boolean;
    toggleAutoMode: () => void;
    updateCapacityField: (field: CapacityField) => void;
    conflicts: ConflictWarning[];
};
/**
 * Detect system prefers-reduced-motion preference
 * Returns true if user has requested reduced motion
 */
export declare function usePrefersReducedMotion(): boolean;
/**
 * Derive the full mode from current capacity context.
 * This is the primary hook for section-level components that need
 * the field values AND the derived mode together.
 *
 * Eliminates the repeated { cognitive: context.userCapacity.cognitive, ... }
 * construction that was duplicated across every section component.
 */
export declare function useDerivedMode(): {
    field: CapacityField;
    mode: InterfaceMode;
};
/**
 * Get effective motion mode with system preference override
 *
 * System prefers-reduced-motion is a HARD OVERRIDE - non-negotiable on safety.
 * This ensures accessibility compliance regardless of derived mode.
 */
export declare function useEffectiveMotion(): {
    mode: MotionMode;
    tokens: typeof MOTION_TOKENS[keyof typeof MOTION_TOKENS];
    prefersReducedMotion: boolean;
};
/**
 * Access multimodal feedback preferences and fire helper.
 *
 * Reads opt-in flags from context — feedback only fires when the user
 * has explicitly enabled it in the CapacityControls panel.
 * Pace-aware: sonic frequency adapts to current arousal level.
 */
export declare function useFeedback(): {
    hapticEnabled: boolean;
    sonicEnabled: boolean;
    setHapticEnabled: Dispatch<SetStateAction<boolean>>;
    setSonicEnabled: Dispatch<SetStateAction<boolean>>;
    fire: (pattern?: HapticPatternName) => void;
};
/**
 * Get motion tokens with arousal-based pacing applied (Phase 3)
 *
 * Arousal independently controls animation speed:
 * - calm (< 0.35): +50% duration — slow, deliberate
 * - neutral (0.35–0.65): standard duration
 * - activated (> 0.65): -35% duration — fast, energetic
 *
 * System prefers-reduced-motion overrides pace to "calm" for safety.
 */
export declare function usePacedMotionTokens(): {
    mode: MotionMode;
    pace: ReturnType<typeof deriveMode>["pace"];
    tokens: {
        durationFast: number;
        durationBase: number;
        durationSlow: number;
        easing: string;
        essentialDuration: number;
        essentialEasing: string;
    };
};
export {};
//# sourceMappingURL=provider.d.ts.map