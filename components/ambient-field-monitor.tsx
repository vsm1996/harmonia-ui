/**
 * Ambient Field Monitor - Development tool for visualizing framework state
 *
 * Architecture Decision: Modular, composable structure
 * - Each field gets its own visualization component
 * - Components subscribe to specific fields only (no over-fetching)
 * - Visual design inspired by instrument panels: precision, clarity, readability
 *
 * Design Philosophy:
 * - Dark mode optimized for long development sessions
 * - Monospace fonts for numeric precision
 * - Color-coded by field type using OKLCH for perceptual uniformity
 * - Trend indicators for temporal awareness
 *
 * Phase 1 Updates:
 * - CapacityField as first-class input (4 inputs: cognitive, temporal, emotional, valence)
 * - InterfaceMode badge showing derived coherent state
 * - Arousal removed for Phase 1 (Phase 2+ feature)
 */

"use client"

import {
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  useEmpathyContext,
  deriveMode,
  deriveModeLabel,
  getModeBadgeColor,
} from "@/lib/empathy"
import type { InterfaceMode, CapacityField } from "@/lib/empathy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

export function AmbientFieldMonitor() {
  return (
    <div className="space-y-8">
      <MonitorHeader />
      <InterfaceModeBadge />
      <FieldVisualizationGrid />
      <CapacityFieldInspector />
      <NextStepsGuide />
    </div>
  )
}

/**
 * Header section with title and description
 * Design: Clear hierarchy using size and color contrast
 */
function MonitorHeader() {
  return (
    <header className="space-y-3">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Ambient Field Monitor</h2>
      <p className="text-muted-foreground max-w-2xl text-balance">
        Real-time visualization of the Field → Mode → Components pipeline.
        The CapacityField (4 inputs) derives an InterfaceMode, which drives all UI adaptations.
      </p>
    </header>
  )
}

/**
 * Interface Mode Badge - Shows the derived coherent UI state
 *
 * This is the key insight: don't show "sliders controlling random stuff"
 * Instead show "a coherent interface state" derived from the field.
 *
 * Modes: Calm | Focused | Exploratory | Minimal
 */
function InterfaceModeBadge() {
  const { context } = useEmpathyContext()

  // Build CapacityField from context
  const field: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

  // Derive mode and label
  const mode = deriveMode(field)
  const label = deriveModeLabel(mode)
  const badgeColor = getModeBadgeColor(label)

  return (
    <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Interface Mode:</span>
          <Badge
            className="text-sm font-semibold px-3 py-1"
            style={{
              backgroundColor: badgeColor,
              color: "oklch(0.12 0 0)",
            }}
          >
            {label}
          </Badge>
        </div>

        {/* Mode details */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <ModeIndicator label="Density" value={mode.density} />
          <ModeIndicator label="Guidance" value={mode.guidance} />
          <ModeIndicator label="Motion" value={mode.motion} />
          <ModeIndicator label="Contrast" value={mode.contrast} />
          <ModeIndicator label="Choices" value={mode.choiceLoad} />
        </div>
      </div>
    </Card>
  )
}

/**
 * Small mode indicator pill
 */
function ModeIndicator({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono text-foreground">{value}</span>
    </span>
  )
}

/**
 * Grid layout for the three field visualizations
 * Architecture: Responsive grid that adapts to viewport
 * - Mobile: Stacked (1 column)
 * - Tablet+: Side-by-side (3 columns)
 */
function FieldVisualizationGrid() {
  const energy = useEnergyField()
  const attention = useAttentionField()
  const emotionalValence = useEmotionalValenceField()

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Energy Field - Drives animation intensity and complexity */}
      <FieldCard
        label="Energy Field"
        value={energy.value}
        trend={energy.trend}
        velocity={energy.velocity}
        description="Geometric mean of cognitive, temporal, and emotional capacity"
        color="oklch(0.7 0.19 142)" // Green - growth, vitality
        icon="⚡"
      />

      {/* Attention Field - Influences information density */}
      <FieldCard
        label="Attention Field"
        value={attention.value}
        trend={attention.trend}
        velocity={attention.velocity}
        description="Temporal pressure and focus demand"
        color="oklch(0.65 0.24 264)" // Blue - focus, clarity
        icon="👁"
      />

      {/* Emotional Valence - Affects color warmth and framing */}
      <FieldCard
        label="Emotional Valence"
        value={emotionalValence.value}
        trend={emotionalValence.trend}
        velocity={emotionalValence.velocity}
        description="Positive/negative affect direction"
        color="oklch(0.72 0.21 41)" // Orange - warmth, emotion
        icon="💛"
        isBipolar
      />
    </div>
  )
}

/**
 * Individual field visualization card
 *
 * Design Decisions:
 * - Large numeric display for at-a-glance monitoring
 * - Animated progress bar for visual feedback
 * - Trend arrow with color coding (green=rising, red=falling, gray=stable)
 * - Velocity indicator for rate of change awareness
 */
