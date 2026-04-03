/**
 * Capacity-Adaptive UI Framework Demo Page
 *
 * Architecture:
 * - CapacityProvider wraps the entire app, making ambient fields available
 * - No prop drilling - components read fields directly via hooks
 * - State is shared between this page and /convention
 */

import Link from "next/link"

import { AmbientFieldMonitor } from "@/components/ambient-field-monitor"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { BrainIcon, CheckCircle2Icon } from "lucide-react"
import { CapacityControls } from "@/components/capacity-controls"
import { CapacityDemoCard } from "@/components/capacity-demo-card"

function PhaseCard({
  phase,
  title,
  status,
  items,
}: {
  phase: string
  title: string
  status: "complete" | "in-progress" | "planned"
  items: string[]
}) {
  const statusStyles = {
    complete: "border-green-500/30 bg-green-500/5",
    "in-progress": "border-primary/30 bg-primary/5",
    planned: "border-border/50 bg-muted/20",
  }
  const badgeStyles = {
    complete: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    "in-progress": "bg-primary/10 text-primary border-primary/30",
    planned: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${statusStyles[status]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{phase}</span>
        <Badge variant="outline" className={`text-xs ${badgeStyles[status]}`}>
          {status === "complete" ? "Complete" : status === "in-progress" ? "In Progress" : "Planned"}
        </Badge>
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2Icon className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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

        {/* Development Phases */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Development Phases</h2>
          <p className="text-muted-foreground mb-6">
            Framework implementation status.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <PhaseCard
              phase="Phase 1"
              title="Manual Inputs"
              status="complete"
              items={[
                "4-input capacity controls",
                "FieldManager with derived fields",
                "Mode derivation (4 modes)",
                "Active token system",
                "4-tier motion system",
                "prefers-reduced-motion override",
              ]}
            />
            <PhaseCard
              phase="Phase 2"
              title="Automatic Signals"
              status="complete"
              items={[
                "SignalAggregator (6 detectors)",
                "Time, Session, Scroll detectors",
                "Interaction, Input, Environment detectors",
                "Auto-mode with manual override",
                "PatternStore + PatternExtractor",
                "PredictionEngine + usePredictedCapacity()",
              ]}
            />
            <PhaseCard
              phase="Phase 3"
              title="Extended Dimensions"
              status="complete"
              items={[
                "Arousal dimension → pace token",
                "Haptic feedback (Vibration API)",
                "Sonic feedback (Web Audio API)",
                "Fibonacci spacing scale",
                "Golden ratio utilities",
                "guidance + choiceLoad consumed",
              ]}
            />
          </div>
        </section>
      </div>

      {/* Shared Capacity Controls - state persists across pages */}
      <CapacityControls />
    </main>
  )
}
