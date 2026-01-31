/**
 * Capacity Provider - React Context wrapper for ambient fields
 *
 * Wraps application root and exposes field hooks
 */

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { AmbientContext, UserCapacity, EmotionalState } from "./types"
import { FieldManager } from "./fields/field-manager"

// ============================================================================
// Context Definition
// ============================================================================

interface CapacityContextValue {
  context: AmbientContext
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
}

const CapacityContext = createContext<CapacityContextValue | null>(null)

// ============================================================================
// Provider Component
// ============================================================================

export function CapacityProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AmbientContext>(() => FieldManager.getContext())

  // Subscribe to field changes
  useEffect(() => {
    const unsubscribe = FieldManager.subscribe((newContext) => {
      setContext(newContext)
    })

    return unsubscribe
  }, [])

  // Memoized update functions
  const updateCapacity = useCallback((capacity: Partial<UserCapacity>) => {
    FieldManager.updateCapacity(capacity)
  }, [])

  const updateEmotionalState = useCallback((state: Partial<EmotionalState>) => {
    FieldManager.updateEmotionalState(state)
  }, [])

  return (
    <CapacityContext.Provider value={{ context, updateCapacity, updateEmotionalState }}>
      {children}
    </CapacityContext.Provider>
  )
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
  const { updateCapacity, updateEmotionalState } = useCapacityContext()
  return { updateCapacity, updateEmotionalState }
}
