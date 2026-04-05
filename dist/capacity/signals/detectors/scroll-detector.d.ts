/**
 * @file Implements a signal detector for scroll velocity.
 * This detector assesses cognitive capacity based on the user's scrolling behavior.
 */
import { SignalDetector, SignalReading } from './types';
/**
 * The ScrollDetector class implements the SignalDetector interface
 * to provide signal readings based on scroll velocity.
 */
export declare class ScrollDetector implements SignalDetector {
    readonly name = "ScrollDetector";
    readonly weight = 0.5;
    private lastScrollY;
    private lastScrollTime;
    private scrollVelocity;
    private timeoutId;
    constructor();
    /**
     * Handles the scroll event, debouncing it and calculating scroll velocity.
     * @private
     */
    private handleScroll;
    /**
     * Detects and returns a SignalReading based on the current scroll velocity.
     * It provides insights into the cognitive dimension.
     *
     * @returns {SignalReading} A reading indicating the inferred capacity.
     */
    detect(): SignalReading[];
    /**
     * Cleans up the scroll event listener when the detector is no longer needed.
     */
    destroy(): void;
}
//# sourceMappingURL=scroll-detector.d.ts.map