/**
 * Hero Section - Convention Landing Hero
 *
 * Empathy-Driven Adaptations:
 * - Low cognitive: Simpler tagline, fewer CTAs
 * - Low emotional: Warmer, more supportive tone
 * - Low temporal: Direct messaging, skip secondary info
 * - Negative valence: Calmer animations, gentler language
 */

"use client"

import { motion } from "motion/react"
import { useEmpathyContext, deriveMode } from "@/lib/empathy"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Content variants based on capacity state
 * Each key represents a different cognitive/emotional load level
 */
const TAGLINES = {
  full: {
    main: "Where the discarded become legendary.",
    sub: "The ultimate celebration of outcasts, underdogs, and anime.",
  },
  reduced: {
    main: "Where the discarded become legendary.",
    sub: null, // Remove secondary text when capacity is low
  },
  minimal: {
    main: "Join us in the Abyss.",
    sub: null,
  },
}

const TONES = {
  neutral: {
    cta: "GET TICKETS",
    secondary: "VIEW SCHEDULE",
  },
  supportive: {
    cta: "JOIN US",
    secondary: "LEARN MORE",
  },
}

export function HeroSection() {
  const { context } = useEmpathyContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })

  /**
   * Derive content complexity from mode
   */
  const contentLevel =
    mode.density === "low" ? "minimal" : mode.density === "medium" ? "reduced" : "full"

  const tagline = TAGLINES[contentLevel]
  const tone = mode.guidance === "high" || context.emotionalState.valence < 0 ? "supportive" : "neutral"
  const ctaText = TONES[tone]

  /**
   * Animation intensity scales with motion mode
   */
  const animationIntensity =
    mode.motion === "off" ? 0.3 : mode.motion === "subtle" ? 0.6 : 1

  /**
   * Show secondary CTA only when not in minimal mode
   */
  const showSecondaryCTA = mode.choiceLoad === "normal"

  /**
   * Valence influences color warmth
   */
  const warmthShift = context.emotionalState.valence * 10

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      aria-labelledby="hero-title"
    >
      {/* Background texture layer - grungy concrete aesthetic */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
        animate={{
          opacity: 0.8 + context.emotionalState.valence * 0.1,
        }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      />

      {/* Main content container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Event date badge - hide when temporal is low */}
        {context.userCapacity.temporal > 0.3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6 * animationIntensity,
              delay: 0.2,
            }}
          >
            <Badge
              variant="outline"
              className="mb-6 text-sm tracking-widest uppercase border-primary/50"
            >
              August 15-17, 2026
            </Badge>
          </motion.div>
        )}

        {/* Main title */}
        <motion.h1
          id="hero-title"
          className="font-sans font-black tracking-tighter leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 15vw, 12rem)",
            filter: `hue-rotate(${warmthShift}deg)`,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8 * animationIntensity,
            delay: 0.3,
          }}
        >
          <span className="block text-primary">ABYSS</span>
          <span className="block text-foreground/90">CON</span>
        </motion.h1>

        {/* Tagline - adapts to cognitive/emotional load */}
        <motion.p
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6 * animationIntensity,
            delay: 0.5,
          }}
        >
          {tagline.main}
          {tagline.sub && (
            <>
              <br />
              <span className="text-foreground/60">{tagline.sub}</span>
            </>
          )}
        </motion.p>

        {/* CTA buttons - reduce options when choice load is minimal */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6 * animationIntensity,
            delay: 0.7,
          }}
        >
          <Button size="lg" className="text-lg px-8 py-6 font-bold tracking-wide">
            {ctaText.cta}
          </Button>
          {showSecondaryCTA && (
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 font-medium tracking-wide bg-transparent"
            >
              {ctaText.secondary}
            </Button>
          )}
        </motion.div>

        {/* Location info - show only when cognitive capacity allows */}
        {context.userCapacity.cognitive > 0.4 && (
          <motion.p
            className="mt-12 text-sm text-muted-foreground tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6 * animationIntensity,
              delay: 0.9,
            }}
          >
            Los Angeles Convention Center
          </motion.p>
        )}
      </div>

      {/* Scroll indicator - hide when motion is off or low energy */}
      {mode.motion !== "off" && context.userCapacity.cognitive > 0.3 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 8, 0],
            opacity: 0.6,
          }}
          transition={{
            y: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </section>
  )
}
