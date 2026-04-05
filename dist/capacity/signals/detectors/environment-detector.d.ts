/**
 * @file Implements signal detectors for environmental preferences.
 * Reads prefers-reduced-motion (→ temporal) and prefers-color-scheme (→ emotional).
 *
 * Bug fixes vs. original:
 * - Memory leak: stored MediaQueryList refs so removeEventListener unregisters the
 *   exact same handler that was registered (arrow-function class properties create a
 *   new reference on each access, so calling this.detect would never unregister).
 * - Discarded temporal dimension: now returns both temporal and emotional readings.
 */
import { SignalDetector, SignalReading } from './types';
export declare class EnvironmentDetector implements SignalDetector {
    readonly name = "EnvironmentDetector";
    readonly weight = 0.8;
    private mqlReducedMotion;
    private mqlDarkMode;
    private readonly handleChange;
    constructor();
    /**
     * Returns two readings:
     * - temporal:  based on prefers-reduced-motion (low → less time pressure on animations)
     * - emotional: based on prefers-color-scheme   (dark → slightly lower emotional load)
     */
    detect(): SignalReading[];
    /**
     * Removes the event listeners registered in the constructor.
     * Uses the stored refs so the same function reference is unregistered.
     */
    destroy(): void;
}
//# sourceMappingURL=environment-detector.d.ts.map