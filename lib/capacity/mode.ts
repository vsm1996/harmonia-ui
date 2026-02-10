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
  const veryLowCognitive = field.cognitive < 0.3
  const lowCognitive = field.cognitive < 0.45
  const highCognitive = field.cognitive > 0.7
  const veryLowEmotional = field.emotional < 0.3
  const lowEmotional = field.emotional < 0.45
  const highEmotional = field.emotional > 0.65
  const lowTemporal = field.temporal < 0.4
  const highValence = field.valence > 0.15
  const negValence = field.valence < -0.15

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density, Hierarchy, Concurrency
  // Controls how many things compete for attention at once
  // Low: aggressive simplification (single-column, hide secondary elements)
  // High: full-density grid, show everything, more concurrent info
  // ═══════════════════════════════════════════════════════════════════════════
  const density: InterfaceMode["density"] = veryLowCognitive
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
  const guidance: InterfaceMode["guidance"] = veryLowCognitive
    ? "high"
    : lowTemporal
      ? "medium"
      : "low"

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL → Motion Restraint, Friction
  // Controls nervous-system-safe UI (no surprises when capacity is low)
  //
  // THREE TIERS with real gaps:
  //   "off"        → very low emotional: ZERO decorative motion, static UI
  //   "subtle"     → low/mid emotional: gentle fades, small lifts, no loops
  //   "expressive" → high emotional + positive valence: full animation suite
  // ═══════════════════════════════════════════════════════════════════════════
  const motion: InterfaceMode["motion"] = veryLowEmotional
    ? "off"
    : (highEmotional && highValence)
      ? "expressive"
      : "subtle"

  // ═══════════════════════════════════════════════════════════════════════════
  // VALENCE → Tone, Expressiveness (NOT information volume)
  // Controls emotional color: warmth, playfulness, accent frequency
  // ═══════════════════════════════════════════════════════════════════════════
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
  // Must clearly exceed "Focused" territory
  if (cognitive > 0.7 && emotional > 0.7) {
    return "Exploratory"
  }

  // Minimal: Very low capacity (cognitive AND temporal both low)
  // Aggressive threshold -- catches Exhausted and Overwhelmed
  if (cognitive < 0.4 && temporal < 0.4) {
    return "Minimal"
  }

  // Focused: Good cognitive AND good temporal capacity (ready to work)
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
