"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Lightweight scroll animation hook using IntersectionObserver.
 * 
 * Returns a ref and an `isInView` boolean. When the container enters the
 * viewport, `isInView` flips to true and stays true forever (one-shot).
 * 
 * Components use `isInView` to conditionally apply animation classes in JSX,
 * so the classes survive React re-renders (unlike direct DOM classList mutations).
 */
export function useScrollAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

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
        rootMargin: '80px 0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isInView])

  return { ref, isInView }
}

/**
 * Helper: returns the correct animation class string.
 * Before in-view: hidden (opacity 0, translated down) via animate-fade-in.
 * After in-view: plays the fadeInUp animation via CSS.
 * 
 * Once hasPlayed is true (set after initial animation completes),
 * returns empty string so re-renders don't replay the entrance animation.
 */
export function fadeClass(isInView: boolean, hasPlayed?: boolean): string {
  if (hasPlayed) return "" // Already animated, just be visible
  return isInView ? "animate-fade-in in-view" : "animate-fade-in"
}

/**
 * Hook variant of useScrollAnimation that also tracks whether the 
 * entrance animation has already played, preventing flicker on re-renders.
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
        rootMargin: '80px 0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isInView])

  // After animation completes (longest delay + animation duration),
  // mark as played so re-renders skip the animation classes entirely
  useEffect(() => {
    if (!isInView || hasPlayed) return
    const timer = setTimeout(() => setHasPlayed(true), 1200) // generous buffer
    return () => clearTimeout(timer)
  }, [isInView, hasPlayed])

  return { ref, isInView, hasPlayed }
}

/**
 * Hook for individual elements (simpler usage)
 */
export function useInViewAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

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
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isInView])

  return { ref, isInView }
}
