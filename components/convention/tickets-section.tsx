/**
 * Tickets Section - Pricing and CTA
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (tier count, visual complexity)
 * - Temporal → content length (feature list length, footer info)
 * - Emotional → motion restraint (animation intensity)
 * - Valence → (not heavily used - pricing is factual, not tonal)
 */

"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform, useSpring } from "motion/react"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingDebris, BrokenChain } from "./gachiakuta-svgs"

/**
 * Ticket tier data with content variants
 */
const TIERS = [
  {
    id: "scrapper",
    name: "Scrapper",
    price: 75,
    description: {
      full: "You made it down here. That's what matters.",
      short: "You're in.",
    },
    features: {
      full: [
        "3 days in the Abyss",
        "The Pile (Artist Alley)",
        "All panels, all screenings",
        "You belong here",
      ],
      short: ["3 days", "Full access"],
    },
    highlight: false,
  },
  {
    id: "hunter",
    name: "Hunter",
    price: 175,
    description: {
      full: "You know the good stuff. You get there first.",
      short: "Early access. Better seats.",
    },
    features: {
      full: [
        "Everything Scrappers get +",
        "Enter 1 hour before the crowd",
        "Front section at panels",
        "Exclusive merch drop",
        "Hunter's den (lounge)",
      ],
      short: ["Scrapper +", "Early entry", "Front seats"],
    },
    highlight: true,
  },
  {
    id: "boss",
    name: "Tribe Boss",
    price: 350,
    description: {
      full: "You run this place.",
      short: "Full access. All perks.",
    },
    features: {
      full: [
        "Everything Hunters get +",
        "Front row. Reserved.",
        "Meet the legends face to face",
        "Boss-only gatherings",
        "Signed Gachiakuta print from Urana",
        "Personal guide through the chaos",
      ],
      short: ["Hunter +", "Meet guests", "Boss events"],
    },
    highlight: false,
  },
] as const

/**
 * Header text variants
 */
const HEADERS = {
  full: {
    title: "Claim Your Place",
    description: "The Abyss doesn't wait. Early rates end July 1. After that, prices rise. We don't make the rules. Actually we do. But still.",
    footer: "Changed your mind? Refund til 30 days out. After that, find someone else to take your spot. Someone always wants in.",
  },
  reduced: {
    title: "Passes",
    description: "Early bird til July 1.",
    footer: null,
  },
  minimal: {
    title: "Passes",
    description: null,
    footer: null,
  },
}

