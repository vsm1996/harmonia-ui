/**
 * Typography Utilities - Renge (Proportional Form)
 *
 * Font scaling based on golden ratio with subtle randomness
 * and energy-based adjustments for cognitive load adaptation.
 *
 * Philosophy:
 * - Legibility first: minimum sizes and contrast are non-negotiable
 * - φ-based modular scale prevents arbitrary sizing
 * - Small random jitter (±5%) prevents mechanical rigidity
 * - Energy-based bias: low energy = larger (readability), high = smaller (density)
 */
import type { DensityMode } from "../types";
/**
 * Typography roles in the UI hierarchy
 * Maps to semantic HTML elements
 */
export type TypographyRole = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "label";
/**
 * Energy levels derived from EnergyField
 * Influences sizing bias for cognitive adaptation
 */
export type EnergyLevel = "low" | "medium" | "high";
/**
 * Attention levels derived from AttentionField
 * Influences weight and spacing for focus
 */
export type AttentionLevel = "low" | "medium" | "high";
/**
 * Modular scale function using golden ratio
 *
 * @param step - Power of φ to scale by (can be negative for smaller sizes)
 * @param base - Base size in pixels (default: 16)
 * @returns Scaled size in pixels
 *
 * Example:
 * modularScale(2) → 16 * φ^2 ≈ 41.89px
 * modularScale(-1) → 16 * φ^-1 ≈ 9.89px
 */
export declare function modularScale(step: number, base?: number): number;
/**
 * Get font size with φ-based scaling, random jitter, and energy bias
 *
 * @param role - Typography role (h1, h2, body, etc.)
 * @param energy - Energy level from EnergyField (default: medium)
 * @param options - Optional overrides
 * @returns Font size in pixels (clamped to minimum)
 *
 * Design decisions:
 * 1. Uses φ-based modular scale for natural proportions
 * 2. Adds ±5% random jitter to prevent mechanical feel
 * 3. Biases size based on energy: low = larger, high = smaller
 * 4. Always respects minimum font size for accessibility
 */
export declare function getFontSize(role: TypographyRole, energy?: EnergyLevel, options?: {
    base?: number;
    jitter?: boolean;
    minSize?: number;
}): number;
/**
 * Get font weight based on attention level
 *
 * @param attention - Attention level from AttentionField
 * @returns Font weight value (400-500)
 *
 * Higher attention = bolder text to help maintain focus
 */
export declare function getFontWeight(attention?: AttentionLevel): number;
/**
 * Get letter spacing based on attention level
 *
 * @param attention - Attention level from AttentionField
 * @returns Letter spacing in em units
 *
 * Tighter tracking when focused, looser when relaxed
 */
export declare function getLetterSpacing(attention?: AttentionLevel): number;
/**
 * Get line height based on typography role
 *
 * @param role - Typography role
 * @returns Line height as unitless multiplier
 *
 * Design decisions:
 * - Headings: tighter (1.2-1.3) for visual impact
 * - Body: comfortable reading (1.5-1.6)
 * - Always maintains readability standards
 */
export declare function getLineHeight(role: TypographyRole): number;
/**
 * Get complete typography styles for a role
 *
 * @param role - Typography role
 * @param energy - Energy level from EnergyField
 * @param attention - Attention level from AttentionField
 * @returns Complete CSS-in-JS typography object
 *
 * Returns all typography properties in one call for convenience
 */
export declare function getTypographyStyles(role: TypographyRole, energy?: EnergyLevel, attention?: AttentionLevel): {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: string;
};
/**
 * Get responsive font size with clamp()
 *
 * @param role - Typography role
 * @param energy - Energy level
 * @returns CSS clamp() expression for fluid typography
 *
 * Creates fluid typography that scales between viewport sizes
 * while respecting φ-based proportions
 */
export declare function getFluidFontSize(role: TypographyRole, energy?: EnergyLevel): string;
/**
 * Fibonacci-based spacing scale.
 * Each step is a Fibonacci number × SPACING_BASE (4px):
 *
 * Step | Fibonacci | px  | rem
 * -----|-----------|-----|-----
 *  0   |     1     |  4  | 0.25
 *  1   |     1     |  4  | 0.25
 *  2   |     2     |  8  | 0.5
 *  3   |     3     | 12  | 0.75
 *  4   |     5     | 20  | 1.25
 *  5   |     8     | 32  | 2
 *  6   |    13     | 52  | 3.25
 *  7   |    21     | 84  | 5.25
 *  8   |    34     | 136 | 8.5
 *  9   |    55     | 220 | 13.75
 */
export declare const SPACING_SCALE: number[];
/**
 * Get spacing value from Fibonacci scale.
 *
 * @param step - Scale step (0–11, maps to FIBONACCI sequence)
 * @param unit - Return "px" string, "rem" string, or raw number (default: "px")
 * @returns Spacing value
 *
 * @example
 * getSpacing(4)        // "20px"   (Fibonacci[4]=5 × 4)
 * getSpacing(5, "rem") // "2rem"   (Fibonacci[5]=8 × 4 / 16)
 * getSpacing(3, "raw") // 12
 */
export declare function getSpacing(step: number, unit?: "px" | "rem" | "raw"): string | number;
/**
 * Get proportional padding/gap values based on current density mode.
 *
 * Returns CSS-ready spacing strings using the Fibonacci scale,
 * scaled back at low density (less space) and up at high density (more breathing room).
 *
 * @param density - Current density mode from InterfaceMode
 * @returns Object of CSS spacing values for padding, gap, etc.
 */
export declare function getProportionalSpacing(density: DensityMode): {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    gap: string;
};
/**
 * Get a φ-based size ratio for proportional component scaling.
 *
 * @param steps - Number of φ steps (positive = larger, negative = smaller)
 * @returns Unitless multiplier based on powers of φ
 *
 * @example
 * phiRatio(1)  // 1.618 — golden ratio
 * phiRatio(-1) // 0.618 — inverse golden ratio
 * phiRatio(2)  // 2.618 — φ²
 */
export declare function phiRatio(steps: number): number;
//# sourceMappingURL=typography.d.ts.map