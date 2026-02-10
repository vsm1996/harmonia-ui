/**
 * Hero Section - Convention Landing Hero
 * 
 * PERFORMANCE OPTIMIZED: Uses CSS animations instead of JS-driven motion
 * to prevent scroll jank and ensure smooth 60fps rendering.
 *
 * STRICT SEPARATION OF CONCERNS:
 * - Cognitive → density (concurrent info: location, secondary details)
 * - Temporal → content length (date badge, tagline sub-text)
 * - Emotional → motion restraint (animation intensity)
 * - Valence → tone only (CTA language warmth, NOT information)
 */

"use client"

import { useRef } from "react"
import { useCapacityContext, deriveMode, useEffectiveMotion } from "@/lib/capacity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedDumpster } from "./animated-dumpster"

/**
 * TEMPORAL → Content Length (how much time the UI asks)
 */
const TAGLINES = {
  full: {
    main: "They threw us away. We built a kingdom.",
    sub: "The world above forgot us. Good. We don't need them.",
  },
  abbreviated: {
    main: "Discarded. Not defeated.",
    sub: null,
  },
}

/**
 * VALENCE → Tone Only (emotional color, NOT information volume)
 */
const TONES = {
  positive: {
    cta: "DESCEND",
    secondary: "SEE WHAT WE SALVAGED",
  },
  neutral: {
    cta: "ENTER THE ABYSS",
    secondary: "VIEW SCHEDULE",
  },
  negative: {
    cta: "FIND YOUR PEOPLE",
    secondary: "LEARN MORE",
  },
}

export function HeroSection() {
  const { context } = useCapacityContext()
  const { mode: effectiveMotion } = useEffectiveMotion()
  const sectionRef = useRef<HTMLElement>(null)
  
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })
  
  const motionMode = effectiveMotion

  // Content adaptations
  const tagline = context.userCapacity.temporal > 0.4 ? TAGLINES.full : TAGLINES.abbreviated
  const toneKey = context.emotionalState.valence > 0.2 ? "positive" 
    : context.emotionalState.valence < -0.2 ? "negative" : "neutral"
  const ctaText = TONES[toneKey]
  const showSecondaryCTA = mode.choiceLoad === "normal"
  const warmthShift = context.emotionalState.valence * 10

  // Hero is above fold - use immediate animation (no scroll trigger needed)
  const animateClass = motionMode !== "off" ? "animate-fade-in-immediate" : ""
  
  // Fun CON letter collision animation - only at high expressiveness + positive valence
  const showConCollision = motionMode === "expressive" && context.emotionalState.valence > 0.3

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      aria-labelledby="hero-title"
    >
      {/* Background gradient only - removed heavy SVG filter */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-card"
        aria-hidden="true"
      />

      {/* Main content - CSS animations only */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Date badge */}
        {context.userCapacity.temporal > 0.3 && (
          <div className={animateClass} style={{ animationDelay: "0ms" }}>
            <Badge
              variant="outline"
              className={`mb-6 text-sm tracking-widest uppercase border-primary/50 ${
                motionMode === "expressive" ? "vibrate" : ""
              }`}
            >
              August 15-17, 2026
            </Badge>
          </div>
        )}

        {/* Main title */}
        <h1
          id="hero-title"
          className={`font-sans font-black tracking-tighter leading-none mb-6 ${animateClass}`}
          style={{
            fontSize: "clamp(3rem, 15vw, 12rem)",
            filter: `hue-rotate(${warmthShift}deg)`,
            animationDelay: "100ms",
          }}
        >
          <span className={`block text-primary ${motionMode === "expressive" ? "breathe" : ""}`}>
            ABYSS
          </span>
          <span className="block text-foreground/90">
            {showConCollision ? (
              <>
                <span className="letter-smash-c">C</span>
                <span className="letter-smash-o">O</span>
                <span className="letter-smash-n">N</span>
              </>
            ) : (
              "CON"
            )}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance ${animateClass}`}
          style={{ animationDelay: "200ms" }}
        >
          {tagline.main}
          {tagline.sub && (
            <span className="block text-foreground/60 mt-2">
              {tagline.sub}
            </span>
          )}
        </p>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${animateClass}`}
          style={{ animationDelay: "300ms" }}
        >
          <Button 
            size="lg" 
            className={`text-lg px-8 py-6 font-bold tracking-wide transition-transform hover:scale-105 active:scale-95 ${
              motionMode === "expressive" ? "hover-pulse" : ""
            }`}
          >
            {ctaText.cta}
          </Button>
          {showSecondaryCTA && (
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 font-medium tracking-wide bg-transparent transition-transform hover:scale-105 active:scale-95"
            >
              {ctaText.secondary}
            </Button>
          )}
        </div>

        {/* Location info */}
        {context.userCapacity.cognitive > 0.4 && (
          <p
            className={`mt-12 text-sm text-muted-foreground tracking-widest uppercase ${animateClass}`}
            style={{ animationDelay: "400ms" }}
          >
            Los Angeles Convention Center
          </p>
        )}
      </div>

      {/* Scroll indicator */}
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
