# Architecture

This document describes the technical architecture of Harmonia UI. Every code snippet matches the actual implementation.

## Overview

Harmonia UI follows a unidirectional data flow pattern:

```
Signals (auto) ─────────────────┐
                                 ▼
Sliders (manual) → UserCapacity + EmotionalState → FieldManager → AmbientContext → deriveMode() → Components
```

In auto mode, the `SignalAggregator` collects readings from 6 passive detectors every 2 seconds. Raw readings are smoothed through an exponential moving average (α = 0.2) before being applied to `FieldManager`, so a single noisy poll cannot instantly flip the mode label — a sustained change requires roughly 8–10 seconds of consistent signal. In manual mode, sliders drive state directly with no smoothing. Both paths write to `FieldManager`; everything downstream is identical.

Each layer transforms data for the next, maintaining clear boundaries and predictable behavior.

---

## Layer 1: Raw Inputs (UserCapacity + EmotionalState)

The user's current state is represented by two separate structures stored on the `AmbientContext`:

```typescript
interface UserCapacity {
  cognitive: number   // 0-1: Mental bandwidth available
  temporal: number    // 0-1: Time/effort budget
  emotional: number   // 0-1: Load tolerance
}

interface EmotionalState {
  valence: number     // -1 to +1: Emotional direction
  arousal: number     // 0-1: Energy/activation (Phase 2+)
}
```

Components that need to derive mode combine these into a `CapacityField`:

```typescript
const field: CapacityField = {
  cognitive: context.userCapacity.cognitive,
  temporal: context.userCapacity.temporal,
  emotional: context.userCapacity.emotional,
  valence: context.emotionalState.valence,
}
```

### Input Semantics

| Input | Low (0) | Mid (0.5) | High (1) |
|-------|---------|-----------|----------|
| Cognitive | Overwhelmed, foggy | Normal attention | Sharp, focused |
| Temporal | Rushed, no time | Moderate pace | Leisurely, exploratory |
| Emotional | Fragile, stressed | Stable | Resilient, robust |
| Valence (-1 to +1) | Distressed, negative | Neutral | Upbeat, positive |

### Separation of Concerns

Each slider controls specific aspects and must NOT control others:

```
Slider      | Controls                            | Must NOT Control
------------|-------------------------------------|-----------------------------
Cognitive   | density, hierarchy, concurrency     | tone, animation speed
Temporal    | content length, shortcuts, defaults | color, layout structure
Emotional   | motion restraint, friction          | content importance
Valence     | tone, expressiveness                | information volume
```

### Default Values

```typescript
const DEFAULT_USER_CAPACITY = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7,
} as const

const DEFAULT_EMOTIONAL_STATE = {
  valence: 0.3,   // > 0.15 (with emotional > 0.6) triggers expressive motion mode
  arousal: 0.5,
} as const
```

---

## Layer 2: Derived Fields (FieldManager)

The `FieldManager` singleton computes three derived fields from raw inputs. These are wrapped in `FieldValue<T>` which tracks temporal metadata (trend, velocity, lastChange).

```typescript
interface AmbientContext {
  energy: FieldValue<number>             // Geometric mean of cognitive * temporal * emotional
  attention: FieldValue<number>          // Inverse of temporal (low time = high attention demand)
  emotionalValence: FieldValue<number>   // Pass-through from EmotionalState.valence

  userCapacity: UserCapacity             // Raw inputs preserved
  emotionalState: EmotionalState         // Raw inputs preserved
}
```

### Derivation Formulas

```typescript
// Energy: Geometric mean of capacity dimensions
energy = Math.pow(cognitive * temporal * emotional, 1/3)

// Attention: Inverse of temporal (range: 0.5 to 1.0)
attention = 1 - (temporal * 0.5)

// Emotional valence: Direct pass-through
emotionalValence = emotionalState.valence
```

### FieldValue Temporal Tracking

Each derived field carries temporal metadata:

```typescript
interface FieldValue<T> {
  value: T
  lastChange: number                       // Timestamp (ms)
  trend: "rising" | "falling" | "stable"   // Based on velocity threshold
  velocity?: number                        // Rate of change per second
}
```

