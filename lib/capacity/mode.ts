/**
 * Mode Derivation - Field → Mode transformation
 *
 * This is the key insight: don't map sliders directly to 50 UI changes.
 * Instead, derive 2-4 coherent modes and let modes drive everything.
 *
 * STRICT SEPARATION OF CONCERNS:
 * ┌─────────────┬────────────────────────────────────┬─────────────────────────────┐
 * │ Slider      │ Controls                           │ Must NOT Control            │
 * ├─────────────┼────────────────────────────────────┼─────────────────────────────┤
 * │ Cognitive   │ density, hierarchy, concurrency    │ tone, animation speed       │
 * │ Temporal    │ content length, shortcuts, defaults│ color, layout structure     │
 * │ Emotional   │ motion restraint, friction         │ content importance          │
 * │ Valence     │ tone, expressiveness               │ information volume          │
 * └─────────────┴────────────────────────────────────┴─────────────────────────────┘
 */

import type { CapacityField, InterfaceMode, InterfaceModeLabel } from "./types"

// ============================================================================
// Mode Derivation Rules
// ============================================================================

/**
 * Derives InterfaceMode from CapacityField
 *
 * Rules:
 * - Cognitive → density (how many things compete for attention at once)
 * - Temporal → content length, shortcuts (how much time the UI asks from user)
 * - Emotional → motion restraint (nervous-system-safe UI, no surprises)
 * - Valence → tone/expressiveness (emotional color, not information volume)
 */
export function deriveMode(field: CapacityField): InterfaceMode {
  const lowCognitive = field.cognitive < 0.35
  const highCognitive = field.cognitive > 0.75
  const lowEmotional = field.emotional < 0.35
  const lowTemporal = field.temporal < 0.35
  const highValence = field.valence > 0.25
  const negValence = field.valence < -0.25

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density, Hierarchy, Concurrency
  // Controls how many things compete for attention at once
  // ═══════════════════════════════════════════════════════════════════════════
  const density: InterfaceMode["density"] = lowCognitive
    ? "low"
    : highCognitive
      ? "high"
      : "medium"

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL → Content Length, Shortcuts, Defaults
  // Controls how much time the UI asks from the user
  // ═══════════════════════════════════════════════════════════════════════════
  const choiceLoad: InterfaceMode["choiceLoad"] = lowTemporal ? "minimal" : "normal"

  // Guidance increases when temporal is low (provide shortcuts/defaults)
  // Also increases when cognitive is low (need more explanation)
  const guidance: InterfaceMode["guidance"] = lowCognitive
    ? "high"
    : lowTemporal
      ? "medium"
      : "low"

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL → Motion Restraint, Friction
  // Controls nervous-system-safe UI (no surprises when capacity is low)
  // ═══════════════════════════════════════════════════════════════════════════
  // Low emotional capacity = subtle/off motion (no unexpected reflows, no playful micro-interactions)
  // Normal emotional capacity = motion allowed, but valence determines expressiveness
  const motion: InterfaceMode["motion"] = lowEmotional
    ? "subtle"
    : highValence
      ? "expressive"
      : "subtle"

  // ═══════════════════════════════════════════════════════════════════════════
  // VALENCE → Tone, Expressiveness (NOT information volume)
  // Controls emotional color: warmth, playfulness, accent frequency
  // ═══════════════════════════════════════════════════════════════════════════
  // Boosted contrast when mood is low helps with visual accessibility
  // This is a subtle visual adjustment, not information density
  const contrast: InterfaceMode["contrast"] = negValence ? "boosted" : "standard"

  return { density, guidance, motion, contrast, choiceLoad }
}

// ============================================================================
// Mode Label Derivation
// ============================================================================

/**
 * Derives a human-readable mode label from raw capacity inputs
 *
 * We use RAW VALUES, not derived mode, because:
 * - Neutral (0.5, 0.5, 0.5) and Focused (0.7, 0.7, 0.6) produce the same InterfaceMode
 * - But they should have different labels (Calm vs Focused)
 * - The distinction is the RAW capacity level, not the derived mode
 *
 * Preset → Label mapping:
 * - Exhausted   (0.2, 0.2, 0.1)  → Minimal   (very low everything)
 * - Overwhelmed (0.3, 0.25, 0.2) → Minimal   (low cognitive + temporal)
 * - Distracted  (0.4, 0.3, 0.6)  → Calm      (ok cognitive, low temporal)
 * - Neutral     (0.5, 0.5, 0.5)  → Calm      (balanced, middle-ground)
 * - Focused     (0.7, 0.7, 0.6)  → Focused   (good capacity, ready to work)
 * - Energized   (0.9, 0.8, 0.9)  → Exploratory (high everything)
 * - Exploring   (0.85, 0.7, 0.8) → Exploratory (high cognitive + emotional)
 */
export function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel {
  const { cognitive, temporal, emotional } = inputs
  
  // Exploratory: High cognitive AND high emotional capacity (energetic, engaged)
  // Threshold: both > 0.65
  if (cognitive > 0.65 && emotional > 0.65) {
    return "Exploratory"
  }
  
  // Minimal: Very low capacity (cognitive AND temporal both low)
  // Threshold: both < 0.35
  if (cognitive < 0.35 && temporal < 0.35) {
    return "Minimal"
  }
  
  // Focused: Good cognitive AND good temporal capacity (ready to work)
  // Threshold: both >= 0.6
  if (cognitive >= 0.6 && temporal >= 0.6) {
    return "Focused"
  }
  
  // Calm: Everything else
  // Includes: Neutral (0.5s), Distracted (ok cognitive but low temporal), moderate states
  return "Calm"
}

// ============================================================================
// Mode Utilities
// ============================================================================

/**
 * Get mode badge color based on label
 */
export function getModeBadgeColor(label: InterfaceModeLabel): string {
  switch (label) {
    case "Calm":
      return "oklch(0.65 0.15 220)" // Soft blue
    case "Focused":
      return "oklch(0.68 0.16 45)" // Primary rust
    case "Exploratory":
      return "oklch(0.65 0.2 135)" // Toxic green
    case "Minimal":
      return "oklch(0.55 0.1 280)" // Muted purple
    default:
      return "oklch(0.5 0 0)" // Gray
  }
}
