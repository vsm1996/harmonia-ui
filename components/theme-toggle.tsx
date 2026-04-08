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

    if (theme === "dark") {
      root.classList.add("dark")
      root.setAttribute("data-mode", "dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
      root.setAttribute("data-mode", "light")
    } else {
      // system — let renge's media query handle data-mode
      root.classList.toggle("dark", systemDark)
      root.removeAttribute("data-mode")
    }

    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      root.classList.toggle("dark", e.matches)
      // system mode: remove data-mode override, let renge media query decide
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
      <button className="inline-flex items-center justify-center w-9 h-9 rounded-renge-2 text-renge-fg-muted" disabled aria-label="Loading theme">
        <span className="size-4" />
      </button>
    )
  }

  const activeMode = getActiveMode()

  return (
    <button
      className="inline-flex items-center justify-center w-9 h-9 rounded-renge-2 text-renge-fg-muted hover:bg-renge-bg-muted hover:text-renge-fg transition-all duration-renge-2 ease-renge-ease-out"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {activeMode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="sr-only">Current theme: {theme}. Press to cycle through light, dark, and system.</span>
    </button>
  )
}
