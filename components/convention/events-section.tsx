"use client"

import { useState, useCallback } from "react"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfectedText } from "@/components/infected-text"

/**
 * Events Section - Simplified for scroll performance
 * Uses CSS animations instead of Framer Motion
 */

const EVENTS = [
  {
    id: "jinki-forge",
    title: "Jinki Forge: Build Your Weapon",
    shortTitle: "Jinki Forge",
    description: {
      full: "Your trash. Your emotions. Your weapon. Craft a Jinki from salvaged materials with pro prop makers.",
      short: "Build a Jinki from trash. Keep it.",
    },
    category: "Workshop",
    time: "All Days",
    shortTime: "All Days",
    location: "Workshop Zone",
  },
  {
    id: "cosplay-championship",
    title: "Scavenger's Championship",
    shortTitle: "Cosplay Champ",
    description: {
      full: "50% of your costume must be salvaged. Broken electronics. Discarded fabric. Turn it into something they can't look away from.",
      short: "Salvage cosplay competition.",
    },
    category: "Competition",
    time: "Saturday, 2:00 PM",
    shortTime: "Sat 2PM",
    location: "Main Hall",
  },
  {
    id: "artist-alley",
    title: "The Pile",
    shortTitle: "Artist Alley",
    description: {
      full: "217 artists. Outcasts. Weirdos. People who make beautiful things the mainstream won't touch.",
      short: "217 artists. The real ones.",
    },
    category: "Exhibition",
    time: "All Days",
    shortTime: "All Days",
    location: "Hall B",
  },
  {
    id: "gachiakuta-panel",
    title: "Words From The Creator",
    shortTitle: "Urana Q&A",
    description: {
      full: "Kei Urana. The one who built this world. The Abyss. Rudo. The Cleaners. He's here. He's talking.",
      short: "Kei Urana. In person.",
    },
    category: "Panel",
    time: "Sunday, 11:00 AM",
    shortTime: "Sun 11AM",
    location: "Panel Room A",
  },
  {
    id: "abyss-escape",
    title: "Escape The Cleaners",
    shortTitle: "Escape Room",
    description: {
      full: "They're coming. You have 45 minutes. Solve the puzzles. Find the exit. 23% success rate.",
      short: "45 minutes. 23% survive.",
    },
    category: "Interactive",
    time: "All Days",
    shortTime: "All Days",
    location: "Experience Zone",
  },
  {
    id: "midnight-screening",
    title: "Depths of Night",
    shortTitle: "Late Screening",
    description: {
      full: "2AM. The stuff too raw for daylight. Stories about people who fell through the cracks.",
      short: "2AM. The dark stuff.",
    },
    category: "Screening",
    time: "Fri & Sat, 2:00 AM",
    shortTime: "Fri-Sat 2AM",
    location: "Theater 1",
  },
] as const

const CATEGORY_STYLES: Record<string, string> = {
  Competition: "bg-orange-600 text-white",
  Exhibition: "bg-emerald-600 text-white",
  Panel: "bg-blue-600 text-white",
  Interactive: "bg-purple-600 text-white",
  Screening: "bg-red-600 text-white",
  Workshop: "bg-primary text-primary-foreground",
}

export function EventsSection() {
  const { context } = useCapacityContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })

  const cognitiveCapacity = context.userCapacity.cognitive
  const temporalCapacity = context.userCapacity.temporal

  const gridClass = mode.density === "low"
    ? "grid-cols-1 md:grid-cols-2"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  const infectedColor = "oklch(0.65 0.18 55)"

  return (
    <section
      className="py-24 px-4 md:px-8 border-y border-border/30 bg-muted/20"
      aria-labelledby="events-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center animate-fade-in">
          <Badge variant="outline" className="mb-4 tracking-widest text-primary border-primary/50">
            SCHEDULE
          </Badge>
          <h2 id="events-title" className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <InfectedText text="What We" infectColor={infectedColor} />
            <span style={{ color: infectedColor }}> Salvaged</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            The world above threw this stuff away. We made it into something.
          </p>
        </header>

        {/* Events grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {EVENTS.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <EventCard
                event={event}
                cognitiveCapacity={cognitiveCapacity}
                temporalCapacity={temporalCapacity}
                guidance={mode.guidance}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <a
            href="#schedule"
            className="font-medium tracking-wide inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            View Full Schedule
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function EventCard({
  event,
  cognitiveCapacity,
  temporalCapacity,
  guidance,
}: {
  event: (typeof EVENTS)[number]
  cognitiveCapacity: number
  temporalCapacity: number
  guidance: "low" | "medium" | "high"
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categoryStyle = CATEGORY_STYLES[event.category] || "bg-secondary text-secondary-foreground"

  const isLowCognitive = cognitiveCapacity < 0.35
  const isLowTemporal = temporalCapacity < 0.35

  const shouldAutoShowDescription = cognitiveCapacity > 0.25
  const showDescription = shouldAutoShowDescription || isExpanded
  const showTapHint = guidance === "high" && !shouldAutoShowDescription && !isExpanded

  const title = isLowTemporal && !isExpanded ? event.shortTitle : event.title
  const description = isLowTemporal ? event.description.short : event.description.full
  const time = isLowTemporal && !isExpanded ? event.shortTime : event.time
  const showLocation = temporalCapacity > 0.3 || isExpanded

  const handleCardClick = useCallback(() => {
    if (!shouldAutoShowDescription) {
      setIsExpanded(prev => !prev)
    }
  }, [shouldAutoShowDescription])

  return (
    <Card
      className={`h-full flex flex-col overflow-hidden transition-colors duration-200 ${
        !shouldAutoShowDescription ? "cursor-pointer hover:border-primary/50" : ""
      }`}
      onClick={handleCardClick}
      role={!shouldAutoShowDescription ? "button" : undefined}
      tabIndex={!shouldAutoShowDescription ? 0 : undefined}
      onKeyDown={!shouldAutoShowDescription ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleCardClick()
        }
      } : undefined}
    >
      {/* Category color bar */}
      <div className={`h-1.5 w-full ${categoryStyle.split(" ")[0]}`} />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className={`font-bold leading-tight ${isLowCognitive ? "text-base" : "text-lg"}`}>
            {title}
          </CardTitle>
          <Badge className={`shrink-0 text-xs font-semibold ${categoryStyle}`}>
            {event.category}
          </Badge>
        </div>

        {showDescription && (
          <CardDescription className="text-sm text-muted-foreground/90 mt-2">
            {description}
          </CardDescription>
        )}

        {showTapHint && (
          <p className="text-xs text-muted-foreground/60 italic mt-1">Tap for details</p>
        )}
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="text-primary font-medium">{time}</span>
          {showLocation && <span>{event.location}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
