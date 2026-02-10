# API Reference

This document describes the public API of Harmonia UI.

---

## Hooks

### `useCapacity()`

The primary hook for accessing capacity state and derived values.

\`\`\`typescript
function useCapacity(): CapacityContextValue
\`\`\`

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `capacity` | `CapacityField` | Current raw input values |
| `setCapacity` | `(capacity: CapacityField) => void` | Replace entire capacity state |
| `updateCapacity` | `(partial: Partial<CapacityField>) => void` | Update specific fields |
| `derivedFields` | `DerivedFields` | Computed aggregate values |
| `mode` | `InterfaceMode` | Current interface mode tokens (density, motion, contrast, etc.) |
| `modeLabel` | `InterfaceModeLabel` | Human-readable label: Minimal, Calm, Focused, or Exploratory |
| `tokens` | `InterfaceModeTokens` | Design tokens for components |

#### Example

```tsx
import { useCapacity } from '@/lib/capacity-context'

function MyComponent() {
  const { tokens, modeLabel, updateCapacity } = useCapacity()
  
  return (
    <div className={`density-${tokens.density}`}>
      {/* modeLabel is one of: 'Minimal' | 'Calm' | 'Focused' | 'Exploratory' */}
      <p>Current mode: {modeLabel}</p>
      <button onClick={() => updateCapacity({ cognitive: 0.5 })}>
        Set cognitive to 50%
      </button>
    </div>
  )
}
```

---

## Components

### `<CapacityProvider>`

Wraps your application and provides capacity context to all children.

\`\`\`tsx
<CapacityProvider
  initialCapacity?: Partial<CapacityField>
  persistKey?: string
>
  {children}
</CapacityProvider>
\`\`\`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialCapacity` | `Partial<CapacityField>` | `DEFAULT_CAPACITY` | Override default values |
| `persistKey` | `string` | `undefined` | LocalStorage key for persistence |
| `children` | `ReactNode` | required | Child components |

#### Example

