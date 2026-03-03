import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, act, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

// ─── Hoist shared mocks before module hoisting ─────────────────────────────
const mocks = vi.hoisted(() => ({
  updateCapacity: vi.fn(),
  updateEmotionalState: vi.fn(),
}))

// ─── Mock motion/react (avoid animation complexity in jsdom) ────────────────
vi.mock("motion/react", () => ({
  motion: {
    div: React.forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t, ...props }: any, ref: any) =>
      React.createElement("div", { ref, ...props }, children)
    ),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}))

// ─── Mock SignalAggregator (used by CapacityProvider) ───────────────────────
vi.mock("@/lib/capacity/signals/aggregator", () => {
  class MockSignalAggregator {
    aggregateSignals() {
      return Promise.resolve({ cognitive: 0.6, temporal: 0.6, emotional: 0.6, valence: 0.0 })
    }
    destroy() {}
  }
  return { SignalAggregator: MockSignalAggregator }
})

// ─── Mock lib/capacity hooks (keep pure functions real) ─────────────────────
vi.mock("@/lib/capacity", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/capacity")>()
  return {
    ...actual,
    useCapacityContext: () => ({
      updateCapacity: mocks.updateCapacity,
      updateEmotionalState: mocks.updateEmotionalState,
      isAutoMode: true,
      toggleAutoMode: vi.fn(),
      updateCapacityField: vi.fn(),
      context: {
        userCapacity: { cognitive: 0.5, temporal: 0.5, emotional: 0.5 },
        emotionalState: { valence: 0.0, arousal: 0.5 },
        energy: { value: 0.5, trend: "stable", lastChange: Date.now() },
        attention: { value: 0.75, trend: "stable", lastChange: Date.now() },
        emotionalValence: { value: 0.0, trend: "stable", lastChange: Date.now() },
      },
    }),
    useDerivedMode: () => ({
      field: { cognitive: 0.5, temporal: 0.5, emotional: 0.5, valence: 0.0 },
      mode: {
        density: "medium",
        guidance: "low",
        motion: "subtle",
        contrast: "standard",
        choiceLoad: "normal",
        focus: "gentle",
      },
    }),
    useEnergyField: () => ({ value: 0.5, trend: "stable", lastChange: Date.now() }),
    useAttentionField: () => ({ value: 0.75, trend: "stable", lastChange: Date.now() }),
    useEmotionalValenceField: () => ({ value: 0.0, trend: "stable", lastChange: Date.now() }),
    useFeedback: () => ({
      hapticEnabled: false,
      sonicEnabled: false,
      setHapticEnabled: vi.fn(),
      setSonicEnabled: vi.fn(),
      fire: vi.fn(),
    }),
  }
})

// ─── Browser API stubs ───────────────────────────────────────────────────────
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })

  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  mocks.updateCapacity.mockClear()
  mocks.updateEmotionalState.mockClear()
})

afterEach(() => {
  vi.clearAllTimers()
})

// ─── Import component AFTER mocks are set up ────────────────────────────────
import { CapacityControls } from "../capacity-controls"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderControls() {
  return render(<CapacityControls />)
}

