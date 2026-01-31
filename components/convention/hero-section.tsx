/**
 * Hero Section - Convention Landing Hero
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (concurrent info: location, secondary details)
 * - Temporal → content length (date badge, tagline sub-text)
 * - Emotional → motion restraint (animation intensity)
 * - Valence → tone only (CTA language warmth, NOT information)
 */

"use client"

import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react"
import { useRef } from "react"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedDumpster } from "./animated-dumpster"

/**
 * Motion configuration based on capacity
 * Returns spring configs and animation parameters adapted to user state
 */
function useAdaptiveMotionConfig(motionMode: "off" | "subtle" | "expressive") {
  const springConfig = {
    off: { stiffness: 300, damping: 30, mass: 1 },
    subtle: { stiffness: 200, damping: 25, mass: 0.8 },
    expressive: { stiffness: 120, damping: 14, mass: 0.5 },
  }[motionMode]

  const duration = {
    off: 0,
    subtle: 0.4,
    expressive: 0.8,
  }[motionMode]

  return { springConfig, duration }
}

/**
 * TEMPORAL → Content Length (how much time the UI asks)
 * Controls: tagline verbosity, secondary text presence
 */
const TAGLINES = {
  full: {
    main: "Where the discarded become legendary.",
    sub: "The ultimate celebration of outcasts, underdogs, and anime.",
  },
  abbreviated: {
    main: "Where the discarded become legendary.",
    sub: null, // Skip secondary text when temporal is low
  },
}

/**
 * VALENCE → Tone Only (emotional color, NOT information volume)
 * Controls: CTA language warmth/playfulness
 */
const TONES = {
  positive: {
    cta: "LET'S GO!",
    secondary: "EXPLORE MORE",
  },
  neutral: {
    cta: "GET TICKETS",
    secondary: "VIEW SCHEDULE",
  },
  negative: {
    cta: "JOIN US",
    secondary: "LEARN MORE",
  },
}

