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
  {
    id: "kei-urana",
    name: "Kei Urana",
    role: "The Creator",
    image: "/images/guests/kei-urana.jpg",
    bio: {
      full: "He built the Abyss. Rudo. The Cleaners. The whole world where trash becomes power. First time outside Japan. We begged.",
      short: "He made this world.",
    },
    featured: true,
  },
  {
    id: "zeno-robinson",
    name: "Zeno Robinson",
    role: "Voice of Hawks",
    image: "/images/guests/zeno-robinson.jpg",
    bio: {
      full: "Hawks. The guy who looks like he's joking until he's not. Zeno gets it. He always got it.",
      short: "Hawks.",
    },
    featured: true,
  },
  {
    id: "anairis-quinones",
    name: "Anairis Quinones",
    role: "Voice of Mirko",
    image: "/images/guests/anairis-quinones.jpg",
    bio: {
      full: "Mirko. You know, rabbit-kick-lady who made everyone on Twitter realize something about themselves. That's Anairis.",
      short: "Mirko.",
    },
    featured: true,
  },
  {
    id: "voice-actor-1",
    name: "Yuki Kaji",
    role: "Voice of Eren",
    image: "/images/guests/yuki-kaji.jpg",
    bio: {
      full: "Keep moving forward.",
      short: "Eren.",
    },
    featured: true,
  },
  {
    id: "animator-1",
    name: "Shingo Yamashita",
    role: "Key Animator",
    image: "/images/guests/shingo-yamashita.jpg",
    bio: {
      full: "You know that one scene you've rewatched like 50 times trying to figure out how it works? Probably him.",
      short: "That scene. You know the one.",
    },
    featured: false,
  },
  {
    id: "steve-blum",
    name: "Steve Blum",
    role: "Voice Legend",
    image: "/images/guests/steve-blum.jpg",
    bio: {
      full: "Spike. Mugen. Wolverine. 400+ roles. Started doing voices because he couldn't afford acting classes. Turned trash into treasure before it was a manga.",
      short: "Spike. Mugen. A legend.",
    },
    featured: false,
  },
  {
    id: "cristina-vee",
    name: "Cristina Vee",
    role: "Voice Actor",
    image: "/images/guests/cristina-vee.jpg",
    bio: {
      full: "Homura, Marinette, like 200 other roles. Also sings. Also directs. Will also destroy you at Smash Bros if you challenge her at the afterparty. (Don't.)",
      short: "Homura. Don't challenge her at Smash.",
    },
    featured: false,
  },
  {
    id: "bryce-papenbrook",
    name: "Bryce Papenbrook",
    role: "Voice Actor",
    image: "/images/guests/bryce-papenbrook.jpg",
    bio: {
      full: "English Eren. Kirito. Inosuke. If the protagonist is screaming about protecting someone, it's probably him. Weirdly zen in person.",
      short: "English Eren. Kirito. Inosuke.",
    },
    featured: false,
  },
  {
    id: "erica-mendez",
    name: "Erica Mendez",
    role: "Voice Actor",
    image: "/images/guests/erica-mendez.jpg",
    bio: {
      full: "Ryuko. Gon. Megumin. Range from 'small and will explode' to 'will punch through a wall.' Sometimes both.",
      short: "Ryuko. Gon. Explosive.",
    },
    featured: false,
  },
  {
    id: "yutaka-nakamura",
    name: "Yutaka Nakamura",
    role: "Key Animator",
    image: "/images/guests/yutaka-nakamura.jpg",
    bio: {
      full: "Your favorite fight scene. The one you've rewatched a hundred times. The one that made you feel something. Him.",
      short: "THE fight scene animator.",
    },
    featured: false,
  },
  {
    id: "mitsuo-iso",
    name: "Mitsuo Iso",
    role: "Animator/Director",
    image: "/images/guests/mitsuo-iso.jpg",
    bio: {
      full: "Made Dennou Coil. Literally invented an animation technique. Probably thinking about frame interpolation right now as you read this.",
      short: "Dennou Coil guy.",
    },
    featured: false,
  },
  {
    id: "cosplay-judge",
    name: "Vampy Bit Me",
    role: "Scavenger Judge",
    image: "/images/guests/vampy-bit-me.jpg",
    bio: {
      full: "She's judged Scavenger Championships for five years. She knows real craft from bought craft. Bring your best or don't.",
      short: "The judge.",
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
              className={animateClass}
              style={{ animationDelay: `${150 + index * 30}ms` }}
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
              View All 50+ Guests
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
