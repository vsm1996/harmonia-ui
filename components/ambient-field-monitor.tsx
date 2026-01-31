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
 * Inputs → Mode Flow
 * Shows the complete derivation: your inputs, the thresholds, the resulting mode
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

  // Threshold evaluations (same logic as mode.ts)
  const lowCognitive = field.cognitive < 0.35
  const highCognitive = field.cognitive > 0.75
  const lowEmotional = field.emotional < 0.35
  const lowTemporal = field.temporal < 0.35
  const highValence = field.valence > 0.25
  const negValence = field.valence < -0.25

  return (
    <Card className="p-6 border-border/50">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {/* Column 1: Your Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Your Inputs
          </h3>
          <div className="space-y-2">
            <InputRow 
              label="cognitive" 
              value={field.cognitive} 
              threshold={lowCognitive ? "< 0.35 (low)" : highCognitive ? "> 0.75 (high)" : "0.35-0.75"}
              isTriggered={lowCognitive || highCognitive}
            />
            <InputRow 
              label="temporal" 
              value={field.temporal} 
              threshold={lowTemporal ? "< 0.35 (low)" : ">= 0.35"}
              isTriggered={lowTemporal}
            />
            <InputRow 
              label="emotional" 
              value={field.emotional} 
              threshold={lowEmotional ? "< 0.35 (low)" : ">= 0.35"}
              isTriggered={lowEmotional}
            />
            <InputRow 
              label="valence" 
              value={field.valence} 
              threshold={negValence ? "< -0.25 (neg)" : highValence ? "> 0.25 (pos)" : "-0.25 to 0.25"}
              isTriggered={negValence || highValence}
              isBipolar
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center text-2xl text-muted-foreground">
          →
        </div>

        {/* Column 2: Derived Mode */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Derived Mode
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                className="text-lg font-bold px-4 py-2"
                style={{ backgroundColor: badgeColor, color: "oklch(0.12 0 0)" }}
              >
                {label}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <ModeProperty label="density" value={mode.density} source="cognitive" />
              <ModeProperty label="guidance" value={mode.guidance} source="cognitive + temporal" />
              <ModeProperty label="choiceLoad" value={mode.choiceLoad} source="temporal" />
              <ModeProperty label="motion" value={mode.motion} source="emotional + valence" />
              <ModeProperty label="contrast" value={mode.contrast} source="valence" />
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center text-2xl text-muted-foreground">
          →
        </div>

        {/* Column 3: UI Effects */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            UI Effects
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <EffectRow 
              condition={mode.density === "low"} 
              text="Fewer items shown, simpler layouts"
            />
            <EffectRow 
              condition={mode.density === "high"} 
              text="Full feature display, dense grids"
            />
            <EffectRow 
              condition={mode.guidance === "high"} 
              text="More labels, helper text visible"
            />
            <EffectRow 
              condition={mode.choiceLoad === "minimal"} 
              text="Reduced options, smart defaults"
            />
            <EffectRow 
              condition={mode.motion === "subtle"} 
              text="Calm animations, no surprises"
            />
            <EffectRow 
              condition={mode.motion === "expressive"} 
              text="Playful micro-interactions"
            />
            <EffectRow 
              condition={mode.contrast === "boosted"} 
              text="Higher contrast for accessibility"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

function InputRow({ 
  label, 
  value, 
  threshold, 
  isTriggered,
  isBipolar = false 
}: { 
  label: string
  value: number
  threshold: string
  isTriggered: boolean
  isBipolar?: boolean
}) {
  return (
    <div className={`flex justify-between items-center py-2 px-3 rounded-md transition-colors ${
      isTriggered ? "bg-primary/10 border border-primary/30" : "bg-muted/30"
    }`}>
      <span className="font-mono text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold tabular-nums">
          {isBipolar ? (value >= 0 ? "+" : "") + value.toFixed(2) : value.toFixed(2)}
        </span>
        <span className={`text-xs ${isTriggered ? "text-primary font-medium" : "text-muted-foreground"}`}>
          {threshold}
        </span>
      </div>
    </div>
  )
}

function ModeProperty({ label, value, source }: { label: string; value: string; source: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="font-mono text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground/60">from {source}</span>
      </div>
    </div>
  )
}

function EffectRow({ condition, text }: { condition: boolean; text: string }) {
  return (
    <div className={`py-1 ${condition ? "text-foreground font-medium" : "opacity-40"}`}>
      {condition ? "→ " : "  "}{text}
    </div>
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
