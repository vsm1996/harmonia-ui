/**
 * @file Aggregates signals from all detectors into a suggested CapacityField.
 *
 * Bug fixes vs. original:
 * - detect() now returns SignalReading[] so readings.push(...) spreads the array.
 * - getDetectorWeight() now uses a per-detector/dimension lookup table instead of
 *   ignoring the dimension parameter.
 * - destroy() uses the optional-chaining destroy?() instead of (detector as any).destroy().
 */
import { CapacityField } from '../types';
export declare class SignalAggregator {
    private detectors;
    /**
     * Per-detector, per-dimension weight overrides.
     * Falls back to detector.weight for any unlisted combination.
     *
     * Rationale for asymmetries:
     * - TimeDetector: cognitive signal is stronger (diurnal pattern) than temporal
     *   (weekday/weekend is coarser)
     * - EnvironmentDetector: emotional signal (color scheme) is a stronger explicit
     *   preference than temporal (reduced-motion)
     */
    private static readonly DIMENSION_WEIGHTS;
    constructor();
    /**
     * Collects signal readings from all detectors and aggregates them into a
     * confidence-weighted CapacityField.
     */
    aggregateSignals(): Promise<CapacityField>;
    /**
     * Returns the effective weight for a detector/dimension pair.
     * Checks DIMENSION_WEIGHTS first; falls back to detector.weight.
     */
    private getDetectorWeight;
    /** Cleans up all detector resources (event listeners, timers). */
    destroy(): void;
}
//# sourceMappingURL=aggregator.d.ts.map