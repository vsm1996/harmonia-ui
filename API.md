# API Reference

This document describes the public API of Harmonia UI. Every signature, type, and example matches the actual codebase.

---

## Hooks

### `useCapacityContext()`

The primary hook for accessing capacity state and update functions.

```typescript
function useCapacityContext(): CapacityContextValue
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `context` | `AmbientContext` | Current ambient state (raw inputs + derived fields) |
| `updateCapacity` | `(capacity: Partial<UserCapacity>) => void` | Update cognitive, temporal, or emotional values |
| `updateEmotionalState` | `(state: Partial<EmotionalState>) => void` | Update valence (and arousal in Phase 2+) |

#### Example

```tsx
import { useCapacityContext } from "@/lib/capacity"

function MyComponent() {
  const { updateCapacity } = useCapacityContext()

  return (
    <button onClick={() => updateCapacity({ cognitive: 0.5 })}>
      Set cognitive to 50%
    </button>
  )
}
```

> **Note:** Most components should use `useDerivedMode()` instead of `useCapacityContext()` directly. Only use `useCapacityContext()` when you need the mutation functions (`updateCapacity`, `updateEmotionalState`).

### `useDerivedMode()`

The primary hook for section-level components. Builds a `CapacityField` from context and derives the full `InterfaceMode` in one call, eliminating the repeated manual field construction.

```typescript
function useDerivedMode(): {
  field: CapacityField
  mode: InterfaceMode
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `field` | `CapacityField` | The 4-input field (cognitive, temporal, emotional, valence) |
| `mode` | `InterfaceMode` | The derived mode tokens (density, motion, contrast, etc.) |

#### Example

```tsx
import { useDerivedMode, deriveModeLabel } from "@/lib/capacity"

function MySection() {
  const { field, mode } = useDerivedMode()
  const label = deriveModeLabel(field)

  return (
    <div>
      <p>Mode: {label} | Density: {mode.density} | Motion: {mode.motion}</p>
      {mode.density !== "low" && <DetailedContent />}
    </div>
  )
}
```

### `useEnergyField()`

Subscribe to the derived energy field only.

```typescript
function useEnergyField(): EnergyFieldValue
```

Returns a `FieldValue<number>` with `.value`, `.trend`, `.velocity`, `.lastChange`.

### `useAttentionField()`

Subscribe to the derived attention field only.

```typescript
function useAttentionField(): AttentionFieldValue
```

### `useEmotionalValenceField()`

Subscribe to the derived emotional valence field only.

```typescript
function useEmotionalValenceField(): EmotionalValenceFieldValue
```

### `useFieldControls()`

Get update functions without subscribing to context changes.

```typescript
function useFieldControls(): {
  updateCapacity: (capacity: Partial<UserCapacity>) => void
  updateEmotionalState: (state: Partial<EmotionalState>) => void
}
```

### `usePrefersReducedMotion()`

Detect the system `prefers-reduced-motion` media query.

```typescript
function usePrefersReducedMotion(): boolean
```

### `useEffectiveMotion()`

Get the effective motion mode after applying the system reduced-motion override. System `prefers-reduced-motion` is a hard override that forces `"off"` regardless of derived mode.

```typescript
function useEffectiveMotion(): {
  mode: MotionMode              // "off" | "soothing" | "subtle" | "expressive"
  tokens: typeof MOTION_TOKENS  // Duration and easing values
  prefersReducedMotion: boolean
}
```

---

## Components

### `<CapacityProvider>`

Wraps your application and provides capacity context to all children. Takes no configuration props -- defaults come from `DEFAULT_USER_CAPACITY` and `DEFAULT_EMOTIONAL_STATE` constants.

```tsx
<CapacityProvider>
  {children}
</CapacityProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |

#### Example

```tsx
// app/layout.tsx
import { CapacityProvider } from "@/lib/capacity"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CapacityProvider>
          {children}
        </CapacityProvider>
      </body>
    </html>
  )
}
```

---

### `<CapacityControls>`

A pre-built UI panel for adjusting capacity inputs. Fixed to the bottom-right corner. Includes preset selection, individual sliders, derived field readout, and interface mode breakdown. Takes no props.

```tsx
<CapacityControls />
```

#### Example

```tsx
import { CapacityControls } from "@/components/capacity-controls"

