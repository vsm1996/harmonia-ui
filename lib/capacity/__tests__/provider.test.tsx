import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, act, renderHook } from "@testing-library/react"
import React from "react"

// Must use class syntax for vi.mock constructor mocks (arrow functions are not constructable)
vi.mock("../signals/aggregator", () => {
  class MockSignalAggregator {
    aggregateSignals() {
      return Promise.resolve({ cognitive: 0.6, temporal: 0.6, emotional: 0.6, valence: 0.0 })
    }
    destroy() {}
  }
  return { SignalAggregator: MockSignalAggregator }
})

function setupMatchMedia(reducedMotion = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" && reducedMotion,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

import {
  CapacityProvider,
  useCapacityContext,
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  useFieldControls,
  usePrefersReducedMotion,
  useDerivedMode,
  useEffectiveMotion,
} from "../provider"
import { MOTION_TOKENS } from "../constants"

beforeEach(() => {
  setupMatchMedia()
})

afterEach(() => {
  vi.clearAllTimers()
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CapacityProvider>{children}</CapacityProvider>
)

describe("CapacityProvider", () => {
  it("renders children without error", () => {
    const { getByText } = render(
      <CapacityProvider>
        <div>hello</div>
      </CapacityProvider>
    )
    expect(getByText("hello")).toBeTruthy()
  })
})

describe("useCapacityContext", () => {
  it("throws when used outside CapacityProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => renderHook(() => useCapacityContext())).toThrow(
      "useCapacityContext must be used within CapacityProvider"
    )
    consoleError.mockRestore()
  })

  it("returns context, updateCapacity, updateEmotionalState", () => {
    const { result } = renderHook(() => useCapacityContext(), { wrapper })
    expect(result.current.context).toBeDefined()
    expect(typeof result.current.updateCapacity).toBe("function")
    expect(typeof result.current.updateEmotionalState).toBe("function")
  })

  it("starts in auto mode", () => {
    const { result } = renderHook(() => useCapacityContext(), { wrapper })
    expect(result.current.isAutoMode).toBe(true)
  })

  it("toggleAutoMode switches auto mode", () => {
    const { result } = renderHook(() => useCapacityContext(), { wrapper })
    act(() => {
      result.current.toggleAutoMode()
    })
    expect(result.current.isAutoMode).toBe(false)
  })

  it("updateCapacity switches to manual mode", () => {
    const { result } = renderHook(() => useCapacityContext(), { wrapper })
    act(() => {
      result.current.updateCapacity({ cognitive: 0.3 })
    })
    expect(result.current.isAutoMode).toBe(false)
  })

  it("updateEmotionalState switches to manual mode", () => {
    const { result } = renderHook(() => useCapacityContext(), { wrapper })
    act(() => {
      result.current.updateEmotionalState({ valence: -0.5 })
    })
    expect(result.current.isAutoMode).toBe(false)
  })
})

describe("useEnergyField", () => {
  it("returns energy FieldValue with value, trend, lastChange", () => {
    const { result } = renderHook(() => useEnergyField(), { wrapper })
    expect(result.current.value).toBeGreaterThanOrEqual(0)
    expect(result.current.value).toBeLessThanOrEqual(1)
    expect(["rising", "falling", "stable"]).toContain(result.current.trend)
    expect(result.current.lastChange).toBeGreaterThan(0)
  })
})

describe("useAttentionField", () => {
  it("returns attention FieldValue in 0.5-1.0 range", () => {
    const { result } = renderHook(() => useAttentionField(), { wrapper })
    expect(result.current.value).toBeGreaterThanOrEqual(0.5)
    expect(result.current.value).toBeLessThanOrEqual(1.0)
  })
})

describe("useEmotionalValenceField", () => {
  it("returns valence FieldValue in -1 to 1 range", () => {
    const { result } = renderHook(() => useEmotionalValenceField(), { wrapper })
    expect(result.current.value).toBeGreaterThanOrEqual(-1)
    expect(result.current.value).toBeLessThanOrEqual(1)
  })
})

describe("useFieldControls", () => {
  it("returns all control functions and state", () => {
    const { result } = renderHook(() => useFieldControls(), { wrapper })
    expect(typeof result.current.updateCapacity).toBe("function")
    expect(typeof result.current.updateEmotionalState).toBe("function")
    expect(typeof result.current.toggleAutoMode).toBe("function")
    expect(typeof result.current.updateCapacityField).toBe("function")
    expect(typeof result.current.isAutoMode).toBe("boolean")
  })

  it("updateCapacityField updates both capacity and valence", () => {
    const { result } = renderHook(
      () => ({ ctx: useCapacityContext(), controls: useFieldControls() }),
      { wrapper }
    )
    act(() => {
      result.current.controls.updateCapacityField({
        cognitive: 0.9,
        temporal: 0.8,
        emotional: 0.85,
        valence: 0.4,
      })
    })
    const cap = result.current.ctx.context.userCapacity
    expect(cap.cognitive).toBe(0.9)
    expect(cap.temporal).toBe(0.8)
    expect(cap.emotional).toBe(0.85)
    expect(result.current.ctx.context.emotionalState.valence).toBe(0.4)
  })
})

describe("usePrefersReducedMotion", () => {
  it("returns false when no reduced motion preference", () => {
    setupMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it("returns true when reduced motion is preferred", () => {
    setupMatchMedia(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })
})

describe("useDerivedMode", () => {
  it("returns field and mode", () => {
    const { result } = renderHook(() => useDerivedMode(), { wrapper })
    expect(result.current.field).toBeDefined()
    expect(result.current.mode).toBeDefined()
    expect(result.current.mode.density).toMatch(/^(low|medium|high)$/)
    expect(result.current.mode.motion).toMatch(/^(off|soothing|subtle|expressive)$/)
  })

  it("field reflects current capacity context", () => {
    const { result } = renderHook(
      () => ({ mode: useDerivedMode(), ctx: useCapacityContext() }),
      { wrapper }
    )
    const { field } = result.current.mode
    const { userCapacity, emotionalState } = result.current.ctx.context
    expect(field.cognitive).toBe(userCapacity.cognitive)
    expect(field.temporal).toBe(userCapacity.temporal)
    expect(field.emotional).toBe(userCapacity.emotional)
    expect(field.valence).toBe(emotionalState.valence)
  })
})

describe("useEffectiveMotion", () => {
  it("returns mode, tokens, prefersReducedMotion", () => {
    const { result } = renderHook(() => useEffectiveMotion(), { wrapper })
    expect(result.current.mode).toMatch(/^(off|soothing|subtle|expressive)$/)
    expect(result.current.tokens).toBeDefined()
    expect(typeof result.current.prefersReducedMotion).toBe("boolean")
  })

  it("overrides motion to off when prefers-reduced-motion", () => {
    setupMatchMedia(true)
    const { result } = renderHook(() => useEffectiveMotion(), { wrapper })
    expect(result.current.mode).toBe("off")
    expect(result.current.prefersReducedMotion).toBe(true)
  })

  it("tokens match the effective motion mode", () => {
    const { result } = renderHook(() => useEffectiveMotion(), { wrapper })
    expect(result.current.tokens).toEqual(MOTION_TOKENS[result.current.mode])
  })
})
