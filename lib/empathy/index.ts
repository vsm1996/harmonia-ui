/**
 * Empathy Framework - Public API
 *
 * Export only what components need to consume
 */

// Provider & Hooks
export {
  EmpathyProvider,
  useEmpathyContext,
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  useFieldControls,
} from "./provider"

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
export { PHI, PHI_INVERSE, FIBONACCI, SOLFEGGIO_FREQUENCIES, DEFAULT_COMPONENT_RESPONSE } from "./constants"

// Signal Bus
export { SignalBus, SIGNAL_TYPES } from "./signals/signal-bus"

// Field Manager (for advanced usage)
export { FieldManager } from "./fields/field-manager"

// Typography Utilities
export {
  modularScale,
  getFontSize,
  getFontWeight,
  getLetterSpacing,
  getLineHeight,
  getTypographyStyles,
  getFluidFontSize,
} from "./utils"