function App() {
  return (
    <main>
      <Content />
      <CapacityControls />
    </main>
  )
}
```

---

### `<CapacityDemoCard>`

An example adaptive card demonstrating token consumption. Takes no props -- it reads all state from context internally.

```tsx
<CapacityDemoCard />
```

#### Adaptation Behavior

| Source | Token / Value | Effect | Status |
|--------|--------------|--------|--------|
| Cognitive | `mode.density` | Controls title complexity and visible feature count | Active |
| Temporal | `field.temporal` | Controls description length (full vs abbreviated) | Active |
| Emotional | `mode.motion` | Controls animation class via `entranceClass()` and `ambientClass()` | Active |
| Valence | `field.valence` | Controls tone/greeting text and accent color | Active |
| Mode label | `deriveModeLabel(field)` | Badge color and label text | Active |

---

## Types

### `CapacityField`

The canonical 4-input model. Used to derive `InterfaceMode`.

```typescript
interface CapacityField {
  /** Cognitive bandwidth available (0-1) */
  cognitive: number

  /** Time/effort budget (0-1) */
  temporal: number

  /** Emotional load tolerance (0-1) */
  emotional: number

  /** Emotional direction (-1 to +1) */
  valence: number
}
```

### `UserCapacity`

The three 0-1 capacity dimensions (no valence). Stored on `context.userCapacity`.

```typescript
interface UserCapacity {
  cognitive: number
  temporal: number
  emotional: number
}
```

### `EmotionalState`

Affect model stored on `context.emotionalState`.

```typescript
interface EmotionalState {
  /** Positive/negative affect (-1 to +1) */
  valence: number

  /** Energy/activation level (0 to 1) - Phase 2+ */
  arousal: number
}
```

### `AmbientContext`

The full context object returned by `useCapacityContext().context`.

```typescript
interface AmbientContext {
  energy: FieldValue<number>
  attention: FieldValue<number>
  emotionalValence: FieldValue<number>

  /** Raw user capacity (before field derivation) */
  userCapacity: UserCapacity

  /** Raw emotional state (before field derivation) */
  emotionalState: EmotionalState
}
```

### `FieldValue<T>`

Wrapper that tracks value changes over time.

```typescript
interface FieldValue<T> {
  value: T
  lastChange: number                    // Timestamp (ms)
  trend: "rising" | "falling" | "stable"
  velocity?: number                     // Rate of change per second
}
```

### `InterfaceMode`

The complete token set derived from `CapacityField`.

```typescript
interface InterfaceMode {
  // Active tokens -- consumed by components
  density: "low" | "medium" | "high"
  motion: "off" | "soothing" | "subtle" | "expressive"
  contrast: "standard" | "boosted"

