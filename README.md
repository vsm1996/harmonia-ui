# @harmonia-core

A capacity-adaptive UI framework that treats human cognitive, temporal, and emotional state as first-class inputs.

Instead of inferring or profiling users, Harmonia derives discrete interface mode tokens from explicit state — density, motion, contrast, and focus — and lets components consume them in JavaScript.

[Live demo](https://harmonia-ui.vercel.app) | [Convention example](https://harmonia-ui.vercel.app/convention)

---

## Installation

```bash
npm install @harmonia-core @renge-ui/tokens
# or
pnpm add @harmonia-core @renge-ui/tokens
```

`@renge-ui/tokens` is a required peer dependency. It provides the `createRengeTheme()` function and the `--renge-*` CSS custom properties that the capacity system's motion and spacing utilities reference.

### Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@renge-ui/tokens": "^1.0.0"
}
```

---

## Setup

### 1. Inject the design token theme

Call `createRengeTheme()` in your root layout and inject the result as a `<style>` tag. The capacity system manipulates `--renge-*` CSS custom properties at runtime — static Tailwind classes cannot do this.

```tsx
// app/layout.tsx (Next.js App Router)
import { createRengeTheme } from "@renge-ui/tokens"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = createRengeTheme({ profile: "ocean" })

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 2. Wrap your app with CapacityProvider

```tsx
// components/providers.tsx
"use client"

import { CapacityProvider } from "@harmonia-core"

export function Providers({ children }: { children: React.ReactNode }) {
  return <CapacityProvider>{children}</CapacityProvider>
}
```

`CapacityProvider` starts in **auto mode** — it polls six passive signal detectors every 2 seconds (time of day, session duration, scroll velocity, interaction rate, typing speed, system preferences) and writes inferred capacity values to the field manager. Any manual slider interaction disables auto mode.

---

## Usage

### Consuming mode tokens in a component

```tsx
import { useDerivedMode, deriveModeLabel } from "@harmonia-core"

function AdaptiveCard() {
  const { field, mode } = useDerivedMode()
  const label = deriveModeLabel(field) // "Minimal" | "Calm" | "Focused" | "Exploratory"

  return (
    <div>
      <span>Mode: {label}</span>

      {/* density controls information visibility */}
      <h2>Card Title</h2>
      {mode.density !== "low" && <p>Description shown at medium/high density</p>}
      {mode.density === "high" && <ul><li>Full feature list</li></ul>}

      {/* temporal controls content length — read raw field value */}
      <p>
        {field.temporal > 0.4
          ? "Full description with details and context."
          : "Short summary."}
      </p>

      {/* valence controls tone */}
      <p>
        {field.valence > 0.2
          ? "You're doing great!"
          : field.valence < -0.2
          ? "Take your time."
          : "Here's how it works:"}
      </p>
    </div>
  )
}
```

### Applying motion classes

```tsx
import { useEffectiveMotion, entranceClass, hoverClass } from "@harmonia-core"

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { mode } = useEffectiveMotion() // applies prefers-reduced-motion hard override

  return (
    <div className={entranceClass(mode)}>
      <button className={hoverClass(mode)}>
        {children}
      </button>
    </div>
  )
}
```

`useEffectiveMotion()` forces `"off"` when `prefers-reduced-motion` is set, regardless of the derived value.

### Adjusting grid layout by density

```tsx
import { useDerivedMode } from "@harmonia-core"

function EventGrid({ events }: { events: Event[] }) {
  const { mode } = useDerivedMode()

  const columns = { low: 1, medium: 2, high: 3 }[mode.density]
  const visible = mode.density === "low" ? events.slice(0, 3) : events

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {visible.map(e => (
        <EventCard key={e.id} event={e} showDetails={mode.density !== "low"} />
      ))}
    </div>
  )
}
```

---

## Core pipeline

```
Signals (auto) ─────────────────────────────────────────┐
                                                         ▼
Sliders (manual) → UserCapacity + EmotionalState → FieldManager → AmbientContext → deriveMode() → Components
```

Raw inputs are never mapped directly to styles. Inputs → Fields → Tokens → Components.

### Raw inputs

**UserCapacity** — three 0–1 dimensions:

| Input | Controls |
|-------|----------|
| `cognitive` | Density, focus guidance |
| `temporal` | Content length, guidance |
| `emotional` | Motion restraint |

**EmotionalState**:

