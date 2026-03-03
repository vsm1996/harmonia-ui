/**
 * Capacity Provider - React Context wrapper for ambient fields
 *
 * Wraps application root and exposes field hooks
 */

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { AmbientContext, UserCapacity, EmotionalState, MotionMode, CapacityField, InterfaceMode } from "./types"
import { FieldManager } from "./fields/field-manager"
import { deriveMode } from "./mode"
import { MOTION_TOKENS, DEFAULT_CAPACITY_FIELD } from "./constants"
import { SignalAggregator } from "./signals/aggregator"

// ============================================================================
// Context Definition
// ============================================================================

interface CapacityContextValue {
  context: AmbientContext
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
  isAutoMode: boolean;
  toggleAutoMode: () => void;
  updateCapacityField: (field: CapacityField) => void;
}

const CapacityContext = createContext<CapacityContextValue | null>(null)

// ============================================================================
// Provider Component
// ============================================================================

export function CapacityProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AmbientContext>(() => FieldManager.getContext());
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true); // Start in auto mode
  const isFirstAggregationComplete = useRef<boolean>(false); // New ref to control initial aggregator application
  const aggregatorRef = useRef<SignalAggregator | null>(null);

  useEffect(() => {
    // Initialize aggregator on mount
    aggregatorRef.current = new SignalAggregator();

    const unsubscribe = FieldManager.subscribe((newContext) => {
      setContext(newContext);
    });

    return () => {
      unsubscribe();
      // Clean up aggregator on unmount
      if (aggregatorRef.current) {
        aggregatorRef.current.destroy();
      }
    };
  }, []);

  // Effect to run aggregator in auto mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoMode && aggregatorRef.current) {
      intervalId = setInterval(async () => {
        try {
          const suggestedField = await aggregatorRef.current!.aggregateSignals();

          if (!isFirstAggregationComplete.current) {
            // Skip the very first aggregation — detectors need one cycle to stabilise
            isFirstAggregationComplete.current = true;
          } else {
            FieldManager.updateCapacity({
              cognitive: suggestedField.cognitive,
              temporal: suggestedField.temporal,
              emotional: suggestedField.emotional,
            });
            FieldManager.updateEmotionalState({
              valence: suggestedField.valence,
            });
          }
        } catch (error) {
          // Log but do not crash — auto mode silently degrades on transient failures
          console.warn('[CapacityProvider] Signal aggregation failed:', error);
        }
      }, 2000); // Aggregate every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoMode]);

  // Memoized update functions
  const updateCapacity = useCallback((capacity: Partial<UserCapacity>) => {
    if (isAutoMode) {
      setIsAutoMode(false); // Switch to manual mode if user manually updates capacity
    }
    FieldManager.updateCapacity(capacity);
  }, [isAutoMode]);

  const updateEmotionalState = useCallback((state: Partial<EmotionalState>) => {
    if (isAutoMode) {
      setIsAutoMode(false); // Switch to manual mode if user manually updates emotional state
    }
    FieldManager.updateEmotionalState(state);
  }, [isAutoMode]);

  const updateCapacityField = useCallback((field: CapacityField) => {
    // This function can be used to set the full capacity field directly, regardless of auto mode.
    // Useful for initial setup or explicit overrides.
    FieldManager.updateCapacity({
      cognitive: field.cognitive,
      temporal: field.temporal,
      emotional: field.emotional,
    });
    FieldManager.updateEmotionalState({
      valence: field.valence,
    });
  }, []);

  const toggleAutoMode = useCallback(() => {
    setIsAutoMode((prev) => !prev);
  }, []);

  return (
    <CapacityContext.Provider value={{
      context, updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField,
    }}>
      {children}
    </CapacityContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access full ambient context
 * Most components should use specific field hooks instead
 */
export function useCapacityContext(): CapacityContextValue {
  const context = useContext(CapacityContext)
  if (!context) {
    throw new Error("useCapacityContext must be used within CapacityProvider")
  }
  return context
}

/**
 * Subscribe to energy field only
 */
export function useEnergyField() {
  const { context } = useCapacityContext()
  return context.energy
}

/**
 * Subscribe to attention field only
 */
export function useAttentionField() {
  const { context } = useCapacityContext()
  return context.attention
}

/**
 * Subscribe to emotional valence field only
 */
export function useEmotionalValenceField() {
  const { context } = useCapacityContext()
  return context.emotionalValence
}

/**
 * Get field update functions (for Phase 1 slider system)
 */
export function useFieldControls() {
  const { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField } = useCapacityContext()
  return { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField }
}

/**
 * Detect system prefers-reduced-motion preference
 * Returns true if user has requested reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check initial value
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Derive the full mode from current capacity context.
 * This is the primary hook for section-level components that need
 * the field values AND the derived mode together.
 * 
 * Eliminates the repeated { cognitive: context.userCapacity.cognitive, ... }
 * construction that was duplicated across every section component.
 */
export function useDerivedMode(): {
  field: CapacityField
  mode: InterfaceMode
} {
  const { context } = useCapacityContext()

  const field: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

  const mode = deriveMode(field)

  return { field, mode }
}

/**
 * Get effective motion mode with system preference override
 * 
 * System prefers-reduced-motion is a HARD OVERRIDE - non-negotiable on safety.
 * This ensures accessibility compliance regardless of derived mode.
 */
export function useEffectiveMotion(): {
  mode: MotionMode
  tokens: typeof MOTION_TOKENS[keyof typeof MOTION_TOKENS]
  prefersReducedMotion: boolean
} {
  const { field } = useDerivedMode()
  const prefersReducedMotion = usePrefersReducedMotion()

  const derivedMode = deriveMode(field)
  const effectiveMode: MotionMode = prefersReducedMotion ? "off" : derivedMode.motion

  return {
    mode: effectiveMode,
    tokens: MOTION_TOKENS[effectiveMode],
    prefersReducedMotion,
  }
}
