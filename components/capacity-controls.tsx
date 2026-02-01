/**
 * Capacity-Adaptive UI Controls - Phase 1 Manual Input System (4 Inputs)
 *
 * STRICT SEPARATION OF CONCERNS:
 * ┌─────────────┬────────────────────────────────────┬─────────────────────────────┐
 * │ Slider      │ Controls                           │ Must NOT Control            │
 * ├─────────────┼────────────────────────────────────┼─────────────────────────────┤
 * │ Cognitive   │ density, hierarchy, concurrency    │ tone, animation speed       │
 * │ Temporal    │ content length, shortcuts, defaults│ color, layout structure     │
 * │ Emotional   │ motion restraint, friction         │ content importance          │
 * │ Valence     │ tone, expressiveness               │ information volume          │
 * └─────────────┴────────────────────────────────────┴─────────────────────────────┘
 *
 * Rules of thumb:
 * - Cognitive: how many things compete for attention at once
 * - Temporal: how much time the UI asks from the user
 * - Emotional: nervous-system-safe UI (no surprises when low)
 * - Valence: emotional color, not information density
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useCapacityContext,
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  deriveMode,
  deriveModeLabel,
  getModeBadgeColor,
} from "@/lib/capacity"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Capacity Presets - Quick state configurations for demos
 * Each preset represents a realistic user state
 */
const CAPACITY_PRESETS = {
  exhausted: {
    label: "Exhausted",
    description: "Low energy, minimal bandwidth",
    cognitive: 0.2,
    temporal: 0.15,
    emotional: 0.25,
    valence: -0.3,
  },
  overwhelmed: {
    label: "Overwhelmed",
    description: "High stress, need simplicity",
    cognitive: 0.3,
    temporal: 0.25,
    emotional: 0.2,
    valence: -0.5,
  },
  distracted: {
    label: "Distracted",
    description: "Limited focus, short attention",
    cognitive: 0.4,
    temporal: 0.3,
    emotional: 0.6,
    valence: 0.0,
  },
  neutral: {
    label: "Neutral",
    description: "Balanced, typical state",
    cognitive: 0.5,
    temporal: 0.5,
    emotional: 0.5,
    valence: 0.0,
  },
  focused: {
    label: "Focused",
    description: "Good concentration, ready to engage",
    cognitive: 0.7,
    temporal: 0.7,
    emotional: 0.6,
    valence: 0.2,
  },
  energized: {
    label: "Energized",
    description: "High energy, eager to explore",
    cognitive: 0.85,
    temporal: 0.8,
    emotional: 0.9,
    valence: 0.5,
  },
  exploring: {
    label: "Exploring",
    description: "Maximum engagement, show me everything",
    cognitive: 1.0,
    temporal: 1.0,
    emotional: 1.0,
    valence: 0.7,
  },
} as const

type PresetKey = keyof typeof CAPACITY_PRESETS

