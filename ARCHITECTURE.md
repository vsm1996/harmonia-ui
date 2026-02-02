# Architecture

This document describes the technical architecture of Harmonia UI.

## Overview

Harmonia UI follows a unidirectional data flow pattern:

\`\`\`
User Inputs → CapacityField → Derived Fields → InterfaceMode → Tokens → Components
\`\`\`

Each layer transforms data for the next, maintaining clear boundaries and predictable behavior.

---

## Layer 1: CapacityField (Raw Inputs)

The CapacityField represents the user's current state through four dimensions:

\`\`\`typescript
interface CapacityField {
  cognitive: number   // 0-1: Mental bandwidth available
  temporal: number    // 0-1: Time/effort budget
  emotional: number   // 0-1: Load tolerance
  valence: number     // -1 to +1: Emotional direction
}
\`\`\`

### Input Semantics

| Input | Low (0) | Mid (0.5) | High (1) |
|-------|---------|-----------|----------|
| Cognitive | Overwhelmed, foggy | Normal attention | Sharp, focused |
| Temporal | Rushed, no time | Moderate pace | Leisurely, exploratory |
| Emotional | Fragile, stressed | Stable | Resilient, robust |
| Valence | Distressed, negative | Neutral | Upbeat, positive |

### Default Values

\`\`\`typescript
const DEFAULT_CAPACITY: CapacityField = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7,
  valence: 0.3
}
\`\`\`

---

## Layer 2: Derived Fields

Derived fields are computed from raw inputs to provide higher-level signals:

\`\`\`typescript
interface DerivedFields {
  energy: number      // 0-1: Overall capacity
  attention: number   // 0-1: Focus demand
  valence: number     // -1 to +1: Pass-through
}
\`\`\`

### Derivation Formulas

\`\`\`typescript
// Energy: Geometric mean of capacity inputs
const energy = Math.pow(
  cognitive * temporal * emotional, 
  1/3
)

// Attention: Inverse of temporal (low time = high attention demand)
const attention = 1 - (temporal * 0.5)

// Valence: Direct pass-through
const valence = capacityField.valence
\`\`\`

---

## Layer 3: InterfaceMode

The InterfaceMode is a discrete state derived from the continuous field values:

\`\`\`typescript
type InterfaceMode = 'minimal' | 'focused' | 'exploratory'
\`\`\`

### Mode Derivation Logic

\`\`\`typescript
function deriveMode(fields: DerivedFields, capacity: CapacityField): InterfaceMode {
  const { energy } = fields
  const { cognitive, temporal, emotional, valence } = capacity
  
  // Minimal: User is struggling
  if (energy < 0.2) return 'minimal'
  if (cognitive < 0.3 && temporal < 0.3) return 'minimal'
  
  // Exploratory: User is thriving
  if (energy >= 0.7 && emotional > 0.5 && valence > 0) return 'exploratory'
  
  // Focused: Default working state
  return 'focused'
}
\`\`\`

### Mode Characteristics

| Mode | Energy | Cognitive | Emotional | Valence | Behavior |
|------|--------|-----------|-----------|---------|----------|
| Minimal | < 0.2 | any | any | any | Protective, essential only |
| Minimal | any | < 0.3 | any | any | Protective (with low temporal) |
| Focused | 0.2–0.7 | any | any | any | Balanced, task-oriented |
| Exploratory | ≥ 0.7 | any | > 0.5 | > 0 | Full features, playful |

---

## Layer 4: Design Tokens

Tokens are the bridge between mode and components. They provide semantic values that components consume:

\`\`\`typescript
interface InterfaceModeTokens {
  density: 'low' | 'medium' | 'high'
  guidance: 'low' | 'medium' | 'high'
  motion: 'subtle' | 'expressive'
  contrast: 'standard' | 'boosted'
  choices: 'minimal' | 'normal'
}
\`\`\`

### Token Derivation

\`\`\`typescript
function deriveTokens(capacity: CapacityField, valence: number): InterfaceModeTokens {
  return {
    // Density from cognitive
    density: capacity.cognitive < 0.35 ? 'low' 
           : capacity.cognitive > 0.75 ? 'high' 
           : 'medium',
    
    // Guidance from energy (inverse)
    guidance: energy < 0.3 ? 'high' 
            : energy > 0.7 ? 'low' 
            : 'medium',
    
    // Motion from emotional + valence
    motion: capacity.emotional < 0.35 ? 'subtle'
          : valence > 0.25 ? 'expressive'
          : 'subtle',
    
    // Contrast from valence (boost when negative)
    contrast: valence < -0.25 ? 'boosted' : 'standard',
    
    // Choices from temporal
    choices: capacity.temporal < 0.35 ? 'minimal' : 'normal'
  }
}
\`\`\`

### Token-to-CSS Mapping

\`\`\`css
/* Density */
.density-low { --items-visible: 3; --grid-cols: 1; }
.density-medium { --items-visible: 6; --grid-cols: 2; }
.density-high { --items-visible: all; --grid-cols: 3; }

/* Motion */
.motion-subtle { --transition-duration: 150ms; --animation: none; }
.motion-expressive { --transition-duration: 300ms; --animation: bounce; }

/* Contrast */
.contrast-standard { --text-opacity: 0.9; }
.contrast-boosted { --text-opacity: 1; --font-weight: 500; }
\`\`\`

---

## Layer 5: Components

Components consume tokens and render accordingly. They never read raw capacity values.

### Component Pattern

\`\`\`tsx
function AdaptiveComponent() {
  const { tokens, mode } = useCapacity()
  
  // Use tokens for styling decisions
  const gridCols = {
    low: 1,
    medium: 2,
    high: 3
  }[tokens.density]
  
  // Use mode for behavioral decisions
  const showAdvancedFeatures = mode === 'exploratory'
  
  return (
    <div style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
      {/* Content */}
    </div>
  )
}
\`\`\`

### What Components Should Do

| Token | Component Response |
|-------|-------------------|
| `density: low` | Show fewer items, larger touch targets, more whitespace |
| `density: high` | Show all items, dense grid, full information |
| `guidance: high` | Show helper text, labels, tooltips |
| `guidance: low` | Hide scaffolding, trust user knowledge |
| `motion: subtle` | Minimal transitions, no decorative animation |
| `motion: expressive` | Playful micro-interactions, spring physics |
| `contrast: boosted` | Higher text contrast, bolder weights |
| `choices: minimal` | Reduce options, smart defaults, progressive disclosure |

---

## Data Flow Example

\`\`\`
User drags cognitive slider to 0.2
    │
    ▼
CapacityField updates: { cognitive: 0.2, temporal: 0.7, emotional: 0.7, valence: 0.3 }
    │
    ▼
Derived fields compute: { energy: 0.42, attention: 0.65, valence: 0.3 }
    │
    ▼
Mode derives: 'focused' (energy >= 0.2, not exploratory conditions)
    │
    ▼
Tokens derive: { density: 'low', guidance: 'medium', motion: 'subtle', ... }
    │
    ▼
Components re-render with new tokens
    │
    ▼
Grid shows 1 column, descriptions hidden, helper text appears
\`\`\`

---

## State Management

### Context Structure

\`\`\`typescript
interface CapacityContextValue {
  // Raw inputs
  capacity: CapacityField
  setCapacity: (capacity: CapacityField) => void
  
  // Derived values
  derivedFields: DerivedFields
  mode: InterfaceMode
  tokens: InterfaceModeTokens
  
  // Convenience
  updateCapacity: (partial: Partial<CapacityField>) => void
}
\`\`\`

### Provider Implementation

\`\`\`tsx
function CapacityProvider({ children }) {
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY)
  
  // Derive everything from capacity
  const derivedFields = useMemo(() => deriveFields(capacity), [capacity])
  const mode = useMemo(() => deriveMode(derivedFields, capacity), [derivedFields, capacity])
  const tokens = useMemo(() => deriveTokens(capacity, derivedFields.valence), [capacity, derivedFields])
  
  const value = useMemo(() => ({
    capacity,
    setCapacity,
    derivedFields,
    mode,
    tokens,
    updateCapacity: (partial) => setCapacity(prev => ({ ...prev, ...partial }))
  }), [capacity, derivedFields, mode, tokens])
  
  return (
    <CapacityContext.Provider value={value}>
      {children}
    </CapacityContext.Provider>
  )
}
\`\`\`

---

## Why This Architecture?

### 1. Separation of Concerns

Each layer has one job:
- CapacityField: Represent user state
- Derived Fields: Compute aggregate signals
- Mode: Classify into discrete states
- Tokens: Provide component-friendly values
- Components: Render based on tokens

### 2. Testability

Each layer can be tested independently:

\`\`\`typescript
// Test mode derivation
expect(deriveMode({ energy: 0.1 }, capacity)).toBe('minimal')
expect(deriveMode({ energy: 0.5 }, capacity)).toBe('focused')

// Test token derivation
expect(deriveTokens({ cognitive: 0.2 }).density).toBe('low')
\`\`\`

### 3. Predictability

Components never access raw values, so behavior is deterministic:
- Same tokens → Same rendering
- No hidden dependencies
- Easy to debug

### 4. Extensibility

New dimensions can be added without changing existing code:
- Add new field to CapacityField
- Add derivation logic
- Add new token if needed
- Components opt-in to new token

---

## Performance Considerations

### Memoization

All derivations are memoized to prevent unnecessary recalculation:

\`\`\`typescript
const derivedFields = useMemo(() => deriveFields(capacity), [capacity])
const mode = useMemo(() => deriveMode(derivedFields, capacity), [derivedFields, capacity])
const tokens = useMemo(() => deriveTokens(capacity, derivedFields.valence), [capacity, derivedFields])
\`\`\`

### Selective Re-rendering

Components only re-render when their consumed tokens change:

\`\`\`typescript
// This component only re-renders when density changes
function DensityAwareGrid({ children }) {
  const { tokens } = useCapacity()
  
  // If only valence changes, this won't re-render
  return <div className={`grid-${tokens.density}`}>{children}</div>
}
\`\`\`

### CSS Variables

Token values are mapped to CSS variables to minimize JavaScript involvement:

\`\`\`typescript
useEffect(() => {
  document.documentElement.style.setProperty('--density', tokens.density)
  document.documentElement.style.setProperty('--motion', tokens.motion)
}, [tokens])
\`\`\`

---

## Future Considerations

### Automatic Signal Integration (Phase 2)

\`\`\`typescript
interface AutomaticSignals {
  scrollVelocity: number      // Derived from scroll events
  timeOnPage: number          // Time since page load
  interactionRate: number     // Clicks/taps per minute
  idleTime: number            // Time since last interaction
}

// Automatic signals modulate capacity over time
function modulateCapacity(
  capacity: CapacityField, 
  signals: AutomaticSignals
): CapacityField {
  return {
    ...capacity,
    temporal: capacity.temporal * (1 - signals.scrollVelocity * 0.1),
    cognitive: capacity.cognitive * (1 - signals.idleTime * 0.01)
  }
}
\`\`\`

### Arousal Dimension (Phase 3)

\`\`\`typescript
interface ExtendedCapacityField extends CapacityField {
  arousal: number  // 0-1: Calm to activated
}

// Arousal affects motion and pacing
const motion = arousal > 0.7 ? 'energetic' : arousal < 0.3 ? 'calm' : 'subtle'
\`\`\`
