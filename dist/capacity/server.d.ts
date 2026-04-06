/**
 * Server-safe exports — pure functions and types with no browser API dependencies.
 *
 * Import from "@harmonia-core/ui/server" in Server Components, RSC, edge
 * functions, or any SSR context. Nothing here touches window / document /
 * localStorage / navigator.
 *
 * For hooks, the provider, and runtime-adaptive utilities, import from
 * "@harmonia-core/ui" (client bundle, requires "use client" boundary).
 */
export { deriveMode, deriveModeLabel, getModeBadgeColor } from "./mode";
export { detectConflicts } from "./validation";
export type { ConflictWarning, ConflictSeverity } from "./validation";
export { entranceClass, hoverClass, ambientClass, listItemClass, focusBeaconClass, focusTextClass } from "./animation";
export { PHI, PHI_INVERSE, FIBONACCI, FEEDBACK_FREQUENCIES, DEFAULT_COMPONENT_RESPONSE, MOTION_TOKENS, DEFAULT_CAPACITY_FIELD, } from "./constants";
export { getSpacing, getProportionalSpacing, phiRatio, SPACING_SCALE, modularScale, getFontSize, getFontWeight, getLetterSpacing, getLineHeight, getTypographyStyles, getFluidFontSize, } from "./utils/typography";
export type { CapacityField, InterfaceMode, InterfaceModeLabel, DensityMode, GuidanceMode, MotionMode, FocusMode, ContrastMode, ChoiceLoadMode, ArousalMode, UserCapacity, EmotionalState, AmbientContext, FieldValue, Signal, ComponentResponse, SignalHandler, Unsubscribe, TypographyRole, EnergyLevel, AttentionLevel, } from "./types";
//# sourceMappingURL=server.d.ts.map