interface FieldCardProps {
  label: string
  value: number
  trend: "rising" | "falling" | "stable"
  velocity?: number
  description: string
  color: string
  icon: string
  isBipolar?: boolean
}

function FieldCard({ label, value, trend, velocity, description, color, icon, isBipolar = false }: FieldCardProps) {
  // Normalization: Bipolar values (-1 to 1) need remapping to 0-100% for progress bars
  const displayValue = isBipolar ? ((value + 1) / 2) * 100 : value * 100

  // Trend visualization: Rising ↑, Falling ↓, Stable →
  const trendConfig = {
    rising: { icon: "↑", color: "text-green-500", label: "Rising" },
    falling: { icon: "↓", color: "text-red-500", label: "Falling" },
    stable: { icon: "→", color: "text-muted-foreground", label: "Stable" },
  }[trend]

  return (
    <Card className="p-6 space-y-5 border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Header: Label + Icon + Trend */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={label}>
              {icon}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{label}</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Trend Indicator */}
        <div className="flex flex-col items-end gap-1">
          <span className={`text-2xl font-mono ${trendConfig.color}`} aria-label={`Trend: ${trendConfig.label}`}>
            {trendConfig.icon}
          </span>
          {velocity !== undefined && (
            <span className="text-xs text-muted-foreground font-mono" title="Rate of change per second">
              {velocity.toFixed(3)}/s
            </span>
          )}
        </div>
      </div>

      {/* Numeric Value Display */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold font-mono tabular-nums text-foreground">
            {isBipolar ? value.toFixed(2) : (value * 100).toFixed(0)}
          </span>
          {!isBipolar && <span className="text-xl text-muted-foreground">%</span>}
          {isBipolar && (
            <span className="text-sm text-muted-foreground">
              ({value > 0 ? "positive" : value < 0 ? "negative" : "neutral"})
            </span>
          )}
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: `${displayValue}%` }}
            animate={{ width: `${displayValue}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </Card>
  )
}

/**
 * CapacityField Inspector - Shows the canonical 4-input model
 *
 * Architecture Decision: Renamed from "Raw State Inspector"
 * - CapacityField is the FIRST-CLASS input object
 * - Shows all 4 inputs: cognitive, temporal, emotional, valence
 * - Arousal removed for Phase 1 (Phase 2+ feature)
 */
function CapacityFieldInspector() {
  const { context } = useEmpathyContext()

  return (
    <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">🔬</span>
        <h3 className="text-lg font-semibold text-foreground">CapacityField Inspector</h3>
        <Badge variant="outline" className="text-xs">Phase 1</Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        The canonical 4-input model that drives the entire framework.
        Field → Mode → Tokens → Components.
      </p>

      {/* CapacityField as a single unified object */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          CapacityField
        </h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <StateRow
            label="cognitive"
            value={context.userCapacity.cognitive}
            unit="0-1"
            description="bandwidth available"
          />
          <StateRow
            label="temporal"
            value={context.userCapacity.temporal}
            unit="0-1"
            description="time/effort budget"
          />
          <StateRow
            label="emotional"
            value={context.userCapacity.emotional}
            unit="0-1"
            description="load tolerance"
          />
          <StateRow
            label="valence"
            value={context.emotionalState.valence}
            unit="-1 to 1"
            description="emotional direction"
            isBipolar
          />
        </div>
      </div>
    </Card>
  )
}

/**
 * Individual state value row with label and formatted value
 * Design: Monospace for alignment, semantic colors for different value types
 */
interface StateRowProps {
  label: string
  value: number
  unit: string
  description?: string
  isBipolar?: boolean
}

function StateRow({ label, value, unit, description, isBipolar = false }: StateRowProps) {
  // Color coding based on value range
  const getValueColor = () => {
    if (isBipolar) {
      if (value > 0.3) return "text-green-500"
      if (value < -0.3) return "text-red-500"
      return "text-yellow-500"
    }
    if (value > 0.7) return "text-green-500"
    if (value < 0.3) return "text-red-500"
    return "text-yellow-500"
  }

  return (
    <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col">
        <span className="text-sm font-mono text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-base font-mono font-semibold tabular-nums ${getValueColor()}`}>
          {value.toFixed(3)}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{unit}</span>
      </div>
    </div>
  )
}

/**
 * Next Steps Guide - Helps developers understand what to build next
 * UX Decision: Always provide clear next actions in dev tools
 *
 * Updated: Changed "3-slider" to "4 inputs" for accuracy
 */
function NextStepsGuide() {
  return (
    <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <h3 className="text-lg font-semibold text-foreground">Next Steps</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Phase 1:</strong> Build the 4-input control system
          (cognitive, temporal, emotional, valence) to manually adjust CapacityField and see
          the InterfaceMode and fields update in real-time.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Then:</strong> Create components that respond to the
          derived InterfaceMode — showing content, layout, and interaction adaptations based on
          the coherent state (not individual sliders).
        </p>
      </div>
    </Card>
  )
}
