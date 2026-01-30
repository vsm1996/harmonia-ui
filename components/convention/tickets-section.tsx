/**
 * Tickets Section - Pricing and CTA
 *
 * Design decisions:
 * - Attention field influences visual emphasis on CTA
 * - High attention = more prominent pricing display
 * - Energy influences the pulsing animation of the main CTA
 * - Clear tier hierarchy with visual differentiation
 */

"use client"

import { motion } from "motion/react"
import { useEnergyField, useAttentionField } from "@/lib/empathy"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Ticket tier data
 */
const TIERS = [
  {
    id: "general",
    name: "General",
    price: 75,
    description: "Full convention access",
    features: [
      "3-day access to all public areas",
      "Artist alley & vendor hall",
      "Standard panel seating",
      "Anime screenings",
    ],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 175,
    description: "Priority access & perks",
    features: [
      "Everything in General",
      "Priority panel seating",
      "Exclusive merch pack",
      "Early entry (1 hour)",
      "Premium lounge access",
    ],
    highlight: true,
  },
  {
    id: "vip",
    name: "VIP Abyss",
    price: 350,
    description: "The ultimate experience",
    features: [
      "Everything in Premium",
      "Reserved front-row seating",
      "Meet & greet with guests",
      "Private VIP events",
      "Exclusive Gachiakuta print",
      "Concierge service",
    ],
    highlight: false,
  },
] as const

export function TicketsSection() {
  const energy = useEnergyField()
  const attention = useAttentionField()

  /**
   * CTA pulse animation based on energy
   * Higher energy = more noticeable pulse
   * Lower energy = subtle or no pulse (less distracting)
   */
  const pulseIntensity = energy.value > 0.5 ? 0.05 : 0

  /**
   * Attention influences the scale of the highlighted tier
   * Higher attention = more pronounced emphasis
   */
  const highlightScale = 1 + attention.value * 0.02

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
            Claim Your
            <span className="text-primary"> Spot</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Limited capacity. Early bird pricing ends July 1st.
          </p>
        </motion.header>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              style={{
                scale: tier.highlight ? highlightScale : 1,
              }}
            >
              <TierCard
                tier={tier}
                pulseIntensity={pulseIntensity}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          className="mt-12 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>
            All tickets include digital schedule access and convention app.
            <br />
            Refunds available up to 30 days before the event.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Individual tier card
 */
function TierCard({
  tier,
  pulseIntensity,
}: {
  tier: (typeof TIERS)[number]
  pulseIntensity: number
}) {
  return (
    <Card
      className={`h-full flex flex-col ${
        tier.highlight
          ? "border-primary bg-primary/5 relative"
          : ""
      }`}
    >
      {/* Popular badge for highlighted tier */}
      {tier.highlight && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Price display */}
        <div className="text-center mb-6">
          <span className="text-5xl font-black text-foreground">
            ${tier.price}
          </span>
          <span className="text-muted-foreground ml-1">USD</span>
        </div>

        {/* Features list */}
        <ul className="space-y-3" role="list">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <CheckIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <motion.div
          className="w-full"
          animate={
            tier.highlight && pulseIntensity > 0
              ? {
                  scale: [1, 1 + pulseIntensity, 1],
                }
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
            Select {tier.name}
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
