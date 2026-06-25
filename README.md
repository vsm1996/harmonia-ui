# @harmonia-core/ui

[![npm version](https://img.shields.io/npm/v/@harmonia-core/ui.svg)](https://www.npmjs.com/package/@harmonia-core/ui)
[![License](https://img.shields.io/npm/l/@harmonia-core/ui.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://react.dev)
[![npm downloads](https://img.shields.io/npm/dm/@harmonia-core/ui.svg)](https://www.npmjs.com/package/@harmonia-core/ui)

A capacity-adaptive UI framework that treats human cognitive, temporal, and emotional state as first-class inputs.

Instead of inferring or profiling users, Harmonia derives discrete interface mode tokens from explicit state — density, motion, contrast, and focus — and lets components consume them in JavaScript.

[Live demo](https://harmonia-ui.vercel.app) | 
[Convention example](https://harmonia-ui.vercel.app/convention) • 
[GitHub](https://github.com/vanessa/harmonia-ui) • 
[Issues](https://github.com/vanessa/harmonia-ui/issues) • 
[Discussions](https://github.com/vanessa/harmonia-ui/discussions)

---

## Installation

```bash
npm install @harmonia-core/ui @renge-ui/tokens motion
# or
pnpm add @harmonia-core/ui @renge-ui/tokens motion
```

`@renge-ui/tokens` is a required peer dependency. It provides the `--renge-*` CSS custom properties (φ-based typography, Fibonacci spacing, OKLCH colors, natural motion) that the capacity system's utilities reference.

### Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@renge-ui/tokens": "^2.2.4",
  "motion": ">=11.0.0"
}
```

---

## Setup

### 1. Load the design tokens

Import the pre-built CSS file once in your root layout and set `data-profile` on `<html>` to activate a color profile. The capacity system manipulates `--renge-*` CSS custom properties at runtime — these are live CSS vars, so the static file is compatible with runtime adaptation.

```tsx
// app/layout.tsx (Next.js App Router)
import "@renge-ui/tokens/renge.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-profile="ocean">
      <body>{children}</body>
    </html>
  )
}
```

Available profiles: `ocean` (default), `earth`, `twilight`, `fire`, `void`, `leaf`. Add `data-mode="dark"` for explicit dark mode — otherwise `prefers-color-scheme` is respected automatically.

**For scoped theming** (e.g. a section of your app with a different profile), use `createRengeTheme()` directly:

```tsx
import { createRengeTheme } from "@renge-ui/tokens"

const sectionTheme = createRengeTheme({ profile: "fire", mode: "dark", selector: ".my-section" })

// inject sectionTheme.css as a <style> tag
```

### 2. Wrap your app with CapacityProvider

```tsx
// components/providers.tsx
"use client"

import { CapacityProvider } from "@harmonia-core/ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return <CapacityProvider>{children}</CapacityProvider>
}
```

`CapacityProvider` starts in **auto mode** — it polls six passive signal detectors every 2 seconds (time of day, session duration, scroll velocity, interaction rate, typing speed, system preferences) and writes inferred capacity values to the field manager. Any manual slider interaction disables auto mode.

### 3. Add CapacityControls and AmbientFieldMonitor for controls + debugging

Pre-built components are available via the `/components` entry point:

```ts
import { CapacityControls, CapacityDemoCard, AmbientFieldMonitor } from "@harmonia-core/ui/components"
```

| Component | Description |
|-----------|-------------|
| `CapacityControls` | Floating panel for manual capacity input — sliders, presets, live mode readout |
| `CapacityDemoCard` | Demo card that reacts to the current mode in real-time |
| `AmbientFieldMonitor` | Debug overlay showing live field values and derived tokens |

#### CapacityControls

A fixed-position floating control panel (bottom-right) that lets users set their capacity state manually. Includes four sliders (cognitive, temporal, emotional, valence), quick presets, auto/manual mode toggle, opt-in haptic/sonic feedback, and a live derived fields display.

Requires `motion` (`>=11.0.0`) as a peer dependency for animations.

```tsx
// app/layout.tsx or your root providers file
import { CapacityControls } from "@harmonia-core/ui/components"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CapacityControls />
      </body>
    </html>
  )
}
```

`CapacityControls` must be rendered inside `CapacityProvider`. It reads and writes to the capacity context directly — no props required.

**Presets available:** Exhausted, Overwhelmed, Distracted, Neutral, Focused, Energized, Exploring.

See the [live demo](https://harmonia-ui.vercel.app) for all three components in action.

---

## When NOT to Use Harmonia

Harmonia is optimized for applications where **user capacity varies significantly** throughout a session. It may not be the right fit for:

### ❌ Poor Fit

- **Gaming:** Requires continuous high-frequency state updates, not discrete capacity changes
- **High-frequency trading/financial UIs:** State changes every millisecond; discrete capacity doesn't apply
- **Real-time collaborative editing:** Mode changes every keystroke would distract multi-user environments
- **Custom capacity inference:** You need proprietary ML/profiling logic (Harmonia uses explicit state only)
- **Static apps:** Content and layout don't change much regardless of user state

### ✅ Good Fit

- **Productivity apps:** Writing, coding, design tools (capacity varies as user gets tired)
- **Learning platforms:** Student capacity decreases as session length increases
- **Wellness/health apps:** Mood and energy state directly affect what users need
- **Admin dashboards:** Operators have different needs depending on alertness, time available
- **Accessibility-first apps:** Adaptive UI as accessibility feature for cognitive conditions
- **Research/survey tools:** Adjust complexity based on respondent capacity
- **Documentation sites:** Readers can adapt complexity per their current capacity

### ⚠️ Trade-offs

- **Requires React 18+:** Cannot use with older React versions
- **Takes CSS var approach:** Not compatible with Tailwind CSS preset; uses runtime CSS manipulation
- **Signal detection is 2s polling:** Not suitable for real-time updates (by design — prevents thrashing)
- **Manual state input:** Users must interact with controls (no surveillance/profiling)
- **Adds ~1 MB (patterns):** PatternStore uses localStorage; acceptable for most apps

**Still not sure?** [Open a discussion](https://github.com/vanessa/harmonia-ui/discussions) — we're happy to advise.

---

## Usage

### Consuming mode tokens in a component

```tsx
import { useDerivedMode, deriveModeLabel } from "@harmonia-core/ui"

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
import { useEffectiveMotion, entranceClass, hoverClass } from "@harmonia-core/ui"

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
import { useDerivedMode } from "@harmonia-core/ui"

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

## What's New (v1.2.7)

- ✨ **Arousal dimension** — Pace token (`calm|normal|activated`) for motion speed
- ✨ **Haptic feedback** — `triggerHaptic()` using Vibration API
- ✨ **Sonic feedback** — `playSonicFeedback()` using Web Audio API
- 🔨 **Type consolidation** — Improved IDE autocomplete and maintainability
- 🐛 **Better error handling** — More informative error messages
- 📦 **Zero dependencies** — Still minimal bundle size (~15 KB gzipped)

**Upcoming in v1.3:**
- sessionDuration pattern matching (currently time-of-day / day-of-week only)
- Additional Renge token profiles
- Performance optimizations

[See all versions →](https://www.npmjs.com/package/@harmonia-core/ui?activeTab=versions)

---

## API Reference

Complete documentation of all hooks, types, and utilities.

### Hooks

**Core:**
- `useDerivedMode()` — Get current mode + field values + label
- `useCapacityContext()` — Access raw `AmbientContext` (signals, fields, sliders)

**Field Hooks:**
- `useEnergyField()` — Energy field value + trend
- `useAttentionField()` — Attention field value + trend  
- `useEmotionalValenceField()` — Emotional valence field value + trend
- `useFieldControls()` — Get/set slider values (manual mode)

**Motion & Feedback:**
- `useEffectiveMotion()` — Current motion mode with `prefers-reduced-motion` override
- `usePrefersReducedMotion()` — Check if user prefers reduced motion (OS setting)
- `useFeedback()` — Access haptic (`triggerHaptic`), sonic (`playSonicFeedback`), visual feedback utilities

**Advanced:**
- `usePredictedCapacity()` — Get capacity predicted from past patterns (5s refresh)

### Utilities

**Mode & Tokens:**
- `deriveMode(field: CapacityField): InterfaceMode` — Derive tokens from field values
- `deriveModeLabel(field: CapacityField): string` — Get mode label ("Minimal" | "Calm" | "Focused" | "Exploratory")
- `getModeBadgeColor(mode: string): string` — Theme color for mode label

**Animation Classes:**
- `entranceClass(mode: InterfaceMode): string` — CSS class for entrance animation
- `hoverClass(mode: InterfaceMode): string` — CSS class for hover animation
- `ambientClass(mode: InterfaceMode): string` — CSS class for ambient motion
- `listItemClass(index: number, mode: InterfaceMode): string` — Staggered animation for list items
- `focusBeaconClass(mode: InterfaceMode): string` — Beacon glow for focused elements
- `focusTextClass(mode: InterfaceMode): string` — Text focus effect

**Utilities:**
- `detectConflicts(field: CapacityField): string[]` — Check for contradictory input states

### Types

**Main:**
- `CapacityField` — Derived field values: `{ cognitive, temporal, emotional, valence, energy }`
- `InterfaceMode` — Mode tokens: `{ density, motion, contrast, focus, guidance, choiceLoad, pace }`
- `AmbientContext` — Full ambient state with signals, fields, sliders

**Constants:**
- `PHI = 1.618...` — Golden ratio
- `FIBONACCI = [1, 1, 2, 3, 5, 8, 13, ...]` — Fibonacci sequence
- `MOTION_TOKENS = ['off', 'soothing', 'subtle', 'expressive']`
- `DENSITY_TOKENS = ['low', 'medium', 'high']`

For complete type definitions, see: [lib/capacity/types.ts](./lib/capacity/types.ts)

For live API examples, run: `pnpm run dev` and visit http://localhost:3000 (use `AmbientFieldMonitor` to inspect values)

### Design tokens (rengeVars)

Use `rengeVars` from `@renge-ui/tokens` for typed CSS variable references with IDE autocomplete:

```ts
import { rengeVars } from "@renge-ui/tokens"

style={{ animationDelay: rengeVars.duration[3] }}    // "var(--renge-duration-3)"
style={{ padding: rengeVars.space[4] }}              // "var(--renge-space-4)"
style={{ fontSize: rengeVars.fontSize.lg }}          // "var(--renge-font-size-lg)"
style={{ color: rengeVars.color.accent }}            // "var(--renge-color-accent)"
style={{ borderRadius: rengeVars.radius[2] }}        // "var(--renge-radius-2)"
```

Available scales: `color`, `space`, `fontSize`, `lineHeight`, `duration`, `easing`, `radius`.

---

## Design principles

**Inputs over inference.** Human state is provided explicitly. No biometrics, no tracking, no behavioral profiling.

**Capacity, not preference.** The system adapts to what a user *can handle*, not what they "like."

**Inputs → Fields → Tokens → Components.** Raw inputs are never mapped directly to styles. The abstraction layers ensure consistent, predictable adaptation.

**Accessibility as a constraint.** `prefers-reduced-motion` is a hard override. Semantic structure, keyboard navigation, and contrast are never compromised by adaptation.

---

## License

MIT — see [LICENSE.md](LICENSE.md).
