# API Reference

This document describes the public API of Harmonia UI.

---

## Hooks

### `useCapacity()`

The primary hook for accessing capacity state and derived values.

```typescript
function useCapacity(): CapacityContextValue
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `capacity` | `CapacityField` | Current raw input values |
| `setCapacity` | `(capacity: CapacityField) => void` | Replace entire capacity state |
| `updateCapacity` | `(partial: Partial<CapacityField>) => void` | Update specific fields |
| `derivedFields` | `DerivedFields` | Computed aggregate values |
| `mode` | `InterfaceMode` | Current interface mode |
| `tokens` | `InterfaceModeTokens` | Design tokens for components |

#### Example

```tsx
import { useCapacity } from '@/lib/capacity-context'

function MyComponent() {
  const { tokens, mode, updateCapacity } = useCapacity()
  
  return (
    <div className={`density-${tokens.density}`}>
      <p>Current mode: {mode}</p>
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

```tsx
<CapacityProvider
  initialCapacity?: Partial<CapacityField>
  persistKey?: string
>
  {children}
</CapacityProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialCapacity` | `Partial<CapacityField>` | `DEFAULT_CAPACITY` | Override default values |
| `persistKey` | `string` | `undefined` | LocalStorage key for persistence |
| `children` | `ReactNode` | required | Child components |

#### Example

```tsx
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
```

---

### `<CapacityControls>`

A pre-built UI panel for adjusting capacity inputs.

```tsx
<CapacityControls
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  collapsible?: boolean
  defaultCollapsed?: boolean
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `'bottom-right'` | Panel position |
| `collapsible` | `boolean` | `true` | Allow collapsing |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed |

#### Example

```tsx
import { CapacityControls } from '@/components/capacity-controls'

function App() {
  return (
    <main>
      <Content />
      <CapacityControls position="bottom-right" />
    </main>
  )
}
```

---

### `<CapacityDemoCard>`

An example adaptive card component demonstrating token consumption.

```tsx
<CapacityDemoCard
  title: string
  description?: string
  features?: string[]
  cta?: string
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card title |
| `description` | `string` | `undefined` | Card description (hidden at low density) |
| `features` | `string[]` | `[]` | Feature list (hidden at low density) |
| `cta` | `string` | `'Explore'` | Call-to-action text |

#### Adaptation Behavior

| Token | Effect |
|-------|--------|
| `density: low` | Shows title + CTA only |
| `density: medium` | Shows title + description + CTA |
| `density: high` | Shows everything including features |
| `guidance: high` | Shows helper text |
| `motion: expressive` | Enables hover animations |

---

## Types

### `CapacityField`

The raw input model.

```typescript
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
```

### `DerivedFields`

Computed aggregate values.

```typescript
interface DerivedFields {
  /** Overall capacity (geometric mean) */
  energy: number
  
  /** Focus demand (inverse of temporal) */
  attention: number
  
  /** Emotional direction (pass-through) */
  valence: number
}
```

### `InterfaceMode`

Discrete interface states.

```typescript
type InterfaceMode = 'minimal' | 'focused' | 'exploratory'
```

### `InterfaceModeTokens`

Design tokens consumed by components.

```typescript
interface InterfaceModeTokens {
  /** Visual density */
  density: 'low' | 'medium' | 'high'
  
  /** Scaffolding level */
  guidance: 'low' | 'medium' | 'high'
  
  /** Animation intensity */
  motion: 'subtle' | 'expressive'
  
  /** Text/background contrast */
  contrast: 'standard' | 'boosted'
  
  /** Options visibility */
  choices: 'minimal' | 'normal'
}
```

---

## Constants

### `DEFAULT_CAPACITY`

```typescript
const DEFAULT_CAPACITY: CapacityField = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7,
  valence: 0.3
}
```

### `MODE_THRESHOLDS`

```typescript
const MODE_THRESHOLDS = {
  minimal: {
    energy: 0.2,
    cognitive: 0.3,
    temporal: 0.3
  },
  exploratory: {
    energy: 0.7,
    emotional: 0.5,
    valence: 0
  }
}
```

### `TOKEN_THRESHOLDS`

```typescript
const TOKEN_THRESHOLDS = {
  density: {
    low: 0.35,
    high: 0.75
  },
  guidance: {
    high: 0.3,
    low: 0.7
  },
  motion: {
    subtle: 0.35
  },
  contrast: {
    boosted: -0.25
  },
  choices: {
    minimal: 0.35
  }
}
```

---

## Utility Functions

### `deriveFields(capacity)`

Compute derived fields from raw capacity.

```typescript
function deriveFields(capacity: CapacityField): DerivedFields
```

### `deriveMode(fields, capacity)`

Compute interface mode from derived fields and capacity.

```typescript
function deriveMode(fields: DerivedFields, capacity: CapacityField): InterfaceMode
```

### `deriveTokens(capacity, valence)`

Compute design tokens from capacity and valence.

```typescript
function deriveTokens(capacity: CapacityField, valence: number): InterfaceModeTokens
```

### `getToneMessage(mode, valence)`

Get the appropriate tone message for current state.

```typescript
function getToneMessage(mode: InterfaceMode, valence: number): string

// Returns:
// mode === 'minimal' && valence < 0 → "Take your time."
// mode === 'exploratory' && valence > 0.25 → "You're doing great!"
// default → "Here's how it works:"
```

---

## CSS Classes

Harmonia UI provides CSS classes that map to token values:

### Density Classes

```css
.density-low {
  /* Reduced information density */
}

.density-medium {
  /* Balanced density */
}

.density-high {
  /* Full information density */
}
```

### Motion Classes

```css
.motion-subtle {
  /* Minimal transitions */
  --transition-duration: 150ms;
}

.motion-expressive {
  /* Playful animations */
  --transition-duration: 300ms;
}
```

### Contrast Classes

```css
.contrast-standard {
  /* Normal contrast */
}

.contrast-boosted {
  /* Enhanced contrast for accessibility */
}
```

---

## Events

The capacity system doesn't emit events directly, but you can observe changes using React's useEffect:

```typescript
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
```

---

## Error Handling

### Invalid Capacity Values

The system clamps values to valid ranges:

```typescript
function validateCapacity(capacity: CapacityField): CapacityField {
  return {
    cognitive: Math.max(0, Math.min(1, capacity.cognitive)),
    temporal: Math.max(0, Math.min(1, capacity.temporal)),
    emotional: Math.max(0, Math.min(1, capacity.emotional)),
    valence: Math.max(-1, Math.min(1, capacity.valence))
  }
}
```

### Missing Provider

Using `useCapacity()` outside of `CapacityProvider` throws:

```typescript
const context = useContext(CapacityContext)
if (!context) {
  throw new Error('useCapacity must be used within a CapacityProvider')
}
```
