# Harmonia UI

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://harmonia-ui.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-90.5%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE.md)

**A capacity-adaptive UI framework that treats human state as a first-class input.**

[Live Demo](https://harmonia-ui.vercel.app) | [Convention Example](https://harmonia-ui.vercel.app/convention) | [Report Bug](https://github.com/vsm1996/harmonia-ui/issues)

---

## See It In Action

<!-- TODO: Replace with actual screen recording GIF -->
<!-- Recommended: Use a tool like Kap (macOS), ScreenToGif (Windows), or peek (Linux) -->
<!-- Show: Adjusting capacity sliders and watching the UI adapt in real-time -->

![Harmonia UI Demo](public/demo.gif)

*The interface adapts as you adjust cognitive, temporal, and emotional capacity. From Minimal mode (stripped to essentials) to Exploratory mode (full features with expressive motion).*

---

## What is Harmonia UI?

Harmonia UI is a framework for building interfaces that adapt to a user's current cognitive, temporal, and emotional capacity. Instead of inferring or profiling users, Harmonia uses explicit inputs to derive coherent interface modes that affect layout density, content length, motion, and tone.

**The core insight:** Users don't always have the same capacity. Sometimes you're focused and energized; sometimes you're exhausted and overwhelmed. Interfaces should respond to this reality.

```
UserCapacity + EmotionalState -> FieldManager -> AmbientContext -> deriveMode() -> Components
```

Raw inputs are never mapped directly to styles. Inputs derive fields; fields inform modes; components consume mode tokens. This separation keeps adaptation consistent, predictable, and maintainable.

---

## Table of Contents

- [Core Concepts](#core-concepts)
- [Architecture](#architecture)
- [Derivation Rules](#derivation-rules)
- [Interface Modes](#interface-modes)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Design Principles](#design-principles)
- [Accessibility](#accessibility)
- [Roadmap](#roadmap)
- [License](#license)

---

## Core Concepts

### Raw Inputs

The user's state is captured by two structures:

**UserCapacity** (three 0-1 dimensions):

| Input | Range | Controls | Description |
|-------|-------|----------|-------------|
| **Cognitive** | 0-1 | Density | Mental bandwidth available. Low = overwhelmed, high = sharp. |
| **Temporal** | 0-1 | Content length | Time/effort budget. Low = rushed, high = leisurely. |
| **Emotional** | 0-1 | Motion restraint | Load tolerance/resilience. Low = fragile, high = robust. |

**EmotionalState**:

| Input | Range | Controls | Description |
|-------|-------|----------|-------------|
| **Valence** | -1 to +1 | Tone, expressiveness | Emotional direction. Negative = distressed, positive = upbeat. |
| **Arousal** | 0-1 | (Phase 2+) | Energy/activation level. Reserved for future use. |

### Derived Fields (AmbientContext)

The `FieldManager` computes three derived fields from raw inputs, wrapped in `FieldValue<T>` with temporal metadata (trend, velocity):

| Field | Formula | Purpose |
|-------|---------|---------|
| **Energy** | Geometric mean of cognitive, temporal, emotional | Overall capacity level |
| **Attention** | Inverse of temporal pressure | Focus demand on the system |
| **Emotional Valence** | Pass-through from EmotionalState.valence | Emotional direction for tone |

### InterfaceMode (Tokens)

Components call `deriveMode(field)` to get discrete tokens. There are no CSS classes for tokens -- components read them in JavaScript and make rendering decisions in JSX.

| Token | Source | Values | Status |
|-------|--------|--------|--------|
| **density** | cognitive | `"low"` / `"medium"` / `"high"` | Active |
| **motion** | emotional + valence | `"off"` / `"subtle"` / `"expressive"` | Active |
| **contrast** | valence | `"standard"` / `"boosted"` | Active |
| **guidance** | cognitive + temporal | `"low"` / `"medium"` / `"high"` | Derived, not yet consumed |
| **choiceLoad** | temporal | `"minimal"` / `"normal"` | Derived, not yet consumed |

### Interface Mode Labels

Four human-readable labels derived from raw inputs:

| Mode | Trigger | Characteristics |
|------|---------|-----------------|
| **Minimal** | cognitive < 0.35 AND temporal < 0.35 | Stripped to essentials, boosted contrast |
| **Calm** | Fallthrough (moderate, uneven capacity) | Gentle density, subtle motion |
| **Focused** | cognitive >= 0.6 AND temporal >= 0.6 | Balanced density, task-oriented |
| **Exploratory** | cognitive > 0.65 AND emotional > 0.65 | Full features, expressive motion |

---

## Architecture

```
+-----------------------------------------------------------------+
|                        CapacityProvider                          |
|  +---------------+    +---------------+    +----------------+   |
|  | UserCapacity  | -> | FieldManager  | -> | AmbientContext |   |
|  | Emotional     |    | (derives      |    | (energy,       |   |
|  | State         |    |  fields)      |    |  attention,    |   |
|  +---------------+    +---------------+    |  valence,      |   |
|                                            |  raw inputs)   |   |
|                                            +----------------+   |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                         Components                               |
|  Each component:                                                 |
|    1. Calls useCapacityContext() to get AmbientContext            |
|    2. Builds a CapacityField from context                        |
|    3. Calls deriveMode(field) inline for tokens                  |
|    4. Reads raw values from context for content decisions         |
|    5. Applies CSS animation classes based on mode.motion          |
+-----------------------------------------------------------------+
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/capacity/types.ts` | All TypeScript interfaces (CapacityField, InterfaceMode, AmbientContext, etc.) |
| `lib/capacity/provider.tsx` | CapacityProvider, context hooks (useCapacityContext, useEnergyField, etc.) |
| `lib/capacity/fields/field-manager.ts` | FieldManager singleton -- computes derived fields from raw inputs |
| `lib/capacity/mode.ts` | deriveMode(), deriveModeLabel(), getModeBadgeColor() |
| `lib/capacity/constants.ts` | Default values, motion tokens, golden ratio constants, presets |
| `lib/capacity/signals/signal-bus.ts` | Type-safe pub/sub for inter-component communication |
| `lib/capacity/utils/typography.ts` | Modular scale, fluid font sizing, typography role utilities |
| `lib/capacity/index.ts` | Barrel exports for the capacity system |
| `components/capacity-controls.tsx` | UI panel for manual capacity adjustment (sliders + presets) |
| `components/capacity-demo-card.tsx` | Example adaptive component demonstrating token consumption |
| `components/ambient-field-monitor.tsx` | Debug overlay showing live field values and derived state |

---

## Derivation Rules

### Density (from Cognitive)

```typescript
if (cognitive < 0.35) return "low"
if (cognitive > 0.75) return "high"
return "medium"
```

### Motion (from Emotional + Valence)

```typescript
if (emotional < 0.35) return "subtle"
if (valence > 0.25) return "expressive"
return "subtle"
```

System `prefers-reduced-motion` is a hard override that forces `"off"` regardless of derived value.

### Contrast (from Valence)

```typescript
if (valence < -0.25) return "boosted"
return "standard"
```

### Guidance (from Cognitive + Temporal)

> Not yet consumed by any component. Available for future use.

```typescript
if (cognitive < 0.35) return "high"
if (temporal < 0.35) return "medium"
return "low"
```

### Choice Load (from Temporal)

> Not yet consumed by any component. Available for future use.

```typescript
if (temporal < 0.35) return "minimal"
return "normal"
```

---

## Interface Modes

### Minimal Mode

**When:** User is overwhelmed, exhausted, or in distress.

| Token | Value | Effect |
|-------|-------|--------|
| density | low | Fewer items visible, single-column layout |
| motion | subtle or off | No surprises |
| contrast | boosted | Higher accessibility |

**Suggested tone:** "Take your time."

### Calm Mode

**When:** User has moderate but uneven capacity. Includes neutral states, distracted states, and other in-between conditions that don't meet the thresholds for Focused or Exploratory.

| Token | Value | Effect |
|-------|-------|--------|
| density | low to medium | Gentle information load |
| motion | subtle | Grounded transitions |
| contrast | standard | Normal contrast |

**Suggested tone:** "Take it easy."

### Focused Mode

**When:** User has good cognitive and temporal capacity -- ready to work.

| Token | Value | Effect |
|-------|-------|--------|
| density | medium | Balanced information |
| motion | subtle to expressive | Depends on emotional + valence |
| contrast | standard | Normal contrast |

**Suggested tone:** "Here's how it works:"

### Exploratory Mode

**When:** User is energized, curious, and emotionally robust.

| Token | Value | Effect |
|-------|-------|--------|
| density | medium to high | Full feature display |
| motion | expressive | Playful micro-interactions |
| contrast | standard | Normal contrast |

**Suggested tone:** "You're doing great!"

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vsm1996/harmonia-ui.git
cd harmonia-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
harmonia-ui/
+-- app/
|   +-- page.tsx                            # Homepage with live demo
|   +-- convention/
|   |   +-- layout.tsx                      # Convention layout with CapacityProvider
|   |   +-- page.tsx                        # AbyssCon example page
|   +-- accessibility/page.tsx              # Accessibility statement
|   +-- privacy/page.tsx                    # Privacy policy
|   +-- terms/page.tsx                      # Terms of service
|   +-- layout.tsx                          # Root layout
|   +-- globals.css                         # Global styles + animation classes
+-- components/
|   +-- capacity-controls.tsx               # Slider panel for adjusting inputs
|   +-- capacity-demo-card.tsx              # Example adaptive card
|   +-- ambient-field-monitor.tsx           # Debug overlay for field values
|   +-- providers.tsx                       # Theme + capacity provider wrapper
|   +-- infected-text.tsx                   # Capacity-adaptive text component
|   +-- convention/
|   |   +-- hero-section.tsx                # Adaptive convention hero
|   |   +-- events-section.tsx              # Adaptive events grid
|   |   +-- guests-section.tsx              # Adaptive guest cards
|   |   +-- tickets-section.tsx             # Adaptive ticket tiers
|   |   +-- convention-nav.tsx              # Convention navigation
|   |   +-- footer.tsx                      # Convention footer
|   |   +-- animated-dumpster.tsx           # SVG animation component
|   |   +-- gachiakuta-svgs.tsx             # Themed SVG illustrations
+-- lib/
|   +-- capacity/
|   |   +-- types.ts                        # All TypeScript interfaces
|   |   +-- constants.ts                    # Defaults, thresholds, motion tokens
|   |   +-- provider.tsx                    # CapacityProvider + context hooks
|   |   +-- mode.ts                         # deriveMode, deriveModeLabel, badge colors
|   |   +-- index.ts                        # Barrel exports
|   |   +-- fields/
|   |   |   +-- field-manager.ts            # FieldManager singleton
|   |   +-- signals/
|   |   |   +-- signal-bus.ts               # Type-safe event bus
|   |   +-- utils/
|   |       +-- index.ts                    # General utilities
|   |       +-- typography.ts               # Modular scale + fluid fonts
|   +-- use-scroll-animation.ts             # IntersectionObserver scroll hook
|   +-- utils.ts                            # cn() class utility
+-- styles/
|   +-- globals.css                         # Additional global styles
+-- public/
    +-- images/                             # Static assets
```

---

## Usage Examples

### Wrapping Your App

```tsx
// components/providers.tsx
import { CapacityProvider } from "@/lib/capacity"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CapacityProvider>
      {children}
    </CapacityProvider>
  )
}
```

### Consuming Capacity in a Component

```tsx
import { useCapacityContext, deriveMode, deriveModeLabel } from "@/lib/capacity"

function AdaptiveCard() {
  const { context } = useCapacityContext()

  // Build CapacityField from context
  const field = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }
  const mode = deriveMode(field)
  const label = deriveModeLabel(field)

  return (
    <div>
      {/* Mode label for display */}
      <span>Mode: {label}</span>

      {/* Density controls what's visible */}
      <h2>Card Title</h2>
      {mode.density !== "low" && <p>Description shown at medium/high density</p>}
      {mode.density === "high" && <ul><li>Feature list at high density</li></ul>}

      {/* Motion controls animation classes */}
      <div className={mode.motion === "expressive" ? "morph-fade-in" : "sacred-fade"}>
        Animated content
      </div>

      {/* Temporal controls content length (read raw value) */}
      <p>{context.userCapacity.temporal > 0.4
        ? "Full description with details and context."
        : "Short summary."
      }</p>

      {/* Valence controls tone (read raw value) */}
      <p>{context.emotionalState.valence > 0.2
        ? "You're doing great!"
        : context.emotionalState.valence < -0.2
          ? "Take your time."
          : "Here's how it works:"
      }</p>
    </div>
  )
}
```

### Adjusting Grid Layout by Density

```tsx
import { useCapacityContext, deriveMode } from "@/lib/capacity"

function EventGrid({ events }) {
  const { context } = useCapacityContext()

  const field = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }
  const mode = deriveMode(field)

  // Density drives column count
  const columns = { low: 1, medium: 2, high: 3 }[mode.density]

  // Density drives visible item count
  const visibleEvents = mode.density === "low"
    ? events.slice(0, 3)
    : events

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    }}>
      {visibleEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          showDetails={mode.density !== "low"}
        />
      ))}
    </div>
  )
}
```

### Using Motion Tokens

```tsx
import { useEffectiveMotion } from "@/lib/capacity"

