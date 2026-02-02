# Harmonia UI

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://harmonia-ui.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-90.5%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE.md)

**A capacity-adaptive UI framework that treats human state as a first-class input.**

[Live Demo](https://harmonia-ui.vercel.app) · [Convention Example](https://harmonia-ui.vercel.app/convention) · [Report Bug](https://github.com/vsm1996/harmonia-ui/issues)

---

## What is Harmonia UI?

Harmonia UI is a framework for building interfaces that adapt to a user's current cognitive, temporal, and emotional capacity. Instead of inferring or profiling users, Harmonia uses explicit inputs to derive coherent interface modes that affect layout density, content length, motion, and tone.

**The core insight:** Users don't always have the same capacity. Sometimes you're focused and energized; sometimes you're exhausted and overwhelmed. Interfaces should respond to this reality.

\`\`\`
CapacityField (4 inputs) → InterfaceMode → Tokens → Components
\`\`\`

Raw inputs are never mapped directly to styles. Inputs derive modes; modes produce tokens; components consume tokens. This separation keeps adaptation consistent, predictable, and maintainable.

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
- [Contributing](#contributing)
- [License](#license)

---

## Core Concepts

### The CapacityField

The CapacityField is the canonical input model — four dimensions that describe a user's current state:

| Input | Range | Controls | Description |
|-------|-------|----------|-------------|
| **Cognitive** | 0–1 | Density | Mental bandwidth available. Low = overwhelmed, high = sharp. |
| **Temporal** | 0–1 | Choices | Time/effort budget. Low = rushed, high = leisurely. |
| **Emotional** | 0–1 | Motion | Load tolerance/resilience. Low = fragile, high = robust. |
| **Valence** | -1 to +1 | Tone | Emotional direction. Negative = distressed, positive = upbeat. |

### Derived Fields

From the four inputs, three derived fields are computed:

| Field | Formula | Purpose |
|-------|---------|---------|
| **Energy** | Geometric mean of cognitive, temporal, emotional | Overall capacity level |
| **Attention** | Inverse of temporal pressure | Focus demand on the system |
| **Valence** | Pass-through | Emotional direction for tone |

### Interface Modes

The derived fields produce one of three interface modes:

| Mode | Trigger | Characteristics |
|------|---------|-----------------|
| **Minimal** | Energy < 0.2 OR (cognitive < 0.3 AND temporal < 0.3) | Stripped to essentials, high guidance, boosted contrast |
| **Focused** | 0.2 ≤ Energy < 0.7 | Balanced density, medium guidance, subtle motion |
| **Exploratory** | Energy ≥ 0.7 AND emotional > 0.5 AND valence > 0 | Full features, low guidance, expressive motion |

---

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        CapacityProvider                         │
│  ┌───────────────┐    ┌───────────────┐    ┌────────────────┐  │
│  │ CapacityField │ -> │ InterfaceMode │ -> │ Design Tokens  │  │
│  │ (4 inputs)    │    │ (derived)     │    │ (consumed)     │  │
│  └───────────────┘    └───────────────┘    └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Components                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Cards    │  │ Grids    │  │ Heroes   │  │ Event Cards  │   │
│  │          │  │          │  │          │  │              │   │
│  │ Reads:   │  │ Reads:   │  │ Reads:   │  │ Reads:       │   │
│  │ density  │  │ density  │  │ density  │  │ density      │   │
│  │ guidance │  │ choices  │  │ motion   │  │ guidance     │   │
│  │ motion   │  │          │  │ contrast │  │ motion       │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Key Files

| File | Purpose |
|------|---------|
| `lib/capacity-context.tsx` | CapacityProvider, field derivation, mode computation |
| `lib/capacity-types.ts` | TypeScript interfaces for CapacityField, InterfaceMode, tokens |
| `components/capacity-controls.tsx` | UI panel for manual capacity adjustment |
| `components/capacity-demo-card.tsx` | Example adaptive component |

---

## Derivation Rules

The following rules transform raw inputs into interface tokens:

### Density (from Cognitive)

\`\`\`typescript
if (cognitive < 0.35) return 'low'
if (cognitive > 0.75) return 'high'
return 'medium'
\`\`\`

### Choices (from Temporal)

\`\`\`typescript
if (temporal < 0.35) return 'minimal'
return 'normal'
\`\`\`

### Motion (from Emotional + Valence)

\`\`\`typescript
if (emotional < 0.35) return 'subtle'
if (valence > 0.25) return 'expressive'
return 'subtle'
\`\`\`

### Contrast (from Valence)

\`\`\`typescript
if (valence < -0.25) return 'boosted'
return 'standard'
\`\`\`

### Guidance (from Energy)

\`\`\`typescript
if (energy < 0.3) return 'high'
if (energy > 0.7) return 'low'
return 'medium'
\`\`\`

---

## Interface Modes

### Minimal Mode

**When:** User is overwhelmed, exhausted, or in distress.

| Token | Value | Effect |
|-------|-------|--------|
| density | low | Fewer items visible |
| guidance | high | More labels, helper text |
| motion | subtle | No surprises |
| contrast | boosted | Higher accessibility |
| choices | minimal | Reduced options, smart defaults |

**Tone message:** "Take your time."

### Focused Mode

**When:** User has moderate capacity, working on a task.

| Token | Value | Effect |
|-------|-------|--------|
| density | medium | Balanced information |
| guidance | medium | Some assistance |
| motion | subtle | Calm animations |
| contrast | standard | Normal contrast |
| choices | normal | Full options available |

**Tone message:** "Here's how it works:"

### Exploratory Mode

**When:** User is energized, curious, and positive.

| Token | Value | Effect |
|-------|-------|--------|
| density | high | Full feature display |
| guidance | low | User knows what they're doing |
| motion | expressive | Playful micro-interactions |
| contrast | standard | Normal contrast |
| choices | normal | All options visible |

**Tone message:** "You're doing great!"

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/vsm1996/harmonia-ui.git
cd harmonia-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Build for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

---

## Project Structure

\`\`\`
harmonia-ui/
├── app/
│   ├── page.tsx              # Homepage with live demo
│   ├── convention/
│   │   └── page.tsx          # AbyssCon example page
│   └── layout.tsx            # Root layout with CapacityProvider
├── components/
│   ├── capacity-controls.tsx # Slider panel for adjusting inputs
│   ├── capacity-demo-card.tsx# Example adaptive card
│   ├── mode-derivation.tsx   # Visualization of the pipeline
│   └── convention/           # Convention-specific components
│       ├── hero.tsx
│       ├── events.tsx
│       ├── guests.tsx
│       └── tickets.tsx
├── lib/
│   ├── capacity-context.tsx  # React context and derivation logic
│   └── capacity-types.ts     # TypeScript definitions
├── styles/
│   └── globals.css           # Global styles and CSS variables
└── public/
    └── images/               # Static assets
\`\`\`

---

## Usage Examples

### Wrapping Your App

\`\`\`tsx
// app/layout.tsx
import { CapacityProvider } from '@/lib/capacity-context'

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
\`\`\`

### Consuming Capacity in a Component

\`\`\`tsx
import { useCapacity } from '@/lib/capacity-context'

function AdaptiveCard({ title, description, features }) {
  const { mode, tokens } = useCapacity()
  
  return (
    <div className={`card density-${tokens.density}`}>
      <h2>{title}</h2>
      
      {/* Show description only if density allows */}
      {tokens.density !== 'low' && <p>{description}</p>}
      
      {/* Show features based on density */}
      {tokens.density === 'high' && (
        <ul>
          {features.map(f => <li key={f}>{f}</li>)}
        </ul>
      )}
      
      {/* Adaptive CTA based on temporal capacity */}
      <button>
        {tokens.choices === 'minimal' ? 'Go' : 'Explore Options'}
      </button>
      
      {/* Guidance text for struggling users */}
      {tokens.guidance === 'high' && (
        <p className="helper">Take your time. No rush.</p>
      )}
    </div>
  )
}
\`\`\`

### Responding to Mode Changes

\`\`\`tsx
import { useCapacity } from '@/lib/capacity-context'

function EventGrid({ events }) {
  const { tokens } = useCapacity()
  
  // Adjust grid columns based on density
  const columns = {
    low: 1,
    medium: 2,
    high: 3
  }[tokens.density]
  
  // Limit visible items at low capacity
  const visibleEvents = tokens.density === 'low' 
    ? events.slice(0, 3) 
    : events
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)` 
    }}>
      {visibleEvents.map(event => (
        <EventCard 
          key={event.id} 
          event={event}
          showDetails={tokens.density !== 'low'}
        />
      ))}
    </div>
  )
}
\`\`\`

---

## Design Principles

### 1. Inputs Over Inference

Human state is provided explicitly, not guessed or extracted. No biometrics, no tracking, no profiling. Users control their own capacity declaration.

### 2. Capacity, Not Preference

The system adapts to what a user *can handle*, not what they "like." This is about cognitive ergonomics, not personalization.

### 3. Field → Mode → Tokens → Components

Raw inputs are never mapped directly to styles. The abstraction layers ensure consistency:
- **Fields** are raw user inputs
- **Modes** are derived states (Minimal, Focused, Exploratory)
- **Tokens** are design primitives (density: low/medium/high)
- **Components** consume tokens, never raw fields

### 4. Distributed, Local Adaptation

Components respond to shared context without relying on global god-state. Each component makes local decisions based on tokens.

### 5. Accessibility as a Constraint

Semantic structure, keyboard navigation, contrast, and motion preferences are never compromised by adaptation. WCAG compliance is the floor, not the ceiling.

### 6. Identity is Stable, Expression Adapts

Font families, semantics, and meaning remain fixed. Only density, spacing, motion, and emphasis change. The content is the same — the presentation adapts.

---

## Accessibility

Harmonia UI is built with accessibility as a core constraint:

| Concern | Approach |
|---------|----------|
| **Semantic HTML** | All components use proper heading hierarchy, landmarks, and ARIA roles |
| **Keyboard Navigation** | Tab order follows DOM order; focus states are always visible |
| **Motion** | Respects `prefers-reduced-motion`; motion scales down before turning off |
| **Contrast** | Boosted contrast at low capacity/negative valence; WCAG AA minimum always |
| **Screen Readers** | Mode changes announced via `aria-live` regions; no meaning-critical animations |
| **Progressive Disclosure** | Hidden content remains keyboard-reachable via expandable regions |

### The Key Rule

> **Fluidity may never alter meaning, semantics, or access paths. Only presentation and density may change.**

---

## Roadmap

### Phase 1: Manual Inputs ✅

- [x] Four-input capacity controls (cognitive, temporal, emotional, valence)
- [x] Mode derivation (Minimal, Focused, Exploratory)
- [x] Token system (density, guidance, motion, contrast, choices)
- [x] Demo components with real-time adaptation
- [x] Convention page example

### Phase 2: Automatic Signals (Next)

- [ ] Scroll velocity detection
- [ ] Time-on-page tracking
- [ ] Interaction pattern analysis
- [ ] Passive capacity modulation without manual controls

### Phase 3: Extended Dimensions (Future)

- [ ] Arousal dimension (calm ↔ activated)
- [ ] Multimodal feedback (haptics, sound)
- [ ] Proportional scaling systems (golden ratio integration)

---

## Intentionally Not Included

- ❌ No biometric or wearable integrations
- ❌ No emotional inference or profiling
- ❌ No AI-driven prediction systems
- ❌ No opinionated component library
- ❌ No universal claims about "natural law" or harmony

---

## License

MIT License. See [LICENSE.md](LICENSE.md) for details.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)
- Convention demo inspired by [Gachiakuta](https://en.wikipedia.org/wiki/Gachiakuta) by Kei Urana

---

**Harmonia UI** — Interfaces that breathe with the user.
