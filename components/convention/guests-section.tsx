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

import Image from "next/image"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BuzzingFlies, SalvagedWeapon, CrackPattern } from "./gachiakuta-svgs"

/**
 * Guest data with variants for different cognitive loads
 */
const GUESTS = [
  {
    id: "kei-urana",
    name: "Kei Urana",
    role: "Gachiakuta Creator",
    image: "/images/guests/kei-urana.jpg",
    bio: {
      full: "The mastermind behind the world of the Abyss. First US appearance.",
      short: "Creator of Gachiakuta. First US visit.",
    },
    featured: true,
  },
  {
    id: "zeno-robinson",
    name: "Zeno Robinson",
    role: "Voice Actor",
    image: "/images/guests/zeno-robinson.jpg",
    bio: {
      full: "The voice of Hawks in My Hero Academia, bringing charm and depth to fan-favorite characters.",
      short: "Voice of Hawks (My Hero Academia).",
    },
    featured: true,
  },
  {
    id: "anairis-quinones",
    name: "Anairis Quinones",
    role: "Voice Actor",
    image: "/images/guests/anairis-quinones.jpg",
    bio: {
      full: "Powerhouse voice behind Mirko in My Hero Academia. Breaking barriers in anime dubbing.",
      short: "Voice of Mirko (My Hero Academia).",
    },
    featured: true,
  },
  {
    id: "voice-actor-1",
    name: "Yuki Kaji",
    role: "Voice Actor",
    image: "/images/guests/yuki-kaji.jpg",
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
    image: "/images/guests/shingo-yamashita.jpg",
    bio: {
      full: "Action sequences that define modern anime aesthetics.",
      short: "Legendary action animator.",
    },
    featured: false,
  },
  {
    id: "steve-blum",
    name: "Steve Blum",
    role: "Voice Actor",
    image: "/images/guests/steve-blum.jpg",
    bio: {
      full: "Legendary voice of Spike Spiegel in Cowboy Bebop. Over 400+ anime and game roles.",
      short: "Voice of Spike Spiegel (Cowboy Bebop).",
    },
    featured: false,
  },
  {
    id: "cristina-vee",
    name: "Cristina Vee",
    role: "Voice Actor",
    image: "/images/guests/cristina-vee.jpg",
    bio: {
      full: "Voice of Homura in Madoka Magica and Marinette in Miraculous Ladybug. Singer and director.",
      short: "Voice of Homura (Madoka Magica).",
    },
    featured: false,
  },
  {
    id: "bryce-papenbrook",
    name: "Bryce Papenbrook",
    role: "Voice Actor",
    image: "/images/guests/bryce-papenbrook.jpg",
    bio: {
      full: "The voice behind Eren Yeager (English), Kirito, and Inosuke. A titan of anime dubbing.",
      short: "Voice of Eren (English), Kirito, Inosuke.",
    },
    featured: false,
  },
  {
    id: "erica-mendez",
    name: "Erica Mendez",
    role: "Voice Actor",
    image: "/images/guests/erica-mendez.jpg",
    bio: {
      full: "Voice of Ryuko in Kill la Kill and Gon in Hunter x Hunter. Versatile and iconic.",
      short: "Voice of Ryuko (Kill la Kill).",
    },
    featured: false,
  },
  {
    id: "yutaka-nakamura",
    name: "Yutaka Nakamura",
    role: "Key Animator",
    image: "/images/guests/yutaka-nakamura.jpg",
    bio: {
      full: "The animation genius behind iconic fight scenes in My Hero Academia and Mob Psycho 100.",
      short: "Legendary fight scene animator.",
    },
    featured: false,
  },
  {
    id: "mitsuo-iso",
    name: "Mitsuo Iso",
    role: "Animator/Director",
    image: "/images/guests/mitsuo-iso.jpg",
    bio: {
      full: "Creator of Dennou Coil. Pioneer of full limited animation technique.",
      short: "Creator of Dennou Coil.",
    },
    featured: false,
  },
  {
    id: "cosplay-judge",
    name: "Vampy Bit Me",
    role: "Cosplay Judge",
    image: "/images/guests/vampy-bit-me.jpg",
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
  const { mode: effectiveMotion } = useEffectiveMotion()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  // Use effective motion (respects prefers-reduced-motion)
  const motionMode = effectiveMotion

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
  const sectionAnimClass = motionMode === "subtle" ? "spiral-in" : ""

  return (
    <section
      className="py-24 px-4 md:px-8 bg-card/50 relative"
      aria-labelledby="guests-title"
    >
      {/* Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <BuzzingFlies size={48} className="absolute top-16 right-8 text-muted-foreground/25" />
        <SalvagedWeapon size={56} className="absolute bottom-12 left-8 text-primary/15 -rotate-12" />
        <CrackPattern width={100} height={50} className="absolute top-1/2 right-4 text-muted-foreground/10" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section header - vortex-reveal like legends emerging from chaos */}
        <header className={`mb-16 text-center ${motionMode === "expressive" ? "vortex-reveal" : motionMode === "subtle" ? "bloom" : ""}`}>
          <Badge variant="outline" className={`mb-4 tracking-widest ${motionMode === "expressive" ? "float" : ""}`}>
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

        {/* Guests grid - helix-rise like outcasts rising from the Abyss */}
        <div className={`grid ${gridClass} gap-4 md:gap-6`}>
          {visibleGuests.map((guest, index) => (
            <div
              key={guest.id}
              className={motionMode === "expressive" ? "helix-rise" : motionMode === "subtle" ? "gentle-fade" : ""}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <GuestCard
                guest={guest}
                motionMode={motionMode}
                index={index}
                bioLength={bioLength}
              />
            </div>
          ))}
        </div>

        {/* More guests link - conditionally shown */}
        {showViewAll && (
          <div className={`mt-12 text-center ${motionMode === "expressive" ? "float" : motionMode === "subtle" ? "gentle-fade" : ""}`}>
            <a
              href="#guests"
              className={`text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors ${
                motionMode === "expressive" ? "hover-lift" : ""
              }`}
            >
              View All 50+ Guests
              <span aria-hidden="true">-&gt;</span>
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
   * Hover class based on motion mode - more thematic variety
   * Expressive: alternating between hover-expand and hover-pulse
   * Subtle: hover-lift for gentle feedback
   * Off: no hover animation
   */
  const hoverClass =
    motionMode === "expressive" 
      ? index % 2 === 0 ? "hover-expand" : "hover-pulse"
      : motionMode === "subtle" ? "hover-lift" : ""

  /**
   * Continuous animation for featured guests in expressive mode
   */
  const featuredAnim = guest.featured && motionMode === "expressive" ? "breathe" : ""

  return (
    <Card className={`overflow-hidden group cursor-pointer h-full border-border/50 hover:border-primary/50 transition-colors ${hoverClass} ${featuredAnim}`}>
      {/* Guest image */}
      <div
        className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${gradientClass}`}
      >
        <Image
          src={guest.image}
          alt={`${guest.name} - ${guest.role}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {guest.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground z-10">
            Featured
          </Badge>
        )}
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
