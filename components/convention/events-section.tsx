/**
 * Events Section - Convention Schedule Grid
 *
 * Design decisions:
 * - Grid density adapts to energy field (more columns when alert)
 * - Card expansion behavior responds to attention field
 * - Staggered animations for visual interest
 * - Categories use semantic colors from the design system
 */

"use client"

import { motion } from "motion/react"
import { useEnergyField, useAttentionField } from "@/lib/empathy"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const energy = useEnergyField()
  const attention = useAttentionField()

  /**
   * Grid columns adapt to energy level
   * Low energy: simpler 1-2 column layout (less cognitive load)
   * High energy: denser 3 column layout (can process more)
   */
  const gridClass =
    energy.value < 0.4
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  /**
   * Animation stagger based on attention
   * Higher attention = faster stagger (user is engaged)
   * Lower attention = slower, gentler reveal
   */
  const staggerDelay = 0.15 - attention.value * 0.08

  return (
    <section
      className="py-24 px-4 md:px-8"
      aria-labelledby="events-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.header
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 tracking-widest">
            SCHEDULE
          </Badge>
          <h2
            id="events-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            Descend Into
            <span className="text-primary"> The Events</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Three days of panels, competitions, screenings, and experiences
            designed for true outcasts.
          </p>
        </motion.header>

        {/* Events grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * staggerDelay,
              }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#schedule"
            className="text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors"
          >
            View Full Schedule
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
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
 */
function EventCard({
  event,
}: {
  event: (typeof EVENTS)[number]
}) {
  const categoryStyle = CATEGORY_STYLES[event.category] || "bg-secondary text-secondary-foreground"

  return (
    <Card className="h-full flex flex-col hover:border-primary/50 transition-colors duration-300 group">
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>
          <Badge className={`shrink-0 ${categoryStyle}`}>{event.category}</Badge>
        </div>
        <CardDescription className="text-base line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
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
