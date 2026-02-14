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
  const lowCognitive = field.cognitive < 0.4
  const highCognitive = field.cognitive > 0.7
  const lowEmotional = field.emotional < 0.4
  const highEmotional = field.emotional > 0.6
  const lowTemporal = field.temporal < 0.4
  const highValence = field.valence > 0.15
  const negValence = field.valence < -0.15

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density, Hierarchy, Concurrency
  // Controls how many things compete for attention at once
  // Wider thresholds → clearer visual jumps between modes
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
  // Four distinct tiers:
  //   off:        emotional < 0.15 → fully protective, static UI
  //   soothing:   emotional 0.15-0.4 → slow rhythmic motion only (breathe, float)
  //   subtle:     emotional 0.4-0.6 or low valence → grounded, minimal motion
  //   expressive: emotional > 0.6 AND positive valence → full animation suite
  // ═══════════════════════════════════════════════════════════════════════════
  const veryLowEmotional = field.emotional < 0.15
  const motion: InterfaceMode["motion"] = veryLowEmotional
    ? "off"
    : lowEmotional
      ? "soothing"
      : highEmotional && highValence
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
 * Preset → Label / Motion mapping:
 * - Exhausted   (0.1, 0.1, 0.1)   → Minimal     motion: off      (protective, static)
 * - Overwhelmed (0.2, 0.15, 0.2)  → Minimal     motion: soothing (breathe, float only)
 * - Distracted  (0.35, 0.25, 0.5) → Minimal     motion: subtle   (calm, grounded)
 * - Neutral     (0.5, 0.5, 0.5)   → Calm        motion: subtle   (balanced)
 * - Focused     (0.75, 0.75, 0.55) → Focused    motion: subtle   (task-ready)
 * - Energized   (0.9, 0.85, 0.85) → Exploratory motion: expressive (full engagement)
 * - Exploring   (1.0, 1.0, 1.0)   → Exploratory motion: expressive (maximum)
 */
export function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel {
  const { cognitive, temporal, emotional } = inputs

  // Exploratory: High cognitive AND high emotional capacity (energetic, engaged)
  // Threshold: both > 0.6 (lowered to capture Energized preset)
  if (cognitive > 0.6 && emotional > 0.6) {
    return "Exploratory"
  }

  // Minimal: Low capacity (cognitive AND temporal both below midpoint)
  // Threshold: both < 0.4 (raised to capture Overwhelmed + Exhausted distinctly)
  if (cognitive < 0.4 && temporal < 0.4) {
    return "Minimal"
  }

  // Focused: Good cognitive AND good temporal capacity (ready to work)
  // Threshold: both >= 0.55 (lowered slightly to capture Focused preset cleanly)
  if (cognitive >= 0.55 && temporal >= 0.55) {
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
