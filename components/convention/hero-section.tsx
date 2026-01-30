/**
 * Hero Section - Convention Landing Hero
 *
 * Design decisions:
 * - Full viewport height to create immersive entry
 * - Typography responds to energy field via φ-based scaling
 * - Motion animations scale down with lower energy (Myoho principle)
 * - Grungy, industrial aesthetic inspired by Gachiakuta's Abyss
 */

"use client"

import { motion } from "motion/react"
import { useEnergyField, useEmotionalValenceField } from "@/lib/empathy"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  const energy = useEnergyField()
  const valence = useEmotionalValenceField()

  /**
   * Animation intensity scales with energy
   * Low energy = subtle, almost static
   * High energy = dynamic, expressive
   */
  const animationIntensity = 0.3 + energy.value * 0.7

  /**
   * Valence influences color warmth
   * Positive = warmer accent tones
   * Negative = cooler, more muted
   */
  const warmthShift = valence.value * 10

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

      {/* Animated gradient overlay - responds to valence */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
        animate={{
          opacity: 0.8 + valence.value * 0.1,
        }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      />

      {/* Main content container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Event date badge */}
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

        {/* Main title - massive, impactful */}
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

        {/* Tagline - references Gachiakuta themes */}
        <motion.p
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6 * animationIntensity,
            delay: 0.5,
          }}
        >
          Where the discarded become legendary.
          <br />
          <span className="text-foreground/60">
            The ultimate celebration of outcasts, underdogs, and anime.
          </span>
        </motion.p>

        {/* CTA buttons */}
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
            GET TICKETS
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-medium tracking-wide bg-transparent"
          >
            VIEW SCHEDULE
          </Button>
        </motion.div>

        {/* Location info */}
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
      </div>

      {/* Scroll indicator - fades based on energy */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 8, 0],
          opacity: energy.value > 0.3 ? 0.6 : 0.2,
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
    </section>
  )
}
