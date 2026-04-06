/**
 * Capacity-Adaptive UI Framework - Public API
 *
 * Export only what components need to consume
 */
export { CapacityProvider, useCapacityContext, useDerivedMode, useEnergyField, useAttentionField, useEmotionalValenceField, useFieldControls, usePrefersReducedMotion, useEffectiveMotion, usePacedMotionTokens, useFeedback, } from "./provider";
export { entranceClass, hoverClass, ambientClass, listItemClass, focusBeaconClass, focusTextClass } from "./animation";
export type { CapacityField, InterfaceMode, InterfaceModeLabel, DensityMode, GuidanceMode, MotionMode, FocusMode, ContrastMode, ChoiceLoadMode, ArousalMode, UserCapacity, EmotionalState, AmbientContext, FieldValue, Signal, ComponentResponse, SignalHandler, Unsubscribe, TypographyRole, EnergyLevel, AttentionLevel, } from "./types";
export { deriveMode, deriveModeLabel, getModeBadgeColor } from "./mode";
export { PHI, PHI_INVERSE, FIBONACCI, FEEDBACK_FREQUENCIES, DEFAULT_COMPONENT_RESPONSE, MOTION_TOKENS } from "./constants";
export { triggerHaptic, playSonicFeedback, getFrequencyForPace, playPacedSonic, HAPTIC_PATTERNS, } from "./feedback";
export { getSpacing, getProportionalSpacing, phiRatio, SPACING_SCALE, modularScale, getFontSize, getFontWeight, getLetterSpacing, getLineHeight, getTypographyStyles, getFluidFontSize } from "./utils/typography";
export { SignalBus, SIGNAL_TYPES } from "./signals/signal-bus";
export { FieldManager } from "./fields/field-manager";
export { detectConflicts } from "./validation";
export type { ConflictWarning, ConflictSeverity } from "./validation";
//# sourceMappingURL=index.d.ts.map