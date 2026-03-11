"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setTheme(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (theme === "dark" || (theme === "system" && systemDark)) {
      root.classList.add("dark")
      root.setAttribute("data-theme", "harmonia-dark")
    } else {
      root.classList.remove("dark")
      root.setAttribute("data-theme", "harmonia-light")
    }

    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      root.classList.toggle("dark", e.matches)
      root.setAttribute("data-theme", e.matches ? "harmonia-dark" : "harmonia-light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === "light") return "dark"
      if (current === "dark") return "system"
      return "light"
    })
  }

  const getActiveMode = (): "light" | "dark" => {
    if (!mounted) return "light"
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  if (!mounted) {
    return (
      <button className="btn btn-ghost btn-square" disabled aria-label="Loading theme">
        <span className="size-4" />
      </button>
    )
  }

  const activeMode = getActiveMode()

  return (
    <button
      className="btn btn-ghost btn-square"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {activeMode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="sr-only">Current theme: {theme}. Press to cycle through light, dark, and system.</span>
    </button>
  )
}