This enables future anticipatory component responses (e.g., responding to velocity of change, not just current value).

---

## Layer 3: InterfaceMode (Token Derivation)

The `InterfaceMode` is a set of discrete tokens derived from a `CapacityField`. Components call `deriveMode()` inline -- it is NOT stored on the context.

```typescript
function deriveMode(field: CapacityField): InterfaceMode {
  const lowCognitive  = field.cognitive < 0.4
  const highCognitive = field.cognitive > 0.7
  const lowEmotional  = field.emotional < 0.4    // emotional 0.15–0.4
  const highEmotional = field.emotional > 0.6
  const veryLowEmotional = field.emotional < 0.15
  const lowTemporal   = field.temporal < 0.4
  const highValence   = field.valence > 0.15
  const negValence    = field.valence < -0.15

  // Cognitive → Density (how many things compete for attention at once)
  const density = lowCognitive ? "low" : highCognitive ? "high" : "medium"

  // Temporal → Guidance and Choice load
  const choiceLoad = lowTemporal ? "minimal" : "normal"
  const guidance   = lowCognitive ? "high" : lowTemporal ? "medium" : "low"

  // Emotional → Motion (4-tier nervous-system-safe system)
  //   off:        emotional < 0.15 → fully static, protective
  //   soothing:   emotional 0.15–0.4 → slow rhythmic only (breathe, float)
  //   expressive: emotional > 0.6 AND valence > 0.15 → full animation suite
  //   subtle:     everything else → grounded, minimal motion
  const motion = veryLowEmotional ? "off"
               : lowEmotional      ? "soothing"
               : (highEmotional && highValence) ? "expressive"
               : "subtle"

  // Valence → Contrast (boost when mood is negative)
  const contrast = negValence ? "boosted" : "standard"

  // Cognitive → Focus guidance (attention beacons for key elements)
  //   Only activates when motion is available (not "off")
  //   guided:  cognitive < 0.4 → strong warm beacon
  //   gentle:  cognitive < 0.7 → soft cool glow
  //   default: cognitive >= 0.7 → no special treatment
  const focus = motion === "off" ? "default"
              : lowCognitive     ? "guided"
              : !highCognitive   ? "gentle"
              : "default"

  return { density, guidance, motion, contrast, choiceLoad, focus }
}
```

> **Implementation note:** `guidance`, `choiceLoad`, and `focus` are all derived and included in the `InterfaceMode` TypeScript interface. Only `focus` is currently consumed by components (focus beacon animations). `guidance` and `choiceLoad` exist as a foundation for future component development.

### Mode Labels

Mode labels are derived separately from **raw inputs** (not from the token set), because different input states can produce the same tokens but should have different human-readable labels:

```typescript
function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel {
  const { cognitive, temporal, emotional } = inputs

  // Checked in order — first match wins
  if (cognitive > 0.6 && emotional > 0.6) return "Exploratory"
  if (cognitive < 0.4 && temporal < 0.4) return "Minimal"
  if (cognitive >= 0.55 && temporal >= 0.55) return "Focused"
  return "Calm"
}
```

### Mode Characteristics

| Mode | Cognitive | Temporal | Emotional | Behavior |
|------|-----------|----------|-----------|----------|
| Minimal | < 0.4 | < 0.4 | any | Protective, essential only |
| Calm | moderate | any | any | Gentle, balanced, no pressure |
| Focused | >= 0.55 | >= 0.55 | any | Balanced, task-oriented |
| Exploratory | > 0.6 | any | > 0.6 | Full features, playful |

### Preset-to-Mode Mapping

| Preset | Cognitive | Temporal | Emotional | Valence | Motion | Focus | Label |
|--------|-----------|----------|-----------|---------|--------|-------|-------|
| Exhausted | 0.1 | 0.1 | 0.1 | -0.6 | off | default | Minimal |
| Overwhelmed | 0.2 | 0.15 | 0.2 | -0.5 | soothing | guided | Minimal |
| Distracted | 0.35 | 0.25 | 0.5 | 0.0 | subtle | guided | Minimal |
| Neutral | 0.5 | 0.5 | 0.5 | 0.0 | subtle | gentle | Calm |
| Focused | 0.75 | 0.75 | 0.55 | 0.1 | subtle | default | Focused |
| Energized | 0.9 | 0.85 | 0.85 | 0.6 | expressive | default | Exploratory |
| Exploring | 1.0 | 1.0 | 1.0 | 0.8 | expressive | default | Exploratory |

