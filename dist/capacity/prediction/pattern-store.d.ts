/**
 * @file Manages the storage and retrieval of CapacityField patterns in localStorage.
 * Provides CRUD operations for persisting user capacity history.
 *
 * Bug fix vs. original: all localStorage calls are now wrapped in try/catch.
 * localStorage.setItem() throws DOMException when the storage quota is exceeded and
 * JSON.parse throws SyntaxError on corrupt data. Both are now handled gracefully —
 * reads degrade to [] and writes are silently skipped.
 */
import { CapacityField } from '../types';
interface CapacityHistoryItem {
    timestamp: number;
    capacity: CapacityField;
}
export declare class PatternStore {
    constructor();
    /**
     * Records a new CapacityField state with a timestamp.
     * Silently skips the write if localStorage is full or unavailable.
     */
    recordCapacity(capacity: CapacityField): void;
    /**
     * Retrieves the entire capacity history.
     * Returns [] on any storage or parse error.
     */
    getHistory(): CapacityHistoryItem[];
    /** Clears the entire capacity history. */
    clearHistory(): void;
    /** Deletes a specific historical item by its timestamp. */
    deleteItem(timestamp: number): void;
    /** Updates the capacity fields of a specific historical item. */
    updateItem(timestamp: number, updates: Partial<CapacityField>): void;
}
export {};
//# sourceMappingURL=pattern-store.d.ts.map