/**
 * InfectedText Component
 *
 * Creates a gradual "infection" animation effect where text
 * transitions from foreground color to accent (toxic green)
 * character by character, like a spreading contagion.
 *
 * Design philosophy:
 * - Organic, non-linear spread pattern
 * - Each character animates independently
 * - Infection spreads from random seed points
 * - Uses the accent color (toxic green) from theme
 */

"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"

interface InfectedTextProps {
  text: string
  /**
   * Duration of full infection spread in milliseconds
   * @default 2000
   */
  spreadDuration?: number
  /**
   * Delay before infection begins (ms)
   * @default 500
   */
  delay?: number
  /**
   * Whether the infection should loop
   * @default true
   */
  loop?: boolean
  /**
   * Time between infection cycles (ms)
   * @default 3000
   */
  loopDelay?: number
  /**
   * Custom color for infected state (OKLCH string)
   * If provided, overrides the default accent color
   * Allows parent components to pass transitioning color
   */
  infectColor?: string
}

export function InfectedText({
  text,
  spreadDuration = 2000,
  delay = 500,
  loop = true,
  loopDelay = 3000,
  infectColor,
}: InfectedTextProps) {
  const [infectedIndices, setInfectedIndices] = useState<Set<number>>(new Set())

  /**
   * Generate infection order - pseudo-random but deterministic per render
   * Creates organic spreading pattern by starting from random "seed" points
   * and spreading to adjacent characters with some randomness
   */
  const infectionOrder = useMemo(() => {
    const chars = text.split("")
    const order: number[] = []
    const remaining = new Set(chars.map((_, i) => i))

    // Start with 1-2 random seed points
    const seedCount = Math.min(2, Math.ceil(chars.length / 6))
    for (let i = 0; i < seedCount && remaining.size > 0; i++) {
      const seeds = Array.from(remaining)
      const seedIndex = seeds[Math.floor(Math.random() * seeds.length)]
      order.push(seedIndex)
      remaining.delete(seedIndex)
    }

    // Spread from infected points with weighted randomness
    while (remaining.size > 0) {
      const lastInfected = order[order.length - 1]
      const candidates = Array.from(remaining)

      // Weight candidates by proximity to already infected characters
      const weighted = candidates.map((idx) => {
        const minDistance = Math.min(
          ...order.map((infected) => Math.abs(idx - infected))
        )
        // Closer = higher weight, but add randomness
        return {
          idx,
          weight: 1 / (minDistance + 0.5) + Math.random() * 0.3,
        }
      })

      // Sort by weight and pick the highest (most likely to be adjacent)
      weighted.sort((a, b) => b.weight - a.weight)
      const next = weighted[0].idx
      order.push(next)
      remaining.delete(next)
    }

    return order
  }, [text])

  /**
   * Run infection animation
   * Gradually adds indices to the infected set
   */
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = []

    const runInfection = () => {
      setInfectedIndices(new Set())

      const intervalPerChar = spreadDuration / text.length

      infectionOrder.forEach((charIndex, orderIndex) => {
        const timeout = setTimeout(() => {
          setInfectedIndices((prev) => new Set([...prev, charIndex]))
        }, delay + orderIndex * intervalPerChar)
        timeouts.push(timeout)
      })

      // If looping, schedule reset and restart
      if (loop) {
        const resetTimeout = setTimeout(() => {
          setInfectedIndices(new Set())
          runInfection()
        }, delay + spreadDuration + loopDelay)
        timeouts.push(resetTimeout)
      }
    }

    runInfection()

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [text, infectionOrder, spreadDuration, delay, loop, loopDelay])

  return (
    <span className="inline" aria-label={text}>
      {text.split("").map((char, index) => {
        const isInfected = infectedIndices.has(index)
        const isSpace = char === " "

        return (
          <motion.span
            key={index}
            className={`inline-block ${!infectColor && isInfected ? "text-accent" : !infectColor ? "text-foreground" : ""}`}
            initial={false}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            style={{
              // Preserve spaces
              width: isSpace ? "0.25em" : "auto",
              // CSS transition handles color change smoothly
              transition: "color 0.4s ease-out",
              // Use custom infectColor if provided, otherwise fall back to classes
              ...(infectColor && { color: isInfected ? infectColor : undefined }),
            }}
            aria-hidden="true"
          >
            {char}
          </motion.span>
        )
      })}
    </span>
  )
}