---

## Layer 4: Components

Components consume tokens by calling `deriveMode()` on a `CapacityField` they build from context. They make rendering decisions in JavaScript/JSX -- there are no CSS classes for token values.

### Component Pattern

```tsx
function AdaptiveComponent() {
  const { context } = useCapacityContext()

  const field = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }
  const mode = deriveMode(field)

  // Density controls layout
  const gridCols = { low: 1, medium: 2, high: 3 }[mode.density]

  // Motion controls animation classes
  const animClass = mode.motion === "expressive" ? "morph-fade-in"
                  : mode.motion === "subtle" ? "sacred-fade"
                  : ""

  // Temporal controls content length (read directly from context)
  const showFullText = context.userCapacity.temporal > 0.4

  // Valence controls tone (read directly from context)
  const greeting = context.emotionalState.valence > 0.2 ? "You're doing great!"
                 : context.emotionalState.valence < -0.2 ? "Take your time."
                 : "Here's how it works:"

  return (
    <div
      className={animClass}
      style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
    >
      <p>{greeting}</p>
      {showFullText && <p>Full description here...</p>}
    </div>
  )
}
```

### What Components Consume

| Source | What Components Read | Effect | Status |
|--------|---------------------|--------|--------|
| `mode.density` | `"low"` / `"medium"` / `"high"` | Item count, grid columns, visible sections | Active |
| `mode.motion` | `"off"` / `"soothing"` / `"subtle"` / `"expressive"` | Animation classes, hover effects | Active |
| `mode.focus` | `"default"` / `"gentle"` / `"guided"` | Focus beacon animations on key elements | Active |
| `mode.contrast` | `"standard"` / `"boosted"` | Visual contrast, font weight | Active |
| `context.userCapacity.temporal` | Raw 0-1 value | Content length (full vs abbreviated) | Active |
| `context.emotionalState.valence` | Raw -1 to +1 value | Tone, greeting text, color warmth | Active |
| `mode.guidance` | `"low"` / `"medium"` / `"high"` | Helper text, labels, tooltips | Not yet consumed |
| `mode.choiceLoad` | `"minimal"` / `"normal"` | Option count, progressive disclosure | Not yet consumed |

### CSS Animation Application

Components conditionally apply CSS animation classes from `globals.css` based on `mode.motion`. There are no CSS classes for density, contrast, or other tokens.

```tsx
// Entrance animation based on motion mode
const cardAnim = mode.motion === "expressive" ? "morph-fade-in"
               : mode.motion === "subtle" ? "sacred-fade"
               : ""

// Hover effect based on motion mode
const hoverClass = mode.motion === "expressive" ? "hover-pulse" : "hover-lift"

// Continuous animation gated by motion mode
const breatheClass = mode.motion === "expressive" ? "breathe" : ""
```

---

## Data Flow Example

```
User drags cognitive slider to 0.2
    |
    v
FieldManager.updateCapacity({ cognitive: 0.2 })
    |
    v
AmbientContext updates:
  userCapacity: { cognitive: 0.2, temporal: 0.7, emotional: 0.7 }
  emotionalState: { valence: 0.3, arousal: 0.5 }
  energy: { value: 0.42, trend: "falling", ... }
  attention: { value: 0.65, ... }
    |
    v
Components re-render, build CapacityField from context, call deriveMode():
  deriveMode({ cognitive: 0.2, temporal: 0.7, emotional: 0.7, valence: 0.3 })
  -> { density: "low", motion: "expressive", contrast: "standard", guidance: "high", choiceLoad: "normal", focus: "guided" }
    |
    v
Components respond:
  - Grid shows 1 column (density: "low")
  - Descriptions hidden (density: "low")
  - Animations still playful (motion: "expressive" because emotional 0.7 > 0.6 and valence 0.3 > 0.15)
  - Focus beacons active on key elements (focus: "guided" because cognitive 0.2 < 0.4)
  - Content full (temporal 0.7 > 0.4, so full detail shown)
```

