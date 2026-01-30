/**
 * Empathy Controls - Phase 1 Manual Input System (4 Inputs)
 *
 * The canonical CapacityField input:
 * - cognitive: 0-1 (mental bandwidth)
 * - temporal: 0-1 (time/effort budget)
 * - emotional: 0-1 (emotional resilience)
 * - valence: -1 to +1 (emotional direction)
 *
 * Design decisions:
 * - Fixed position bottom-right for persistent access
 * - Shows derived InterfaceMode badge
 * - Real-time preview of how the UI adapts
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useEmpathyContext,
  useEnergyField,
  useAttentionField,
  useEmotionalValenceField,
  deriveMode,
  deriveModeLabel,
  getModeBadgeColor,
} from "@/lib/empathy"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EmpathyControls() {
  const [isOpen, setIsOpen] = useState(false)
  const { context, updateCapacity, updateEmotionalState } = useEmpathyContext()
  const energy = useEnergyField()
  const attention = useAttentionField()
  const valence = useEmotionalValenceField()

  /**
   * Derive the current interface mode from CapacityField
   */
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  const modeLabel = deriveModeLabel(mode)
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
              Empathy
            </Button>
          </motion.div>
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
          >
            <Card className="w-80 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">
                      Empathy Controls
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
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <CloseIcon className="w-4 h-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adjust your state to see the UI adapt in real-time.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Cognitive Capacity Slider */}
                <SliderControl
                  label="Cognitive Capacity"
                  description="Mental bandwidth available"
                  value={context.userCapacity.cognitive}
                  onChange={(v) => updateCapacity({ cognitive: v })}
                  lowLabel="Overwhelmed"
                  highLabel="Sharp"
                />

                {/* Temporal Capacity Slider */}
                <SliderControl
                  label="Temporal Capacity"
                  description="Time pressure level"
                  value={context.userCapacity.temporal}
                  onChange={(v) => updateCapacity({ temporal: v })}
                  lowLabel="Rushed"
                  highLabel="Relaxed"
                />

                {/* Emotional Capacity Slider */}
                <SliderControl
                  label="Emotional Capacity"
                  description="Emotional resilience"
                  value={context.userCapacity.emotional}
                  onChange={(v) => updateCapacity({ emotional: v })}
                  lowLabel="Drained"
                  highLabel="Centered"
                />

                {/* Emotional Valence */}
                <div className="pt-2 border-t border-border">
                  <SliderControl
                    label="Emotional Valence"
                    description="Overall mood direction"
                    value={(context.emotionalState.valence + 1) / 2}
                    onChange={(v) => updateEmotionalState({ valence: v * 2 - 1 })}
                    lowLabel="Negative"
                    highLabel="Positive"
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
