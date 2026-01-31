/**
 * Empathy Framework Demo Page
 *
 * Architecture:
 * - EmpathyProvider wraps the entire app, making ambient fields available
 * - No prop drilling - components read fields directly via hooks
 * - This page is just a shell; all logic lives in composed components
 */

import Link from "next/link"
import { AmbientFieldMonitor } from "@/components/ambient-field-monitor"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header section with framework introduction */}
      <header className="border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-12 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl" role="img" aria-label="Framework">
                🧠
              </span>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Empathy-Driven UI Framework</h1>
                <p className="text-lg text-muted-foreground mt-2 text-pretty">
                  A living system that responds to human emotional state through distributed intelligence
                </p>
              </div>
            </div>
            {/* Theme toggle positioned in header for easy access */}
            <ThemeToggle />
          </div>

          {/* Philosophy callout */}
          <div className="pt-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground max-w-3xl text-balance leading-relaxed">
              <strong className="text-foreground">Myoho-Renge-Kyo:</strong> The Law (distributed state), the Form
              (golden ratio), and the Resonance (solfeggio frequencies) working together to create interfaces that
              breathe with the user.
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
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Abyss Con - Gachiakuta Convention
                </p>
                <p className="text-xs text-muted-foreground">
                  See the framework in action with adaptive content, density modes, and emotional response
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
      <div className="mx-auto max-w-6xl px-6 py-12">
        <AmbientFieldMonitor />
      </div>
    </main>
  )
}
