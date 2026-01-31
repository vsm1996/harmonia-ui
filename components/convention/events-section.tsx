/**
 * Events Section - Convention Schedule Grid
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (grid columns, visible event count)
 * - Temporal → content length (description verbosity)
 * - Emotional → motion restraint (animation intensity, infection speed)
 * - Valence → (not heavily used - schedule is factual)
 *
 * Special: Infection animation transitions colors when section enters view
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "motion/react"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfectedText } from "@/components/infected-text"
import { ToxicDrip, AbyssRat } from "./gachiakuta-svgs"

/**
 * Infection progress hook
 * Manages the gradual transition from primary (rust) to accent (green)
 * Starts when section enters viewport, progresses over time
 */
function useInfectionProgress(isInView: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isInView) return

    /**
     * Infection spreads gradually over 3 seconds
     * Uses requestAnimationFrame for smooth animation
     * Progress 0 = fully rust/primary
     * Progress 1 = fully green/accent
     */
    const startTime = Date.now()
    const duration = 3000 // 3 seconds for full infection

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)

      // Easing function for organic feel - slow start, accelerate, slow end
      const eased = newProgress < 0.5
        ? 2 * newProgress * newProgress
        : 1 - Math.pow(-2 * newProgress + 2, 2) / 2

      setProgress(eased)

      if (newProgress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView])

  return progress
}

/**
 * Event data structure
 * In production, this would come from a CMS or API
 * 
 * Content variants for temporal adaptation:
 * - full: Complete description for high temporal capacity
 * - short: Abbreviated for low temporal capacity
 */
const EVENTS = [
  {
    id: "cosplay-championship",
    title: "Cosplay Championship",
    shortTitle: "Cosplay Champ",
    description: {
      full: "Transform trash into treasure. Build your weapons from discarded materials and compete for glory.",
      short: "Build weapons from trash. Compete for glory.",
    },
    category: "Competition",
    time: "Saturday, 2:00 PM",
    shortTime: "Sat 2PM",
    location: "Main Hall",
  },
  {
    id: "artist-alley",
    title: "Artist Alley",
    shortTitle: "Artist Alley",
    description: {
      full: "200+ independent artists showcasing manga, prints, and original works from around the world.",
      short: "200+ artists. Manga, prints, originals.",
    },
    category: "Exhibition",
    time: "All Days",
    shortTime: "All Days",
    location: "Hall B",
  },
  {
    id: "gachiakuta-panel",
    title: "Gachiakuta Creator Panel",
    shortTitle: "Creator Panel",
    description: {
      full: "Exclusive Q&A with Kei Urana. First time at a US convention. Don't miss this historic moment.",
      short: "Q&A with Kei Urana. First US appearance.",
    },
    category: "Panel",
    time: "Sunday, 11:00 AM",
    shortTime: "Sun 11AM",
    location: "Panel Room A",
  },
  {
    id: "abyss-escape",
    title: "The Abyss Escape Room",
    shortTitle: "Abyss Escape",
    description: {
      full: "Survive the depths. Solve puzzles using discarded objects to escape before time runs out.",
      short: "Puzzle escape room. Survive the depths.",
    },
    category: "Interactive",
    time: "All Days",
    shortTime: "All Days",
    location: "Experience Zone",
  },
  {
    id: "midnight-screening",
    title: "Midnight Anime Screening",
    shortTitle: "Late Screening",
    description: {
      full: "Dark, gritty anime marathon featuring underground classics. Not for the faint of heart.",
      short: "Dark anime marathon. Underground classics.",
    },
    category: "Screening",
    time: "Fri & Sat, 12:00 AM",
    shortTime: "Fri-Sat 12AM",
    location: "Theater 1",
  },
  {
    id: "trash-art-workshop",
    title: "Trash Art Workshop",
    shortTitle: "Art Workshop",
    description: {
      full: "Learn to create stunning art from discarded materials with professional artists and take home your creation.",
      short: "Create art from trash. Take it home.",
    },
    category: "Workshop",
    time: "Saturday, 10:00 AM",
    shortTime: "Sat 10AM",
    location: "Workshop Room",
  },
] as const

/**
 * Category color mapping
 * Uses chart colors from design system for semantic meaning
 */
