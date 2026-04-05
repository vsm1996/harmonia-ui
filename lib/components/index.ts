/**
 * @harmonia-core/ui — Pre-built Components
 *
 * Drop-in components for the capacity system.
 * Requires DaisyUI for styling.
 *
 * @example
 * import { CapacityControls, CapacityDemoCard, AmbientFieldMonitor } from "@harmonia-core/ui/components"
 */

export { CapacityControls } from "./capacity-controls"
export { CapacityDemoCard } from "./capacity-demo-card"
export { AmbientFieldMonitor } from "./ambient-field-monitor"

// UI primitives — re-exported for consumers who want consistent styling
export { Badge } from "./ui/badge"
export { Button } from "./ui/button"
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./ui/card"
export { Select } from "./ui/select"
export { Slider } from "./ui/slider"
