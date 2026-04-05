/**
 * @file Analyzes session history from PatternStore to identify recurring capacity patterns.
 */
import { CapacityPattern } from './types';
import { PatternStore } from './pattern-store';
/**
 * Extracts recurring capacity patterns from historical data.
 */
export declare class PatternExtractor {
    private store;
    constructor(store: PatternStore);
    /**
     * Analyzes the historical capacity data to find recurring patterns.
     * @returns {CapacityPattern[]} An array of identified CapacityPattern objects.
     */
    extractPatterns(): CapacityPattern[];
    /**
     * Averages two CapacityField objects. Used for incremental averaging of predictions.
     * @param {Partial<CapacityField>} currentAvg - The current averaged capacity field.
     * @param {CapacityField} newItem - The new capacity field to include in the average.
     * @param {number} currentSampleSize - The current number of samples in the average.
     * @returns {Partial<CapacityField>} The new averaged capacity field.
     */
    private averageCapacityFields;
}
//# sourceMappingURL=pattern-extractor.d.ts.map