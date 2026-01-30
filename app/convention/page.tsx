/**
 * ABYSS CON - Gachiakuta-Inspired Anime Convention Landing Page
 *
 * This page demonstrates the empathy-driven UI framework in action:
 * - Components respond to ambient fields (energy, attention, valence)
 * - Typography scales based on user cognitive capacity
 * - Animations adapt to user energy levels
 * - The design respects the "trash-punk" aesthetic of Gachiakuta
 *
 * Gachiakuta context:
 * - Manga about people thrown into a garbage dump called "The Abyss"
 * - Characters fight with weapons made from discarded trash
 * - Themes: outcasts, survival, finding worth in the discarded
 */

"use client"

import { HeroSection } from "@/components/convention/hero-section"
import { EventsSection } from "@/components/convention/events-section"
import { GuestsSection } from "@/components/convention/guests-section"
import { TicketsSection } from "@/components/convention/tickets-section"
import { ConventionNav } from "@/components/convention/convention-nav"
import { EmpathyControls } from "@/components/convention/empathy-controls"
import { Footer } from "@/components/convention/footer"

export default function ConventionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation - sticky with backdrop blur */}
      <ConventionNav />

      {/* Hero - full viewport, sets the tone */}
      <HeroSection />

      {/* Events grid - responds to energy field for density */}
      <EventsSection />

      {/* Featured guests - card-based with valence-influenced warmth */}
      <GuestsSection />

      {/* Tickets CTA - attention-driven emphasis */}
      <TicketsSection />

      {/* Footer with convention details */}
      <Footer />

      {/* Phase 1: Manual empathy controls (bottom-right fixed) */}
      <EmpathyControls />
    </main>
  )
}
