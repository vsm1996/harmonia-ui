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
 * Derives a human-readable mode label from InterfaceMode
 *
 * Preset → Mode mapping (for reference):
 * - Exhausted:   density=low,  choiceLoad=minimal, motion=subtle   → Minimal
 * - Overwhelmed: density=low,  choiceLoad=minimal, motion=subtle   → Minimal  
 * - Distracted:  density=med,  choiceLoad=minimal, motion=subtle   → Calm (time pressure but ok cognitive)
 * - Neutral:     density=med,  choiceLoad=normal,  motion=subtle   → Calm (balanced state)
 * - Focused:     density=med,  choiceLoad=normal,  motion=subtle   → Focused (good capacity, no time pressure)
 * - Energized:   density=high, choiceLoad=normal,  motion=express  → Exploratory
 * - Exploring:   density=high, choiceLoad=normal,  motion=express  → Exploratory
 *
 * Labels:
 * - Minimal: Low density + minimal choices (exhausted/overwhelmed)
 * - Calm: Medium density + minimal choices OR medium density + normal choices + subtle motion + not high guidance
 * - Focused: Medium density + normal choices + low guidance (engaged, ready to work)
 * - Exploratory: High density OR expressive motion
 */
export function deriveModeLabel(mode: InterfaceMode): InterfaceModeLabel {
  // Exploratory: Open, engaged state (high density or expressive motion)
  // Check FIRST - if you have high energy/cognitive, you're exploring
  if (mode.density === "high" || mode.motion === "expressive") {
    return "Exploratory"
  }

  // Minimal: Everything scaled back (low density + time pressure)
  if (mode.density === "low" && mode.choiceLoad === "minimal") {
    return "Minimal"
  }

  // Now we're in medium density territory...
  
  // Focused: Good cognitive capacity + no time pressure + low guidance needed
  // This is the "ready to work" state - engaged but not overwhelmed
  if (mode.density === "medium" && mode.choiceLoad === "normal" && mode.guidance === "low") {
    return "Focused"
  }

  // Calm: Everything else - balanced/neutral states, or time pressure with ok cognitive
  // Includes: distracted (med density + minimal choices), neutral (med + normal + medium guidance)
  // Also includes low density states without time pressure
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
