/**
 * @file Defines the interfaces for predictive adaptation patterns.
 */
import { CapacityField } from '../types';
/**
 * Represents a detected capacity pattern, linking a trigger to a predicted CapacityField.
 */
export interface CapacityPattern {
    trigger: PatternTrigger;
    prediction: Partial<CapacityField>;
    confidence: number;
    sampleSize: number;
    timestamp: number;
}
/**
 * Defines the conditions that trigger a capacity pattern.
 * This can be extended with more specific properties as needed.
 */
export interface PatternTrigger {
    timeOfDay?: number;
    dayOfWeek?: number;
    sessionDuration?: number;
}
//# sourceMappingURL=types.d.ts.map