/**
 * Capacity-aware animation class utilities.
 *
 * Centralizes the repeated pattern of selecting CSS animation classes
 * based on the current motion mode (off / subtle / expressive).
 * Each section was independently deriving the same entranceClass / hoverClass /
 * ambientClass -- this module makes it a single source of truth.
 */

import type { MotionMode } from "./types"

// ============================================================================
// Entrance animations (one-shot, runs once when section scrolls into view)
// ============================================================================

/**
 * Map of named entrance animation presets.
 * Each preset maps a MotionMode to a CSS class name from globals.css.
 * "off" always maps to "" (no animation).
 */
const ENTRANCE_PRESETS = {
  /** Liquid organic morph -> gentle scale fade */
  morph: { expressive: "morph-fade-in", subtle: "sacred-fade", off: "" },
  /** Spinning vortex -> gentle scale fade */
  vortex: { expressive: "vortex-reveal", subtle: "sacred-fade", off: "" },
  /** Spiral in from corner -> soft bloom */
  spiral: { expressive: "spiral-in", subtle: "bloom", off: "" },
} as const

type EntrancePreset = keyof typeof ENTRANCE_PRESETS

/**
 * Returns the appropriate entrance animation class for the given motion mode.
 * Returns "" when hasPlayed is true, preventing re-render flicker.
 */
export function entranceClass(
  motion: MotionMode,
  preset: EntrancePreset,
  hasPlayed: boolean,
): string {
  if (hasPlayed) return ""
  return ENTRANCE_PRESETS[preset][motion]
}

// ============================================================================
// Hover animations (applied as a persistent class, triggered by :hover in CSS)
// ============================================================================

/**
 * Returns the appropriate hover animation class.
 * "off" mode disables hover animations entirely.
 */
export function hoverClass(motion: MotionMode): string {
  if (motion === "expressive") return "hover-expand"
  if (motion === "subtle") return "hover-lift"
  return ""
}

// ============================================================================
// Ambient animations (looping, always active while mode is expressive)
// ============================================================================

/**
 * Returns a class for continuous ambient animation (breathing, floating, etc.)
 * Only active in expressive mode to avoid overwhelming lower-capacity users.
 */
export function ambientClass(motion: MotionMode, type: "breathe" | "float" | "pulse" | "vibrate"): string {
  return motion === "expressive" ? type : ""
}

/**
 * Returns the appropriate animation class for list items (staggered entrance).
 * Expressive: helix-rise, Subtle: sacred-fade, Off: none.
 */
export function listItemClass(motion: MotionMode): string {
  if (motion === "expressive") return "helix-rise"
  if (motion === "subtle") return "sacred-fade"
  return ""
}
