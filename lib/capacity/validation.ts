/**
 * Emotional State Conflict Detection
 *
 * Detects combinations of capacity/emotional inputs that produce contradictory
 * or meaningless derived tokens. Does not throw — returns warnings so the UI
 * can surface them non-intrusively.
 *
 * Conflicts are structural (inputs fight each other at the token level), not
 * value judgements. A panic state is valid input; it just produces tokens that
 * partially cancel each other out.
 */

import type { CapacityField } from "./types"

// ============================================================================
// Types
// ============================================================================

export type ConflictSeverity = "info" | "warning"

export interface ConflictWarning {
  /** Stable ID — use for React keys and deduplication */
  id: string
  severity: ConflictSeverity
  /** Short label shown in the UI */
  label: string
  /** Full description of what's conflicting and why it matters */
  message: string
  /** Which derived tokens are affected */
  affectedTokens: string[]
  /** Optional resolution hint shown to the user */
  suggestion?: string
}

// ============================================================================
// Conflict Rules
// ============================================================================

/**
 * Detect conflicting emotional/capacity state combinations.
 * Returns an empty array when all inputs are coherent.
 */
export function detectConflicts(field: CapacityField): ConflictWarning[] {
  const conflicts: ConflictWarning[] = []
  const arousal = field.arousal ?? 0.5

  // ── Conflict 1: Dead pace tokens ────────────────────────────────────────
  // emotional < 0.15 disables all animations (motion = "off").
  // arousal > 0.65 drives pace = "activated" and multiplier = 0.65.
  // The multiplier applies to zero-duration animations — no effect.
  if (field.emotional < 0.15 && arousal > 0.65) {
    conflicts.push({
      id: "dead-pace",
      severity: "info",
      label: "Pace has no effect",
      message:
        "Arousal is high (pace: activated) but emotional capacity has disabled all animations. The pace multiplier runs on nothing.",
      affectedTokens: ["motion", "pace"],
      suggestion: "Lower arousal below 0.65, or raise emotional capacity above 0.15 to let pace take effect.",
    })
  }

  // ── Conflict 2: Anxiety/panic pattern ───────────────────────────────────
  // High physiological activation (arousal) paired with low emotional capacity
  // produces a protective, near-static UI (motion: soothing or off) running at
  // an internally fast pace. The experience feels frozen but wired.
  if (arousal > 0.7 && field.emotional < 0.3 && !conflicts.find(c => c.id === "dead-pace")) {
    conflicts.push({
      id: "anxiety-pattern",
      severity: "warning",
      label: "Anxiety pattern detected",
      message:
        "High arousal with low emotional capacity signals an overwhelm/anxiety state. The UI is protective (slow or static motion) but internal pace is fast — these work against each other.",
      affectedTokens: ["motion", "pace"],
      suggestion: "Lower arousal to match emotional capacity, or raise emotional capacity if the high energy is intentional.",
    })
  }

  // ── Conflict 3: Density–choice inversion ────────────────────────────────
  // High cognitive drives density = "high" (many items, full hierarchy).
  // Low temporal drives choiceLoad = "minimal" (few decisions, shortcuts).
  // Dense content with minimal choices is structurally contradictory — the UI
  // shows everything but hides most of the actions.
  if (field.cognitive > 0.75 && field.temporal < 0.2) {
    conflicts.push({
      id: "density-choice-inversion",
      severity: "info",
      label: "Dense content, minimal choices",
      message:
        "High cognitive capacity requests full information density, but low temporal capacity minimises available choices. Content will be rich but most actions will be hidden.",
      affectedTokens: ["density", "choiceLoad", "guidance"],
    })
  }

  // ── Conflict 4: Mute expressiveness ─────────────────────────────────────
  // Strong positive valence signals a warm, expressive tone. But very low
  // emotional capacity disables all decorative motion. The tone has no outlet.
  if (field.valence > 0.5 && field.emotional < 0.15) {
    conflicts.push({
      id: "mute-expressiveness",
      severity: "info",
      label: "Positive tone, no motion",
      message:
        "Emotional valence is strongly positive, but emotional capacity has disabled all animations. The expressive tone cannot be conveyed through motion.",
      affectedTokens: ["motion", "contrast"],
      suggestion: "Raise emotional capacity above 0.15 to allow at least soothing motion.",
    })
  }

  return conflicts
}
