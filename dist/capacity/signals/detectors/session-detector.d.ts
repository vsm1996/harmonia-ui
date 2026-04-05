/**
 * @file Implements a signal detector for session duration.
 * This detector assesses temporal capacity based on how long the user has been active in the current session.
 */
import { SignalDetector, SignalReading } from './types';
/**
 * The SessionDetector class implements the SignalDetector interface
 * to provide signal readings based on the current session duration.
 */
export declare class SessionDetector implements SignalDetector {
    readonly name = "SessionDetector";
    readonly weight = 0.7;
    private sessionStartTime;
    constructor();
    /**
     * Detects and returns a SignalReading based on the current session duration.
     * It provides insights into the temporal dimension.
     *
     * @returns {SignalReading} A reading indicating the inferred capacity.
     */
    detect(): SignalReading[];
}
//# sourceMappingURL=session-detector.d.ts.map