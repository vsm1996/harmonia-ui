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
import { useScrollAnimation } from "@/lib/use-scroll-animation"

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
    featured: true,
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
  const sectionRef = useScrollAnimation<HTMLElement>()

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

  const visibleGuests = mode.density === "low" ? GUESTS.filter((g) => g.featured) : GUESTS
  const gridClass = mode.density === "low" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
  const bioLength = context.userCapacity.temporal > 0.5 ? "full" : "short"
  const headerContent = context.userCapacity.temporal > 0.5 ? HEADERS.full
    : context.userCapacity.temporal > 0.3 ? HEADERS.reduced : HEADERS.minimal
  const showViewAll = context.userCapacity.temporal > 0.4
  const animateClass = motionMode !== "off" ? "animate-fade-in" : ""

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 bg-card/50 relative overflow-hidden"
      aria-labelledby="guests-title"
    >
      <div className="max-w-7xl mx-auto relative" style={{ filter: `hue-rotate(${warmthShift}deg)` }}>
        {/* Section header */}
        <header className="mb-16 text-center">
          <div className={animateClass} style={{ animationDelay: "0ms" }}>
            <Badge variant="outline" className="mb-4 tracking-widest">
              GUESTS
            </Badge>
          </div>
          <h2
            id="guests-title"
            className={`text-4xl md:text-6xl font-black tracking-tight mb-4 ${animateClass}`}
            style={{ animationDelay: "50ms" }}
          >
            {headerContent.title.split(" ").slice(0, -1).join(" ")}
            <span className="text-primary"> {headerContent.title.split(" ").slice(-1)}</span>
          </h2>
          {headerContent.description && (
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto text-balance ${animateClass}`}
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
              className={motionMode !== "off" ? "animate-fade-in in-view" : ""}
              style={{ 
                animationDelay: `${150 + index * 30}ms`,
              }}
            >
              <GuestCard
                guest={guest}
                motionMode={motionMode}
                bioLength={bioLength}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* More guests link */}
        {showViewAll && (
          <div
            className={`mt-12 text-center ${animateClass}`}
            style={{ animationDelay: "400ms" }}
          >
            <a
              href="#guests"
              className="text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors hover:translate-x-1"
            >
              Full guest list coming soon.
              <span aria-hidden="true">-&gt;</span>
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
  bioLength,
  index,
}: {
  guest: (typeof GUESTS)[number]
  motionMode: "off" | "subtle" | "expressive"
  bioLength: "full" | "short"
  index: number
}) {
  // Use index for consistent gradient assignment (no random)
  const gradientClass = GUEST_GRADIENTS[index % GUEST_GRADIENTS.length]
  const bio = guest.bio[bioLength]
  const hoverClass = motionMode !== "off" ? "hover:-translate-y-2 hover:shadow-lg" : ""

  return (
    <Card className={`overflow-hidden group cursor-pointer h-full border-border/50 hover:border-primary/50 transition-all duration-300 ${hoverClass}`}>
      {/* Guest image */}
      <div className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
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
        <p className="text-muted-foreground text-sm">
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}
