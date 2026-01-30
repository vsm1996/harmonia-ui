/**
 * Mode Derivation - Field → Mode transformation
 *
 * This is the key insight: don't map sliders directly to 50 UI changes.
 * Instead, derive 2-4 coherent modes and let modes drive everything.
 *
 * This keeps the UI from feeling like "sliders controlling random stuff"
 * and instead like "sliders select a coherent state."
 */

import type { CapacityField, InterfaceMode, InterfaceModeLabel } from "./types"

// ============================================================================
// Mode Derivation Rules
// ============================================================================

/**
 * Derives InterfaceMode from CapacityField
 *
 * Rules (tunable):
 * - low cognitive OR low emotional → lower density + more guidance + minimal choice load
 * - low temporal → shorter content, fewer steps, more defaults
 * - negative valence → calmer motion + boosted contrast + warmer copy tone
 */
export function deriveMode(field: CapacityField): InterfaceMode {
  const lowCognitive = field.cognitive < 0.35
  const lowEmotional = field.emotional < 0.35
  const lowTemporal = field.temporal < 0.35
  const negValence = field.valence < -0.25

  // Density: How much information to show
  const density: InterfaceMode["density"] =
    lowCognitive || lowEmotional ? "low" : field.cognitive > 0.75 ? "high" : "medium"

  // Guidance: How much explanation/labeling
  const guidance: InterfaceMode["guidance"] =
    lowCognitive || lowEmotional ? "high" : lowTemporal ? "medium" : "low"

  // Choice Load: Number of options/decisions
  const choiceLoad: InterfaceMode["choiceLoad"] =
    lowCognitive || lowEmotional || lowTemporal ? "minimal" : "normal"

  // Motion: Animation intensity
  const motion: InterfaceMode["motion"] =
    lowEmotional || negValence ? "subtle" : field.valence > 0.5 ? "expressive" : "subtle"

  // Contrast: Visual contrast level (boost when mood is low)
  const contrast: InterfaceMode["contrast"] = negValence ? "boosted" : "standard"

  return { density, guidance, motion, contrast, choiceLoad }
}

// ============================================================================
// Mode Label Derivation
// ============================================================================

/**
 * Derives a human-readable mode label from InterfaceMode
 *
 * Labels:
 * - Calm: Low density, subtle motion, high guidance
 * - Focused: Medium density, minimal choices, low guidance
 * - Exploratory: High density, expressive motion, normal choices
 * - Minimal: Low density, minimal choices, subtle motion
 */
export function deriveModeLabel(mode: InterfaceMode): InterfaceModeLabel {
  // Minimal: Everything scaled back
  if (mode.density === "low" && mode.choiceLoad === "minimal" && mode.motion === "subtle") {
    return "Minimal"
  }

  // Calm: Gentle, supportive state
  if (mode.guidance === "high" && mode.motion === "subtle") {
    return "Calm"
  }

  // Focused: Efficient, task-oriented
  if (mode.density === "medium" && mode.choiceLoad === "minimal") {
    return "Focused"
  }

  // Exploratory: Open, engaged state
  if (mode.density === "high" || mode.motion === "expressive") {
    return "Exploratory"
  }

  // Default to Calm if nothing else matches
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
