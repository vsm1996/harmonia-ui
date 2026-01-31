/**
 * Guests Section - Featured Convention Guests
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (guest count, grid columns, visual complexity)
 * - Temporal → content length (bio verbosity, "view all" link)
 * - Emotional → motion restraint (animation intensity)
 * - Valence → (not used here - tone doesn't apply to factual guest info)
 */

"use client"

import { useCapacityContext, deriveMode } from "@/lib/capacity"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * Guest data with variants for different cognitive loads
 */
const GUESTS = [
  {
    id: "kei-urana",
    name: "Kei Urana",
    role: "Gachiakuta Creator",
    bio: {
      full: "The mastermind behind the world of the Abyss. First US appearance.",
      short: "Creator of Gachiakuta. First US visit.",
    },
    featured: true,
  },
  {
    id: "voice-actor-1",
    name: "Yuki Kaji",
    role: "Voice Actor",
    bio: {
      full: "Known for Eren Yeager, bringing intensity to every role.",
      short: "Voice of Eren Yeager.",
    },
    featured: true,
  },
  {
    id: "animator-1",
    name: "Shingo Yamashita",
    role: "Key Animator",
    bio: {
      full: "Action sequences that define modern anime aesthetics.",
      short: "Legendary action animator.",
    },
    featured: false,
  },
  {
    id: "cosplay-judge",
    name: "Vampy Bit Me",
    role: "Cosplay Judge",
    bio: {
      full: "Professional cosplayer and craftsmanship expert.",
      short: "Pro cosplayer & judge.",
    },
    featured: false,
  },
] as const

/**
 * Section header text variants
 */
const HEADERS = {
  full: {
    title: "Meet The Legends",
    description: "Industry icons, creators, and personalities who understand what it means to rise from nothing.",
  },
  reduced: {
    title: "Meet The Legends",
    description: "Industry icons and creators joining us this year.",
  },
  minimal: {
    title: "Our Guests",
    description: null,
  },
}

export function GuestsSection() {
  const { context } = useCapacityContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density (guest count, grid columns)
  // Controls how many things compete for attention at once
  // ═══════════════════════════════════════════════════════════════════════════
  const visibleGuests =
    mode.density === "low" ? GUESTS.filter((g) => g.featured) : GUESTS

  const gridClass =
    mode.density === "low"
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-2 lg:grid-cols-4"

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL → Content Length (bio verbosity, header detail, view all link)
  // Controls how much time the UI asks from the user
  // ═══════════════════════════════════════════════════════════════════════════
  const bioLength = context.userCapacity.temporal > 0.5 ? "full" : "short"

  const headerContent =
    context.userCapacity.temporal > 0.5
      ? HEADERS.full
      : context.userCapacity.temporal > 0.3
        ? HEADERS.reduced
        : HEADERS.minimal

  const showViewAll = context.userCapacity.temporal > 0.4

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL → Motion Restraint (animation intensity)
  // Low emotional = no surprises, calm UI
  // ═══════════════════════════════════════════════════════════════════════════
  const sectionAnimClass = mode.motion !== "off" ? "sacred-fade" : ""

  return (
    <section
      className="py-24 px-4 md:px-8 bg-card/50"
      aria-labelledby="guests-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header - bloom animation for organic reveal */}
        <header className={`mb-16 text-center ${mode.motion === "expressive" ? "bloom" : sectionAnimClass}`}>
          <Badge variant="outline" className="mb-4 tracking-widest">
            GUESTS
          </Badge>
          <h2
            id="guests-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            {headerContent.title.split(" ").slice(0, -1).join(" ")}
            <span className="text-primary"> {headerContent.title.split(" ").slice(-1)}</span>
          </h2>
          {headerContent.description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              {headerContent.description}
            </p>
          )}
        </header>

        {/* Guests grid - adapts columns to density */}
        <div className={`grid ${gridClass} gap-4 md:gap-6`}>
          {visibleGuests.map((guest, index) => (
            <div
              key={guest.id}
              className={mode.motion === "expressive" ? "helix-rise" : sectionAnimClass}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <GuestCard
                guest={guest}
                motionMode={mode.motion}
                index={index}
                bioLength={bioLength}
              />
            </div>
          ))}
        </div>

        {/* More guests link - conditionally shown */}
        {showViewAll && (
          <div className={`mt-12 text-center ${sectionAnimClass}`}>
            <a
              href="#guests"
              className="text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors hover-lift"
            >
              View All 50+ Guests
              <span aria-hidden="true">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Guest card gradient backgrounds
 * Maps to chart colors from the Gachiakuta theme
 */
const GUEST_GRADIENTS = [
  "from-chart-1/40 to-chart-1/15", // Rust
  "from-chart-2/40 to-chart-2/15", // Toxic green
  "from-chart-3/40 to-chart-3/15", // Industrial teal
  "from-chart-5/40 to-chart-5/15", // Deep purple
] as const

/**
 * Individual guest card
 * Adapts bio length and hover behavior based on capacity state
 */
function GuestCard({
  guest,
  motionMode,
  index,
  bioLength,
}: {
  guest: (typeof GUESTS)[number]
  motionMode: "off" | "subtle" | "expressive"
  index: number
  bioLength: "full" | "short"
}) {
  const gradientClass = GUEST_GRADIENTS[index % GUEST_GRADIENTS.length]
  const bio = guest.bio[bioLength]

  /**
   * Hover class based on motion mode
   * Expressive: hover-pulse for energetic feedback
   * Subtle: hover-expand for gentle feedback
   * Off: no hover animation
   */
  const hoverClass =
    motionMode === "expressive" ? "hover-expand" : motionMode === "subtle" ? "hover-lift" : ""

  return (
    <Card className={`overflow-hidden group cursor-pointer h-full border-border/50 hover:border-primary/50 transition-colors ${hoverClass}`}>
      {/* Abstract image placeholder */}
      <div
        className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${gradientClass}`}
      >
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        {guest.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
          {guest.name}
        </h3>
        <p className="text-accent text-sm font-medium mb-2">
          {guest.role}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}
