"use client"

import { useDerivedMode, useFeedback, entranceClass as getEntranceClass, hoverClass as getHoverClass, ambientClass, listItemClass, focusBeaconClass, focusTextClass } from "@/lib/capacity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useScrollFade, fadeClass } from "@/lib/use-scroll-animation"

/**
 * Tickets Section - Simplified for scroll performance
 * Uses CSS animations instead of Framer Motion
 */

const TIERS = [
  {
    id: "scrapper",
    name: "Scrapper",
    price: 75,
    description: {
      full: "You made it down here. That's what matters.",
      short: "You're in.",
    },
    features: {
      full: [
        "3 days in the Abyss",
        "The Pile (Artist Alley)",
        "All panels, all screenings",
        "You belong here",
      ],
      short: ["3 days", "Full access"],
    },
    highlight: false,
  },
  {
    id: "hunter",
    name: "Hunter",
    price: 175,
    description: {
      full: "You know the good stuff. You get there first.",
      short: "Early access. Better seats.",
    },
    features: {
      full: [
        "Everything Scrappers get +",
        "Enter 1 hour before the crowd",
        "Front section at panels",
        "Exclusive merch drop",
        "Hunter's den (lounge)",
      ],
      short: ["Scrapper +", "Early entry", "Front seats"],
    },
    highlight: true,
  },
  {
    id: "boss",
    name: "Tribe Boss",
    price: 350,
    description: {
      full: "You run this place.",
      short: "Full access. All perks.",
    },
    features: {
      full: [
        "Everything Hunters get +",
        "Front row. Reserved.",
        "Meet the legends face to face",
        "Boss-only gatherings",
        "Signed Gachiakuta print from Urana",
        "Personal guide through the chaos",
      ],
      short: ["Hunter +", "Meet guests", "Boss events"],
    },
    highlight: false,
  },
] as const

const HEADERS = {
  full: {
    title: "Claim Your Place",
    description: "The Abyss doesn't wait. Early rates end July 1. After that, prices rise.",
    footer: "Refund til 30 days out. After that, find someone else to take your spot.",
  },
  reduced: {
    title: "Passes",
    description: "Early bird til July 1.",
    footer: null,
  },
  minimal: {
    title: "Passes",
    description: null,
    footer: null,
  },
}

export function TicketsSection() {
  const { field, mode } = useDerivedMode()
  const { fire } = useFeedback()
  const { ref: sectionRef, isInView, hasPlayed } = useScrollFade<HTMLElement>()

  const entrance = getEntranceClass(mode.motion, "spiral", hasPlayed)
  const hover = getHoverClass(mode.motion)
  const warmthShift = field.valence * 15

  const headerVariant = field.temporal < 0.3 ? "minimal" : field.temporal < 0.6 ? "reduced" : "full"
  const header = HEADERS[headerVariant]

  // choiceLoad="minimal" reduces decision fatigue: show only the recommended tier
  const visibleTiers = mode.choiceLoad === "minimal" ? TIERS.filter(t => t.highlight) : TIERS
  const featureVariant = field.temporal < 0.4 ? "short" : "full"

  const gridClass = visibleTiers.length === 1 
    ? "max-w-md mx-auto" 
    : "grid gap-6 md:grid-cols-3 max-w-5xl mx-auto"

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-8 bg-muted/30" aria-labelledby="tickets-title">
      <div className="max-w-6xl mx-auto" style={{ filter: `hue-rotate(${warmthShift}deg)` }}>
        {/* Header */}
        <header className={`mb-16 text-center ${fadeClass(isInView, hasPlayed)}`}>
          <Badge variant="outline" className="mb-4 tracking-widest text-primary border-primary/50">
            PASSES
          </Badge>
          <h2 id="tickets-title" className={`text-4xl md:text-6xl font-black tracking-tight mb-4 ${ambientClass(mode.motion, "float")}`}>
            {header.title}
          </h2>
          {header.description && (
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              {header.description}
            </p>
          )}
        </header>

        {/* Pricing grid */}
        <div className={gridClass}>
          {visibleTiers.map((tier, index) => (
            <div
              key={tier.id}
              className={entrance || fadeClass(isInView, hasPlayed)}
              style={!hasPlayed ? { animationDelay: `${100 + index * 100}ms` } : undefined}
            >
              <Card className={`h-full flex flex-col relative overflow-hidden group transition-all duration-300 ${hover} hover:border-primary/50 hover:shadow-lg ${
                tier.highlight 
                  ? "border-primary/50 shadow-lg" 
                  : "border-border/50"
              } ${ambientClass(mode.motion, "breathe")} ${tier.highlight ? focusBeaconClass(mode.focus) : ""}`}>
                {tier.highlight && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className={`text-2xl font-bold group-hover:text-primary transition-colors ${ambientClass(mode.motion, "float")} ${tier.highlight ? focusTextClass(mode.focus) : ""}`}>
                    {tier.name}
                  </CardTitle>
                  <CardDescription>
                    {tier.description[featureVariant === "full" ? "full" : "short"]}
                  </CardDescription>
                  <div className="mt-4">
                    <span className={`text-4xl font-black ${ambientClass(mode.motion, "pulse")}`}>${tier.price}</span>
                    <span className="text-muted-foreground ml-1">/pass</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-6">
                    {tier.features[featureVariant].map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2 text-sm ${listItemClass(mode.motion)}`}
                        style={{ animationDelay: `${i * 0.12}s` }}
                      >
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${tier.highlight ? "" : "bg-transparent"} ${getHoverClass(mode.motion)} ${tier.highlight ? focusBeaconClass(mode.focus) : ""}`}
                    variant={tier.highlight ? "default" : "outline"}
                    size="lg"
                    onClick={() => fire("tap")}
                  >
                    Get {tier.name} Pass
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer */}
        {header.footer && (
          <p 
            className={`mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto ${fadeClass(isInView, hasPlayed)}`}
            style={!hasPlayed ? { animationDelay: "350ms" } : undefined}
          >
            {header.footer}
          </p>
        )}
      </div>
    </section>
  )
}
