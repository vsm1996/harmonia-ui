/**
 * Guests Section - Featured Convention Guests
 * 
 * PERFORMANCE OPTIMIZED: Uses CSS animations and IntersectionObserver
 * instead of Framer Motion scroll-linked animations.
 */

"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { useScrollFade, fadeClass } from "@/lib/use-scroll-animation"

const GUESTS = [
  // Creator
  {
    id: "kei-urana",
    name: "Kei Urana",
    role: "The Creator",
    image: "/images/guests/kei-urana.jpg",
    bio: {
      full: "They built the Abyss. Rudo. The Cleaners. The whole world where trash becomes power. First time outside Japan. We begged.",
      short: "They made this world.",
    },
    featured: true,
  },
  // Graffiti Designer
  {
    id: "hideyoshi-andou",
    name: "Hideyoshi Andou",
    role: "Graffiti Designer",
    image: "/images/guests/hideyoshi-andou.png",
    bio: {
      full: "The visual soul of Gachiakuta. Every tag, every spray, every piece of street art in the manga and anime? That's Hideyoshi. The Abyss wouldn't look the same without him.",
      short: "The visual soul of the Abyss.",
    },
    featured: true,
  },
  // Main English Dub Cast
  {
    id: "bryson-baugus",
    name: "Bryson Baugus",
    role: "Voice of Rudo",
    image: "/images/guests/bryson-baugus.jpg",
    bio: {
      full: "Hinata from Haikyu. Bell Cranel from DanMachi. Falco from Attack on Titan. Now he's screaming as Rudo. The range is absurd.",
      short: "The voice of Rudo.",
    },
    featured: true,
  },
  {
    id: "kenneisha-thompson",
    name: "Kenneisha Thompson",
    role: "Voice of Semiu Grier",
    image: "/images/guests/kenneisha-thompson.jpg",
    bio: {
      full: "Aurelia Hammerlock from Borderlands 3. Now bringing Semiu Grier to life in the Abyss. The voice carries.",
      short: "Semiu Grier.",
    },
    featured: true,
  },
  {
    id: "zeno-robinson",
    name: "Zeno Robinson",
    role: "Voice of Jabber",
    image: "/images/guests/zeno-robinson.jpg",
    bio: {
      full: "Hawks from MHA. Genya from Demon Slayer. Cyborg from Teen Titans Go. Now he's Jabber. Every role hits different.",
      short: "Hawks. Genya. Jabber.",
    },
    featured: false,
  },
  {
    id: "christopher-wehkamp",
    name: "Christopher Wehkamp",
    role: "Voice of Enjin",
    image: "/images/guests/christopher-wehkamp.jpg",
    bio: {
      full: "Aizawa from MHA. You know, the guy who looks tired but will absolutely wreck you. Perfect energy for Enjin.",
      short: "Voice of Enjin. Also Aizawa.",
    },
    featured: false,
  },
  {
    id: "john-burgmeier",
    name: "John Burgmeier",
    role: "Voice of Regto",
    image: "/images/guests/john-burgmeier.png",
    bio: {
      full: "Tien from Dragon Ball. Been in the game since before most fans were born. Now voicing Regto. Legend status.",
      short: "Tien. Regto. Legend.",
    },
    featured: false,
  },
  {
    id: "gabe-kunda",
    name: "Gabe Kunda",
    role: "Voice of Arkha Corvus",
    image: "/images/guests/gabe-kunda.jpg",
    bio: {
      full: "Kaburagi from DECA-DENCE. Orsted from Mushoku Tensei. Rock Lock from MHA. Arkha Corvus energy? He's got it.",
      short: "Arkha Corvus.",
    },
    featured: false,
  },
  {
    id: "chris-guerrero",
    name: "Chris Guerrero",
    role: "Voice of Gris Rubion",
    image: "/images/guests/chris-guerrero.jpg",
    bio: {
      full: "Ainz Ooal Gown from Overlord. THE Overlord. Gecko Moria from One Piece. Now he's Gris Rubion. Commanding presence doesn't cover it.",
      short: "Ainz. Gris Rubion.",
    },
    featured: false,
  },
  {
    id: "katie-caruso",
    name: "Katie Caruso",
    role: "Voice of Riyo",
    image: "/images/guests/katie-caruso.jpg",
    bio: {
      full: "Bringing Riyo to life in the English dub. The character needed someone who could handle both the soft and sharp moments. She delivers.",
      short: "Voice of Riyo.",
    },
    featured: false,
  },
  {
    id: "corey-wilder",
    name: "Corey Wilder",
    role: "Voice of Zanka",
    image: "/images/guests/corey-wilder.webp",
    bio: {
      full: "Zanka. The English voice that makes the character land. If you've watched the dub, you know.",
      short: "Voice of Zanka.",
    },
    featured: false,
  },
  {
    id: "celeste-perez",
    name: "Celeste Perez",
    role: "Voice of Amo Empool",
    image: "/images/guests/celeste-perez.webp",
    bio: {
      full: "Amo Empool. The character needed someone who could balance intensity with heart. Found it.",
      short: "Amo Empool.",
    },
    featured: false,
  },
  {
    id: "adam-gibbs",
    name: "Adam Gibbs",
    role: "Voice of Tamsy Caines",
    image: "/images/guests/adam-gibbs.webp",
    bio: {
      full: "Tamsy Caines. Every Cleaner needs a voice that fits. This one fits.",
      short: "Tamsy Caines.",
    },
    featured: false,
  },
] as const

const HEADERS = {
  full: {
    title: "They Actually Said Yes",
    description: "We asked. They showed up. Still processing.",
  },
  reduced: {
    title: "Guests",
    description: "They're coming.",
  },
  minimal: {
    title: "Guests",
    description: null,
  },
}

