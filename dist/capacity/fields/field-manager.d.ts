/**
 * Field Manager - Singleton that maintains ambient field state
 *
 * Components subscribe to fields, never write to them
 * Only Phase 1 slider system writes field values
 */
import type { AmbientContext, UserCapacity, EmotionalState, FieldConfig } from "../types";
type FieldChangeListener = (context: AmbientContext) => void;
declare class FieldManagerClass {
    private context;
    private listeners;
    private config;
    constructor();
    /**
     * Get current ambient context (read-only)
     */
    getContext(): Readonly<AmbientContext>;
    /**
     * Update user capacity (Phase 1 slider system writes here)
     */
    updateCapacity(capacity: Partial<UserCapacity>): void;
    /**
     * Update emotional state (Phase 1 slider system writes here)
     */
    updateEmotionalState(state: Partial<EmotionalState>): void;
    /**
     * Subscribe to field changes
     */
    subscribe(listener: FieldChangeListener): () => void;
    /**
     * Notify all listeners of field changes
     */
    private notifyListeners;
    /**
     * Update field configuration
     */
    updateConfig(config: Partial<FieldConfig>): void;
    /**
     * Get current field configuration
     */
    getConfig(): Readonly<FieldConfig>;
}
export declare const FieldManager: FieldManagerClass;
export {};
//# sourceMappingURL=field-manager.d.ts.map