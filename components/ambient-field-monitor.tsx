/**
 * Ambient Field Monitor - Development tool for visualizing framework state
 *
 * Architecture Decision: Modular, composable structure
 * - Shows the canonical 4-input CapacityField model
 * - Displays derived InterfaceMode as a coherent state badge
 * - Field cards show derived values (energy, attention, valence)
 *
 * Pipeline visualization:
 * CapacityField (4 inputs) → InterfaceMode (coherent state) → Derived Fields → Components
 *
 * Design Philosophy:
 * - Dark mode optimized for long development sessions
 * - Monospace fonts for numeric precision
 * - Color-coded by field type using OKLCH for perceptual uniformity
 * - Trend indicators for temporal awareness
 */

"use client"

import {
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
} from "@/lib/empathy"
import { Card } from "@/components/ui/card"
import { motion } from "motion/react"
import { CapacityFieldInspector } from "@/components/capacity-field-inspector"

export function AmbientFieldMonitor() {
  return (
    <div className="space-y-8">
      <MonitorHeader />
      <CapacityFieldInspector /> {/* Used the declared variable here */}
      <FieldVisualizationGrid />
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
        Real-time visualization of the three core ambient fields. Each field represents a different aspect of user
        capacity and emotional state, enabling components to respond empathetically.
      </p>
    </header>
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
        {/* Animation: Motion library handles smooth transitions as values change */}
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
 * Next Steps Guide - Helps developers understand what to build next
 * UX Decision: Always provide clear next actions in dev tools
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
          <strong className="text-foreground">Phase 1:</strong> Build the 4-slider input system to manually control the
          CapacityField (cognitive, temporal, emotional, valence) and watch the InterfaceMode badge update in real-time.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Then:</strong> Create adaptive components that respond to the derived mode
          — not raw sliders — for coherent UI states like Calm, Focused, Exploratory, and Minimal.
        </p>
      </div>
    </Card>
  )
}
