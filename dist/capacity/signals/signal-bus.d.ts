/**
 * Signal Bus - Type-safe pub/sub for inter-component communication
 *
 * Components emit signals, never directly call each other
 */
import type { SignalHandler, Unsubscribe, SignalPriority } from "../types";
declare class SignalBusClass {
    private handlers;
    private signalQueue;
    private processing;
    /**
     * Emit a signal to all subscribed handlers
     */
    emit<T = unknown>(type: string, payload: T, priority?: SignalPriority, source?: string): void;
    /**
     * Subscribe to a specific signal type
     */
    subscribe<T = unknown>(type: string, handler: SignalHandler<T>): Unsubscribe;
    /**
     * Subscribe to multiple signal types with same handler
     */
    subscribeMultiple<T = unknown>(types: string[], handler: SignalHandler<T>): Unsubscribe;
    /**
     * Process signal queue
     */
    private processQueue;
    /**
     * Get count of handlers for a signal type
     */
    getHandlerCount(type: string): number;
    /**
     * Clear all handlers (useful for testing)
     */
    clear(): void;
}
export declare const SignalBus: SignalBusClass;
export declare const SIGNAL_TYPES: {
    readonly FIELD_ENERGY_CHANGED: "field:energy:changed";
    readonly FIELD_ATTENTION_CHANGED: "field:attention:changed";
    readonly FIELD_VALENCE_CHANGED: "field:valence:changed";
    readonly USER_INTERACTION_START: "user:interaction:start";
    readonly USER_INTERACTION_END: "user:interaction:end";
    readonly USER_FOCUS_CHANGED: "user:focus:changed";
    readonly COMPONENT_MOUNTED: "component:mounted";
    readonly COMPONENT_UNMOUNTED: "component:unmounted";
    readonly A11Y_ANNOUNCE: "a11y:announce";
    readonly A11Y_FOCUS_TRAP: "a11y:focus:trap";
};
export {};
//# sourceMappingURL=signal-bus.d.ts.map