export function CapacityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const { context, updateCapacity, updateEmotionalState } = useCapacityContext()
  const energy = useEnergyField()
  const attention = useAttentionField()
  const valence = useEmotionalValenceField()

  /**
   * Derive the current interface mode from CapacityField
   */
  const field = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }
  const mode = deriveMode(field)
  const modeLabel = deriveModeLabel(field)
  const modeBadgeColor = getModeBadgeColor(modeLabel)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button with mode badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Badge
              className="shadow-lg"
              style={{ backgroundColor: modeBadgeColor, color: "white" }}
            >
              {modeLabel}
            </Badge>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="sm"
              className="shadow-lg bg-background"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Capacity
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile - tap to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Control panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative"
          >
            <Card className="w-80 shadow-xl max-h-[85vh] overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">
                      Capacity Controls
                    </CardTitle>
                    <Badge
                      className="text-xs"
                      style={{ backgroundColor: modeBadgeColor, color: "white" }}
                    >
                      {modeLabel}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(false)
                    }}
                    aria-label="Close capacity controls"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adjust your state to see the UI adapt in real-time.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Capacity Presets - Quick state selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Presets</label>
                  <Select
                    onValueChange={(value: PresetKey) => {
                      const preset = CAPACITY_PRESETS[value]
                      updateCapacity({
                        cognitive: preset.cognitive,
                        temporal: preset.temporal,
                        emotional: preset.emotional,
                      })
                      updateEmotionalState({ valence: preset.valence })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a preset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CAPACITY_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{preset.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {preset.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-4">Or adjust individually:</p>
                </div>

                {/* Cognitive → density, hierarchy, concurrency */}
                <SliderControl
                  label="Cognitive Capacity"
                  description="Controls: density, hierarchy, concurrency"
                  value={context.userCapacity.cognitive}
                  onChange={(v) => updateCapacity({ cognitive: v })}
                  lowLabel="Fewer items"
                  highLabel="More items"
                />

                {/* Temporal → content length, shortcuts, defaults */}
                <SliderControl
                  label="Temporal Capacity"
                  description="Controls: content length, shortcuts, defaults"
                  value={context.userCapacity.temporal}
                  onChange={(v) => updateCapacity({ temporal: v })}
                  lowLabel="Abbreviated"
                  highLabel="Full detail"
                />

                {/* Emotional → motion restraint, friction */}
                <SliderControl
                  label="Emotional Capacity"
                  description="Controls: motion restraint, friction"
                  value={context.userCapacity.emotional}
                  onChange={(v) => updateCapacity({ emotional: v })}
                  lowLabel="Calm UI"
                  highLabel="Expressive"
                />

                {/* Valence → tone, expressiveness (NOT information volume) */}
                <div className="pt-2 border-t border-border">
                  <ValenceSliderControl
                    label="Emotional Valence"
                    description="Controls: tone, expressiveness (not info volume)"
                    value={context.emotionalState.valence}
                    onChange={(v) => updateEmotionalState({ valence: v })}
                  />
                </div>

                {/* Derived field values display */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Derived Fields
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <FieldDisplay
                      label="Energy"
                      value={energy.value}
                      color="text-chart-1"
                    />
                    <FieldDisplay
                      label="Attention"
                      value={attention.value}
                      color="text-chart-2"
                    />
                    <FieldDisplay
                      label="Valence"
                      value={valence.value}
                      color="text-chart-3"
                      signed
                    />
                  </div>
                </div>

                {/* Interface Mode breakdown */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Interface Mode
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-muted-foreground">Density:</span>
                    <span className="font-medium">{mode.density}</span>
                    <span className="text-muted-foreground">Guidance:</span>
                    <span className="font-medium">{mode.guidance}</span>
                    <span className="text-muted-foreground">Motion:</span>
                    <span className="font-medium">{mode.motion}</span>
                    <span className="text-muted-foreground">Contrast:</span>
                    <span className="font-medium">{mode.contrast}</span>
                    <span className="text-muted-foreground">Choices:</span>
                    <span className="font-medium">{mode.choiceLoad}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Reusable slider control with labels
 */
function SliderControl({
  label,
  description,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  lowLabel: string
  highLabel: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={1}
        step={0.01}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

/**
 * Bipolar slider control for valence (-1 to +1)
 */
function ValenceSliderControl({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}) {
  // Map -1 to +1 range to 0-1 for slider
  const sliderValue = (value + 1) / 2

  // Display value with sign
  const displayValue = value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground tabular-nums font-mono">
          {displayValue}
        </span>
      </div>
      <Slider
        value={[sliderValue]}
        onValueChange={([v]) => onChange(v * 2 - 1)}
        min={0}
        max={1}
        step={0.01}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Negative</span>
        <span className="opacity-50">Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  )
}

/**
 * Field value display chip
 */
function FieldDisplay({
  label,
  value,
  color,
  signed = false,
}: {
  label: string
  value: number
  color: string
  signed?: boolean
}) {
  const displayValue = signed
    ? (value >= 0 ? "+" : "") + value.toFixed(2)
    : value.toFixed(2)

  return (
    <div className="bg-muted/50 rounded-md p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-mono font-bold ${color}`}>{displayValue}</p>
    </div>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
