import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility statement for Harmonia UI. Built with accessibility as a core constraint, ensuring capacity adaptation never breaks access paths.",
}

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter mb-8">Accessibility Statement</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
          <p className="text-lg">
            Harmonia UI is built with accessibility as a core constraint, not an afterthought.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Commitment</h2>
            <p>
              We believe that capacity-adaptive interfaces should enhance accessibility, 
              never compromise it. The Harmonia framework is designed so that adaptation 
              cannot break access paths or alter semantic meaning.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Standards</h2>
            <p>
              We aim to conform to WCAG 2.1 Level AA guidelines. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Sufficient color contrast ratios (minimum 4.5:1 for normal text)</li>
              <li>Keyboard navigation for all interactive elements</li>
              <li>Proper heading hierarchy and landmark regions</li>
              <li>Alternative text for meaningful images</li>
              <li>Respect for user motion preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Motion and Animations</h2>
            <p>
              Harmonia UI respects the <code className="bg-muted px-1 rounded">prefers-reduced-motion</code> media 
              query. When enabled, all animations are disabled or significantly reduced.
            </p>
            <p>
              The "motion" token in our capacity system scales motion down before turning 
              it off entirely, providing a graceful degradation for users who prefer less movement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Capacity Controls</h2>
            <p>
              The capacity adjustment controls (sliders) are fully keyboard accessible:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Tab to navigate between controls</li>
              <li>Arrow keys to adjust values</li>
              <li>Values announced to screen readers</li>
              <li>Mode changes announced via aria-live regions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Key Rule</h2>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Fluidity may never alter meaning, semantics, or access paths. Only presentation 
              and density may change."
            </blockquote>
            <p className="mt-4">
              This principle ensures that regardless of what capacity mode you're in, the 
              content remains accessible. Hidden content in low-density modes is still 
              reachable via expandable regions or alternative navigation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Known Issues</h2>
            <p>
              We're actively working to improve accessibility. Known issues include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Some complex animations may not have adequate reduced-motion alternatives yet</li>
              <li>Touch target sizes on mobile could be improved in some components</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Feedback</h2>
            <p>
              If you encounter accessibility barriers, please let us know by opening an issue 
              on our{" "}
              <a 
                href="https://github.com/vsm1996/harmonia-ui/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>. We take accessibility feedback seriously and will work to address issues promptly.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/convention">Back to Abyss Con</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
