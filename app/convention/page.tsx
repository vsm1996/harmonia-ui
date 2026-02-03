/**
 * ABYSS CON - Gachiakuta-Inspired Anime Convention Landing Page
 *
 * This page demonstrates the capacity-adaptive UI framework in action:
 * - Components respond to ambient fields (energy, attention, valence)
 * - Typography scales based on user cognitive capacity
 * - Animations adapt to user energy levels
 * - The design respects the "trash-punk" aesthetic of Gachiakuta
 *
 * Gachiakuta context:
 * - Manga about people thrown into a garbage dump called "The Abyss"
 * - Characters fight with weapons made from discarded trash
 * - Themes: outcasts, survival, finding worth in the discarded
 *
 * Note: This is a client component, so metadata is exported from a separate file.
 * See app/convention/metadata.ts for SEO configuration.
 */

"use client"

import { HeroSection } from "@/components/convention/hero-section"
import { EventsSection } from "@/components/convention/events-section"
import { GuestsSection } from "@/components/convention/guests-section"
import { TicketsSection } from "@/components/convention/tickets-section"
import { ConventionNav } from "@/components/convention/convention-nav"
import { CapacityControls } from "@/components/capacity-controls"
import { Footer } from "@/components/convention/footer"
import {
  FloatingDebris,
  BrokenChain,
  SalvagedGear,
  CrackPattern,
  DebrisDivider,
} from "@/components/convention/gachiakuta-svgs"

export default function ConventionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden theme-gachiakuta">
      {/* Background decorative elements - positioned absolutely */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Top left debris cluster */}
        <FloatingDebris size={32} className="absolute top-24 left-8 text-primary/30" />
        <SalvagedGear size={48} className="absolute top-40 left-16 text-muted-foreground/20" />
        
        {/* Top right chain */}
        <BrokenChain size={40} className="absolute top-32 right-12 text-primary/25" />
        
        {/* Mid-page decorations */}
        <FloatingDebris size={24} className="absolute top-[40%] left-4 text-muted-foreground/20" />
        <SalvagedGear size={64} className="absolute top-[60%] right-8 text-accent/15" />
        <BrokenChain size={32} className="absolute top-[75%] left-12 text-muted-foreground/15" />
        
        {/* Bottom decorations */}
        <FloatingDebris size={28} className="absolute bottom-40 right-16 text-primary/20" />
        <CrackPattern width={120} height={60} className="absolute bottom-20 left-1/4 text-muted-foreground/10" />
      </div>

      {/* Navigation - sticky with backdrop blur */}
      <ConventionNav />

      {/* Hero - full viewport, sets the tone */}
      <HeroSection />

      {/* Debris divider */}
      <DebrisDivider className="text-primary/40" />

      {/* Events grid - responds to energy field for density */}
      <EventsSection />

      {/* Featured guests - card-based with valence-influenced warmth */}
      <GuestsSection />

      {/* Debris divider */}
      <DebrisDivider className="text-accent/40" />

      {/* Tickets CTA - attention-driven emphasis */}
      <TicketsSection />

      {/* Footer with convention details */}
      <Footer />

      {/* Phase 1: Manual capacity controls (bottom-right fixed) */}
      <CapacityControls />
    </main>
  )
}
