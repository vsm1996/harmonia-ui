/**
 * Capacity-Adaptive UI Framework - Public API
 *
 * Export only what components need to consume
 */

// Provider & Hooks
export {
  CapacityProvider,
  useCapacityContext,
  useDerivedMode,
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  useFieldControls,
  usePrefersReducedMotion,
  useEffectiveMotion,
} from "./provider"

// Animation Utilities
export { entranceClass, hoverClass, ambientClass, listItemClass } from "./animation"

// Types
export type {
  CapacityField,
  InterfaceMode,
  InterfaceModeLabel,
  DensityMode,
  GuidanceMode,
  MotionMode,
  ContrastMode,
  ChoiceLoadMode,
  UserCapacity,
  EmotionalState,
  AmbientContext,
  FieldValue,
  Signal,
  ComponentResponse,
  SignalHandler,
  Unsubscribe,
  TypographyRole,
  EnergyLevel,
  AttentionLevel,
} from "./types"

// Mode Derivation
export { deriveMode, deriveModeLabel, getModeBadgeColor } from "./mode"

// Constants
export { PHI, PHI_INVERSE, FIBONACCI, FEEDBACK_FREQUENCIES, DEFAULT_COMPONENT_RESPONSE, MOTION_TOKENS } from "./constants"

// Signal Bus
export { SignalBus, SIGNAL_TYPES } from "./signals/signal-bus"

// Field Manager (for advanced usage)
export { FieldManager } from "./fields/field-manager"
