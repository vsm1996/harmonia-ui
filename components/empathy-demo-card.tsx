/**
 * Empathy Demo Card
 *
 * A live demonstration of how UI adapts to empathy state:
 * - Content length varies with cognitive capacity
 * - Animation intensity varies with motion mode
 * - Visual density varies with density mode
 * - Tone shifts with emotional valence
 */

"use client"

import { useEmpathyContext, deriveMode, deriveModeLabel, getModeBadgeColor } from "@/lib/empathy"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * Content variants for different cognitive loads
 */
const CONTENT = {
  full: {
    title: "Adaptive Interface Demo",
    description: "This card demonstrates how the empathy system adapts UI in real-time based on your current state.",
    features: [
      "Content length adjusts to cognitive capacity",
      "Animation intensity matches your energy level",
      "Visual density responds to your available bandwidth",
      "Tone shifts based on emotional valence",
    ],
    cta: "Explore the Framework",
  },
  reduced: {
    title: "Adaptive Interface",
    description: "UI adapts in real-time to your current state.",
    features: [
      "Content adapts to capacity",
      "Animations match energy",
    ],
    cta: "Explore",
  },
  minimal: {
    title: "Live Demo",
    description: null,
    features: null,
    cta: "Go",
  },
}

/**
 * Tone variants based on valence
 */
const TONE = {
  positive: {
    greeting: "You're doing great!",
    accent: "text-accent",
  },
  neutral: {
    greeting: "Here's how it works:",
    accent: "text-primary",
  },
  negative: {
    greeting: "Take your time.",
    accent: "text-muted-foreground",
  },
}

export function EmpathyDemoCard() {
  const { context } = useEmpathyContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  const modeLabel = deriveModeLabel(mode)
  const modeBadgeColor = getModeBadgeColor(modeLabel)

  /**
   * Content level based on density mode
   */
  const contentLevel =
    mode.density === "low" ? "minimal" : mode.density === "medium" ? "reduced" : "full"
  const content = CONTENT[contentLevel]

  /**
   * Tone based on valence
   */
  const toneKey =
    context.emotionalState.valence > 0.2
      ? "positive"
      : context.emotionalState.valence < -0.2
        ? "negative"
        : "neutral"
  const tone = TONE[toneKey]

  /**
   * Animation classes based on motion mode
   */
  const cardAnimClass =
    mode.motion === "expressive"
      ? "morph-fade-in"
      : mode.motion === "subtle"
        ? "sacred-fade"
        : ""

  const hoverClass =
    mode.motion === "expressive"
      ? "hover-expand"
      : mode.motion === "subtle"
        ? "hover-lift"
        : ""

  const breatheClass = mode.motion === "expressive" ? "breathe" : ""

  return (
    <Card
      className={`max-w-md border-2 transition-colors ${cardAnimClass} ${hoverClass}`}
      style={{ borderColor: `color-mix(in oklch, ${modeBadgeColor} 40%, transparent)` }}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge
            className="text-xs"
            style={{ backgroundColor: modeBadgeColor, color: "white" }}
          >
            {modeLabel} Mode
          </Badge>
          <span className={`text-xs ${tone.accent}`}>{tone.greeting}</span>
        </div>
        <CardTitle className={mode.motion === "expressive" ? "float" : ""}>
          {content.title}
        </CardTitle>
        {content.description && (
          <CardDescription>{content.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Feature list - only shown when content level allows */}
        {content.features && (
          <ul className="space-y-2">
            {content.features.map((feature, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 text-sm text-muted-foreground ${
                  mode.motion === "expressive" ? "helix-rise" : mode.motion === "subtle" ? "sacred-fade" : ""
                }`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <CheckIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA button - animation intensity varies */}
        <button
          className={`w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-transform ${
            mode.motion === "expressive" ? "hover-pulse" : "hover-lift"
          } ${breatheClass}`}
        >
          {content.cta}
        </button>

        {/* Live state readout */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Live State</p>
          <div className="grid grid-cols-4 gap-1 text-xs">
            <StateChip label="Cog" value={context.userCapacity.cognitive} />
            <StateChip label="Temp" value={context.userCapacity.temporal} />
            <StateChip label="Emo" value={context.userCapacity.emotional} />
            <StateChip
              label="Val"
              value={context.emotionalState.valence}
              signed
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StateChip({
  label,
  value,
  signed = false,
}: {
  label: string
  value: number
  signed?: boolean
}) {
  const displayValue = signed
    ? (value >= 0 ? "+" : "") + value.toFixed(1)
    : value.toFixed(1)

  return (
    <div className="bg-muted/50 rounded px-2 py-1 text-center">
      <p className="text-muted-foreground text-[10px]">{label}</p>
      <p className="font-mono font-medium">{displayValue}</p>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
