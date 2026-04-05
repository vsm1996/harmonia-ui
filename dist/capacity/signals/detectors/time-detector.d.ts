/**
 * @file Implements a signal detector for time-based capacity.
 * Emits two readings per detect() call: cognitive (hour-of-day diurnal pattern)
 * and temporal (weekday vs. weekend).
 */
import { SignalDetector, SignalReading } from './types';
/**
 * The TimeDetector class implements the SignalDetector interface
 * to provide signal readings based on the current time and day.
 */
export declare class TimeDetector implements SignalDetector {
    readonly name = "TimeDetector";
    readonly weight = 0.6;
    /**
     * Detects and returns SignalReadings based on the current time and day.
     * Returns two readings: cognitive (hour-of-day) and temporal (weekday/weekend).
     */
    detect(): SignalReading[];
}
//# sourceMappingURL=time-detector.d.ts.map