export function GuestsSection() {
  const { context } = useCapacityContext()
  const { mode: effectiveMotion } = useEffectiveMotion()
  const { ref: sectionRef, isInView, hasPlayed } = useScrollFade<HTMLElement>()

  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })

  const motionMode = effectiveMotion
  const valence = context.emotionalState.valence

  // Adaptive color shift based on valence
  const warmthShift = valence * 15

  // Capacity-aware entrance animation
  const entranceClass =
    motionMode === "expressive"
      ? "morph-fade-in"
      : motionMode === "subtle"
        ? "sacred-fade"
        : ""

  // Capacity-aware hover animation for cards
  const hoverClass =
    motionMode === "expressive"
      ? "hover-expand"
      : motionMode === "subtle"
        ? "hover-lift"
        : ""

  const visibleGuests = mode.density === "low" ? GUESTS.filter((g) => g.featured) : GUESTS
  // DENSITY → grid (low = single col narrow, high = full 4-col)
  const gridClass = mode.density === "low"
    ? "grid-cols-1 max-w-sm mx-auto"
    : mode.density === "high"
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 lg:grid-cols-3"
  const bioLength = context.userCapacity.temporal > 0.5 ? "full" : "short"
  const headerContent = context.userCapacity.temporal > 0.5 ? HEADERS.full
    : context.userCapacity.temporal > 0.3 ? HEADERS.reduced : HEADERS.minimal
  const showViewAll = context.userCapacity.temporal > 0.4

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 bg-card/50 relative overflow-hidden"
      aria-labelledby="guests-title"
    >
      <div className="max-w-7xl mx-auto relative" style={{ filter: `hue-rotate(${warmthShift}deg)` }}>
        {/* Section header -- Minimal: tighter, no badge, no subtitle */}
        <header className={`${mode.density === "low" ? "mb-8" : "mb-16"} text-center`}>
          {mode.density !== "low" && (
            <div className={fadeClass(isInView, hasPlayed)} style={{ animationDelay: "0ms" }}>
              <Badge variant="outline" className={`mb-4 tracking-widest ${motionMode === "expressive" ? "vibrate" : ""}`}>
                GUESTS
              </Badge>
            </div>
          )}
          <h2
            id="guests-title"
            className={`font-black tracking-tight mb-4 ${fadeClass(isInView, hasPlayed)} ${
              mode.density === "low" ? "text-2xl md:text-4xl" : "text-4xl md:text-6xl"
            } ${motionMode === "expressive" ? "float" : ""}`}
            style={{ animationDelay: "50ms" }}
          >
            {headerContent.title.split(" ").slice(0, -1).join(" ")}
            <span className="text-primary"> {headerContent.title.split(" ").slice(-1)}</span>
          </h2>
          {headerContent.description && mode.density !== "low" && (
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto text-balance ${fadeClass(isInView, hasPlayed)}`}
              style={{ animationDelay: "100ms" }}
            >
              {headerContent.description}
            </p>
          )}
        </header>

        {/* Guests grid */}
        <div className={`grid ${gridClass} gap-4 md:gap-6`}>
          {visibleGuests.map((guest, index) => (
            <div
              key={guest.id}
              className={`${hasPlayed ? entranceClass : fadeClass(isInView, hasPlayed)}`}
              style={{
                animationDelay: `${150 + index * 50}ms`,
              }}
            >
              <GuestCard
                guest={guest}
                motionMode={motionMode}
                hoverClass={hoverClass}
                bioLength={bioLength}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* More guests link */}
        {showViewAll && (
          <div
            className={`mt-12 text-center ${fadeClass(isInView, hasPlayed)}`}
            style={{ animationDelay: "400ms" }}
          >
            <a
              href="#guests"
              className={`text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors ${
                motionMode === "expressive" ? "hover-pulse" : ""
              }`}
            >
              Full guest list coming soon.
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

const GUEST_GRADIENTS = [
  "from-chart-1/40 to-chart-1/15",
  "from-chart-2/40 to-chart-2/15",
  "from-chart-3/40 to-chart-3/15",
  "from-chart-5/40 to-chart-5/15",
] as const

function GuestCard({
  guest,
  motionMode,
  hoverClass,
  bioLength,
  index,
}: {
  guest: (typeof GUESTS)[number]
  motionMode: "off" | "subtle" | "expressive"
  hoverClass: string
  bioLength: "full" | "short"
  index: number
}) {
  // Use index for consistent gradient assignment (no random)
  const gradientClass = GUEST_GRADIENTS[index % GUEST_GRADIENTS.length]
  const bio = guest.bio[bioLength]

  return (
    <Card className={`overflow-hidden group cursor-pointer h-full border-border/50 ${
      motionMode !== "off" ? "hover:border-primary/50 hover:shadow-lg transition-all duration-300" : ""
    } ${hoverClass} ${motionMode === "expressive" ? "breathe" : ""}`}>
      {/* Guest image */}
      <div className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <div className={`absolute inset-0 ${motionMode !== "off" ? "transition-transform duration-500 group-hover:scale-105" : ""}`}>
          <Image
            src={guest.image || "/placeholder.svg"}
            alt={`${guest.name} - ${guest.role}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {guest.featured && (
          <Badge className={`absolute top-3 left-3 bg-accent text-accent-foreground z-10 ${motionMode === "expressive" ? "pulse" : ""}`}>
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className={`font-bold text-lg group-hover:text-primary transition-colors ${motionMode === "expressive" ? "float" : ""}`}>
          {guest.name}
        </h3>
        <p className="text-accent text-sm font-medium mb-2">
          {guest.role}
        </p>
        <p className="text-muted-foreground text-sm">
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}