\`\`\`tsx
// app/layout.tsx
import { CapacityProvider } from '@/lib/capacity-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CapacityProvider 
          initialCapacity={{ cognitive: 0.8 }}
          persistKey="harmonia-capacity"
        >
          {children}
        </CapacityProvider>
      </body>
    </html>
  )
}
\`\`\`

---

### `<CapacityControls>`

A pre-built UI panel for adjusting capacity inputs.

\`\`\`tsx
<CapacityControls
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  collapsible?: boolean
  defaultCollapsed?: boolean
/>
\`\`\`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `'bottom-right'` | Panel position |
| `collapsible` | `boolean` | `true` | Allow collapsing |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed |

#### Example

\`\`\`tsx
import { CapacityControls } from '@/components/capacity-controls'

function App() {
  return (
    <main>
      <Content />
      <CapacityControls position="bottom-right" />
    </main>
  )
}
\`\`\`

---

### `<CapacityDemoCard>`

An example adaptive card component demonstrating token consumption.

\`\`\`tsx
<CapacityDemoCard
  title: string
  description?: string
  features?: string[]
  cta?: string
/>
\`\`\`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card title |
| `description` | `string` | `undefined` | Card description (hidden at low density) |
| `features` | `string[]` | `[]` | Feature list (hidden at low density) |
| `cta` | `string` | `'Explore'` | Call-to-action text |

#### Adaptation Behavior

| Token | Effect | Status |
|-------|--------|--------|
| `density: low` | Shows title + CTA only | Active |
| `density: medium` | Shows title + description + CTA | Active |
| `density: high` | Shows everything including features | Active |
| `motion: expressive` | Enables hover animations | Active |
| `guidance: high` | Shows helper text | Future (not yet consumed) |

---

## Types

### `CapacityField`

The raw input model.

\`\`\`typescript
interface CapacityField {
  /** Mental bandwidth available (0-1) */
  cognitive: number
  
  /** Time/effort budget (0-1) */
  temporal: number
  
  /** Load tolerance/resilience (0-1) */
  emotional: number
  
  /** Emotional direction (-1 to +1) */
  valence: number
}
\`\`\`

### `DerivedFields`

Computed aggregate values.

\`\`\`typescript
interface DerivedFields {
  /** Overall capacity (geometric mean) */
  energy: number
  
  /** Focus demand (inverse of temporal) */
  attention: number
  
  /** Emotional direction (pass-through) */
  valence: number
}
\`\`\`

### `InterfaceModeLabel`

Human-readable mode labels for UI display. Derived from **raw** `CapacityField` inputs (not from `InterfaceMode` tokens), because states like Neutral and Focused can produce the same token set but should have different labels.

```typescript
type InterfaceModeLabel = 'Calm' | 'Focused' | 'Exploratory' | 'Minimal'
```

#### Derivation Rules

Labels are checked in this order -- the first match wins:

| Label | Trigger | Description |
|-------|---------|-------------|
| **Exploratory** | `cognitive > 0.65` AND `emotional > 0.65` | High capacity, full features, playful |
| **Minimal** | `cognitive < 0.35` AND `temporal < 0.35` | Very low capacity, protective mode |
| **Focused** | `cognitive >= 0.6` AND `temporal >= 0.6` | Good capacity, task-oriented |
| **Calm** | Fallthrough (none of the above match) | Gentle, balanced, no pressure |

#### Preset-to-Label Mapping

| Preset | Cognitive | Temporal | Emotional | Label |
|--------|-----------|----------|-----------|-------|
| Exhausted | 0.2 | 0.2 | 0.1 | Minimal |
| Overwhelmed | 0.3 | 0.25 | 0.2 | Minimal |
| Distracted | 0.4 | 0.3 | 0.6 | Calm |
| Neutral | 0.5 | 0.5 | 0.5 | Calm |
| Focused | 0.7 | 0.7 | 0.6 | Focused |
| Energized | 0.9 | 0.8 | 0.9 | Exploratory |
| Exploring | 0.85 | 0.7 | 0.8 | Exploratory |

#### Badge Colors

Each label has a distinct badge color for visual identification:

| Label | Color | Value |
|-------|-------|-------|
| Calm | Soft blue | `oklch(0.65 0.15 220)` |
| Focused | Primary rust | `oklch(0.68 0.16 45)` |
| Exploratory | Toxic green | `oklch(0.65 0.2 135)` |
| Minimal | Muted purple | `oklch(0.55 0.1 280)` |

### `InterfaceMode`

The complete token set derived from `CapacityField`. Contains both active and future tokens.

```typescript
interface InterfaceMode {
  // Active tokens — consumed by components, mapped to CSS
  
  /** Visual density (from cognitive) */
  density: 'low' | 'medium' | 'high'
  
  /** Animation intensity (from emotional + valence) */
  motion: 'off' | 'subtle' | 'expressive'
  
  /** Text/background contrast (from valence) */
  contrast: 'standard' | 'boosted'
  
  // Derived tokens — computed but not yet consumed by components or CSS
  
  /** Scaffolding level (from cognitive + temporal) */
  guidance: 'low' | 'medium' | 'high'
  
