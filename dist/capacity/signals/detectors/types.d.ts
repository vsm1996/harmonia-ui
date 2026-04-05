/**
 * @file Defines the interfaces for signal detectors and their readings.
 */
/**
 * Represents a signal detector that can detect a specific aspect of user capacity.
 * detect() returns an array to allow a single detector to emit readings for multiple
 * dimensions (e.g. TimeDetector emits both cognitive and temporal).
 */
export interface SignalDetector {
    name: string;
    weight: number;
    detect(): SignalReading[] | Promise<SignalReading[]>;
    destroy?(): void;
}
/**
 * Represents a single reading from a signal detector.
 */
export interface SignalReading {
    dimension: 'cognitive' | 'temporal' | 'emotional' | 'valence';
    value: number;
    confidence: number;
    timestamp: number;
    detectorName: string;
}
//# sourceMappingURL=types.d.ts.map