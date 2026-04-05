/**
 * @file Matches the current context against stored patterns to generate predictive capacity suggestions.
 */
import { CapacityField } from '../types';
import { PatternTrigger } from './types';
import { PatternExtractor } from './pattern-extractor';
/**
 * The PredictionEngine uses extracted patterns to predict future capacity states
 * based on the current context.
 */
export declare class PredictionEngine {
    private patternExtractor;
    private patterns;
    constructor(patternExtractor: PatternExtractor);
    /**
     * Loads or reloads patterns from the extractor.
     */
    loadPatterns(): void;
    /**
     * Generates a predicted CapacityField based on the current context.
     * @param {PatternTrigger} currentContext - The current environmental and behavioral context.
     * @returns {CapacityField | null} A predicted CapacityField or null if no confident prediction can be made.
     */
    predictCapacity(currentContext: PatternTrigger): CapacityField | null;
    /**
     * Determines if a pattern's trigger matches the current context.
     * This can be made more sophisticated (e.g., fuzzy matching, weighting different trigger types).
     * @param {PatternTrigger} patternTrigger - The trigger defined in the pattern.
     * @param {PatternTrigger} currentContext - The current environmental and behavioral context.
     * @returns {boolean} True if the pattern trigger matches the current context.
     */
    private matchesContext;
    /**
     * Implements confidence decay for patterns. Confidence should decay over time if a pattern is not re-observed.
     * This method would typically be called periodically (e.g., daily) or when patterns are reloaded.
     */
    decayConfidence(): void;
}
//# sourceMappingURL=prediction-engine.d.ts.map