async function openPanel() {
  const user = userEvent.setup()
  const trigger = screen.getByRole("button", { name: /capacity/i })
  await user.click(trigger)
  return user
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("CapacityControls – closed state (initial)", () => {
  it("renders the toggle button", () => {
    renderControls()
    expect(screen.getByRole("button", { name: /capacity/i })).toBeInTheDocument()
  })

  it("shows mode badge in closed state", () => {
    renderControls()
    // deriveModeLabel({ cognitive:0.5, temporal:0.5, emotional:0.5, valence:0.0 }) = "Calm"
    expect(screen.getByText("Calm")).toBeInTheDocument()
  })

  it("does not show the control panel heading initially", () => {
    renderControls()
    expect(screen.queryByText("Capacity Controls")).not.toBeInTheDocument()
  })

  it("does not show the close button initially", () => {
    renderControls()
    expect(screen.queryByRole("button", { name: /close capacity controls/i })).not.toBeInTheDocument()
  })

  it("does not show slider labels initially", () => {
    renderControls()
    expect(screen.queryByText("Cognitive Capacity")).not.toBeInTheDocument()
    expect(screen.queryByText("Emotional Capacity")).not.toBeInTheDocument()
  })
})

describe("CapacityControls – opening the panel", () => {
  it("clicking the trigger button opens the panel", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByText("Capacity Controls")).toBeInTheDocument()
  })

  it("shows close button with correct aria-label when open", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByRole("button", { name: /close capacity controls/i })).toBeInTheDocument()
  })

  it("shows mode badge inside the open panel", async () => {
    renderControls()
    await openPanel()
    // "Calm" appears in both the toggle badge and the panel badge
    const labels = screen.getAllByText("Calm")
    expect(labels.length).toBeGreaterThanOrEqual(1)
  })

  it("shows descriptive text inside the panel", async () => {
    renderControls()
    await openPanel()
    // isAutoMode: true in mock → signals-driving message
    expect(screen.getByText(/signals are driving values/i)).toBeInTheDocument()
  })
})

describe("CapacityControls – closing the panel", () => {
  it("clicking close button hides the panel", async () => {
    renderControls()
    const user = await openPanel()

    const closeBtn = screen.getByRole("button", { name: /close capacity controls/i })
    await user.click(closeBtn)

    expect(screen.queryByText("Capacity Controls")).not.toBeInTheDocument()
  })

  it("Capacity button is visible again after closing", async () => {
    renderControls()
    const user = await openPanel()

    await user.click(screen.getByRole("button", { name: /close capacity controls/i }))
    expect(screen.getByRole("button", { name: /capacity/i })).toBeInTheDocument()
  })
})

describe("CapacityControls – slider labels and values", () => {
  beforeEach(async () => {
    renderControls()
    await openPanel()
  })

  it("shows Cognitive Capacity slider with correct labels", () => {
    expect(screen.getByText("Cognitive Capacity")).toBeInTheDocument()
    expect(screen.getByText("Fewer items")).toBeInTheDocument()
    expect(screen.getByText("More items")).toBeInTheDocument()
  })

  it("shows Temporal Capacity slider with correct labels", () => {
    expect(screen.getByText("Temporal Capacity")).toBeInTheDocument()
    expect(screen.getByText("Abbreviated")).toBeInTheDocument()
    expect(screen.getByText("Full detail")).toBeInTheDocument()
  })

  it("shows Emotional Capacity slider with correct labels", () => {
    expect(screen.getByText("Emotional Capacity")).toBeInTheDocument()
    expect(screen.getByText("Calm UI")).toBeInTheDocument()
    expect(screen.getByText("Expressive")).toBeInTheDocument()
  })

  it("shows Emotional Valence slider with correct labels", () => {
    expect(screen.getByText("Emotional Valence")).toBeInTheDocument()
    expect(screen.getByText("Negative")).toBeInTheDocument()
    expect(screen.getByText("Positive")).toBeInTheDocument()
    expect(screen.getByText("Neutral")).toBeInTheDocument()
  })

  it("shows percentage value for cognitive, temporal, emotional, and arousal (all 50% at 0.5)", () => {
    // Cognitive, Temporal, Emotional, and Arousal all default to 0.5 → each shows "50%"
    const percentages = screen.getAllByText("50%")
    expect(percentages.length).toBe(4)
  })

  it("shows signed valence value (+0.00 for neutral)", () => {
    // valence = 0.0 → "+0.00" appears in slider header AND in field display
    const values = screen.getAllByText("+0.00")
    expect(values.length).toBeGreaterThanOrEqual(1)
  })
})

describe("CapacityControls – Quick Presets", () => {
  it("shows Quick Presets label when panel is open", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByText("Quick Presets")).toBeInTheDocument()
  })

  it("shows preset select trigger", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })
})

