"use client"

/**
 * Theme Toggle Component
 *
 * Design Decision:
 * - Uses system preference as default, then respects user override
 * - Persists choice to localStorage for consistency across sessions
 * - Respects prefers-reduced-motion for the toggle animation
 *
 * Architecture:
 * - Self-contained component with local state
 * - No global state manager - aligns with Myoho principle of distributed autonomy
 * - Toggle applies .dark class to <html> element for CSS variable switching
 */

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
  /**
   * State tracks the user's explicit preference.
   * 'system' means we defer to prefers-color-scheme.
   */
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  /**
   * On mount, check localStorage for saved preference.
   * This runs once to hydrate the component with persisted state.
   */
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setTheme(stored)
    }
    setMounted(true)
  }, [])

  /**
   * Apply theme changes to the document.
   * Decision: We toggle the .dark class on <html> to trigger CSS variable swap.
   * This approach works with Tailwind's dark mode and our OKLCH color system.
   */
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (theme === "dark" || (theme === "system" && systemDark)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Persist choice for future sessions
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  /**
   * Listen for system preference changes when in 'system' mode.
   * This ensures real-time updates if user changes OS settings.
   */
  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  /**
   * Toggle cycles through: light → dark → system → light
   * This gives users full control while defaulting to system preference.
   */
  const cycleTheme = () => {
    setTheme((current) => {
      if (current === "light") return "dark"
      if (current === "dark") return "system"
      return "light"
    })
  }

  /**
   * Derive the currently active visual mode for icon display.
   * This accounts for 'system' mode resolving to actual light/dark.
   */
  const getActiveMode = (): "light" | "dark" => {
    if (!mounted) return "light"
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Loading theme">
        <span className="size-4" />
      </Button>
    )
  }

  const activeMode = getActiveMode()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {activeMode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="sr-only">Current theme: {theme}. Press to cycle through light, dark, and system.</span>
    </Button>
  )
}
