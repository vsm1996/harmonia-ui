/**
 * Mode Derivation - Transforms CapacityField into coherent InterfaceMode
 *
 * Philosophy:
 * - Don't map sliders directly to styles (feels arbitrary)
 * - Derive 2-4 coherent modes that drive everything
 * - Modes create meaningful states: "Calm", "Focused", "Exploratory", "Minimal"
 *
 * Mapping Rules:
 * - low cognitive OR low emotional → lower density + more guidance + minimal choice load
 * - low temporal → fewer steps, fewer CTAs
 * - negative valence → calmer motion + boosted contrast + warmer tone
 */

import type { CapacityField, InterfaceMode, InterfaceModeLabel } from "./types"

/**
 * Derives InterfaceMode from CapacityField
 * This is the core transformation that makes the framework coherent
 */
export function deriveMode(field: CapacityField): InterfaceMode {
  const lowCognitive = field.cognitive < 0.35
  const lowEmotional = field.emotional < 0.35
  const lowTemporal = field.temporal < 0.35
  const negValence = field.valence < -0.25
  const highCognitive = field.cognitive > 0.75
  const posValence = field.valence > 0.5

  // Density: How much information complexity to show
  const density: InterfaceMode["density"] =
    lowCognitive || lowEmotional ? "low" : highCognitive ? "high" : "medium"

  // Guidance: How much explanation/labeling
  const guidance: InterfaceMode["guidance"] =
    lowCognitive || lowEmotional ? "high" : lowTemporal ? "medium" : "low"

  // Choice Load: Reduces decision fatigue
  const choiceLoad: InterfaceMode["choiceLoad"] =
    lowCognitive || lowEmotional || lowTemporal ? "minimal" : "normal"

  // Motion: Animation intensity
  const motion: InterfaceMode["motion"] =
    lowEmotional || negValence ? "subtle" : posValence ? "expressive" : "subtle"

  // Contrast: Visual contrast level (boosted when stressed/negative)
  const contrast: InterfaceMode["contrast"] = negValence ? "boosted" : "standard"

  return { density, guidance, motion, contrast, choiceLoad }
}

/**
 * Derives a human-readable mode label for display
 * Shows the "coherent state" the UI is in
 */
export function deriveModeLabel(field: CapacityField): InterfaceModeLabel {
  const lowCognitive = field.cognitive < 0.35
  const lowEmotional = field.emotional < 0.35
  const lowTemporal = field.temporal < 0.35
  const highCognitive = field.cognitive > 0.75
  const negValence = field.valence < -0.25

  // Minimal: User is overwhelmed or stressed
  if ((lowCognitive || lowEmotional) && negValence) {
    return "Minimal"
  }

  // Calm: User needs low intensity, gentle interface
  if (lowCognitive || lowEmotional || negValence) {
    return "Calm"
  }

  // Focused: User has high attention, limited time
  if (highCognitive && lowTemporal) {
    return "Focused"
  }

  // Exploratory: User has capacity and time to explore
  return "Exploratory"
}

/**
 * Get mode label color for badge display
 * Uses semantic colors from the theme
 */
export function getModeLabelColor(label: InterfaceModeLabel): string {
  switch (label) {
    case "Calm":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Focused":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "Exploratory":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Minimal":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
  }
}
