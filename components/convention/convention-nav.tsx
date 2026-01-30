/**
 * Convention Navigation - Sticky Header
 *
 * Design decisions:
 * - Sticky positioning with backdrop blur for modern glass effect
 * - Energy field influences opacity/blur intensity
 * - Simple, focused navigation for convention context
 * - Mobile-responsive with hamburger menu pattern
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useEnergyField } from "@/lib/empathy"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { label: "Schedule", href: "#schedule" },
  { label: "Guests", href: "#guests" },
  { label: "Tickets", href: "#tickets" },
  { label: "FAQ", href: "#faq" },
] as const

export function ConventionNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const energy = useEnergyField()

  /**
   * Backdrop blur intensity based on energy
   * Higher energy = more visual separation
   * Lower energy = subtler, less distracting
   */
  const blurIntensity = 8 + energy.value * 8

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
      }}
    >
      <div className="bg-background/80 border-b border-border/50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="/convention"
            className="font-black text-xl tracking-tighter flex items-center gap-2"
          >
            <span className="text-primary">ABYSS</span>
            <span className="text-foreground/80">CON</span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button size="sm">Get Tickets</Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                className="w-5 h-0.5 bg-current block"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 2 },
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-current block mt-1"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-current block mt-1"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 },
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </button>
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 border-b border-border overflow-hidden"
            style={{
              backdropFilter: `blur(${blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="w-full mt-2">Get Tickets</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