export function TicketsSection() {
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
    ? { stiffness: 100, damping: 15 } 
    : { stiffness: 200, damping: 25 }
  
  // Scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1])
  const scaleSpring = useSpring(scale, springConfig)

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Density (tier count, decision complexity)
  // Controls how many things compete for attention at once
  // ═══════════════════════════════════════════════════════════════════════════
  const visibleTiers =
    mode.density === "low" ? TIERS.filter((t) => t.highlight) : TIERS

  const gridClass =
    visibleTiers.length === 1 ? "max-w-md mx-auto" : "grid md:grid-cols-3 gap-6 items-stretch"

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL → Content Length (feature list verbosity, header detail, footer)
  // Controls how much time the UI asks from the user
  // ═══════════════════════════════════════════════════════════════════════════
  const featureLength = context.userCapacity.temporal > 0.5 ? "full" : "short"

  const headerContent =
    context.userCapacity.temporal > 0.5
      ? HEADERS.full
      : context.userCapacity.temporal > 0.3
        ? HEADERS.reduced
        : HEADERS.minimal

  const showFeatures = context.userCapacity.temporal > 0.35

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL → Motion Restraint (animation intensity)
  // Low emotional = no surprises, calm UI
  // ═══════════════════════════════════════════════════════════════════════════
  const sectionAnimClass = motionMode === "subtle" ? "helix-rise" : ""

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 relative overflow-hidden"
      aria-labelledby="tickets-title"
    >
      {/* Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <FloatingDebris size={28} className="absolute top-12 left-12 text-primary/25" />
        <BrokenChain size={36} className="absolute top-1/3 right-8 text-muted-foreground/20" />
        <FloatingDebris size={20} className="absolute bottom-16 right-1/4 text-accent/20" />
      </div>
      
      <motion.div 
        className="max-w-6xl mx-auto relative"
        style={{ scale: motionMode !== "off" ? scaleSpring : 1 }}
      >
        {/* Section header with entrance animation */}
        <motion.header 
          className="mb-16 text-center"
          initial={motionMode !== "off" ? { opacity: 0, y: 50 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ...springConfig }}
        >
          <motion.div
            initial={motionMode !== "off" ? { scale: 0.8, opacity: 0 } : false}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="outline" className={`mb-4 tracking-widest ${motionMode === "expressive" ? "vibrate" : ""}`}>
              TICKETS
            </Badge>
          </motion.div>
          <motion.h2
            id="tickets-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            initial={motionMode !== "off" ? { opacity: 0, y: 30 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ...springConfig }}
          >
            {headerContent.title.split(" ").slice(0, -1).join(" ")}
            {headerContent.title.split(" ").length > 1 && (
              <motion.span 
                className="text-primary"
                whileHover={motionMode === "expressive" ? { scale: 1.1 } : {}}
              > {headerContent.title.split(" ").slice(-1)}</motion.span>
            )}
            {headerContent.title.split(" ").length === 1 && (
              <motion.span 
                className="text-primary"
                whileHover={motionMode === "expressive" ? { scale: 1.1 } : {}}
              >{headerContent.title}</motion.span>
            )}
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

        {/* Pricing grid with staggered entrance */}
        <motion.div 
          className={gridClass}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: motionMode === "expressive" ? 0.2 : 0.1,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {visibleTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              variants={motionMode !== "off" ? {
                hidden: { 
                  opacity: 0, 
                  y: 80,
                  scale: 0.8,
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
              <TierCard
                tier={tier}
                motionMode={motionMode}
                featureLength={featureLength}
                showFeatures={showFeatures}
                index={index}
                springConfig={springConfig}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* TEMPORAL: Additional info with fade in */}
        {headerContent.footer && context.userCapacity.temporal > 0.5 && (
          <motion.div 
            className="mt-12 text-center text-sm text-muted-foreground"
            initial={motionMode !== "off" ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>{headerContent.footer}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

/**
 * Individual tier card with Framer Motion interactions
 * Adapts feature list and animations based on capacity state
 */
function TierCard({
  tier,
  motionMode,
  featureLength,
  showFeatures,
  index,
  springConfig,
}: {
  tier: (typeof TIERS)[number]
  motionMode: "off" | "subtle" | "expressive"
  featureLength: "full" | "short"
  showFeatures: boolean
  index: number
  springConfig: { stiffness: number; damping: number }
}) {
  const description = tier.description[featureLength]
  const features = tier.features[featureLength]

  return (
    <motion.div
      className="h-full"
      whileHover={motionMode !== "off" ? { 
        y: tier.highlight ? -12 : -8,
        scale: tier.highlight ? 1.02 : 1,
      } : {}}
      whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
      transition={{ type: "spring", ...springConfig }}
    >
      <Card
        className={`h-full flex flex-col ${
          tier.highlight
            ? "border-primary bg-primary/5 relative shadow-lg shadow-primary/10"
            : ""
        }`}
      >
        {tier.highlight && (
          <motion.div
            initial={motionMode !== "off" ? { scale: 0, y: 10 } : false}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
          >
            <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground ${
              motionMode === "expressive" ? "vibrate" : ""
            }`}>
              Recommended
            </Badge>
          </motion.div>
        )}

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <motion.div 
            className="text-center mb-6"
            whileHover={motionMode === "expressive" ? { scale: 1.1 } : {}}
            transition={springConfig}
          >
            <span className="text-5xl font-black text-foreground">
              ${tier.price}
            </span>
            <span className="text-muted-foreground ml-1">USD</span>
          </motion.div>

          {showFeatures && (
            <ul className="space-y-3" role="list">
              {features.map((feature, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start gap-3 text-sm"
                  initial={motionMode !== "off" ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <motion.div
                    whileHover={motionMode === "expressive" ? { scale: 1.2, rotate: 10 } : {}}
                  >
                    <CheckIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  </motion.div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>

        <CardFooter>
          <motion.div 
            className="w-full"
            whileHover={motionMode !== "off" ? { scale: 1.02 } : {}}
            whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
          >
            <Button
              className="w-full"
              variant={tier.highlight ? "default" : "outline"}
              size="lg"
            >
              {tier.highlight ? "Get Started" : `Select ${tier.name}`}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
