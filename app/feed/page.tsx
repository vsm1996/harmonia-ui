import type { Metadata } from "next"
import Link from "next/link"
import { DeferredCapacityControls } from "@/components/deferred-capacity-controls"
import { SocialFeed } from "@/components/feed/social-feed"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Feed Demo",
  description: "Adaptive social feed — same content, different presentation based on your declared capacity.",
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-renge-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-renge-border bg-renge-bg/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-renge-4 py-renge-3 flex items-center justify-between">
          <div className="flex items-center gap-renge-4">
            <Link
              href="/"
              className="text-sm text-renge-fg-muted hover:text-renge-fg transition-colors flex items-center gap-1.5"
            >
              <span aria-hidden="true">←</span>
              <span>Harmonia UI</span>
            </Link>
            <div className="w-px h-4 bg-renge-border" aria-hidden="true" />
            <h1 className="text-sm font-semibold text-renge-fg">Feed Demo</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Explainer strip */}
      <div className="border-b border-renge-border bg-renge-bg-subtle">
        <div className="mx-auto max-w-2xl px-renge-4 py-renge-3">
          <p className="text-xs text-renge-fg-muted leading-relaxed">
            Same content, different presentation.{" "}
            <span className="text-renge-fg-subtle">
              Open the Capacity Controls (bottom-right) and drag the sliders — or pick a preset like{" "}
              <em>Exhausted</em> or <em>Energized</em> — to see the feed restructure in real time.
            </span>
          </p>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-2xl px-renge-4 py-renge-5">
        <SocialFeed />
      </div>

      {/* Capacity Controls */}
      <DeferredCapacityControls />
    </main>
  )
}
