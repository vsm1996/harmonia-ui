/**
 * Guests Section - Featured Convention Guests
 *
 * Design decisions:
 * - Card hover effects respond to energy level
 * - Image placeholders use generated abstract patterns
 * - Valence influences the warmth of hover states
 * - Grid maintains readability at all energy levels
 */

"use client"

import { motion } from "motion/react"
import { useEnergyField, useEmotionalValenceField } from "@/lib/empathy"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * Guest data
 * In production, this would include real images and bios
 */
const GUESTS = [
  {
    id: "kei-urana",
    name: "Kei Urana",
    role: "Gachiakuta Creator",
    bio: "The mastermind behind the world of the Abyss. First US appearance.",
    featured: true,
  },
  {
    id: "voice-actor-1",
    name: "Yuki Kaji",
    role: "Voice Actor",
    bio: "Known for Eren Yeager, bringing intensity to every role.",
    featured: true,
  },
  {
    id: "animator-1",
    name: "Shingo Yamashita",
    role: "Key Animator",
    bio: "Action sequences that define modern anime aesthetics.",
    featured: false,
  },
  {
    id: "cosplay-judge",
    name: "Vampy Bit Me",
    role: "Cosplay Judge",
    bio: "Professional cosplayer and craftsmanship expert.",
    featured: false,
  },
] as const

export function GuestsSection() {
  const energy = useEnergyField()
  const valence = useEmotionalValenceField()

  /**
   * Hover scale adapts to energy
   * High energy = more dramatic hovers
   * Low energy = subtle, less distracting
   */
  const hoverScale = 1 + energy.value * 0.03

  return (
    <section
      className="py-24 px-4 md:px-8 bg-card/50"
      aria-labelledby="guests-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.header
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 tracking-widest">
            GUESTS
          </Badge>
          <h2
            id="guests-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            Meet The
            <span className="text-primary"> Legends</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Industry icons, creators, and personalities who understand
            what it means to rise from nothing.
          </p>
        </motion.header>

        {/* Guests grid - 2x2 on mobile, 4 col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {GUESTS.map((guest, index) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <GuestCard
                guest={guest}
                hoverScale={hoverScale}
                valence={valence.value}
              />
            </motion.div>
          ))}
        </div>

        {/* More guests link */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="#guests"
            className="text-primary hover:text-primary/80 font-medium tracking-wide inline-flex items-center gap-2 transition-colors"
          >
            View All 50+ Guests
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Individual guest card
 */
function GuestCard({
  guest,
  hoverScale,
  valence,
}: {
  guest: (typeof GUESTS)[number]
  hoverScale: number
  valence: number
}) {
  /**
   * Generate a pseudo-random but consistent color for each guest
   * Based on their name hash for reproducibility
   */
  const hue = guest.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360

  /**
   * Valence shifts the hue toward warmer (positive) or cooler (negative)
   */
  const adjustedHue = hue + valence * 20

  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden group cursor-pointer h-full">
        {/* Abstract image placeholder */}
        <div
          className="aspect-[3/4] relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              oklch(0.25 0.05 ${adjustedHue}) 0%, 
              oklch(0.35 0.08 ${adjustedHue + 30}) 50%,
              oklch(0.2 0.03 ${adjustedHue - 20}) 100%)`,
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Featured badge */}
          {guest.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
            {guest.name}
          </h3>
          <p className="text-primary/80 text-sm font-medium mb-2">
            {guest.role}
          </p>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {guest.bio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
