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
  useDerivedMode,
  deriveModeLabel,
  getModeBadgeColor,
} from "@/lib/capacity"
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
  const { field, mode } = useDerivedMode()
  const label = deriveModeLabel(field)
  const badgeColor = getModeBadgeColor(label)

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
            <ModePill label="focus" value={mode.focus} />
          </div>
        </div>

        {/* Column 3: UI Effects */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">3</span>
            UI Effects
          </div>
          
          <div className="space-y-1.5">
            <EffectRow active={mode.density === "low"} text="Fewer items shown, simpler layouts" />
            <EffectRow active={mode.density === "high"} text="Full feature display, dense grids" />
            <EffectRow active={mode.guidance === "high"} text="More labels, helper text visible" />
            <EffectRow active={mode.choiceLoad === "minimal"} text="Reduced options, smart defaults" />
            <EffectRow active={mode.motion === "off"} text="No animations, fully static UI" />
            <EffectRow active={mode.motion === "soothing"} text="Slow rhythmic motion: breathe, float" />
            <EffectRow active={mode.motion === "subtle"} text="Calm animations, no surprises" />
            <EffectRow active={mode.motion === "expressive"} text="Playful micro-interactions" />
            <EffectRow active={mode.contrast === "boosted"} text="Higher contrast for accessibility" />
            <EffectRow active={mode.focus === "gentle"} text="Soft highlight on important elements" />
            <EffectRow active={mode.focus === "guided"} text="Strong beacon glow on key elements" />
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
  
  // Color based on value -- thresholds match mode.ts derivation
  const getColor = () => {
    if (isBipolar) {
      if (value < -0.15) return "bg-amber-500"
      if (value > 0.15) return "bg-emerald-500"
      return "bg-sky-500"
    }
    if (value < 0.4) return "bg-amber-500"
    if (value > 0.7) return "bg-emerald-500"
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
 * Effect row showing active/inactive state
 */
function EffectRow({ active, text }: { active: boolean; text: string }) {
  return (
    <div className={`py-1.5 text-sm transition-opacity ${active ? "opacity-100" : "opacity-40"}`}>
      <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>
        {active ? "-> " : "   "}{text}
      </span>
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
            <li>{"cognitive < 0.4  → density: low"}</li>
            <li>{"cognitive > 0.7  → density: high"}</li>
            <li>{"else             → density: medium"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Temporal controls choices:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"temporal < 0.4  → choiceLoad: minimal"}</li>
            <li>{"else            → choiceLoad: normal"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Emotional controls motion:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"emotional < 0.15             → motion: off"}</li>
            <li>{"emotional < 0.4              → motion: soothing"}</li>
            <li>{"emotional > 0.6 & val > 0.15 → motion: expressive"}</li>
            <li>{"else                         → motion: subtle"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Valence controls tone:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"valence < -0.15 → contrast: boosted"}</li>
            <li>{"else            → contrast: standard"}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Cognitive controls focus:</p>
          <ul className="space-y-1 text-muted-foreground font-mono text-xs">
            <li>{"motion == off                  → focus: default"}</li>
            <li>{"cognitive < 0.4                → focus: guided"}</li>
            <li>{"cognitive < 0.7                → focus: gentle"}</li>
            <li>{"else                           → focus: default"}</li>
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
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Done</Badge>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Phase 2:</strong> Automatic signals (scroll velocity, time-on-page,
            interaction patterns) modulate inputs passively — plus pattern-based prediction from past sessions
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
