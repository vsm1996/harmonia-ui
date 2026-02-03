/**
 * Capacity-Adaptive UI Framework Demo Page
 *
 * Architecture:
 * - CapacityProvider wraps the entire app, making ambient fields available
 * - No prop drilling - components read fields directly via hooks
 * - State is shared between this page and /convention
 */

import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Framework Demo",
  description:
    "Explore the Harmonia UI capacity-adaptive framework. Adjust cognitive, temporal, and emotional capacity to see how interfaces adapt in real-time.",
  openGraph: {
    title: "Harmonia UI - Framework Demo",
    description:
      "A dynamic system that responds to human capacity through distributed intelligence. See how UI adapts to your state.",
  },
}
import { AmbientFieldMonitor } from "@/components/ambient-field-monitor"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { BrainIcon } from "lucide-react"
import { CapacityControls } from "@/components/capacity-controls"
import { CapacityDemoCard } from "@/components/capacity-demo-card"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header section with framework introduction */}
      <header className="border-b border-border/40 bg-linear-to-b from-background to-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-12 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-fit" role="img" aria-label="Framework">
                <BrainIcon size={66} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Capacity-Adaptive UI</h1>
                <p className="text-lg text-muted-foreground mt-2 text-pretty">
                  A dynamic system that responds to human capacity through distributed intelligence
                </p>
              </div>
            </div>
            {/* Theme toggle positioned in header for easy access */}
            <ThemeToggle />
          </div>

          {/* Core concept callout */}
          <div className="pt-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground max-w-3xl text-pretty leading-relaxed">
              <strong className="text-foreground">How it works:</strong> Four capacity inputs (cognitive, temporal,
              emotional, valence) derive a coherent interface mode. Components adapt density, content length,
              motion, and tone based on that mode - not individual slider values.
            </p>
          </div>

          {/* Implementation Example CTA */}
          <div className="pt-4">
            <Link
              href="/convention"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors group"
            >
              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                Example
              </Badge>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-pretty">
                  Abyss Con - Gachiakuta Convention
                </p>
                <p className="text-xs text-muted-foreground text-pretty">
                  See the framework in action with adaptive content density, motion, and tone
                </p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        {/* Live Demo Section */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Live Demo</h2>
          <p className="text-muted-foreground mb-6">
            Adjust the capacity controls (bottom-right) to see how this card adapts in real-time.
          </p>
          <CapacityDemoCard />
        </section>

        {/* Mode Derivation Section */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Mode Derivation</h2>
          <p className="text-muted-foreground mb-6">
            See exactly how your inputs become a coherent interface mode.
          </p>
          <AmbientFieldMonitor />
        </section>
      </div>

      {/* Shared Capacity Controls - state persists across pages */}
      <CapacityControls />
    </main>
  )
}
