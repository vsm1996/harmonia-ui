/**
 * @file Implements a signal detector for user interaction patterns.
 * Assesses cognitive capacity from click rate and precision using a rolling window.
 *
 * Bug fixes vs. original:
 * - clickCount / totalClickDistance accumulated forever → replaced with a 60-second
 *   rolling window so recent behaviour dominates over historical averages.
 * - IDLE_THRESHOLD_MS was 3 s (too aggressive for focused reading) → raised to 15 s.
 */
import { SignalDetector, SignalReading } from './types';
export declare class InteractionDetector implements SignalDetector {
    readonly name = "InteractionDetector";
    readonly weight = 0.7;
    private lastMouseMoveTime;
    private lastClickTime;
    private lastClickPosition;
    private clickHistory;
    private idleTimer;
    private isIdle;
    constructor();
    private resetIdleTimer;
    private handleMouseMove;
    private handleClick;
    detect(): SignalReading[];
    destroy(): void;
}
//# sourceMappingURL=interaction-detector.d.ts.map