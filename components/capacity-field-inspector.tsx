/**
 * CapacityField Inspector - Shows the canonical 4-input model
 *
 * Architecture Decision: First-class display of the input model
 * - CapacityField is THE input (cognitive, temporal, emotional, valence)
 * - InterfaceMode badge shows the coherent state derived from inputs
 * - This replaces the old "Raw State Inspector" with proper naming
 *
 * Pipeline: CapacityField → InterfaceMode → Derived Fields → Components
 */

"use client"

import {
  useEmpathyContext,
  deriveModeLabel,
  getModeLabelColor,
} from "@/lib/empathy"
import type { CapacityField } from "@/lib/empathy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

export function CapacityFieldInspector() {
  const { context } = useEmpathyContext()

  // Construct CapacityField from context for mode derivation
  const capacityField: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

  const modeLabel = deriveModeLabel(capacityField)
  const modeLabelColor = getModeLabelColor(modeLabel)

  return (
    <Card className="p-6 space-y-5 border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Header with Mode Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-semibold text-foreground">CapacityField Inspector</h3>
        </div>

        {/* Interface Mode Badge - Shows coherent state */}
        <Badge variant="outline" className={`text-sm font-medium px-3 py-1 ${modeLabelColor}`}>
          Mode: {modeLabel}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        The canonical 4-input model. These values derive the InterfaceMode and all downstream adaptations.
      </p>

      {/* 4-Input Grid: The canonical CapacityField */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CapacityInput
          label="Cognitive"
          value={capacityField.cognitive}
          description="Bandwidth available"
          color="oklch(0.7 0.19 142)"
        />
        <CapacityInput
          label="Temporal"
          value={capacityField.temporal}
          description="Time availability"
          color="oklch(0.65 0.24 264)"
        />
        <CapacityInput
          label="Emotional"
          value={capacityField.emotional}
          description="Regulation capacity"
          color="oklch(0.72 0.21 41)"
        />
        <CapacityInput
          label="Valence"
          value={capacityField.valence}
          description="Mood tone"
          color="oklch(0.68 0.16 320)"
          isBipolar
        />
      </div>
    </Card>
  )
}

/**
 * Individual capacity input display
 * Clean, focused presentation of each CapacityField dimension
 */
interface CapacityInputProps {
  label: string
  value: number
  description: string
  color: string
  isBipolar?: boolean
}

function CapacityInput({ label, value, description, color, isBipolar = false }: CapacityInputProps) {
  // Normalize bipolar values for progress bar
  const displayPercent = isBipolar ? ((value + 1) / 2) * 100 : value * 100

  return (
    <div className="p-4 rounded-lg bg-muted/30 space-y-3">
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground">{label}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
          {isBipolar ? value.toFixed(2) : (value * 100).toFixed(0)}
        </span>
        {!isBipolar && <span className="text-sm text-muted-foreground">%</span>}
      </div>

      {/* Mini progress bar */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: `${displayPercent}%` }}
          animate={{ width: `${displayPercent}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}
