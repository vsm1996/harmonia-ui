/**
 * Capacity Demo Card
 *
 * A live demonstration of how UI adapts to capacity state.
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (how many items shown, visual complexity)
 * - Temporal → content length (full vs abbreviated text)
 * - Emotional → motion restraint (animation intensity)
 * - Valence → tone only (greeting warmth, accent color)
 */

"use client"

import { useCapacityContext, deriveMode, deriveModeLabel, getModeBadgeColor } from "@/lib/capacity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * COGNITIVE → Density (how many things compete for attention)
 * Controls: card count, visible features, visual grouping
 */
const DENSITY_CONTENT = {
  high: {
    title: "Adaptive Interface Demo",
    featureCount: 4,
    cta: "Explore the Framework",
  },
  medium: {
    title: "Adaptive Interface",
    featureCount: 2,
    cta: "Explore",
  },
  low: {
    title: "Live Demo",
    featureCount: 0,
    cta: "Go",
  },
}

/**
 * TEMPORAL → Content Length (how much time the UI asks)
 * Controls: description length, feature text verbosity
 */
const TEMPORAL_CONTENT = {
  full: {
    description: "This card demonstrates how the capacity system adapts UI in real-time based on your current state.",
    features: [
      "Cognitive capacity controls visual density",
      "Temporal capacity controls content length",
      "Emotional capacity controls motion restraint",
      "Valence controls tone and expressiveness",
    ],
  },
  abbreviated: {
    description: "UI adapts in real-time.",
    features: [
      "Density from cognitive",
      "Length from temporal",
      "Motion from emotional",
      "Tone from valence",
    ],
  },
}

/**
 * VALENCE → Tone Only (emotional color, NOT information volume)
 * Controls: greeting warmth, accent styling, playfulness
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

export function CapacityDemoCard() {
  const { context } = useCapacityContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  const modeLabel = deriveModeLabel(mode)
  const modeBadgeColor = getModeBadgeColor(modeLabel)

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density (derived via mode.density)
  // ═══════════════════════════════════════════════════════════════════════════
  const densityContent = DENSITY_CONTENT[mode.density]

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL → Content Length (direct from temporal capacity)
  // ═══════════════════════════════════════════════════════════════════════════
  const temporalContent =
    context.userCapacity.temporal > 0.4 ? TEMPORAL_CONTENT.full : TEMPORAL_CONTENT.abbreviated

  // ═══════════════════════════════════════════════════════════════════════════
  // VALENCE → Tone Only (does NOT affect information volume)
  // ═══════════════════════════════════════════════════════════════════════════
  const toneKey =
    context.emotionalState.valence > 0.2
      ? "positive"
      : context.emotionalState.valence < -0.2
        ? "negative"
        : "neutral"
  const tone = TONE[toneKey]

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL → Motion Restraint (derived via mode.motion)
  // Low emotional = no surprises, no playful micro-interactions
  // ═══════════════════════════════════════════════════════════════════════════
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

  // Combine: features from temporal content, limited by density count
  const visibleFeatures = temporalContent.features.slice(0, densityContent.featureCount)

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
          {/* Valence controls tone/greeting only */}
          <span className={`text-xs ${tone.accent}`}>{tone.greeting}</span>
        </div>
        {/* Cognitive controls title complexity */}
        <CardTitle className={mode.motion === "expressive" ? "float" : ""}>
          {densityContent.title}
        </CardTitle>
        {/* Temporal controls description length, shown when density allows */}
        {mode.density !== "low" && (
          <CardDescription>{temporalContent.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Feature list: count from cognitive, text length from temporal */}
        {visibleFeatures.length > 0 && (
          <ul className="space-y-2">
            {visibleFeatures.map((feature, idx) => (
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

        {/* CTA button - motion restraint from emotional */}
        <button
          className={`w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-transform ${
            mode.motion === "expressive" ? "hover-pulse" : "hover-lift"
          } ${breatheClass}`}
        >
          {densityContent.cta}
        </button>

        {/* Live state readout with hints showing what each controls */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Live State</p>
          <div className="grid grid-cols-4 gap-1 text-xs">
            <StateChip label="Cog" value={context.userCapacity.cognitive} hint="density" />
            <StateChip label="Temp" value={context.userCapacity.temporal} hint="length" />
            <StateChip label="Emo" value={context.userCapacity.emotional} hint="motion" />
            <StateChip
              label="Val"
              value={context.emotionalState.valence}
              hint="tone"
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
  hint,
  signed = false,
}: {
  label: string
  value: number
  hint: string
  signed?: boolean
}) {
  const displayValue = signed
    ? (value >= 0 ? "+" : "") + value.toFixed(1)
    : value.toFixed(1)

  return (
    <div className="bg-muted/50 rounded px-2 py-1 text-center">
      <p className="text-muted-foreground text-[10px]">{label}</p>
      <p className="font-mono font-medium">{displayValue}</p>
      <p className="text-muted-foreground text-[9px] opacity-70">{hint}</p>
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
