/**
 * Tickets Section - Pricing and CTA
 *
 * Empathy-Driven Adaptations:
 * - Low cognitive: Show only recommended tier, hide comparison
 * - Low emotional: Supportive tone, reduce urgency
 * - Low temporal: Skip details, show price + CTA only
 * - Minimal mode: Single "Get Tickets" button
 */

"use client"

import { motion } from "motion/react"
import { useEmpathyContext, deriveMode } from "@/lib/empathy"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Ticket tier data with content variants
 */
const TIERS = [
  {
    id: "general",
    name: "General",
    price: 75,
    description: {
      full: "Full convention access",
      short: "Full access",
    },
    features: {
      full: [
        "3-day access to all public areas",
        "Artist alley & vendor hall",
        "Standard panel seating",
        "Anime screenings",
      ],
      short: ["3-day access", "All public areas"],
    },
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 175,
    description: {
      full: "Priority access & perks",
      short: "Priority access",
    },
    features: {
      full: [
        "Everything in General",
        "Priority panel seating",
        "Exclusive merch pack",
        "Early entry (1 hour)",
        "Premium lounge access",
      ],
      short: ["All General perks", "Priority seating", "Merch pack"],
    },
    highlight: true,
  },
  {
    id: "vip",
    name: "VIP Abyss",
    price: 350,
    description: {
      full: "The ultimate experience",
      short: "VIP experience",
    },
    features: {
      full: [
        "Everything in Premium",
        "Reserved front-row seating",
        "Meet & greet with guests",
        "Private VIP events",
        "Exclusive Gachiakuta print",
        "Concierge service",
      ],
      short: ["All Premium perks", "Meet & greet", "VIP events"],
    },
    highlight: false,
  },
] as const

/**
 * Header text variants
 */
const HEADERS = {
  full: {
    title: "Claim Your Spot",
    description: "Limited capacity. Early bird pricing ends July 1st.",
    footer: "All tickets include digital schedule access and convention app. Refunds available up to 30 days before the event.",
  },
  reduced: {
    title: "Get Tickets",
    description: "Early bird pricing ends July 1st.",
    footer: null,
  },
  minimal: {
    title: "Tickets",
    description: null,
    footer: null,
  },
}

export function TicketsSection() {
  const { context } = useEmpathyContext()
  const mode = deriveMode({
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
  })

  /**
   * Content level based on density
   */
  const contentLevel =
    mode.density === "low" ? "minimal" : mode.density === "medium" ? "reduced" : "full"

  const header = HEADERS[contentLevel]
  const featureLength = context.userCapacity.cognitive > 0.5 ? "full" : "short"

  /**
   * Visible tiers based on choice load
   * Minimal: Only the recommended (premium) tier
   * Normal: All tiers
   */
  const visibleTiers =
    mode.choiceLoad === "minimal" ? TIERS.filter((t) => t.highlight) : TIERS

  /**
   * CTA pulse only when motion is expressive and energy is high
   */
  const pulseIntensity = mode.motion === "expressive" ? 0.05 : 0

  /**
   * Grid columns based on visible tiers
   */
  const gridClass =
    visibleTiers.length === 1 ? "max-w-md mx-auto" : "grid md:grid-cols-3 gap-6 items-stretch"

  return (
    <section
      className="py-24 px-4 md:px-8"
      aria-labelledby="tickets-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.header
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 tracking-widest">
            TICKETS
          </Badge>
          <h2
            id="tickets-title"
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            {header.title.split(" ").slice(0, -1).join(" ")}
            {header.title.split(" ").length > 1 && (
              <span className="text-primary"> {header.title.split(" ").slice(-1)}</span>
            )}
            {header.title.split(" ").length === 1 && (
              <span className="text-primary">{header.title}</span>
            )}
          </h2>
          {header.description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              {header.description}
            </p>
          )}
        </motion.header>

        {/* Pricing grid - adapts to visible tiers */}
        <div className={gridClass}>
          {visibleTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <TierCard
                tier={tier}
                pulseIntensity={pulseIntensity}
                featureLength={featureLength}
                showFeatures={context.userCapacity.cognitive > 0.35}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional info - only when cognitive capacity allows */}
        {header.footer && context.userCapacity.cognitive > 0.5 && (
          <motion.div
            className="mt-12 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p>{header.footer}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual tier card
 * Adapts feature list based on cognitive capacity
 */
function TierCard({
  tier,
  pulseIntensity,
  featureLength,
  showFeatures,
}: {
  tier: (typeof TIERS)[number]
  pulseIntensity: number
  featureLength: "full" | "short"
  showFeatures: boolean
}) {
  const description = tier.description[featureLength]
  const features = tier.features[featureLength]

  return (
    <Card
      className={`h-full flex flex-col ${
        tier.highlight
          ? "border-primary bg-primary/5 relative"
          : ""
      }`}
    >
      {tier.highlight && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Recommended
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-5xl font-black text-foreground">
            ${tier.price}
          </span>
          <span className="text-muted-foreground ml-1">USD</span>
        </div>

        {showFeatures && (
          <ul className="space-y-3" role="list">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <CheckIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter>
        <motion.div
          className="w-full"
          animate={
            tier.highlight && pulseIntensity > 0
              ? { scale: [1, 1 + pulseIntensity, 1] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Button
            className="w-full"
            variant={tier.highlight ? "default" : "outline"}
            size="lg"
          >
            {tier.highlight ? "Get Started" : `Select ${tier.name}`}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