| Input | Range | Controls |
|-------|-------|----------|
| `valence` | −1 to +1 | Tone, expressiveness, contrast |
| `arousal` | 0–1 | Animation pace (Phase 3) |

### Derived fields (FieldManager)

| Field | Formula |
|-------|---------|
| `energy` | Geometric mean: `(cognitive × temporal × emotional)^(1/3)` |
| `attention` | `1 − (temporal × 0.5)` |
| `emotionalValence` | Pass-through from `valence` |

### Mode tokens (deriveMode)

| Token | Source | Values |
|-------|--------|--------|
| `density` | cognitive | `"low"` / `"medium"` / `"high"` |
| `motion` | emotional + valence | `"off"` / `"soothing"` / `"subtle"` / `"expressive"` |
| `contrast` | valence | `"standard"` / `"boosted"` |
| `focus` | cognitive + motion | `"default"` / `"gentle"` / `"guided"` |
| `guidance` | cognitive + temporal | `"low"` / `"medium"` / `"high"` |
| `choiceLoad` | temporal | `"minimal"` / `"normal"` |

### Mode labels

Four human-readable labels derived from raw inputs, first match wins:

| Label | Trigger |
|-------|---------|
| `"Exploratory"` | cognitive > 0.6 AND emotional > 0.6 |
| `"Minimal"` | cognitive < 0.4 AND temporal < 0.4 |
| `"Focused"` | cognitive ≥ 0.55 AND temporal ≥ 0.55 |
| `"Calm"` | Fallthrough |

---

## API reference

### Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useDerivedMode()` | `{ field: CapacityField, mode: InterfaceMode }` | Primary hook — builds the field and runs deriveMode in one call |
| `useEffectiveMotion()` | `{ mode: MotionMode, tokens: MotionTokens }` | Motion with prefers-reduced-motion override |
| `useCapacityContext()` | `AmbientContext` | Raw context — prefer useDerivedMode for most uses |
| `useFieldControls()` | `{ setCapacity, setEmotionalState, setAutoMode }` | Imperative setters for manual control |
| `usePredictedCapacity()` | `CapacityField \| null` | Prediction based on stored patterns (≥12 samples required) |
| `useEnergyField()` | `FieldValue<number>` | Live energy field with trend/velocity |
| `useAttentionField()` | `FieldValue<number>` | Live attention field |
| `useEmotionalValenceField()` | `FieldValue<number>` | Live valence field |
| `usePrefersReducedMotion()` | `boolean` | System prefers-reduced-motion query |

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `deriveMode` | `(field: CapacityField) => InterfaceMode` | Pure — derive mode tokens from a field snapshot |
| `deriveModeLabel` | `(field: CapacityField) => InterfaceModeLabel` | Pure — derive the human-readable mode label |
| `entranceClass` | `(motion: MotionMode) => string` | CSS class for entrance animations |
| `hoverClass` | `(motion: MotionMode) => string` | CSS class for hover interactions |
| `ambientClass` | `(motion: MotionMode) => string` | CSS class for ambient/idle animations |
| `focusBeaconClass` | `(focus: FocusMode) => string` | CSS class for focus beacon indicator |
| `getSpacing` | `(step: number) => number` | Fibonacci spacing scale (step × 6px) |
| `getFontSize` | `(role: TypographyRole) => string` | φ-derived font sizes |
| `triggerHaptic` | `(pattern: HapticPatternName) => void` | Web Vibration API — opt-in haptic feedback |
| `playPacedSonic` | `(pace: ArousalMode) => void` | Web Audio API — opt-in sonic feedback |

### Components

`@harmonia-core` exports the capacity system only — no opinionated UI components. See the [live demo](https://harmonia-ui.vercel.app) for reference implementations of `CapacityControls`, `CapacityDemoCard`, and `AmbientFieldMonitor`.

---

## Design principles

**Inputs over inference.** Human state is provided explicitly. No biometrics, no tracking, no behavioral profiling.

**Capacity, not preference.** The system adapts to what a user *can handle*, not what they "like."

**Inputs → Fields → Tokens → Components.** Raw inputs are never mapped directly to styles. The abstraction layers ensure consistent, predictable adaptation.

**Accessibility as a constraint.** `prefers-reduced-motion` is a hard override. Semantic structure, keyboard navigation, and contrast are never compromised by adaptation.

---

## License

MIT — see [LICENSE.md](LICENSE.md).
