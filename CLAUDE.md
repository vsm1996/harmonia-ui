# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests (vitest run)
npm run test:watch   # Vitest in watch mode

# Run a single test file
npx vitest run lib/capacity/__tests__/mode.test.ts
```

## Architecture

Harmonia UI is a capacity-adaptive UI framework. The core pipeline is unidirectional:

```
Signals (auto) ─────────────────┐
                                 ▼
Sliders (manual) → UserCapacity + EmotionalState → FieldManager → AmbientContext → deriveMode() → Components
```

**Critical design rule:** Raw inputs are never mapped directly to styles. Inputs → Fields → Tokens → Components.

### Layer 1: Raw Inputs

Two structures live on `AmbientContext`:
- `UserCapacity`: `{ cognitive, temporal, emotional }` — all 0–1
- `EmotionalState`: `{ valence: -1 to +1, arousal: 0–1 }`

Slider domains are strictly separated — cognitive controls density/focus, temporal controls content length, emotional controls motion restraint, valence controls tone/contrast.

### Layer 2: FieldManager (`lib/capacity/fields/field-manager.ts`)

Singleton that computes three derived `FieldValue<T>` fields (with trend/velocity tracking):
- `energy` = geometric mean of `(cognitive × temporal × emotional)^(1/3)`
- `attention` = `1 − (temporal × 0.5)`
- `emotionalValence` = pass-through from `valence`

### Layer 3: `deriveMode()` (`lib/capacity/mode.ts`)

Pure function. Components call it inline — it is **not stored on context**. Takes a `CapacityField` and returns `InterfaceMode` tokens:

| Token | Source | Values |
|-------|--------|--------|
| `density` | cognitive | `low / medium / high` |
| `motion` | emotional + valence | `off / soothing / subtle / expressive` |
| `contrast` | valence | `standard / boosted` |
| `focus` | cognitive + motion | `default / gentle / guided` |
| `guidance` | cognitive + temporal | `low / medium / high` *(not yet consumed)* |
| `choiceLoad` | temporal | `minimal / normal` *(not yet consumed)* |

Mode labels (`Minimal / Calm / Focused / Exploratory`) are derived separately by `deriveModeLabel()` from raw inputs, not tokens.

### Layer 4: Components

Components call `useDerivedMode()` (builds `CapacityField` + runs `deriveMode()`) and make rendering decisions in JSX. No CSS classes for token values — tokens are read in JavaScript. CSS animation classes from `app/globals.css` are applied conditionally based on `mode.motion`.

For motion, use `useEffectiveMotion()` which applies the `prefers-reduced-motion` hard override (forces `"off"` regardless of derived value).

### Auto Mode (Phase 2)

`CapacityProvider` (`lib/capacity/provider.tsx`) starts in auto mode. `SignalAggregator` polls 6 passive detectors every 2 seconds and writes to `FieldManager`. Any manual slider interaction disables auto mode.

Detectors in `lib/capacity/signals/detectors/`: `TimeDetector`, `SessionDetector`, `ScrollDetector`, `InteractionDetector`, `InputDetector`, `EnvironmentDetector`.

Each returns `SignalReading[]` — the aggregator computes confidence-weighted averages per dimension.

### Prediction (Phase 2)

`lib/capacity/prediction/`: `PatternStore` (localStorage, max 100 entries) → `PatternExtractor` (time-of-day/day-of-week analysis) → `PredictionEngine` (context matching). `usePredictedCapacity()` hook refreshes every 5 seconds. Patterns require ≥12 samples (confidence 0.6 threshold); stale patterns decay via `confidence × 0.9^days`.

### Public API

Import everything via the barrel: `import { ... } from "@/lib/capacity"`. Key exports: `CapacityProvider`, `useDerivedMode`, `useEffectiveMotion`, `deriveMode`, `deriveModeLabel`, `entranceClass`, `hoverClass`, `ambientClass`, `focusBeaconClass`.

## Test Setup

- **Vitest** with jsdom, `@testing-library/react`, globals enabled
- Config: `vitest.config.ts` — `@` alias resolves to repo root
- Setup file: `vitest.setup.ts`
- Tests: `lib/capacity/__tests__/`, `components/__tests__/`

**Key testing patterns:**
- `framer-motion` mock: Use `React.forwardRef` for `motion.div` (strip animation props); `AnimatePresence` → `React.Fragment`
- Hook mocking: `vi.mock("@/lib/capacity", async (importOriginal) => ({ ...actual, useHook: () => ... }))` — spread real exports, override only hooks
- Constructor mocks require `class` syntax in `vi.mock` factories, not `vi.fn()`
- `FieldManager` singleton: use `vi.resetModules()` + dynamic imports for fresh instances per test
- `ResizeObserver` stub required for Radix UI components in tests
- Fake timers (`vi.useFakeTimers()`) for time-dependent tests (detectors, PatternExtractor)
- `matchMedia` mock must define `addEventListener`/`removeEventListener` on the mock object
