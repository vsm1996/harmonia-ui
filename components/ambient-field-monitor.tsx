/**
 * Mode Derivation Monitor - Shows how inputs become interface modes
 *
 * Simplified for clarity:
 * - Your Inputs (4 values)
 * - Derivation Logic (thresholds and rules)
 * - Resulting Mode (what the UI does)
 */

"use client"

import {
  useCapacityContext,
  deriveMode,
  deriveModeLabel,
  getModeBadgeColor,
} from "@/lib/capacity"
import type { InterfaceMode, CapacityField } from "@/lib/capacity"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AmbientFieldMonitor() {
  return (
    <div className="space-y-6">
      <InputsToModeFlow />
      <DerivationLogicExplainer />
      <NextStepsGuide />
    </div>
  )
}

/**
 * Inputs to Mode Flow - Visual pipeline showing derivation
 */
function InputsToModeFlow() {
  const { context } = useCapacityContext()

  const field: CapacityField = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  }

  const mode = deriveMode(field)
  const label = deriveModeLabel(mode)
  const badgeColor = getModeBadgeColor(label)

  // Build active effects list
  const activeEffects: string[] = []
  if (mode.density === "low") activeEffects.push("Simpler layouts, fewer items")
  if (mode.density === "high") activeEffects.push("Dense layouts, full features")
  if (mode.guidance === "high") activeEffects.push("More helper text visible")
  if (mode.choiceLoad === "minimal") activeEffects.push("Smart defaults, fewer choices")
  if (mode.motion === "subtle") activeEffects.push("Calm, predictable animations")
  if (mode.motion === "expressive") activeEffects.push("Playful micro-interactions")
  if (mode.contrast === "boosted") activeEffects.push("Higher contrast")

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Three-column flow */}
      <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
        
        {/* Column 1: Inputs */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">1</span>
            Your Inputs
          </div>
          <div className="space-y-3">
            <InputGauge label="Cognitive" value={field.cognitive} description="mental bandwidth" />
            <InputGauge label="Temporal" value={field.temporal} description="time available" />
            <InputGauge label="Emotional" value={field.emotional} description="resilience" />
            <InputGauge label="Valence" value={field.valence} description="mood" isBipolar />
          </div>
        </div>

        {/* Column 2: Mode */}
        <div className="p-6 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">2</span>
            Derived Mode
          </div>
          
          {/* Large mode badge */}
          <div className="flex flex-col items-center py-4">
            <Badge
              className="text-xl font-bold px-6 py-3 shadow-lg"
              style={{ backgroundColor: badgeColor, color: "white" }}
            >
              {label}
            </Badge>
          </div>

          {/* Mode properties as pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <ModePill label="density" value={mode.density} />
            <ModePill label="guidance" value={mode.guidance} />
            <ModePill label="choices" value={mode.choiceLoad} />
            <ModePill label="motion" value={mode.motion} />
            <ModePill label="contrast" value={mode.contrast} />
          </div>
        </div>

        {/* Column 3: Effects */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">3</span>
            Active Effects
          </div>
          
          <div className="space-y-2">
            {activeEffects.length > 0 ? (
              activeEffects.map((effect, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{effect}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Standard UI behavior (no special adaptations)
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Visual gauge for input values
 */
function InputGauge({ 
  label, 
  value, 
  description,
  isBipolar = false 
}: { 
  label: string
  value: number
  description: string
  isBipolar?: boolean
}) {
  // For bipolar, remap -1..1 to 0..100
  const percentage = isBipolar ? ((value + 1) / 2) * 100 : value * 100
  
  // Color based on value
  const getColor = () => {
    if (isBipolar) {
      if (value < -0.25) return "bg-amber-500"
      if (value > 0.25) return "bg-emerald-500"
      return "bg-sky-500"
    }
    if (value < 0.35) return "bg-amber-500"
    if (value > 0.75) return "bg-emerald-500"
    return "bg-sky-500"
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-mono tabular-nums w-12 text-right text-foreground">
          {isBipolar ? (value >= 0 ? "+" : "") + value.toFixed(1) : (value * 100).toFixed(0) + "%"}
        </span>
      </div>
    </div>
  )
}

/**
 * Small pill showing a mode property
 */
function ModePill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}

/**
 * Derivation Logic Explainer - Shows the exact rules
 */
function DerivationLogicExplainer() {
  return (
    <Card className="p-6 border-border/50 bg-muted/20">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Derivation Rules
      </h3>
      <div className="grid gap-4 md:grid-cols-2 text-sm">
        <div className="space-y-2">
          <p className="font-medium text-foreground">Cognitive controls density:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"cognitive < 0.35 → density: low"}</li>
            <li>{"cognitive > 0.75 → density: high"}</li>
            <li>{"else → density: medium"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Temporal controls choices:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"temporal < 0.35 → choiceLoad: minimal"}</li>
            <li>{"else → choiceLoad: normal"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Emotional controls motion:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"emotional < 0.35 → motion: subtle"}</li>
            <li>{"else if valence > 0.25 → motion: expressive"}</li>
            <li>{"else → motion: subtle"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Valence controls tone:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"valence < -0.25 → contrast: boosted"}</li>
            <li>{"else → contrast: standard"}</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}

/**
 * Next Steps Guide
 */
function NextStepsGuide() {
  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Roadmap
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Done</Badge>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Phase 1:</strong> Manual 4-input controls with mode derivation
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Next</Badge>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Phase 2:</strong> Automatic signals (scroll velocity, time-on-page, 
            interaction patterns) to modulate inputs without manual controls
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="text-xs">Future</Badge>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Phase 3:</strong> Arousal dimension, multimodal feedback, 
            proportional scaling systems
          </p>
        </div>
      </div>
    </Card>
  )
}
