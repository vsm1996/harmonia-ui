"use client"

import dynamic from "next/dynamic"

// Dynamic import defers motion/react and all control panel code
// until after the initial page load — the panel is hidden on first render anyway.
const CapacityControlsLazy = dynamic(
  () => import("./capacity-controls").then((m) => ({ default: m.CapacityControls })),
  { ssr: false }
)

export function DeferredCapacityControls() {
  return <CapacityControlsLazy />
}
