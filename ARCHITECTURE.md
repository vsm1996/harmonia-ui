# Architecture

This document describes the technical architecture of Harmonia UI. Every code snippet matches the actual implementation.

## Overview

Harmonia UI follows a unidirectional data flow pattern:

```
Sliders → UserCapacity + EmotionalState → FieldManager → AmbientContext → deriveMode() → Components
```

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
  valence: 0.3,   // > 0.25 triggers expressive motion
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
  return {
    // ACTIVE TOKENS (consumed by components)

    // Cognitive -> Density
    density: field.cognitive < 0.35 ? "low"
           : field.cognitive > 0.75 ? "high"
           : "medium",

    // Emotional -> Motion restraint (valence for expressiveness)
    motion: field.emotional < 0.35 ? "subtle"
          : field.valence > 0.25 ? "expressive"
          : "subtle",

    // Valence -> Contrast (boost when negative)
    contrast: field.valence < -0.25 ? "boosted" : "standard",

    // DERIVED TOKENS (not yet consumed by components)

    // Cognitive + Temporal -> Guidance
    guidance: field.cognitive < 0.35 ? "high"
            : field.temporal < 0.35 ? "medium"
            : "low",

    // Temporal -> Choice load
    choiceLoad: field.temporal < 0.35 ? "minimal" : "normal",
  }
}
```

> **Implementation note:** `guidance` and `choiceLoad` are derived and included in the `InterfaceMode` TypeScript interface, but no component currently reads them. They exist as a foundation for future component development.

### Mode Labels

Mode labels are derived separately from **raw inputs** (not from the token set), because different input states can produce the same tokens but should have different human-readable labels:

```typescript
function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel {
  const { cognitive, temporal, emotional } = inputs

  if (cognitive > 0.65 && emotional > 0.65) return "Exploratory"
  if (cognitive < 0.35 && temporal < 0.35) return "Minimal"
  if (cognitive >= 0.6 && temporal >= 0.6) return "Focused"
  return "Calm"
}
```

### Mode Characteristics

| Mode | Cognitive | Temporal | Emotional | Behavior |
|------|-----------|----------|-----------|----------|
| Minimal | < 0.35 | < 0.35 | any | Protective, essential only |
| Calm | moderate | any | any | Gentle, balanced, no pressure |
| Focused | >= 0.6 | >= 0.6 | any | Balanced, task-oriented |
| Exploratory | > 0.65 | any | > 0.65 | Full features, playful |

### Preset-to-Mode Mapping

| Preset | Cognitive | Temporal | Emotional | Label |
|--------|-----------|----------|-----------|-------|
| Exhausted | 0.2 | 0.2 | 0.1 | Minimal |
| Overwhelmed | 0.3 | 0.25 | 0.2 | Minimal |
| Distracted | 0.4 | 0.3 | 0.6 | Calm |
| Neutral | 0.5 | 0.5 | 0.5 | Calm |
| Focused | 0.7 | 0.7 | 0.6 | Focused |
| Energized | 0.9 | 0.8 | 0.9 | Exploratory |
| Exploring | 0.85 | 0.7 | 0.8 | Exploratory |

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
| `mode.motion` | `"off"` / `"subtle"` / `"expressive"` | Animation classes, hover effects | Active |
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
  -> { density: "low", motion: "expressive", contrast: "standard", guidance: "high", choiceLoad: "normal" }
    |
    v
Components respond:
  - Grid shows 1 column (density: "low")
  - Descriptions hidden (density: "low")
  - Animations still playful (motion: "expressive" because emotional 0.7 and valence 0.3)
  - Content abbreviated (temporal 0.7 > 0.4, so actually full in this case)
```

---

## State Management

### Context Structure

```typescript
interface CapacityContextValue {
  context: AmbientContext
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
}
```

### Provider Implementation

The provider wraps a `FieldManager` subscription in React state:

```tsx
function CapacityProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AmbientContext>(() => FieldManager.getContext())

  useEffect(() => {
    const unsubscribe = FieldManager.subscribe((newContext) => {
      setContext(newContext)
    })
    return unsubscribe
  }, [])

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
```

### Motion Override

`useEffectiveMotion()` combines the derived motion mode with the system `prefers-reduced-motion` media query. System preference is a hard override:

```tsx
function useEffectiveMotion() {
  const { context } = useCapacityContext()
  const prefersReducedMotion = usePrefersReducedMotion()

  const field: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

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

## Future Considerations

### Automatic Signal Integration (Phase 2)

```typescript
interface AutomaticSignals {
  scrollVelocity: number
  timeOnPage: number
  interactionRate: number
  idleTime: number
}

function modulateCapacity(
  capacity: UserCapacity,
  signals: AutomaticSignals
): UserCapacity {
  return {
    ...capacity,
    temporal: capacity.temporal * (1 - signals.scrollVelocity * 0.1),
    cognitive: capacity.cognitive * (1 - signals.idleTime * 0.01),
  }
}
```

### Arousal Dimension (Phase 3)

```typescript
interface ExtendedCapacityField extends CapacityField {
  arousal: number  // 0-1: Calm to activated
}

// Arousal affects motion and pacing
const motion = arousal > 0.7 ? "energetic" : arousal < 0.3 ? "calm" : "subtle"
```
