# Harmonia UI Project Memory

## Project Overview
Capacity-adaptive UI framework in Next.js/React. Core pipeline: CapacityField → InterfaceMode → Tokens → Components.

## Key Architecture
- **lib/capacity/types.ts** - Core types: CapacityField (cognitive/temporal/emotional/valence), InterfaceMode, FieldValue
- **lib/capacity/constants.ts** - PHI, FIBONACCI, MOTION_TOKENS, DEFAULT_* constants
- **lib/capacity/mode.ts** - `deriveMode()` and `deriveModeLabel()` - field → mode derivation
- **lib/capacity/fields/field-manager.ts** - Singleton FieldManager (subscribe/updateCapacity/updateEmotionalState)
- **lib/capacity/signals/signal-bus.ts** - Singleton SignalBus (pub/sub)
- **lib/capacity/signals/aggregator.ts** - SignalAggregator (collects from all detectors)
- **lib/capacity/signals/detectors/** - TimeDetector, SessionDetector, ScrollDetector, InteractionDetector, InputDetector, EnvironmentDetector
- **lib/capacity/prediction/** - PatternStore (localStorage), PatternExtractor, PredictionEngine, hooks.ts
- **lib/capacity/provider.tsx** - CapacityProvider + hooks (useCapacityContext, useDerivedMode, useEffectiveMotion, etc.)

## Test Setup (Added Phase 2/3)
- **vitest** with jsdom environment
- **@testing-library/react** for React hooks/components
- Config: `vitest.config.ts`, setup: `vitest.setup.ts`
- Test files: `lib/capacity/__tests__/*.test.{ts,tsx}`
- Script: `npm test`

## Component Test Patterns (capacity-controls)
- **motion/react mock**: Use `React.forwardRef` for `motion.div` (strips `initial/animate/exit/transition` props); `AnimatePresence` → `React.Fragment`
- **Hook mocking via alias**: `vi.mock("@/lib/capacity", async (importOriginal) => ({ ...actual, useHook: () => ... }))` — spread real exports, override only hooks
- **vi.hoisted for mock fns**: When mock fn refs are needed inside `vi.mock` factory, create them with `vi.hoisted(() => ({ fn: vi.fn() }))`
- **ResizeObserver stub**: Add `global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} }` in `beforeEach` for Radix UI components
- **Multiple same-value elements**: When sliders all share the same value (e.g. all 50%), use `getAllByText("50%")` not `getByText`
- **Signed display text**: ValenceSliderControl shows "+0.00" in header AND FieldDisplay also shows it — use `getAllByText` + length check
- **Radix Select combobox**: Query with `screen.getByRole("combobox")` for the trigger button
- **`openPanel()` helper pattern**: Extract repeated "click the trigger" setup into a helper returning `userEvent` instance

## Testing Patterns & Gotchas
- **Class mock required for constructors**: Use `class` syntax in `vi.mock` factories, NOT `vi.fn().mockImplementation()` - arrow functions returned by vi.fn are not constructable as `new X()`
- **FieldManager singleton**: Use `vi.resetModules()` + dynamic imports to get fresh instances per test
- **localStorage**: Use `localStorage.clear()` in `beforeEach` for PatternStore tests
- **Fake timers**: Use `vi.useFakeTimers()` / `vi.setSystemTime()` for time-dependent tests (SessionDetector, PatternExtractor, deleteItem with same-millisecond timestamps)
- **matchMedia mock**: Must define before EnvironmentDetector or usePrefersReducedMotion; use `addEventListener/removeEventListener` on mock
- **InputDetector with no typing**: `typingSpeedCPM=0 < 20` → returns 0.4, NOT 0.6 (default branch not reached)
- **Array sort**: `.sort()` on numbers sorts lexicographically; use `.sort((a,b) => a-b)` for numeric sort

## Current Branch
`phase2n3` - Phase 2/3 features: capacity signals, prediction engine, signal aggregator, auto-mode

## Mode Derivation Key Rules
- cognitive < 0.4 → density=low, guidance=high, focus=guided
- cognitive > 0.7 → density=high, focus=default
- emotional < 0.15 → motion=off (ALL focus=default when motion=off)
- emotional 0.15-0.4 → motion=soothing
- emotional > 0.6 AND valence > 0.15 → motion=expressive
- valence < -0.15 → contrast=boosted
- DISTRACTED preset (0.35, 0.25, 0.5): cognitive<0.4 AND temporal<0.4 → Minimal label