---

## State Management

### Context Structure

```typescript
interface CapacityContextValue {
  context: AmbientContext
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
  isAutoMode: boolean
  toggleAutoMode: () => void
  updateCapacityField: (field: CapacityField) => void
  // Multimodal feedback opt-in flags (Phase 3)
  hapticEnabled: boolean
  sonicEnabled: boolean
  setHapticEnabled: Dispatch<SetStateAction<boolean>>
  setSonicEnabled: Dispatch<SetStateAction<boolean>>
}
```

Feedback flags live on the context (not in `CapacityControls` local state) so that any component — including the demo card and convention page sections — can check opt-in state and fire feedback without prop drilling.

### Provider Implementation

The provider manages both auto mode (signal-driven) and manual mode (slider-driven):

```tsx
function CapacityProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AmbientContext>(() => FieldManager.getContext())
  const [isAutoMode, setIsAutoMode] = useState(true) // Start in auto mode
  const aggregatorRef = useRef<SignalAggregator | null>(null)

  useEffect(() => {
    aggregatorRef.current = new SignalAggregator()
    const unsubscribe = FieldManager.subscribe(setContext)
    return () => { unsubscribe(); aggregatorRef.current?.destroy() }
  }, [])

  // Auto mode: aggregate signals every 2 seconds, apply EMA smoothing, then
  // write to FieldManager. The first poll seeds the EMA baseline (skipped);
  // subsequent polls blend in at α=0.2 to prevent single-poll mode flips.
  useEffect(() => {
    if (!isAutoMode) return
    isFirstAggregationComplete.current = false
    smoothedFieldRef.current = null
    const id = setInterval(async () => {
      const suggested = await aggregatorRef.current!.aggregateSignals()
      if (!isFirstAggregationComplete.current) {
        isFirstAggregationComplete.current = true
        smoothedFieldRef.current = suggested          // seed baseline
      } else {
        smoothedFieldRef.current = applyEMA(smoothedFieldRef.current!, suggested, 0.2)
        FieldManager.updateCapacity({ cognitive: smoothedFieldRef.current.cognitive, ... })
      }
    }, 2000)
    return () => clearInterval(id)
  }, [isAutoMode])

  // Manual updates switch off auto mode
  const updateCapacity = useCallback((capacity: Partial<UserCapacity>) => {
    setIsAutoMode(false)
    FieldManager.updateCapacity(capacity)
  }, [isAutoMode])

  const toggleAutoMode = useCallback(() => setIsAutoMode(prev => !prev), [])

  // updateCapacityField sets the full field without disabling auto mode
  const updateCapacityField = useCallback((field: CapacityField) => {
    FieldManager.updateCapacity({ cognitive: field.cognitive, temporal: field.temporal, emotional: field.emotional })
    FieldManager.updateEmotionalState({ valence: field.valence })
  }, [])

  return (
    <CapacityContext.Provider value={{ context, updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField }}>
      {children}
    </CapacityContext.Provider>
  )
}
```

### Motion Override

`useEffectiveMotion()` combines the derived motion mode with the system `prefers-reduced-motion` media query. System preference is a hard override:

```tsx
function useEffectiveMotion() {
  const { field } = useDerivedMode()          // builds CapacityField from context
  const prefersReducedMotion = usePrefersReducedMotion()

  const derivedMode = deriveMode(field)
  const effectiveMode: MotionMode = prefersReducedMotion ? "off" : derivedMode.motion

  return {
    mode: effectiveMode,
    tokens: MOTION_TOKENS[effectiveMode],
    prefersReducedMotion,
  }
}
```

---

## Design Token Layer — Renge

Harmonia UI sits on top of the Renge design system for its token-based styling values. Renge provides a proportional scale derived from the golden ratio (φ = 1.618) and Fibonacci sequences — the same mathematical principles that underpin Harmonia's capacity-adaptive approach.

### Packages

| Package | Role |
|---|---|
| `@renge-ui/tokens` | Generates `--renge-*` CSS custom properties at runtime via `createRengeTheme()` |
| `@renge-ui/tailwind` | v3 Tailwind preset (not directly used — see v4 adaptation below) |