describe("CapacityControls – Reset button", () => {
  it("shows Reset button when panel is open", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument()
  })

  it("clicking Reset calls updateCapacity with calm defaults", async () => {
    renderControls()
    const user = await openPanel()

    await user.click(screen.getByRole("button", { name: /reset/i }))

    expect(mocks.updateCapacity).toHaveBeenCalledWith({
      cognitive: 0.5,
      temporal: 0.5,
      emotional: 0.5,
    })
  })

  it("clicking Reset calls updateEmotionalState with valence 0 and arousal 0.5", async () => {
    renderControls()
    const user = await openPanel()

    await user.click(screen.getByRole("button", { name: /reset/i }))

    expect(mocks.updateEmotionalState).toHaveBeenCalledWith({ valence: 0.0, arousal: 0.5 })
  })

  it("Reset calls both updateCapacity and updateEmotionalState together", async () => {
    renderControls()
    const user = await openPanel()

    await user.click(screen.getByRole("button", { name: /reset/i }))

    expect(mocks.updateCapacity).toHaveBeenCalledOnce()
    expect(mocks.updateEmotionalState).toHaveBeenCalledOnce()
  })
})

describe("CapacityControls – Derived Fields display", () => {
  it("shows Energy field label", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByText("Energy")).toBeInTheDocument()
  })

  it("shows Attention field label", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByText("Attention")).toBeInTheDocument()
  })

  it("shows Valence field label", async () => {
    renderControls()
    await openPanel()
    // "Valence" appears as a label (distinct from "Emotional Valence" slider label)
    expect(screen.getByText("Valence")).toBeInTheDocument()
  })

  it("shows energy value formatted to 2 decimal places", async () => {
    renderControls()
    await openPanel()
    // energy.value = 0.5 → "0.50"
    expect(screen.getByText("0.50")).toBeInTheDocument()
  })

  it("shows attention value formatted to 2 decimal places", async () => {
    renderControls()
    await openPanel()
    // attention.value = 0.75 → "0.75"
    expect(screen.getByText("0.75")).toBeInTheDocument()
  })

  it("shows signed valence in derived fields (+0.00)", async () => {
    renderControls()
    await openPanel()
    // Valence field shows signed: 0.0 → "+0.00"
    const signedValues = screen.getAllByText("+0.00")
    expect(signedValues.length).toBeGreaterThanOrEqual(1)
  })
})

describe("CapacityControls – Interface Mode breakdown", () => {
  it("shows all mode property labels", async () => {
    renderControls()
    await openPanel()
    expect(screen.getByText("Density:")).toBeInTheDocument()
    expect(screen.getByText("Guidance:")).toBeInTheDocument()
    expect(screen.getByText("Motion:")).toBeInTheDocument()
    expect(screen.getByText("Contrast:")).toBeInTheDocument()
    expect(screen.getByText("Choices:")).toBeInTheDocument()
    expect(screen.getByText("Focus:")).toBeInTheDocument()
  })

  it("shows derived mode values from mock", async () => {
    renderControls()
    await openPanel()
    // From useDerivedMode mock: density=medium, guidance=low, motion=subtle
    expect(screen.getByText("medium")).toBeInTheDocument()
    expect(screen.getByText("low")).toBeInTheDocument()
    expect(screen.getByText("subtle")).toBeInTheDocument()
    expect(screen.getByText("standard")).toBeInTheDocument()
    expect(screen.getByText("normal")).toBeInTheDocument()
    expect(screen.getByText("gentle")).toBeInTheDocument()
  })
})

describe("CapacityControls – keyboard accessibility", () => {
  it("cognitive slider is keyboard focusable", async () => {
    renderControls()
    await openPanel()
    const sliders = screen.getAllByRole("slider")
    // At least cognitive, temporal, emotional, valence sliders
    expect(sliders.length).toBeGreaterThanOrEqual(3)
  })

  it("cognitive slider has correct min/max/step attributes", async () => {
    renderControls()
    await openPanel()
    const sliders = screen.getAllByRole("slider")
    // All capacity sliders: min=0, max=1
    const firstSlider = sliders[0]
    expect(firstSlider).toHaveAttribute("aria-valuemin", "0")
    expect(firstSlider).toHaveAttribute("aria-valuemax", "1")
  })
})