  /** Options visibility (from temporal) */
  choiceLoad: 'minimal' | 'normal'
}
```

> **Note:** `guidance` and `choiceLoad` are derived in `mode.ts` and included in the TypeScript interface, but no built-in component currently reads them and they have no CSS custom property equivalents. They are available for custom component development.

---

## Constants

### `DEFAULT_CAPACITY`

\`\`\`typescript
const DEFAULT_CAPACITY: CapacityField = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7,
  valence: 0.3
}
\`\`\`

### `MODE_THRESHOLDS`

\`\`\`typescript
const MODE_THRESHOLDS = {
  exploratory: {
    cognitive: 0.65,   // Must exceed
    emotional: 0.65    // Must exceed
  },
  minimal: {
    cognitive: 0.35,   // Must be below
    temporal: 0.35     // Must be below
  },
  focused: {
    cognitive: 0.6,    // Must meet or exceed
    temporal: 0.6      // Must meet or exceed
  }
  // Calm: fallthrough when none of the above match
}
\`\`\`

### `TOKEN_THRESHOLDS`

```typescript
const TOKEN_THRESHOLDS = {
  // Active tokens (consumed by components)
  density: {                // Source: cognitive
    low: 0.35,
    high: 0.75
  },
  motion: {                 // Source: emotional
    subtle: 0.35
  },
  contrast: {               // Source: valence
    boosted: -0.25
  },
  
  // Derived tokens (not yet consumed by components or CSS)
  guidance: {               // Source: cognitive, temporal
    high: 0.35,             // cognitive < 0.35 → 'high'
    medium: 0.35            // temporal < 0.35 → 'medium' (fallback)
  },
  choiceLoad: {             // Source: temporal
    minimal: 0.35
  }
}
```

---

## Utility Functions

### `deriveFields(capacity)`

Compute derived fields from raw capacity.

\`\`\`typescript
function deriveFields(capacity: CapacityField): DerivedFields
\`\`\`

### `deriveMode(field)`

Compute interface mode tokens from capacity field.

```typescript
function deriveMode(field: CapacityField): InterfaceMode
```

### `deriveModeLabel(inputs)`

Derive a human-readable mode label from raw capacity inputs. Uses raw values (not derived tokens) because states like Neutral and Focused can produce the same `InterfaceMode` but should have different labels.

```typescript
function deriveModeLabel(inputs: CapacityField): InterfaceModeLabel
```

### `getModeBadgeColor(label)`

Get the OKLCH color string for a mode label badge.

```typescript
function getModeBadgeColor(label: InterfaceModeLabel): string

// Returns:
// 'Calm'        → 'oklch(0.65 0.15 220)' (soft blue)
// 'Focused'     → 'oklch(0.68 0.16 45)'  (primary rust)
// 'Exploratory' → 'oklch(0.65 0.2 135)'  (toxic green)
// 'Minimal'     → 'oklch(0.55 0.1 280)'  (muted purple)
```

### `getToneMessage(mode, valence)`

Get the appropriate tone message for current state.

```typescript
function getToneMessage(mode: InterfaceModeLabel, valence: number): string

// Returns:
// mode === 'Minimal' && valence < 0 → "Take your time."
// mode === 'Calm'                   → "Take it easy."
// mode === 'Focused'                → "Here's how it works:"
// mode === 'Exploratory' && valence > 0.25 → "You're doing great!"
// default → "Here's how it works:"
```

---

## CSS Classes

Harmonia UI provides CSS classes that map to the three **active** token values (`density`, `motion`, `contrast`). The `guidance` and `choiceLoad` tokens have no CSS equivalents — they are TypeScript-only and available for future component logic.

### Density Classes

\`\`\`css
.density-low {
  /* Reduced information density */
}

.density-medium {
  /* Balanced density */
}

.density-high {
  /* Full information density */
}
\`\`\`

### Motion Classes

\`\`\`css
.motion-subtle {
  /* Minimal transitions */
  --transition-duration: 150ms;
}

.motion-expressive {
  /* Playful animations */
  --transition-duration: 300ms;
}
\`\`\`

### Contrast Classes

\`\`\`css
.contrast-standard {
  /* Normal contrast */
}

.contrast-boosted {
  /* Enhanced contrast for accessibility */
}
\`\`\`

---

## Events

The capacity system doesn't emit events directly, but you can observe changes using React's useEffect:

\`\`\`typescript
function useCapacityChange(callback: (capacity: CapacityField) => void) {
  const { capacity } = useCapacity()
  
  useEffect(() => {
    callback(capacity)
  }, [capacity, callback])
}

// Usage
useCapacityChange((capacity) => {
  analytics.track('capacity_changed', capacity)
})
\`\`\`

---

## Error Handling

### Invalid Capacity Values

The system clamps values to valid ranges:

\`\`\`typescript
function validateCapacity(capacity: CapacityField): CapacityField {
  return {
    cognitive: Math.max(0, Math.min(1, capacity.cognitive)),
    temporal: Math.max(0, Math.min(1, capacity.temporal)),
    emotional: Math.max(0, Math.min(1, capacity.emotional)),
    valence: Math.max(-1, Math.min(1, capacity.valence))
  }
}
\`\`\`

### Missing Provider

Using `useCapacity()` outside of `CapacityProvider` throws:

\`\`\`typescript
const context = useContext(CapacityContext)
if (!context) {
  throw new Error('useCapacity must be used within a CapacityProvider')
}
\`\`\`