### Token injection

`app/layout.tsx` calls `createRengeTheme({ profile: 'ocean' })` and injects the resulting CSS string into the document `<head>` via `dangerouslySetInnerHTML`. This runs server-side (RSC), so tokens are present on first paint with no flash.

```ts
const rengeTheme = createRengeTheme({ profile: 'ocean' })
// → writes --renge-space-*, --renge-font-size-*, --renge-radius-*,
//          --renge-duration-*, --renge-easing-*, --renge-color-* to :root
```

Six profiles are available: `ocean` (default), `earth`, `twilight`, `fire`, `void`, `leaf`. Switching profile is a one-line change; all renge utilities update automatically because they reference CSS variables.

### Tailwind v4 adaptation

`@renge-ui/tailwind` targets Tailwind v3. This project uses Tailwind v4 (`@tailwindcss/postcss`), which uses a CSS-first config model with no `tailwind.config.ts`. The equivalent integration is an `@theme inline` block in `app/globals.css` that maps each `--renge-*` var into Tailwind v4's CSS custom property namespaces:

```css
@theme inline {
  --spacing-renge-4: var(--renge-space-4);   /* → p-renge-4, gap-renge-4, … */
  --radius-renge-2:  var(--renge-radius-2);  /* → rounded-renge-2 */
  --duration-renge-3: var(--renge-duration-3); /* → duration-renge-3 */
  --ease-renge-spring: var(--renge-easing-spring); /* → ease-renge-spring */
  --color-renge-fg: var(--renge-color-fg);   /* → text-renge-fg, border-renge-fg */
  /* … full mapping in globals.css */
}
```

`@theme inline` means Tailwind inlines the var reference directly into generated utilities (no extra `:root` property). Since the `--renge-*` vars are set at runtime by the style injection, all utilities resolve correctly in the browser.

### Token scales

**Spacing** (Fibonacci × 6px base):

| Step | Value | Tailwind utility |
|---|---|---|
| renge-0 | 0px | `p-renge-0` |
| renge-1 | 6px | `p-renge-1` |
| renge-2 | 12px | `p-renge-2` |
| renge-3 | 18px | `p-renge-3` |
| renge-4 | 30px | `p-renge-4` |
| renge-5 | 48px | `p-renge-5` |
| renge-6 | 78px | `p-renge-6` |

**Duration** (Fibonacci × 100ms):
`renge-0`=0ms, `renge-1`=100ms, `renge-2`=200ms, `renge-3`=300ms, `renge-4`=500ms, `renge-5`=800ms, `renge-6`=1300ms…

**Easing** (φ-derived cubic-bezier, A=1/φ²≈0.382, B=1/φ≈0.618):
- `ease-renge-ease-out`: `cubic-bezier(0.382, 1, 0.618, 1)`
- `ease-renge-spring`: `cubic-bezier(0.382, 0.618, 0.618, 1.382)`

**Border radius** (Fibonacci × 6px): `renge-1`=6px, `renge-2`=12px, `renge-3`=18px, `renge-4`=30px, `renge-5`=48px, `renge-full`=9999px.

### Migration status

Harmonia's Tailwind classes were partially migrated to renge utilities where scales align exactly. The following were replaced:

| Category | Replaced | Deferred |
|---|---|---|
| Duration | `duration-200/300/500` → `duration-renge-2/3/4` | — |
| Spacing | `*-3` (12px) → `*-renge-2`, `*-12` (48px) → `*-renge-5` | All other values (4px-grid mismatch) |
| Border radius | `rounded-md/xl/full` → `rounded-renge-1/2/full` | — |
| Typography | — | φ-scale (6–177px) vs Tailwind scale (12–36px): too divergent without redesign |
| Semantic colors | — | Requires aligning Harmonia's `--background/--primary` layer with `--renge-color-*` |

### Relationship to capacity adaptation

Renge's motion tokens are directly relevant to Harmonia's adaptive behavior. The `duration-renge-*` and `ease-renge-*` utilities provide the base values; `deriveMode()` then selects *which* animation class is applied (or suppresses animation entirely at `motion: "off"`). The two systems are complementary — Renge provides proportional defaults, Harmonia decides whether to use them.

