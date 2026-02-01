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

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"
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
      full: "Mirko doesn't wait for backup. Neither does Anairis. She fought for that role. Now she's here.",
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
      full: "Every frame a weapon. He makes motion feel like impact. The scenes that hit different? Probably him.",
      short: "The frames that hit different.",
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
      full: "Homura. The girl who kept fighting even when the world told her to stop. Cristina brings that energy to everything.",
      short: "Homura. Marinette. A fighter.",
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
      full: "Ryuko. Gon. Characters who got knocked down and got back up angrier. That's her whole range. Unstoppable.",
      short: "Ryuko. Gon. Unstoppable.",
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
      full: "Invented full limited animation. Created Dennou Coil. Sees movement differently than everyone else on earth.",
      short: "Dennou Coil. Visionary.",
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

/**
 * Section header text variants
 */
const HEADERS = {
  full: {
    title: "The Tribe Leaders",
    description: "Legends who climbed out of the pile. Now they're coming back down to meet you.",
  },
  reduced: {
    title: "Our Tribe",
    description: "The ones who made it.",
  },
  minimal: {
    title: "Guests",
    description: null,
  },
}

export function GuestsSection() {
  const { context } = useCapacityContext()
  const { mode: effectiveMotion } = useEffectiveMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" })
  
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  // Use effective motion (respects prefers-reduced-motion)
  const motionMode = effectiveMotion
  
  // Spring config based on motion mode
  const springConfig = motionMode === "expressive" 
    ? { stiffness: 80, damping: 12 } 
    : { stiffness: 200, damping: 25 }
  
  // Scroll parallax for section
  // Removed scroll-linked parallax for performance

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
      ref={sectionRef}
      className="py-24 px-4 md:px-8 bg-card/50 relative overflow-hidden"
      aria-labelledby="guests-title"
    >
      {/* Decorative SVGs */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        aria-hidden="true"
      >
        <BuzzingFlies size={48} className="absolute top-16 right-8 text-muted-foreground/25" />
        <SalvagedWeapon size={56} className="absolute bottom-12 left-8 text-primary/15 -rotate-12" />
        <CrackPattern width={100} height={50} className="absolute top-1/2 right-4 text-muted-foreground/10" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section header with entrance animation */}
        <motion.header 
          className="mb-16 text-center"
          initial={motionMode !== "off" ? { opacity: 0, y: 40 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ...springConfig }}
        >
          <motion.div
            initial={motionMode !== "off" ? { scale: 0.8, opacity: 0 } : false}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="outline" className={`mb-4 tracking-widest ${motionMode === "expressive" ? "float" : ""}`}>
              GUESTS
            </Badge>
          </motion.div>
          <motion.h2
            id="guests-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            initial={motionMode !== "off" ? { opacity: 0, y: 30 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ...springConfig }}
          >
            {headerContent.title.split(" ").slice(0, -1).join(" ")}
            <motion.span 
              className="text-primary"
              whileHover={motionMode === "expressive" ? { scale: 1.1, textShadow: "0 0 30px hsl(var(--primary))" } : {}}
            > {headerContent.title.split(" ").slice(-1)}</motion.span>
          </motion.h2>
          {headerContent.description && (
            <motion.p 
              className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance"
              initial={motionMode !== "off" ? { opacity: 0 } : false}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {headerContent.description}
            </motion.p>
          )}
        </motion.header>

        {/* Guests grid - simplified entrance for better scroll perf */}
        <div className={`grid ${gridClass} gap-4 md:gap-6`}>
          {visibleGuests.map((guest, index) => (
            <motion.div
              key={guest.id}
              initial={motionMode !== "off" ? { opacity: 0, y: 30 } : false}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
            >
              <GuestCard
                guest={guest}
                motionMode={motionMode}
                index={index}
                bioLength={bioLength}
                springConfig={springConfig}
              />
            </motion.div>
          ))}
        </div>

        {/* More guests link with hover animation */}
        {showViewAll && (
          <motion.div 
            className="mt-12 text-center"
            initial={motionMode !== "off" ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.a
              href="#guests"
              className="text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors"
              whileHover={motionMode !== "off" ? { x: 5, scale: 1.05 } : {}}
              whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
            >
              View All 50+ Guests
              <motion.span 
                aria-hidden="true"
                animate={motionMode === "expressive" ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                -&gt;
              </motion.span>
            </motion.a>
          </motion.div>
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
 * Individual guest card with Framer Motion interactions
 * 
 * Bio display logic:
 * - At high temporal: Show full bio (no truncation)
 * - At low temporal: Show short bio (already sentence-complete)
 * - This avoids mid-sentence truncation issues
 */
function GuestCard({
  guest,
  motionMode,
  index,
  bioLength,
  springConfig,
}: {
  guest: (typeof GUESTS)[number]
  motionMode: "off" | "subtle" | "expressive"
  index: number
  bioLength: "full" | "short"
  springConfig: { stiffness: number; damping: number }
}) {
  const gradientClass = GUEST_GRADIENTS[index % GUEST_GRADIENTS.length]
  // Use the appropriate bio variant - both are complete sentences
  const bio = guest.bio[bioLength]

  return (
    <motion.div
      className="h-full"
      whileHover={motionMode !== "off" ? { y: -8 } : {}}
      whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
      transition={{ type: "spring", ...springConfig }}
    >
      <Card className="overflow-hidden group cursor-pointer h-full border-border/50 hover:border-primary/50 transition-colors">
        {/* Guest image with hover zoom */}
        <div
          className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${gradientClass}`}
        >
          <motion.div 
            className="absolute inset-0"
            whileHover={motionMode !== "off" ? { scale: 1.1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={guest.image}
              alt={`${guest.name} - ${guest.role}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          {guest.featured && (
            <motion.div
              initial={motionMode !== "off" ? { scale: 0, rotate: -10 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
            >
              <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground z-10">
                Featured
              </Badge>
            </motion.div>
          )}
          
          {/* Hover overlay effect for expressive mode */}
          {motionMode === "expressive" && (
            <motion.div
              className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          )}
        </div>

        <CardContent className="p-4">
          <motion.h3 
            className="font-bold text-lg group-hover:text-primary transition-colors"
            whileHover={motionMode === "expressive" ? { x: 5 } : {}}
          >
            {guest.name}
          </motion.h3>
          <p className="text-accent text-sm font-medium mb-2">
            {guest.role}
          </p>
          {/* Bio shown without line-clamp - variants are already sentence-complete */}
          <p className="text-muted-foreground text-sm">
            {bio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
