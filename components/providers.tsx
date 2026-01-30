/**
 * Client-side Providers Wrapper
 *
 * Architecture Decision:
 * - Separates client providers from the Server Component layout
 * - Ensures proper hydration by wrapping all client-only context at one level
 * - EmpathyProvider initializes the ambient field system for all children
 *
 * Why a separate file?
 * - layout.tsx is a Server Component by default in Next.js App Router
 * - Client components with context need to be explicitly separated
 * - This prevents "use client" from propagating to the entire layout tree
 */

"use client"

import type React from "react"
import { EmpathyProvider } from "@/lib/empathy/provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <EmpathyProvider>{children}</EmpathyProvider>
}