function AnimatedButton({ children }) {
  const { mode, tokens } = useEffectiveMotion()

  // Animation class based on effective motion (respects prefers-reduced-motion)
  const animClass = mode === "expressive" ? "breathe"
                  : mode === "subtle" ? "gentle-fade"
                  : ""

  return (
    <button
      className={animClass}
      style={{
        transition: `transform ${tokens.durationBase}ms ${tokens.easing}`,
      }}
    >
      {children}
    </button>
  )
}
```

---

## Design Principles

### 1. Inputs Over Inference

Human state is provided explicitly, not guessed or extracted. No biometrics, no tracking, no profiling. Users control their own capacity declaration.

### 2. Capacity, Not Preference

The system adapts to what a user *can handle*, not what they "like." This is about cognitive ergonomics, not personalization.

### 3. Inputs -> Fields -> Tokens -> Components

Raw inputs are never mapped directly to styles. The abstraction layers ensure consistency:
- **Inputs** are raw user state (UserCapacity + EmotionalState)
- **Fields** are derived aggregates (energy, attention, valence)
- **Tokens** are discrete design primitives (density: low/medium/high)
- **Components** consume tokens in JavaScript, never via CSS classes

### 4. Distributed, Local Adaptation

Components respond to shared context without relying on global god-state. Each component calls `deriveMode()` inline and makes local decisions based on tokens.

### 5. Accessibility as a Constraint

Semantic structure, keyboard navigation, contrast, and motion preferences are never compromised by adaptation. WCAG compliance is the floor, not the ceiling.

### 6. Identity is Stable, Expression Adapts

Font families, semantics, and meaning remain fixed. Only density, spacing, motion, and emphasis change. The content is the same -- the presentation adapts.

---

## Accessibility

Harmonia UI is built with accessibility as a core constraint:

| Concern | Approach |
|---------|----------|
| **Semantic HTML** | All components use proper heading hierarchy, landmarks, and ARIA roles |
| **Keyboard Navigation** | Tab order follows DOM order; focus states are always visible |
| **Motion** | Respects `prefers-reduced-motion` via hard override to `"off"` mode |
| **Contrast** | Boosted contrast at negative valence; WCAG AA minimum always (4.5:1) |
| **Screen Readers** | Mode changes announced via `aria-live` regions; no meaning-critical animations |
| **Progressive Disclosure** | Hidden content remains keyboard-reachable via expandable regions |

### The Key Rule

> **Fluidity may never alter meaning, semantics, or access paths. Only presentation and density may change.**

---

## Roadmap

### Phase 1: Manual Inputs (Complete)

- [x] Four-input capacity controls (cognitive, temporal, emotional, valence)
- [x] FieldManager with derived fields (energy, attention, valence) and temporal tracking
- [x] Mode derivation (Minimal, Calm, Focused, Exploratory)
- [x] Active token system (density, motion, contrast)
- [x] Future token foundations (guidance, choiceLoad -- derived, not yet consumed)
- [x] Motion tokens with system reduced-motion override
- [x] Demo components with real-time adaptation
- [x] Convention page example (AbyssCon)
- [x] SignalBus for inter-component communication
- [x] Typography utilities with modular scale

### Phase 2: Automatic Signals (Next)

- [ ] Scroll velocity detection
- [ ] Time-on-page tracking
- [ ] Interaction pattern analysis
- [ ] Passive capacity modulation without manual controls

### Phase 3: Extended Dimensions (Future)

- [ ] Arousal dimension (calm to activated)
- [ ] Multimodal feedback (haptics, sound)
- [ ] Proportional scaling systems (golden ratio integration)
- [ ] guidance and choiceLoad token consumption in components

---

## Intentionally Not Included

- No biometric or wearable integrations
- No emotional inference or profiling
- No AI-driven prediction systems
- No opinionated component library
- No universal claims about "natural law" or harmony

---

## License

MIT License. See [LICENSE.md](LICENSE.md) for details.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)
- Convention demo inspired by [Gachiakuta](https://en.wikipedia.org/wiki/Gachiakuta) by Kei Urana

---

**Harmonia UI** -- Interfaces that breathe with the user.