  // Derived tokens -- computed but not yet consumed by components
  guidance: "low" | "medium" | "high"
  choiceLoad: "minimal" | "normal"
}
```

> **Note:** `guidance` and `choiceLoad` are derived in `mode.ts` and included in the TypeScript interface, but no built-in component currently reads them. They are available for custom component development.

### `InterfaceModeLabel`

Human-readable mode labels for UI display. Derived from **raw** `CapacityField` inputs (not from `InterfaceMode` tokens), because states like Neutral and Focused can produce the same token set but should have different labels.

```typescript
type InterfaceModeLabel = "Calm" | "Focused" | "Exploratory" | "Minimal"
```

#### Derivation Rules

Labels are checked in this order -- the first match wins:

| Label | Trigger | Description |
|-------|---------|-------------|
| **Exploratory** | `cognitive > 0.6` AND `emotional > 0.6` | High capacity, full features, playful |
| **Minimal** | `cognitive < 0.4` AND `temporal < 0.4` | Low capacity, protective mode |
| **Focused** | `cognitive >= 0.55` AND `temporal >= 0.55` | Good capacity, task-oriented |
| **Calm** | Fallthrough (none of the above match) | Gentle, balanced, no pressure |

#### Preset-to-Label Mapping

| Preset | Cognitive | Temporal | Emotional | Valence | Motion | Label |
|--------|-----------|----------|-----------|---------|--------|-------|
| Exhausted | 0.1 | 0.1 | 0.1 | -0.6 | off | Minimal |
| Overwhelmed | 0.2 | 0.15 | 0.2 | -0.5 | soothing | Minimal |
| Distracted | 0.35 | 0.25 | 0.5 | 0.0 | subtle | Minimal |
| Neutral | 0.5 | 0.5 | 0.5 | 0.0 | subtle | Calm |
| Focused | 0.75 | 0.75 | 0.55 | 0.1 | subtle | Focused |
| Energized | 0.9 | 0.85 | 0.85 | 0.6 | expressive | Exploratory |
| Exploring | 1.0 | 1.0 | 1.0 | 0.8 | expressive | Exploratory |

#### Badge Colors

| Label | Color | Value |
|-------|-------|-------|
| Calm | Soft blue | `oklch(0.65 0.15 220)` |
| Focused | Primary rust | `oklch(0.68 0.16 45)` |
| Exploratory | Toxic green | `oklch(0.65 0.2 135)` |
| Minimal | Muted purple | `oklch(0.55 0.1 280)` |

### `MotionMode`

```typescript
type MotionMode = "off" | "soothing" | "subtle" | "expressive"
```

| Mode | Emotional Range | Allowed Animations | Purpose |
|------|----------------|--------------------|---------|
| `off` | < 0.15 | None (essential transitions only) | Protective, fully static |
| `soothing` | 0.15 - 0.4 | breathe, float, bloom, sacred-fade, hover-lift | Nervous system regulation |
| `subtle` | 0.4 - 0.6 (or low valence) | All of soothing + vortex-reveal, helix-rise, hover-expand | Grounded, low-amplitude |
| `expressive` | > 0.6 + positive valence | Full suite incl. vibrate, morph, spiral | Playful, energetic |

### `ComponentResponse`

Multi-modal response specification. Components declare how they adapt across sensory dimensions.

```typescript
interface ComponentResponse {
  visual: {
    opacityRange: [number, number]
    scaleRange: [number, number]
    colorShift?: { hue?: number; chroma?: number; lightness?: number }
  }
  spatial: {
    densityRange: [number, number]
    spacingMultiplier: [number, number]
  }
  sonic: {
    enabled: boolean
    frequencyHz?: number
    amplitude?: number
  }
  semantic: {
    verbosityLevel: "minimal" | "concise" | "detailed"
    urgencyFraming: "calm" | "neutral" | "urgent"
  }
}
```

---

## Constants

### `DEFAULT_USER_CAPACITY` (internal)

Used by the `FieldManager` to initialize state. Not exported from `@/lib/capacity` -- documented here for reference.

```typescript
const DEFAULT_USER_CAPACITY = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7,
} as const
```

### `DEFAULT_EMOTIONAL_STATE` (internal)

Used by the `FieldManager` to initialize state. Not exported from `@/lib/capacity` -- documented here for reference.

```typescript
const DEFAULT_EMOTIONAL_STATE = {
  valence: 0.3,   // > 0.15 (with emotional > 0.6) triggers expressive motion mode
  arousal: 0.5,
} as const
```

### `MOTION_TOKENS`

Motion timing and easing values by mode. `"off"` still allows essential transitions (opacity, height) to avoid broken-UI feelings.

```typescript
const MOTION_TOKENS = {
  off: {
    durationFast: 0,
    durationBase: 0,
    durationSlow: 0,
    easing: "linear",
    essentialDuration: 100,
    essentialEasing: "ease-out",
  },
  soothing: {
    durationFast: 0,        // No fast motion -- everything slow and rhythmic
    durationBase: 800,
    durationSlow: 1200,
    easing: "ease-in-out",  // Smooth, no sharp edges
    essentialDuration: 200,
    essentialEasing: "ease-in-out",
  },
  subtle: {
    durationFast: 100,
    durationBase: 200,
    durationSlow: 350,
    easing: "ease-out",
    essentialDuration: 150,
    essentialEasing: "ease-out",
  },
  expressive: {
    durationFast: 200,
    durationBase: 400,
    durationSlow: 700,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like overshoot
    essentialDuration: 150,
    essentialEasing: "ease-out",
  },
} as const
```

### `PHI` / `PHI_INVERSE` / `FIBONACCI`

Golden ratio constants for proportional spacing.

```typescript
const PHI = 1.618033988749895
const PHI_INVERSE = 0.618033988749895
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const
```

### `DEFAULT_COMPONENT_RESPONSE`

Intelligent defaults for component response. 90% of components can use these without override.

### Accessibility Constants

```typescript
const MIN_CONTRAST_RATIO = 4.5           // WCAG AA invariant
const PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)"
const MAX_ANIMATION_DURATION_MS = 300     // For time-sensitive users
```

---

## Utility Functions

### `deriveMode(field)`

Compute the full `InterfaceMode` token set from a `CapacityField`.

```typescript
function deriveMode(field: CapacityField): InterfaceMode
```

Most components should use `useDerivedMode()` which calls this internally. Direct usage is for advanced cases or non-React contexts:

```tsx
import { deriveMode } from "@/lib/capacity"