const CATEGORY_STYLES: Record<string, string> = {
  Competition: "bg-chart-1 text-background",
  Exhibition: "bg-chart-2 text-background",
  Panel: "bg-chart-3 text-background",
  Interactive: "bg-chart-4 text-background",
  Screening: "bg-chart-5 text-background",
  Workshop: "bg-primary text-primary-foreground",
}

export function EventsSection() {
  const { context } = useCapacityContext()
  const { mode: effectiveMotion } = useEffectiveMotion()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  // Use effective motion (respects prefers-reduced-motion)
  const motionMode = effectiveMotion
  
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" })
  const infectionProgress = useInfectionProgress(isInView)
  /**
   * Grid columns adapt to density mode
   */
  const gridClass =
    mode.density === "low"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  /**
   * Animation class based on motion mode - uses morph-fade for trash-punk aesthetic
   */
  const sectionAnimClass = mode.motion === "subtle" ? "morph-fade-in" : ""

  /**
   * Color interpolation based on infection progress
   * Primary (rust): oklch(0.68 0.16 45)
   * Accent (toxic green): oklch(0.65 0.2 135)
   *
   * We interpolate the hue from 45 (rust) to 135 (green)
   * and slightly adjust lightness/chroma for organic feel
   */
  const hue = 45 + infectionProgress * 90 // 45 -> 135
  const chroma = 0.16 + infectionProgress * 0.04 // 0.16 -> 0.2
  const lightness = 0.68 - infectionProgress * 0.03 // 0.68 -> 0.65

  const infectedColor = `oklch(${lightness} ${chroma} ${hue})`
  const infectedColorDim = `oklch(${lightness * 0.7} ${chroma * 0.5} ${hue})`
  const infectedBg = `oklch(${lightness * 0.15} ${chroma * 0.3} ${hue} / 0.15)`
  const infectedBorder = `oklch(${lightness * 0.8} ${chroma * 0.6} ${hue} / 0.3)`

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 border-y transition-colors duration-500 relative"
      style={{
        backgroundColor: infectedBg,
        borderColor: infectedBorder,
      }}
      aria-labelledby="events-title"
    >
      {/* Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <ToxicDrip size={24} className="absolute top-8 left-8 text-accent/40" />
        <ToxicDrip size={18} className="absolute top-12 right-16 text-accent/30" style={{ animationDelay: "-1s" } as React.CSSProperties} />
        <AbyssRat size={32} className="absolute bottom-8 left-[15%] text-muted-foreground/20" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section header - vortex-reveal like debris swirling into place */}
        <header className={`mb-16 text-center ${motionMode === "expressive" ? "vortex-reveal" : motionMode === "subtle" ? "bloom" : ""}`}>
          <Badge
            variant="outline"
            className={`mb-4 tracking-widest transition-colors duration-300 ${
              motionMode === "expressive" ? "vibrate" : ""
            }`}
            style={{
              borderColor: `oklch(${lightness} ${chroma} ${hue} / 0.5)`,
              color: infectedColor,
            }}
          >
            SCHEDULE
          </Badge>
          <h2
            id="events-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            <InfectedText text="Descend Into" infectColor={infectedColor} />
            <span style={{ color: infectedColor }}> The Events</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto text-balance transition-colors duration-300"
            style={{ color: `oklch(${lightness} ${chroma} ${hue} / 0.7)` }}
          >
            Three days of panels, competitions, screenings, and experiences
            designed for true outcasts.
          </p>
        </header>

        {/* Events grid - spiral-in like salvaged items being thrown up */}
        <div className={`grid ${gridClass} gap-6`}>
          {EVENTS.map((event, index) => (
            <div
              key={event.id}
              className={motionMode === "expressive" ? "spiral-in" : motionMode === "subtle" ? "helix-rise" : ""}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <EventCard
                event={event}
                infectedColor={infectedColor}
                infectedColorDim={infectedColorDim}
                motionMode={motionMode}
                index={index}
                cognitiveCapacity={context.userCapacity.cognitive}
                temporalCapacity={context.userCapacity.temporal}
                density={mode.density}
                guidance={mode.guidance}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className={`mt-12 text-center ${motionMode === "expressive" ? "float" : motionMode === "subtle" ? "gentle-fade" : ""}`}>
          <a
            href="#schedule"
            className={`font-medium tracking-wide inline-flex items-center gap-2 transition-colors hover:opacity-80 ${
              motionMode === "expressive" ? "hover-lift" : ""
            }`}
            style={{ color: infectedColor }}
          >
            View Full Schedule
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual event card component
 * 
 * CAPACITY ADAPTATIONS:
 * ┌─────────────────┬────────────────────────────────────────────────────────┐
 * │ Cognitive       │ Visual complexity, description visibility, title size │
 * │ Low (<0.35)     │ Simplified card, hide description, larger title       │
 * │ High (>0.75)    │ Full decorations, all details visible                 │
 * ├─────────────────┼────────────────────────────────────────────────────────┤
 * │ Temporal        │ Content length, time format, metadata detail          │
 * │ Low (<0.35)     │ Short descriptions, abbreviated times                 │
 * │ High            │ Full descriptions, complete time info                 │
 * └─────────────────┴────────────────────────────────────────────────────────┘
 */
function EventCard({
  event,
  infectedColor,
  infectedColorDim,
  motionMode,
  index,
  cognitiveCapacity,
  temporalCapacity,
  density,
  guidance,
}: {
  event: (typeof EVENTS)[number]
  infectedColor: string
  infectedColorDim: string
  motionMode: "off" | "subtle" | "expressive"
  index: number
  cognitiveCapacity: number
  temporalCapacity: number
  density: "low" | "medium" | "high"
  guidance: "low" | "medium" | "high"
}) {
  const categoryStyle = CATEGORY_STYLES[event.category] || "bg-secondary text-secondary-foreground"
  const categoryBgColor = CATEGORY_STYLES[event.category]?.split(" ")[0] || "bg-secondary"

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE ADAPTATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const isLowCognitive = cognitiveCapacity < 0.35
  const isHighCognitive = cognitiveCapacity > 0.75
  
  // Show description only when cognitive capacity allows processing more info
  const showDescription = cognitiveCapacity > 0.25
  // Show decorative elements only with sufficient cognitive bandwidth
  const showDecorations = cognitiveCapacity > 0.4
  // Simplified layout for low cognitive capacity
  const useSimplifiedLayout = isLowCognitive

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL ADAPTATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const isLowTemporal = temporalCapacity < 0.35
  
  // Use short or full content based on temporal capacity
  const title = isLowTemporal ? event.shortTitle : event.title
  const description = isLowTemporal ? event.description.short : event.description.full
  const time = isLowTemporal ? event.shortTime : event.time
  // Show location only when user has time to process it
  const showLocation = temporalCapacity > 0.3

  // ═══════════════════════════════════════════════════════════════════════════
  // VISUAL ADAPTATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const hoverClass =
    motionMode === "expressive" 
      ? "hover-expand" 
      : motionMode === "subtle" ? "hover-lift" : ""

  // Simplified card style for low cognitive
  const cardClipPath = useSimplifiedLayout 
    ? undefined 
    : "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"

  return (
    <div className={`group h-full ${hoverClass}`}>
      <Card
        className={`h-full flex flex-col backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden relative ${
          useSimplifiedLayout 
            ? "bg-card border border-border/50" 
            : "bg-card/80 border-0"
        }`}
        style={{ clipPath: cardClipPath }}
      >
        {/* Top accent bar with category color */}
        <div 
          className={`w-full ${categoryBgColor} transition-all duration-300 ${
            useSimplifiedLayout ? "h-2" : "h-1 group-hover:h-1.5"
          }`}
          style={{ 
            boxShadow: motionMode === "expressive" && showDecorations 
              ? `0 0 12px 2px color-mix(in oklch, ${infectedColor} 50%, transparent)` 
              : undefined 
          }}
        />
        
        {/* Decorative corners - only shown with sufficient cognitive capacity */}
        {showDecorations && (
          <>
            {/* Corner cut accent - top right */}
            <div 
              className="absolute top-0 right-0 w-3 h-3 transition-colors duration-300"
              style={{ 
                background: `linear-gradient(135deg, transparent 50%, ${infectedColor} 50%)`,
                opacity: 0.6,
              }}
            />
            
            {/* Corner cut accent - bottom left */}
            <div 
              className="absolute bottom-0 left-0 w-3 h-3 transition-colors duration-300"
              style={{ 
                background: `linear-gradient(-45deg, transparent 50%, ${infectedColor} 50%)`,
                opacity: 0.4,
              }}
            />

            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, color-mix(in oklch, ${infectedColor} 15%, transparent) 0%, transparent 70%)`,
              }}
            />

            {/* Left edge accent line */}
            <div 
              className="absolute left-0 top-1 bottom-1 w-px transition-all duration-300 group-hover:w-0.5"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${infectedColor}, transparent)`,
                opacity: 0.3,
              }}
            />
          </>
        )}

        <CardHeader className={`flex-1 ${useSimplifiedLayout ? "pb-2 pt-4" : "pb-3 pt-5"}`}>
          <div className={`flex items-start justify-between gap-3 ${showDescription ? "mb-2" : "mb-0"}`}>
            <CardTitle className={`font-bold leading-tight group-hover:text-foreground transition-colors ${
              useSimplifiedLayout ? "text-base" : "text-lg"
            }`}>
              {title}
            </CardTitle>
            <Badge 
              className={`shrink-0 font-semibold uppercase tracking-wider ${categoryStyle} ${
                motionMode === "expressive" && showDecorations ? "pulse" : ""
              } ${useSimplifiedLayout ? "text-[10px] px-1.5 py-0.5" : "text-xs"}`}
              style={{
                boxShadow: motionMode === "expressive" && showDecorations 
                  ? `0 0 8px 1px color-mix(in oklch, ${infectedColor} 30%, transparent)` 
                  : undefined
              }}
            >
              {event.category}
            </Badge>
          </div>
          
          {/* Description - hidden at low cognitive capacity */}
          {showDescription && (
            <CardDescription className={`leading-relaxed text-muted-foreground/90 ${
              useSimplifiedLayout ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
            }`}>
              {description}
            </CardDescription>
          )}
          
          {/* High guidance hint for low cognitive */}
          {guidance === "high" && !showDescription && (
            <p className="text-xs text-muted-foreground/60 italic mt-1">
              Tap for details
            </p>
          )}
        </CardHeader>

        {/* Divider line - only when showing full content */}
        {showDecorations && (
          <div 
            className="mx-4 h-px transition-colors duration-300"
            style={{ background: `linear-gradient(to right, transparent, ${infectedColor}, transparent)`, opacity: 0.2 }}
          />
        )}

        <CardContent className={useSimplifiedLayout ? "pt-2 pb-3" : "pt-3 pb-4"}>
          <div className={`flex ${useSimplifiedLayout ? "flex-row items-center gap-4" : "flex-col gap-2"} text-sm`}>
            {/* Time - always shown but format adapts to temporal capacity */}
            <span 
              className="flex items-center gap-2 transition-colors duration-300"
              style={{ color: infectedColorDim }}
            >
              {showDecorations ? (
                <span 
                  className="flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-300"
                  style={{ background: `color-mix(in oklch, ${infectedColor} 15%, transparent)` }}
                >
                  <ClockIcon />
                </span>
              ) : (
                <ClockIcon />
              )}
              <span className={useSimplifiedLayout ? "text-xs font-medium" : "font-medium"}>{time}</span>
            </span>
            
            {/* Location - hidden at low temporal capacity */}
            {showLocation && (
              <span 
                className="flex items-center gap-2 transition-colors duration-300"
                style={{ color: infectedColorDim }}
              >
                {showDecorations ? (
                  <span 
                    className="flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-300"
                    style={{ background: `color-mix(in oklch, ${infectedColor} 15%, transparent)` }}
                  >
                    <MapPinIcon />
                  </span>
                ) : (
                  <MapPinIcon />
                )}
                <span className={useSimplifiedLayout ? "text-xs font-medium" : "font-medium"}>{event.location}</span>
              </span>
            )}
          </div>
        </CardContent>

        {/* Bottom scan line effect - only for expressive mode with decorations */}
        {motionMode === "expressive" && showDecorations && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${infectedColor}, transparent)`,
              animation: "scanLine 3s ease-in-out infinite",
              animationDelay: `${index * 0.5}s`,
            }}
          />
        )}
      </Card>
    </div>
  )
}

/**
 * Simple icon components
 * Using inline SVGs to avoid external dependencies
 */
function ClockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}
