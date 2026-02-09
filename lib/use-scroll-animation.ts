"use client"

import { useEffect, useRef, useState, useCallback } from "react"

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
 * Before in-view: hidden (opacity 0, translated down).
 * After in-view: plays the fadeInUp animation via CSS.
 */
export function fadeClass(isInView: boolean): string {
  return isInView ? "animate-fade-in in-view" : "animate-fade-in"
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
