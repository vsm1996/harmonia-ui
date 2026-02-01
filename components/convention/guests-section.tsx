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
import { motion, useInView, useScroll, useTransform, useSpring } from "motion/react"
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
      full: "First time leaving Japan for a convention. We had to beg. Like, actually beg. His editor said no three times.",
      short: "First US appearance ever.",
    },
    featured: true,
  },
  {
    id: "zeno-robinson",
    name: "Zeno Robinson",
    role: "Voice Actor",
    image: "/images/guests/zeno-robinson.jpg",
    bio: {
      full: "Hawks. That's it. That's the bio. (Also Goh in Pokemon but we know why you're here.)",
      short: "Voice of Hawks.",
    },
    featured: true,
  },
  {
    id: "anairis-quinones",
    name: "Anairis Quinones",
    role: "Voice Actor",
    image: "/images/guests/anairis-quinones.jpg",
    bio: {
      full: "Mirko. She's done other stuff too but let's be honest you're here because rabbit-kick-lady made you feel things.",
      short: "Voice of Mirko.",
    },
    featured: true,
  },
  {
    id: "voice-actor-1",
    name: "Yuki Kaji",
    role: "Voice Actor",
    image: "/images/guests/yuki-kaji.jpg",
    bio: {
      full: "TATAKAE. TATAKAE. TATAKAE.",
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
      full: "If you've rewatched a fight scene 47 times trying to understand how it works, it was probably him.",
      short: "That fight scene? Probably him.",
    },
    featured: false,
  },
  {
    id: "steve-blum",
    name: "Steve Blum",
    role: "Voice Actor",
    image: "/images/guests/steve-blum.jpg",
    bio: {
      full: "Spike Spiegel. Wolverine. Grunt. Amon. Orochimaru. 400+ roles. Will be doing his famous hot dog eating contest bit at the Saturday mixer. Don't ask, just show up.",
      short: "You know who this is.",
    },
    featured: false,
  },
  {
    id: "cristina-vee",
    name: "Cristina Vee",
    role: "Voice Actor",
    image: "/images/guests/cristina-vee.jpg",
    bio: {
      full: "Homura. Marinette. Verosika. Also sings, directs, and will absolutely destroy you in Smash if you challenge her. Don't.",
      short: "Homura, Marinette, + 200 others.",
    },
    featured: false,
  },
  {
    id: "bryce-papenbrook",
    name: "Bryce Papenbrook",
    role: "Voice Actor",
    image: "/images/guests/bryce-papenbrook.jpg",
    bio: {
      full: "English Eren, Kirito, Inosuke, Shirou, Adrien, Meliodas... at this point if a protagonist screams a lot, it's probably him. Very nice in person though. Weirdly calm.",
      short: "Eren (English). Kirito. Inosuke. Many more.",
    },
    featured: false,
  },
  {
    id: "erica-mendez",
    name: "Erica Mendez",
    role: "Voice Actor",
    image: "/images/guests/erica-mendez.jpg",
    bio: {
      full: "Ryuko. Gon. Diane. Megumin. Basically if a character has range from 'tiny and explosive' to 'will punch through walls', Erica's got it.",
      short: "Ryuko, Gon, Megumin.",
    },
    featured: false,
  },
  {
    id: "yutaka-nakamura",
    name: "Yutaka Nakamura",
    role: "Key Animator",
    image: "/images/guests/yutaka-nakamura.jpg",
    bio: {
      full: "The guy. THE guy. Bones studio legend. Your favorite sakuga compilation? 60% him. Will be doing a live drawing demo and honestly just watching him hold a pencil is worth the badge price.",
      short: "THE sakuga guy.",
    },
    featured: false,
  },
  {
    id: "mitsuo-iso",
    name: "Mitsuo Iso",
    role: "Animator/Director",
    image: "/images/guests/mitsuo-iso.jpg",
    bio: {
      full: "Created Dennou Coil. Invented a whole animation technique. Probably thinking about frame interpolation right now.",
      short: "Dennou Coil creator.",
    },
    featured: false,
  },
  {
    id: "cosplay-judge",
    name: "Vampy Bit Me",
    role: "Cosplay Judge",
    image: "/images/guests/vampy-bit-me.jpg",
    bio: {
      full: "Will judge your craftsmanship. Fairly. But thoroughly. Bring your A-game or don't bring your foam.",
      short: "She will judge you.",
    },
    featured: false,
  },
] as const

/**
 * Section header text variants
 */
const HEADERS = {
  full: {
    title: "These People Said Yes",
    description: "We still can't believe it either.",
  },
  reduced: {
    title: "Guest List",
    description: "They're actually coming.",
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const bgYSpring = useSpring(bgY, springConfig)

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
      {/* Decorative SVGs with parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        aria-hidden="true"
        style={{ y: motionMode !== "off" ? bgYSpring : 0 }}
      >
        <BuzzingFlies size={48} className="absolute top-16 right-8 text-muted-foreground/25" />
        <SalvagedWeapon size={56} className="absolute bottom-12 left-8 text-primary/15 -rotate-12" />
        <CrackPattern width={100} height={50} className="absolute top-1/2 right-4 text-muted-foreground/10" />
      </motion.div>
      
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

        {/* Guests grid with staggered entrance */}
        <motion.div 
          className={`grid ${gridClass} gap-4 md:gap-6`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: motionMode === "expressive" ? 0.12 : 0.06,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {visibleGuests.map((guest, index) => (
            <motion.div
              key={guest.id}
              variants={motionMode !== "off" ? {
                hidden: { 
                  opacity: 0, 
                  y: 50,
                  scale: 0.85,
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    ...springConfig,
                  },
                },
              } : {}}
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
        </motion.div>

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