const mode = deriveMode({ cognitive: 0.8, temporal: 0.5, emotional: 0.7, valence: 0.3 })
// mode.density === "high", mode.motion === "expressive", etc.
```

### `deriveModeLabel(inputs)`

Derive a human-readable mode label from raw capacity inputs.

```typescript
function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel
```

### `getModeBadgeColor(label)`

Get the OKLCH color string for a mode label badge.

```typescript
function getModeBadgeColor(label: InterfaceModeLabel): string

// Returns:
// "Calm"        -> "oklch(0.65 0.15 220)"
// "Focused"     -> "oklch(0.68 0.16 45)"
// "Exploratory" -> "oklch(0.65 0.2 135)"
// "Minimal"     -> "oklch(0.55 0.1 280)"
```

### Animation Utilities

Exported from `lib/capacity/animation.ts`. These replace the inline ternary chains that were previously duplicated across every section component.

#### `entranceClass(motion, preset, hasPlayed)`

Returns the appropriate CSS entrance animation class. Returns `""` after `hasPlayed` to prevent re-render flicker.

```typescript
function entranceClass(motion: MotionMode, preset: "morph" | "vortex" | "spiral", hasPlayed: boolean): string

// Examples:
entranceClass("expressive", "morph", false)  // "morph-fade-in"
entranceClass("subtle", "vortex", false)     // "sacred-fade"
entranceClass("soothing", "spiral", false)   // "bloom"
entranceClass("off", "spiral", false)        // ""
entranceClass("expressive", "morph", true)   // "" (already played)
```

#### `hoverClass(motion)`

Returns the hover animation class.

```typescript
function hoverClass(motion: MotionMode): string

// "expressive" -> "hover-expand"
// "subtle" / "soothing" -> "hover-lift"
// "off" -> ""
```

#### `ambientClass(motion, type)`

Returns a class for continuous ambient animation. Expressive allows all types. Soothing allows only `breathe` and `float` (slow, rhythmic, calming).

```typescript
function ambientClass(motion: MotionMode, type: "breathe" | "float" | "pulse" | "vibrate"): string

