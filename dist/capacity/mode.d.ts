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
import type { CapacityField, InterfaceMode, InterfaceModeLabel } from "./types";
/**
 * Derives InterfaceMode from CapacityField
 *
 * Rules:
 * - Cognitive → density (how many things compete for attention at once)
 * - Temporal → content length, shortcuts (how much time the UI asks from user)
 * - Emotional → motion restraint (nervous-system-safe UI, no surprises)
 * - Valence → tone/expressiveness (emotional color, not information volume)
 */
export declare function deriveMode(field: CapacityField): InterfaceMode;
/**
 * Derives a human-readable mode label from raw capacity inputs
 *
 * We use RAW VALUES, not derived mode, because:
 * - Neutral (0.5, 0.5, 0.5) and Focused (0.7, 0.7, 0.6) produce the same InterfaceMode
 * - But they should have different labels (Calm vs Focused)
 * - The distinction is the RAW capacity level, not the derived mode
 *
 * Preset → Label / Motion / Focus mapping:
 * - Exhausted   (0.1, 0.1, 0.1)   → Minimal     motion: off        focus: default (static)
 * - Overwhelmed (0.2, 0.15, 0.2)  → Minimal     motion: soothing   focus: guided  (warm beacon)
 * - Distracted  (0.35, 0.25, 0.5) → Minimal     motion: subtle     focus: guided  (warm beacon)
 * - Neutral     (0.5, 0.5, 0.5)   → Calm        motion: subtle     focus: gentle  (cool glow)
 * - Focused     (0.75, 0.75, 0.55) → Focused    motion: subtle     focus: default
 * - Energized   (0.9, 0.85, 0.85) → Exploratory motion: expressive focus: default
 * - Exploring   (1.0, 1.0, 1.0)   → Exploratory motion: expressive focus: default
 */
export declare function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel;
/**
 * Get mode badge color based on label
 */
export declare function getModeBadgeColor(label: InterfaceModeLabel): string;
//# sourceMappingURL=mode.d.ts.map