---

## Why This Architecture?

### 1. Separation of Concerns

Each layer has one job:
- UserCapacity + EmotionalState: Represent user state
- FieldManager: Compute derived fields with temporal tracking
- deriveMode(): Classify into discrete tokens
- Components: Render based on tokens and raw values

### 2. Testability

Each layer can be tested independently:

```typescript
// Test mode derivation
expect(deriveMode({ cognitive: 0.2, temporal: 0.2, emotional: 0.1, valence: -0.3 }).density).toBe("low")
expect(deriveMode({ cognitive: 0.8, temporal: 0.7, emotional: 0.9, valence: 0.5 }).density).toBe("high")

// Test mode labels
expect(deriveModeLabel({ cognitive: 0.2, temporal: 0.2, emotional: 0.1, valence: -0.3 })).toBe("Minimal")
expect(deriveModeLabel({ cognitive: 0.5, temporal: 0.5, emotional: 0.5, valence: 0.0 })).toBe("Calm")
```

### 3. Predictability

Components never access raw values for token decisions -- they call `deriveMode()` which deterministically maps inputs to tokens. Same inputs always produce the same mode.

### 4. Extensibility

New dimensions can be added without changing existing code:
- Add new field to UserCapacity or EmotionalState
- Add derivation logic in FieldManager
- Add new token to InterfaceMode if needed
- Components opt-in to new token

---

## Performance Considerations

### FieldManager Subscription

The FieldManager notifies all listeners on every update. The provider converts this into React state, triggering re-renders.

### Inline deriveMode()

`deriveMode()` is called inline in each component that needs tokens. It is a pure function with no allocations beyond the returned object, so the cost is negligible. This avoids storing derived mode on context and re-rendering every consumer on every change.

### Selective Hooks

Specialized hooks (`useEnergyField`, `useAttentionField`, `useEmotionalValenceField`) exist, but they still subscribe to the full context under the hood. True selective re-rendering would require splitting into multiple contexts (future optimization).

---

## Implemented: Phase 2 — Automatic Signal Integration

Phase 2 is fully implemented. The `SignalAggregator` collects readings from 6 passive detectors and suggests a `CapacityField` without user interaction.

### Detectors

| Detector | Signals | Dimensions |
|----------|---------|------------|
| `TimeDetector` | Hour of day, day of week | cognitive, temporal |
| `SessionDetector` | Session duration | temporal |
| `ScrollDetector` | Scroll velocity, direction changes | cognitive |
| `InteractionDetector` | Click rate, idle detection | cognitive |
| `InputDetector` | Typing speed (CPM), error correction | cognitive |
| `EnvironmentDetector` | `prefers-reduced-motion`, color scheme | temporal, emotional |

### Signal Aggregation

Each detector returns a `SignalReading[]` with `{ dimension, value, confidence, detectorName }`. The aggregator computes a **confidence-weighted average** per dimension:

```typescript
// For each dimension (cognitive, temporal, emotional, valence):
value = Σ(reading.value × reading.confidence × detectorWeight) / Σ(reading.confidence × detectorWeight)
// Default: 0.5 if no signals for a dimension
```

Detector influence on each dimension is tuned independently via `SignalAggregator.DIMENSION_WEIGHTS`. For example, `EnvironmentDetector` contributes more strongly to `emotional` (weight 0.8) than to `temporal` (weight 0.7), while `TimeDetector` contributes more to `cognitive` (weight 0.6) than `temporal` (weight 0.5). When no override is defined, the detector's base `weight` property is used.

**EMA smoothing (auto mode only):** `CapacityProvider` applies an exponential moving average (α = 0.2) to the aggregated field before writing to `FieldManager`. Each new poll contributes 20% of its value; the previous smoothed field retains 80%. This prevents a single anomalous reading from triggering a mode switch — a genuine step-change needs roughly 4–5 consecutive polls (~8–10 s) to reach ~67% of its final value. The EMA is reset to `null` whenever auto mode is (re-)entered, so stale manual slider positions never pollute the baseline.

### Pattern Prediction (Phase 2)

