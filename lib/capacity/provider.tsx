/**
 * Capacity Provider - React Context wrapper for ambient fields
 *
 * Wraps application root and exposes field hooks
 */

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { AmbientContext, UserCapacity, EmotionalState, MotionMode, CapacityField, InterfaceMode } from "./types"
import { FieldManager } from "./fields/field-manager"
import { deriveMode } from "./mode"
import { MOTION_TOKENS } from "./constants"

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
 * Get effective motion mode with system preference override
 * 
 * System prefers-reduced-motion is a HARD OVERRIDE - non-negotiable on safety.
 * This ensures accessibility compliance regardless of derived mode.
 */
export function useEffectiveMotion(): {
  mode: MotionMode
  tokens: typeof MOTION_TOKENS.off
  prefersReducedMotion: boolean
} {
  const { context } = useCapacityContext()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Build CapacityField from context
  const field: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

  // Derive mode from field
  const derivedMode = deriveMode(field)
  
  // System preference is a HARD OVERRIDE
  const effectiveMode: MotionMode = prefersReducedMotion ? "off" : derivedMode.motion

  return {
    mode: effectiveMode,
    tokens: MOTION_TOKENS[effectiveMode],
    prefersReducedMotion,
  }
}
