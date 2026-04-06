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
import type { CapacityField } from "./types";
export type ConflictSeverity = "info" | "warning";
export interface ConflictWarning {
    /** Stable ID — use for React keys and deduplication */
    id: string;
    severity: ConflictSeverity;
    /** Short label shown in the UI */
    label: string;
    /** Full description of what's conflicting and why it matters */
    message: string;
    /** Which derived tokens are affected — at least one required */
    affectedTokens: [string, ...string[]];
    /** Optional resolution hint shown to the user */
    suggestion?: string;
}
/**
 * Detect conflicting emotional/capacity state combinations.
 * Returns an empty array when all inputs are coherent.
 */
export declare function detectConflicts(field: CapacityField): ConflictWarning[];
//# sourceMappingURL=validation.d.ts.map