export function HeroSection() {
  const { context } = useCapacityContext()
  const { mode: effectiveMotion } = useEffectiveMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  
  // Use effective motion (respects prefers-reduced-motion) instead of derived mode.motion
  const motionMode = effectiveMotion
  const { springConfig, duration } = useAdaptiveMotionConfig(motionMode)

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL-BASED PARALLAX (disabled for off mode)
  // ═══════════════════════════════════════════════════════════════════════════
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  
  // Parallax intensity adapts to motion mode
  const parallaxIntensity = motionMode === "expressive" ? 200 : motionMode === "subtle" ? 100 : 0
  const titleY = useTransform(scrollYProgress, [0, 1], [0, parallaxIntensity])
  const titleYSpring = useSpring(titleY, springConfig)
  const bgY = useTransform(scrollYProgress, [0, 1], [0, parallaxIntensity * 0.5])
  const bgYSpring = useSpring(bgY, springConfig)
  const opacityScroll = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL → Content Length (tagline verbosity)
  // ═══════════════════════════════════════════════════════════════════════════
  const tagline =
    context.userCapacity.temporal > 0.4 ? TAGLINES.full : TAGLINES.abbreviated

  // ═══════════════════════════════════════════════════════════════════════════
  // VALENCE → Tone Only (CTA warmth, NOT information volume)
  // ═══════════════════════════════════════════════════════════════════════════
  const toneKey =
    context.emotionalState.valence > 0.2
      ? "positive"
      : context.emotionalState.valence < -0.2
        ? "negative"
        : "neutral"
  const ctaText = TONES[toneKey]

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE → Concurrent Choices (via mode.choiceLoad from temporal)
  // Show secondary CTA only when temporal allows (user has time to decide)
  // ═══════════════════════════════════════════════════════════════════════════
  const showSecondaryCTA = mode.choiceLoad === "normal"

  // ═══════════════════════════════════════════════════════════════════════════
  // VALENCE → Expressiveness (color warmth shift)
  // ═══════════════════════════════════════════════════════════════════════════
  const warmthShift = context.emotionalState.valence * 10

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      aria-labelledby="hero-title"
    >
      {/* Background texture layer - grungy concrete aesthetic with parallax */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          y: motionMode !== "off" ? bgYSpring : 0,
        }}
        aria-hidden="true"
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
        animate={{
          opacity: 0.8 + context.emotionalState.valence * 0.1,
        }}
        transition={{ duration: duration }}
        style={{ opacity: motionMode !== "off" ? opacityScroll : 1 }}
        aria-hidden="true"
      />

      {/* Main content container with parallax */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto text-center"
        style={{ y: motionMode !== "off" ? titleYSpring : 0 }}
      >
        {/* TEMPORAL: Date badge - skip when user has limited time */}
        {context.userCapacity.temporal > 0.3 && (
          <motion.div 
            initial={motionMode !== "off" ? { opacity: 0, y: -20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration, delay: 0.1, ...springConfig }}
          >
            <Badge
              variant="outline"
              className={`mb-6 text-sm tracking-widest uppercase border-primary/50 ${
                motionMode === "expressive" ? "vibrate" : ""
              }`}
            >
              August 15-17, 2026
            </Badge>
          </motion.div>
        )}

        {/* Main title with staggered letter animation for expressive mode */}
        <motion.h1
          ref={titleRef}
          id="hero-title"
          className="font-sans font-black tracking-tighter leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 15vw, 12rem)",
            filter: `hue-rotate(${warmthShift}deg)`,
          }}
          initial={motionMode !== "off" ? { opacity: 0, scale: 0.8, rotateX: 45 } : false}
          animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: duration * 1.5, ...springConfig }}
        >
          <motion.span 
            className={`block text-primary ${motionMode === "expressive" ? "breathe" : ""}`}
            whileHover={motionMode === "expressive" ? { scale: 1.05, textShadow: "0 0 40px hsl(var(--primary))" } : {}}
            transition={springConfig}
          >
            ABYSS
          </motion.span>
          <motion.span 
            className="block text-foreground/90"
            whileHover={motionMode === "expressive" ? { scale: 1.02, letterSpacing: "0.1em" } : {}}
            transition={springConfig}
          >
            CON
          </motion.span>
        </motion.h1>

        {/* Tagline with staggered reveal */}
        <motion.p
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance"
          initial={motionMode !== "off" ? { opacity: 0, y: 30 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration, delay: duration * 0.5, ...springConfig }}
        >
          {tagline.main}
          {tagline.sub && (
            <motion.span
              className="block text-foreground/60 mt-2"
              initial={motionMode !== "off" ? { opacity: 0 } : false}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration, delay: duration * 0.8 }}
            >
              {tagline.sub}
            </motion.span>
          )}
        </motion.p>

        {/* CTA buttons with staggered entrance and interactive hover */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={motionMode !== "off" ? { opacity: 0, y: 40 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration, delay: duration * 0.7, ...springConfig }}
        >
          <motion.div
            whileHover={motionMode !== "off" ? { scale: 1.05 } : {}}
            whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
            transition={springConfig}
          >
            <Button 
              size="lg" 
              className={`text-lg px-8 py-6 font-bold tracking-wide ${
                motionMode === "expressive" ? "hover-pulse" : ""
              }`}
            >
              {ctaText.cta}
            </Button>
          </motion.div>
          {showSecondaryCTA && (
            <motion.div
              whileHover={motionMode !== "off" ? { scale: 1.05 } : {}}
              whileTap={motionMode !== "off" ? { scale: 0.98 } : {}}
              transition={springConfig}
              initial={motionMode !== "off" ? { opacity: 0, x: -20 } : false}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 font-medium tracking-wide bg-transparent"
              >
                {ctaText.secondary}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* COGNITIVE: Location info - reduce concurrent info when cognitive is low */}
        {context.userCapacity.cognitive > 0.4 && (
          <motion.p
            className="mt-12 text-sm text-muted-foreground tracking-widest uppercase"
            initial={motionMode !== "off" ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration, delay: duration * 1.2 }}
            whileHover={motionMode === "expressive" ? { scale: 1.05, color: "hsl(var(--primary))" } : {}}
          >
            Los Angeles Convention Center
          </motion.p>
        )}
      </motion.div>

      {/* EMOTIONAL: Animated dumpster scroll indicator - hide when motion is off */}
      {motionMode !== "off" && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 fall hover:text-primary/70 transition-colors cursor-pointer"
          aria-hidden="true"
        >
          <AnimatedDumpster size={56} />
        </div>
      )}
    </section>
  )
}
