/**
 * Core Types for Empathy-Driven UI Framework
 *
 * Myoho (Law) - Immutable contracts that govern the system
 */

// ============================================================================
// Capacity Field - The Canonical Input Model (Phase 1)
// ============================================================================

/**
 * CapacityField - The 4-input model that drives the entire framework
 * This is the first-class "state of the human" that components respond to
 *
 * Pipeline: CapacityField → InterfaceMode → Tokens → Components
 */
export interface CapacityField {
  /** Cognitive bandwidth available (attention, working memory) */
  cognitive: number // 0..1

  /** Time pressure inverse (1 = abundant time, 0 = urgent) */
  temporal: number // 0..1

  /** Emotional regulation capacity (1 = regulated, 0 = dysregulated) */
  emotional: number // 0..1

  /** Positive/negative affect (-1 to +1) - mood tone */
  valence: number // -1..1
}

/**
 * @deprecated Use CapacityField instead - kept for backwards compatibility
 */
export interface UserCapacity {
  cognitive: number
  temporal: number
  emotional: number
}

/**
 * @deprecated Use CapacityField.valence instead - kept for backwards compatibility
 * Arousal removed from Phase 1 (may return in Phase 2+)
 */
export interface EmotionalState {
  valence: number
  arousal: number
}

// ============================================================================
// Interface Mode - Derived Coherent State
// ============================================================================

/**
 * Density mode - controls information density and visual complexity
 */
export type DensityMode = "low" | "medium" | "high"

/**
 * Guidance mode - how much explanation/labeling is shown
 */
export type GuidanceMode = "low" | "medium" | "high"

/**
 * Motion mode - animation intensity
 */
export type MotionMode = "off" | "subtle" | "expressive"

/**
 * Contrast mode - visual contrast level
 */
export type ContrastMode = "standard" | "boosted"

/**
 * Choice load mode - reduces decision fatigue
 */
export type ChoiceLoadMode = "minimal" | "normal"

/**
 * InterfaceMode - The coherent UI state derived from CapacityField
 *
 * Why modes exist:
 * - Mapping sliders directly to 50 UI changes feels arbitrary
 * - Modes create coherent states: "Calm", "Focused", "Exploratory", "Minimal"
 * - Components read modes, not raw slider values
 */
export interface InterfaceMode {
  density: DensityMode
  guidance: GuidanceMode
  motion: MotionMode
  contrast: ContrastMode
  choiceLoad: ChoiceLoadMode
}

/**
 * Human-readable mode labels for display
 */
export type InterfaceModeLabel = "Calm" | "Focused" | "Exploratory" | "Minimal"

// ============================================================================
// Field Values with Temporal Context
// ============================================================================

/**
 * Field value wrapper that tracks change over time
 * Enables anticipatory component responses
 */
export interface FieldValue<T> {
  /** Current value */
  value: T

  /** Timestamp of last change (ms) */
  lastChange: number

  /** Trend direction: 'rising' | 'falling' | 'stable' */
  trend: "rising" | "falling" | "stable"

  /** Rate of change per second (for numeric values) */
  velocity?: number
}

// ============================================================================
// Signals & Events
// ============================================================================

/**
 * Priority levels for signal routing
 */
export type SignalPriority = "critical" | "high" | "normal" | "low"

/**
 * Type-safe signal for inter-component communication
 */
export interface Signal<T = unknown> {
  /** Signal type identifier */
  type: string

  /** Signal payload */
  payload: T

  /** Timestamp of emission */
  timestamp: number

  /** Priority level */
  priority: SignalPriority

  /** Optional source component identifier */
  source?: string
}

/**
 * Signal subscription handler
 */
export type SignalHandler<T = unknown> = (signal: Signal<T>) => void

/**
 * Cleanup function returned by subscriptions
 */
export type Unsubscribe = () => void

// ============================================================================
// Component Response Model
// ============================================================================

/**
 * Multi-modal response specification for components
 * Components declare how they respond across sensory dimensions
 */
export interface ComponentResponse {
  /** Visual adaptations (color, opacity, scale) */
  visual: {
    opacityRange: [number, number]
    scaleRange: [number, number]
    colorShift?: {
      hue?: number
      chroma?: number
      lightness?: number
    }
  }

  /** Spatial adaptations (spacing, density) */
  spatial: {
    densityRange: [number, number] // Information density multiplier
    spacingMultiplier: [number, number] // φ-based spacing adjustment
  }

  /** Sonic adaptations (frequency, amplitude) */
  sonic: {
    enabled: boolean
    frequencyHz?: number // Solfeggio frequency for depth
    amplitude?: number // 0-1, sub-audible + haptic
  }

  /** Semantic adaptations (verbosity, urgency framing) */
  semantic: {
    verbosityLevel: "minimal" | "concise" | "detailed"
    urgencyFraming: "calm" | "neutral" | "urgent"
  }
}

// ============================================================================
// Ambient Field Types
// ============================================================================

/**
 * Energy field - composite of all capacity dimensions
 * Primary driver of animation intensity and complexity
 */
export type EnergyFieldValue = FieldValue<number>

/**
 * Attention field - temporal pressure + focus
 * Influences information density and urgency cues
 */
export type AttentionFieldValue = FieldValue<number>

/**
 * Emotional valence field - affect direction
 * Influences color warmth and message framing
 */
export type EmotionalValenceFieldValue = FieldValue<number>

// ============================================================================
// Field Configuration
// ============================================================================

/**
 * Configuration for field behavior
 */
export interface FieldConfig {
  /** Smoothing factor for field transitions (0-1) */
  smoothing: number

  /** Velocity threshold for trend detection */
  velocityThreshold: number

  /** Debounce time for rapid changes (ms) */
  debounceMs: number
}

// ============================================================================
// Component Ambient Context
// ============================================================================

/**
 * The ambient context every component can read
 * Components subscribe to specific fields, never the whole context
 */
export interface AmbientContext {
  energy: EnergyFieldValue
  attention: AttentionFieldValue
  emotionalValence: EmotionalValenceFieldValue

  /** Raw user capacity (before field derivation) */
  userCapacity: UserCapacity

  /** Raw emotional state (before field derivation) */
  emotionalState: EmotionalState
}

// ============================================================================
// Typography Types (Renge - Proportional Form)
// ============================================================================

/**
 * Typography roles in the UI hierarchy
 * Maps to semantic HTML elements
 */
export type TypographyRole = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "label"

/**
 * Energy levels derived from EnergyField
 * Influences sizing bias for cognitive adaptation
 */
export type EnergyLevel = "low" | "medium" | "high"

/**
 * Attention levels derived from AttentionField
 * Influences weight and spacing for focus
 */
export type AttentionLevel = "low" | "medium" | "high"
