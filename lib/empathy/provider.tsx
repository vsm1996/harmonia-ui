/**
 * Empathy Provider - React Context wrapper for ambient fields
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

interface EmpathyContextValue {
  context: AmbientContext
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
}

const EmpathyContext = createContext<EmpathyContextValue | null>(null)

// ============================================================================
// Provider Component
// ============================================================================

export function EmpathyProvider({ children }: { children: React.ReactNode }) {
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
    <EmpathyContext.Provider value={{ context, updateCapacity, updateEmotionalState }}>
      {children}
    </EmpathyContext.Provider>
  )
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access full ambient context
 * Most components should use specific field hooks instead
 */
export function useEmpathyContext(): EmpathyContextValue {
  const context = useContext(EmpathyContext)
  if (!context) {
    throw new Error("useEmpathyContext must be used within EmpathyProvider")
  }
  return context
}

/**
 * Subscribe to energy field only
 */
export function useEnergyField() {
  const { context } = useEmpathyContext()
  return context.energy
}

/**
 * Subscribe to attention field only
 */
export function useAttentionField() {
  const { context } = useEmpathyContext()
  return context.attention
}

/**
 * Subscribe to emotional valence field only
 */
export function useEmotionalValenceField() {
  const { context } = useEmpathyContext()
  return context.emotionalValence
}

/**
 * Get field update functions (for Phase 1 slider system)
 */
export function useFieldControls() {
  const { updateCapacity, updateEmotionalState } = useEmpathyContext()
  return { updateCapacity, updateEmotionalState }
}
