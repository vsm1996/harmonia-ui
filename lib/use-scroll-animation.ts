"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Helper: returns the correct CSS animation class string for scroll-fade entrance.
 *
 * Before in-view: hidden (opacity 0, translated down) via animate-fade-in.
 * After in-view: plays the fadeInUp animation via CSS.
 * Once hasPlayed is true, returns "" so re-renders don't replay the entrance.
 */
export function fadeClass(isInView: boolean, hasPlayed?: boolean): string {
  if (hasPlayed) return ""
  return isInView ? "animate-fade-in in-view" : "animate-fade-in"
}

/**
 * Scroll-triggered fade hook with re-render safety.
 *
 * Uses IntersectionObserver to detect when an element enters the viewport.
 * Returns { ref, isInView, hasPlayed } where:
 * - isInView: true once the element is visible (one-shot, never reverts)
 * - hasPlayed: true after a buffer period, signaling components to drop
 *   entrance animation classes so re-renders don't replay them.
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: "80px 0px",
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isInView])

  // After animation completes (longest delay + animation duration),
  // mark as played so re-renders skip the animation classes entirely
  useEffect(() => {
    if (!isInView || hasPlayed) return
    const timer = setTimeout(() => setHasPlayed(true), 1200)
    return () => clearTimeout(timer)
  }, [isInView, hasPlayed])

  return { ref, isInView, hasPlayed }
}
