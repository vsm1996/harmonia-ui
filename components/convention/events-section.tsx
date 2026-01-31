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
 */
const EVENTS = [
  {
    id: "cosplay-championship",
    title: "Cosplay Championship",
    description: "Transform trash into treasure. Build your weapons from discarded materials.",
    category: "Competition",
    time: "Saturday, 2:00 PM",
    location: "Main Hall",
  },
  {
    id: "artist-alley",
    title: "Artist Alley",
    description: "200+ independent artists showcasing manga, prints, and original works.",
    category: "Exhibition",
    time: "All Days",
    location: "Hall B",
  },
  {
    id: "gachiakuta-panel",
    title: "Gachiakuta Creator Panel",
    description: "Exclusive Q&A with Kei Urana. First time at a US convention.",
    category: "Panel",
    time: "Sunday, 11:00 AM",
    location: "Panel Room A",
  },
  {
    id: "abyss-escape",
    title: "The Abyss Escape Room",
    description: "Survive the depths. Solve puzzles using discarded objects to escape.",
    category: "Interactive",
    time: "All Days",
    location: "Experience Zone",
  },
  {
    id: "midnight-screening",
    title: "Midnight Anime Screening",
    description: "Dark, gritty anime marathon. Not for the faint of heart.",
    category: "Screening",
    time: "Fri & Sat, 12:00 AM",
    location: "Theater 1",
  },
  {
    id: "trash-art-workshop",
    title: "Trash Art Workshop",
    description: "Learn to create art from discarded materials with professional artists.",
    category: "Workshop",
    time: "Saturday, 10:00 AM",
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
      className="py-24 px-4 md:px-8 border-y transition-colors duration-500"
      style={{
        backgroundColor: infectedBg,
        borderColor: infectedBorder,
      }}
      aria-labelledby="events-title"
    >
      <div className="max-w-7xl mx-auto">
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
 * Separated for clarity and potential reuse
 *
 * Height consistency:
 * - Uses flex-col with flex-1 on description area
 * - CardContent pushed to bottom with mt-auto
 *
 * Infection support:
 * - Receives transitioning colors from parent section
 * - Border and hover states use infected color
 */
function EventCard({
  event,
  infectedColor,
  infectedColorDim,
  motionMode,
  index,
}: {
  event: (typeof EVENTS)[number]
  infectedColor: string
  infectedColorDim: string
  motionMode: "off" | "subtle" | "expressive"
  index: number
}) {
  const categoryStyle = CATEGORY_STYLES[event.category] || "bg-secondary text-secondary-foreground"

  /**
   * Hover class based on motion mode - more varied animations
   */
  const hoverClass =
    motionMode === "expressive" 
      ? index % 2 === 0 ? "hover-expand" : "hover-lift"
      : motionMode === "subtle" ? "hover-lift" : ""

  /**
   * Subtle continuous animation for expressive mode - alternating effects
   */
  const continuousAnim = motionMode === "expressive" 
    ? index % 3 === 0 ? "wave" : index % 3 === 1 ? "" : ""
    : ""

  return (
    <Card
      className={`h-full flex flex-col bg-background/50 backdrop-blur-sm transition-transform duration-300 ease-out ${hoverClass} ${continuousAnim}`}
      style={{
        borderColor: `color-mix(in oklch, ${infectedColor} 30%, transparent)`,
      }}
    >
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-bold">
            {event.title}
          </CardTitle>
          <Badge className={`shrink-0 ${categoryStyle} ${motionMode === "expressive" ? "pulse" : ""}`}>
            {event.category}
          </Badge>
        </div>
        <CardDescription className="text-base line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div
          className="flex flex-col gap-1 text-sm"
          style={{ color: infectedColorDim }}
        >
          <span className="flex items-center gap-2">
            <ClockIcon />
            {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPinIcon />
            {event.location}
          </span>
        </div>
      </CardContent>
    </Card>
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
