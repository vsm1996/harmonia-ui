"use client"

import { useEffect, useRef } from "react"

/**
 * Lightweight scroll animation hook using IntersectionObserver
 * Adds 'in-view' class when element enters viewport
 * 
 * Usage: Pass the ref to a container element. All children with
 * 'animate-fade-in' class will animate when the container is in view.
 */
export function useScrollAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Re-query elements at trigger time to avoid stale references
            const animatedElements = element.querySelectorAll('.animate-fade-in')
            const allElements = element.classList.contains('animate-fade-in') 
              ? [element, ...Array.from(animatedElements)]
              : Array.from(animatedElements)

            // Add in-view class to all animated elements
            allElements.forEach((el) => {
              el.classList.add('in-view')
            })
            // Disconnect after triggering - only animate once
            observer.disconnect()
          }
        })
      },
      { 
        threshold: 0.05,
        rootMargin: '80px 0px' // Start animation before element is fully in view
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * Hook for individual elements (simpler usage)
 */
export function useInViewAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('in-view')
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
  }, [])

  return ref
}