The `PatternStore` records capacity snapshots to `localStorage` (max 100 entries, all operations wrapped in try/catch for quota safety). The `PatternExtractor` identifies time-of-day and day-of-week patterns. The `PredictionEngine` matches the current context to stored patterns and returns a predicted `CapacityField`.

Pattern confidence scales with sample size: `confidence = min(1, sampleSize / 20)`. A pattern requires at least 12 observations before it is surfaced (confidence 0.6 = threshold); full confidence (1.0) is reached at 20 observations.

`usePredictedCapacity()` exposes the prediction as a React hook, refreshing every 5 seconds.

`decayConfidence()` applies exponential decay (`confidence × 0.9^days`) relative to `pattern.timestamp`, suppressing stale patterns without deleting historical data.

## Implemented: Phase 3 — Extended Dimensions

### Arousal Dimension

`CapacityField` now includes `arousal?: number` (0–1, calm to activated). `deriveMode()` uses it to produce a `pace: ArousalMode` token (`"calm"` / `"neutral"` / `"activated"`):

- **calm** (arousal < 0.35): +50% animation duration — slow, deliberate pacing
- **neutral** (0.35–0.65): standard timing
- **activated** (arousal > 0.65): −35% animation duration — fast, energetic pacing

`usePacedMotionTokens()` applies the pace multiplier to `MOTION_TOKENS` duration values. `prefers-reduced-motion` forces pace to `"calm"` as an additional safety override.

### Multimodal Feedback

`lib/capacity/feedback.ts` provides opt-in haptic and sonic feedback:

- **Haptic**: `triggerHaptic(pattern)` via Web Vibration API — patterns: `tap`, `toggle`, `pulse`, `error`
- **Sonic**: `playSonicFeedback(frequency, duration)` via Web Audio API — frequencies from `FEEDBACK_FREQUENCIES` (396/528/741 Hz)
- **`playPacedSonic(pace)`**: convenience wrapper selecting frequency by arousal level
- Degrades silently on unsupported browsers (haptic: desktop + iOS Safari; sonic: no AudioContext)
- Opt-in via UI toggles in the `CapacityControls` panel; flags live in `CapacityContext` (not local state)

**`useFeedback()` hook** wraps the above into a single ergonomic API:

```typescript
const { fire } = useFeedback()
// fire("tap")    — fires haptic tap + pace-matched sonic if each is enabled
// fire("toggle") — fires haptic toggle (two-pulse) + sonic
```

The `fire()` helper is a no-op when both flags are `false`. Sonic frequency is automatically selected from `FEEDBACK_FREQUENCIES` based on `mode.pace` (calm → 396 Hz, neutral → 528 Hz, activated → 741 Hz).

**Components that fire feedback** (live demo + convention pages only):

| Component | Interaction | Pattern |
|-----------|-------------|---------|
| `CapacityDemoCard` | Primary + secondary CTA click | `tap` |
| `HeroSection` | Primary + secondary CTA click | `tap` |
| `EventCard` | Expand / collapse click | `toggle` |
| `TicketsSection` | "Get X Pass" button click | `tap` |
| `CapacityControls` | Preset selection | `tap` |

### Proportional Scaling Systems

`lib/capacity/utils/typography.ts` now exports:

- **`SPACING_SCALE`**: Fibonacci × 4px base — [4, 4, 8, 12, 20, 32, 52, 84, 136, 220...]
- **`getSpacing(step, unit)`**: returns Fibonacci-based spacing in px, rem, or raw number
- **`getProportionalSpacing(density)`**: returns `{ xs, sm, md, lg, gap }` CSS strings scaled by density mode
- **`phiRatio(steps)`**: returns φ^n for proportional component scaling

### Token Consumption

| Token | Was | Now |
|-------|-----|-----|
| `guidance` | Derived only | Events section: "Tap for details" hint; demo card: help text at medium/high guidance |
| `choiceLoad` | Derived only | Tickets: filters to recommended tier; demo card: hides secondary CTA + compresses state readout |
| `focus` | Active | Unchanged |
| `pace` | New (Phase 3) | Controls animation speed multiplier via `usePacedMotionTokens()` |