// "expressive"               -> type string (all allowed)
// "soothing" + "breathe"     -> "breathe"
// "soothing" + "float"       -> "float"
// "soothing" + "pulse"       -> "" (too stimulating)
// "soothing" + "vibrate"     -> "" (too stimulating)
// "subtle" / "off"           -> ""
```

#### `listItemClass(motion)`

Returns the staggered list item entrance class.

```typescript
function listItemClass(motion: MotionMode): string

// "expressive" -> "helix-rise"
// "subtle" / "soothing" -> "sacred-fade"
// "off" -> ""
```

---

## CSS Animations

Harmonia does **not** use CSS classes for token values (no `.density-low`, `.motion-subtle`, etc.). Components read tokens in JavaScript and make rendering decisions in JSX.

Animation effects are applied via CSS animation classes defined in `globals.css`. Components conditionally apply these classes based on `mode.motion`:

### Entrance Animations

| Class | Effect | Modes |
|-------|--------|-------|
| `morph-fade-in` | Scale + border-radius morph | expressive |
| `vortex-reveal` | Scale + rotate reveal | expressive |
| `spiral-in` | Translate + rotate + opacity | expressive |
| `helix-rise` | Translate + rotate entrance | expressive (list items) |
| `sacred-fade` | Gentle opacity + scale | subtle, soothing (list items) |
| `gentle-fade` | Soft opacity + scale (alias of sacred-fade) | subtle, soothing |
| `bloom` | Scale bloom entrance | soothing, subtle (spiral preset) |

### Continuous / Ambient Animations

| Class | Effect | Modes |
|-------|--------|-------|
| `breathe` | Slow scale pulse (7.77s) | expressive, soothing |
| `float` | Vertical drift (4.44s) | expressive, soothing |
| `pulse` | Heartbeat rhythm (4.44s) | expressive only |
| `vibrate` | Rapid micro-shake (1.11s) | expressive only |
| `wave` | Gentle rotation (4.44s) | expressive only |

### Hover Effects

| Class | Effect | Modes |
|-------|--------|-------|
| `hover-expand` | Scale up on hover | expressive |
| `hover-lift` | Translate up on hover | subtle, soothing |
| `hover-pulse` | Scale pulse on hover | expressive |

### Intersection Observer Animations

| Class | Effect | Trigger |
|-------|--------|---------|
| `animate-fade-in` | Hidden until `.in-view` added | IntersectionObserver |
| `animate-fade-in-immediate` | Animates on load | Above-fold content |

### CON Letter Collision (Convention page)

| Class | Effect |
|-------|--------|
| `letter-smash-c` | Smash in from left |
| `letter-smash-o` | Drop from above |
| `letter-smash-n` | Smash in from right |

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce` via a CSS media query that forces `animation: none` and removes transforms.

---

## FieldManager (Advanced)

The `FieldManager` singleton maintains ambient field state. Components subscribe through the provider; direct usage is for advanced cases only.

```typescript
FieldManager.getContext(): Readonly<AmbientContext>
FieldManager.updateCapacity(capacity: Partial<UserCapacity>): void
FieldManager.updateEmotionalState(state: Partial<EmotionalState>): void
FieldManager.subscribe(listener: (context: AmbientContext) => void): Unsubscribe
```

---

## SignalBus (Advanced)

Type-safe pub/sub for inter-component communication.

```typescript
SignalBus.emit(signal: Signal): void
SignalBus.subscribe(type: string, handler: SignalHandler): Unsubscribe
```

---

## Error Handling

### Missing Provider

Using `useCapacityContext()` outside of `CapacityProvider` throws:

```
Error: useCapacityContext must be used within CapacityProvider
```

### Value Ranges

The system does not auto-clamp values. Capacity fields expect 0-1, valence expects -1 to +1. Invalid ranges produce undefined behavior in mode derivation.
