/**
 * Harmonia UI — Landing Page
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
import { BrainIcon, CheckCircle2Icon, SparklesIcon, ArrowRightIcon } from "lucide-react"
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
  const borderColor = {
    complete: "border-renge-success",
    "in-progress": "border-renge-accent",
    planned: "border-renge-border",
  }[status]

  const badgeVariant = {
    complete: "default",
    "in-progress": "secondary",
    planned: "outline",
  }[status] as "default" | "secondary" | "outline"

  const badgeLabel = { complete: "Complete", "in-progress": "In Progress", planned: "Planned" }[status]

  return (
    <div className={`rounded-renge-3 border ${borderColor} bg-renge-bg-subtle p-renge-4 space-y-renge-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-renge-fg-muted font-medium tracking-wide uppercase">{phase}</span>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
      </div>
      <h3 className="font-semibold text-sm text-renge-fg">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-xs text-renge-fg-muted">
            <CheckCircle2Icon className="w-3.5 h-3.5 text-renge-success shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) {
  return (
    <div className="mb-renge-5">
      <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest mb-renge-2">{eyebrow}</p>
      <h2 className="text-renge-lg leading-renge-lg font-bold tracking-tight text-renge-fg">{title}</h2>
    </div>
  )
}

import React from "react"

export default function Page() {
  return (
    <main className="min-h-screen bg-renge-bg">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="border-b border-renge-border bg-renge-bg-subtle">
        <div className="mx-auto max-w-6xl px-renge-5 pt-renge-7 pb-renge-6">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-renge-6">
            <div className="flex items-center gap-renge-3">
              <div
                className="text-renge-accent"
                style={{ animation: "rengeBreathe var(--renge-duration-8) ease-in-out infinite" }}
              >
                <BrainIcon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-mono text-renge-fg-muted tracking-wide">harmonia-core/ui</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Headline */}
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-renge-4">
              <Badge variant="outline" className="border-renge-accent text-renge-accent bg-renge-accent-subtle">
                v1.2.6
              </Badge>
              <Badge variant="outline">MIT License</Badge>
              <Badge variant="outline">React 18+</Badge>
            </div>

            <h1
              className="font-bold tracking-tight text-renge-fg"
              style={{ fontSize: "clamp(2.25rem, 5vw, var(--renge-font-size-xl))", lineHeight: "var(--renge-line-height-xl)" }}
            >
              Harmonia UI
            </h1>

            <p
              className="text-renge-fg-subtle mt-renge-3"
              style={{ fontSize: "var(--renge-font-size-lg)", lineHeight: "var(--renge-line-height-lg)" }}
            >
              Interfaces that adapt to human capacity.
            </p>

            <p className="text-sm text-renge-fg-muted mt-renge-3 max-w-2xl leading-relaxed">
              Four inputs — cognitive, temporal, emotional, valence — derive a coherent interface mode.
              Components adapt density, motion, contrast, and focus. No guessing. No profiles. No surveillance.
            </p>
          </div>

          {/* Pipeline visual */}
          <div className="mt-renge-6 p-renge-4 rounded-renge-3 bg-renge-bg border border-renge-border-subtle">
            <p className="text-xs text-renge-fg-muted uppercase tracking-widest mb-renge-3 font-medium">
              Derivation pipeline
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {["Cognitive", "Temporal", "Emotional", "Valence"].map((input, i) => (
                <span key={input} className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-renge-1 bg-renge-accent-subtle text-renge-accent border border-renge-border-subtle">
                    {input}
                  </span>
                  {i < 3 && <span className="text-renge-border">·</span>}
                </span>
              ))}
              <span className="text-renge-fg-muted px-1">→</span>
              <span className="px-2 py-0.5 rounded-renge-1 border border-renge-border text-renge-fg-subtle">FieldManager</span>
              <span className="text-renge-fg-muted px-1">→</span>
              <span className="px-2 py-0.5 rounded-renge-1 border border-renge-border text-renge-fg-subtle">deriveMode()</span>
              <span className="text-renge-fg-muted px-1">→</span>
              {["density", "motion", "contrast", "focus"].map((token, i) => (
                <span key={token} className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-renge-1 bg-renge-success-subtle text-renge-success border border-renge-border-subtle">
                    {token}
                  </span>
                  {i < 3 && <span className="text-renge-border">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Convention CTA */}
          <div className="mt-renge-5">
            <Link
              href="/convention"
              className="group flex items-center gap-renge-4 p-renge-4 rounded-renge-3 border border-renge-border bg-renge-bg hover:border-renge-border-focus hover:bg-renge-bg-subtle transition-all duration-renge-3 ease-renge-ease-out"
            >
              <div className="w-10 h-10 rounded-renge-2 bg-renge-accent-subtle flex items-center justify-center text-renge-accent shrink-0">
                <SparklesIcon size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-renge-fg">Abyss Con — Gachiakuta Convention</p>
                <p className="text-xs text-renge-fg-muted mt-0.5">
                  See the framework in action — adaptive density, motion, and tone
                </p>
              </div>
              <ArrowRightIcon
                size={16}
                className="text-renge-fg-muted group-hover:text-renge-fg group-hover:translate-x-1 transition-all duration-renge-2 ease-renge-spring shrink-0"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-renge-5 py-renge-7 flex flex-col gap-renge-7">

        {/* ── INSTALL ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-start justify-between mb-renge-5">
            <div>
              <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest mb-renge-2">Package</p>
              <div className="flex items-center gap-renge-3">
                <h2 className="text-renge-lg leading-renge-lg font-bold tracking-tight text-renge-fg">Now on npm</h2>
                <a
                  href="https://www.npmjs.com/package/@harmonia-core/ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-renge-full text-xs font-medium bg-renge-danger-subtle text-renge-danger border border-renge-border-subtle hover:opacity-80 transition-opacity duration-renge-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-renge-danger" />
                  npm
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-renge-fg-muted mb-renge-5 max-w-2xl">
            Install the capacity system, hooks, and components into any React project.
            Requires React 18+ and <code className="font-mono text-xs bg-renge-bg-muted px-1.5 py-0.5 rounded-renge-1">@renge-ui/tokens</code>.
          </p>

          <div className="space-y-renge-4">
            {/* Step 1 */}
            <div className="rounded-renge-3 border border-renge-border bg-renge-bg-subtle p-renge-4 space-y-renge-3">
              <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest">1 — Install</p>
              <div className="grid gap-renge-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-renge-fg-muted mb-1.5">npm</p>
                  <div className="rounded-renge-2 bg-renge-bg border border-renge-border px-renge-4 py-renge-3 font-mono text-xs text-renge-fg select-all">
                    npm install @harmonia-core/ui @renge-ui/tokens
                  </div>
                </div>
                <div>
                  <p className="text-xs text-renge-fg-muted mb-1.5">pnpm</p>
                  <div className="rounded-renge-2 bg-renge-bg border border-renge-border px-renge-4 py-renge-3 font-mono text-xs text-renge-fg select-all">
                    pnpm add @harmonia-core/ui @renge-ui/tokens
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-renge-3 border border-renge-border bg-renge-bg-subtle p-renge-4 space-y-renge-3">
              <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest">2 — Setup</p>
              <p className="text-xs text-renge-fg-muted">
                In your root layout, import the token CSS and wrap with{" "}
                <code className="font-mono bg-renge-bg-muted px-1 rounded-renge-1">CapacityProvider</code>.
              </p>
              <div className="rounded-renge-2 bg-renge-bg border border-renge-border px-renge-4 py-renge-4 font-mono text-xs space-y-1 leading-relaxed">
                <div>
                  <span className="text-renge-info">import</span>
                  <span className="text-renge-fg-muted">{" '"}</span>
                  <span className="text-renge-success">@renge-ui/tokens/renge.css</span>
                  <span className="text-renge-fg-muted">{"'"}</span>
                </div>
                <div>
                  <span className="text-renge-info">import</span>
                  <span className="text-renge-fg">{" { CapacityProvider } "}</span>
                  <span className="text-renge-info">from</span>
                  <span className="text-renge-success">{" '@harmonia-core/ui'"}</span>
                </div>
                <div className="pt-1">
                  <span className="text-renge-info">export default function</span>
                  <span className="text-renge-warning">{" RootLayout"}</span>
                  <span className="text-renge-fg-muted">{"({ children }) {"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-renge-info">return</span>
                  <span className="text-renge-fg-muted">{" ("}</span>
                </div>
                <div className="pl-8">
                  <span className="text-renge-fg-subtle">{"<html "}</span>
                  <span className="text-renge-info">data-profile</span>
                  <span className="text-renge-fg-muted">{"="}</span>
                  <span className="text-renge-success">{'"ocean"'}</span>
                  <span className="text-renge-info">{" data-mode"}</span>
                  <span className="text-renge-fg-muted">{"="}</span>
                  <span className="text-renge-success">{'"dark"'}</span>
                  <span className="text-renge-fg-subtle">{">"}</span>
                </div>
                <div className="pl-12 text-renge-fg-subtle">{"<body>"}</div>
                <div className="pl-16">
                  <span className="text-renge-fg-subtle">{"<"}</span>
                  <span className="text-renge-info">CapacityProvider</span>
                  <span className="text-renge-fg-subtle">{">"}</span>
                </div>
                <div className="pl-20 text-renge-fg-subtle">{"{ children }"}</div>
                <div className="pl-16">
                  <span className="text-renge-fg-subtle">{"</"}</span>
                  <span className="text-renge-info">CapacityProvider</span>
                  <span className="text-renge-fg-subtle">{">"}</span>
                </div>
                <div className="pl-12 text-renge-fg-subtle">{"</body>"}</div>
                <div className="pl-8 text-renge-fg-subtle">{"</html>"}</div>
                <div className="pl-4 text-renge-fg-muted">{")"}</div>
                <div className="text-renge-fg-muted">{"}"}</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-renge-3 border border-renge-border bg-renge-bg-subtle p-renge-4 space-y-renge-3">
              <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest">3 — Add capacity controls</p>
              <p className="text-xs text-renge-fg-muted">
                Drop{" "}
                <code className="font-mono bg-renge-bg-muted px-1 rounded-renge-1">{"<CapacityControls />"}</code>{" "}
                anywhere in your app — it renders a floating panel (bottom-right) where users manually adjust their cognitive, temporal, emotional, and valence state.
              </p>
              <div className="rounded-renge-2 bg-renge-bg border border-renge-border px-renge-4 py-renge-4 font-mono text-xs space-y-1 leading-relaxed">
                <div>
                  <span className="text-renge-info">import</span>
                  <span className="text-renge-fg">{" { CapacityControls } "}</span>
                  <span className="text-renge-info">from</span>
                  <span className="text-renge-success">{" '@harmonia-core/ui/components'"}</span>
                </div>
                <div className="pt-1">
                  <span className="text-renge-info">export default function</span>
                  <span className="text-renge-warning">{" RootLayout"}</span>
                  <span className="text-renge-fg-muted">{"({ children }) {"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-renge-info">return</span>
                  <span className="text-renge-fg-muted">{" ("}</span>
                </div>
                <div className="pl-8 text-renge-fg-subtle">{"<html>"}</div>
                <div className="pl-12 text-renge-fg-subtle">{"<body>"}</div>
                <div className="pl-16">
                  <span className="text-renge-fg-subtle">{"<"}</span>
                  <span className="text-renge-info">CapacityProvider</span>
                  <span className="text-renge-fg-subtle">{">"}</span>
                </div>
                <div className="pl-20 text-renge-fg-subtle">{"{ children }"}</div>
                <div className="pl-20">
                  <span className="text-renge-fg-subtle">{"<"}</span>
                  <span className="text-renge-warning">CapacityControls</span>
                  <span className="text-renge-fg-subtle">{" />"}</span>
                  <span className="text-renge-fg-subtle pl-2">{"// ← add this"}</span>
                </div>
                <div className="pl-16">
                  <span className="text-renge-fg-subtle">{"</"}</span>
                  <span className="text-renge-info">CapacityProvider</span>
                  <span className="text-renge-fg-subtle">{">"}</span>
                </div>
                <div className="pl-12 text-renge-fg-subtle">{"</body>"}</div>
                <div className="pl-8 text-renge-fg-subtle">{"</html>"}</div>
                <div className="pl-4 text-renge-fg-muted">{")"}</div>
                <div className="text-renge-fg-muted">{"}"}</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-renge-3 border border-renge-border bg-renge-bg-subtle p-renge-4 space-y-renge-3">
              <p className="text-xs font-medium text-renge-fg-muted uppercase tracking-widest">4 — Use</p>
              <p className="text-xs text-renge-fg-muted">
                Call{" "}
                <code className="font-mono bg-renge-bg-muted px-1 rounded-renge-1">useDerivedMode()</code>{" "}
                in any component to read the current interface mode tokens.
              </p>
              <div className="rounded-renge-2 bg-renge-bg border border-renge-border px-renge-4 py-renge-4 font-mono text-xs space-y-1 leading-relaxed">
                <div>
                  <span className="text-renge-info">import</span>
                  <span className="text-renge-fg">{" { useDerivedMode } "}</span>
                  <span className="text-renge-info">from</span>
                  <span className="text-renge-success">{" '@harmonia-core/ui'"}</span>
                </div>
                <div>
                  <span className="text-renge-info">import</span>
                  <span className="text-renge-fg">{" { Button } "}</span>
                  <span className="text-renge-info">from</span>
                  <span className="text-renge-success">{" '@harmonia-core/ui/components'"}</span>
                </div>
                <div className="pt-1">
                  <span className="text-renge-info">export function</span>
                  <span className="text-renge-warning">{" MyComponent"}</span>
                  <span className="text-renge-fg-muted">{"() {"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-renge-info">const</span>
                  <span className="text-renge-fg">{" mode "}</span>
                  <span className="text-renge-fg-muted">{"= "}</span>
                  <span className="text-renge-warning">useDerivedMode</span>
                  <span className="text-renge-fg-muted">{"()"}</span>
                </div>
                <div className="pl-4 pt-0.5 text-renge-fg-subtle">{"// mode.density → 'low' | 'medium' | 'high'"}</div>
                <div className="pl-4 text-renge-fg-subtle">{"// mode.motion  → 'off' | 'soothing' | 'subtle' | 'expressive'"}</div>
                <div className="pl-4 text-renge-fg-subtle">{"// mode.contrast → 'standard' | 'boosted'"}</div>
                <div className="pl-4 pt-1">
                  <span className="text-renge-info">return</span>
                  <span className="text-renge-fg-muted">{" <"}</span>
                  <span className="text-renge-info">Button</span>
                  <span className="text-renge-fg-muted">{" mode={mode}>Save</Button>"}</span>
                </div>
                <div className="text-renge-fg-muted">{"}"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LIVE DEMO ──────────────────────────────────────────── */}
        <section>
          <SectionHeader eyebrow="Interactive" title="Live Demo" />
          <p className="text-sm text-renge-fg-muted mb-renge-5 -mt-renge-3">
            Adjust the capacity controls (bottom-right) to see how this card adapts in real-time.
          </p>
          <CapacityDemoCard />
        </section>

        {/* ── MODE DERIVATION ────────────────────────────────────── */}
        <section>
          <SectionHeader eyebrow="Transparency" title="Mode Derivation" />
          <p className="text-sm text-renge-fg-muted mb-renge-5 -mt-renge-3">
            See exactly how your inputs become a coherent interface mode.
          </p>
          <AmbientFieldMonitor />
        </section>

        {/* ── PHASES ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader eyebrow="Roadmap" title="Development Phases" />
          <div className="grid gap-renge-4 sm:grid-cols-3">
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
                "Interaction, Input, Environment",
                "Auto-mode with manual override",
                "PatternStore + PatternExtractor",
                "PredictionEngine + hook",
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

      {/* Shared Capacity Controls */}
      <CapacityControls />
    </main>
  )
}
