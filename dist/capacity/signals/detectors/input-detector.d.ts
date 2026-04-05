/**
 * @file Implements a signal detector for user input patterns (typing speed + error rate).
 * Assesses cognitive capacity based on typing behaviour.
 *
 * Bug fix vs. original:
 * - errorCount / lastErrorTime tracked errors since an arbitrary past reset; old
 *   errors counted the same as current ones → replaced with an errorTimes[] sliding
 *   window so only errors within ERROR_CHECK_WINDOW (5 s) are counted.
 * - Inference now uses recentErrorCount (integer) instead of a boolean, letting the
 *   code distinguish a single correction from repeated fumbling.
 */
import { SignalDetector, SignalReading } from './types';
export declare class InputDetector implements SignalDetector {
    readonly name = "InputDetector";
    readonly weight = 0.6;
    private keyPressTimes;
    private errorTimes;
    constructor();
    private handleKeyDown;
    detect(): SignalReading[];
    destroy(): void;
}
//# sourceMappingURL=input-detector.d.ts.map