import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Abyss Con - Gachiakuta Convention",
  description:
    "Join us in the Abyss. A Gachiakuta-themed anime convention featuring voice actors, the manga creator, and exclusive events. Experience capacity-adaptive UI in action.",
  keywords: [
    "Gachiakuta",
    "anime convention",
    "Kei Urana",
    "voice actors",
    "Abyss Con",
    "manga",
    "adaptive UI demo",
  ],
  openGraph: {
    title: "Abyss Con - Gachiakuta Convention",
    description:
      "From the depths, we rise. A Gachiakuta-themed convention showcasing capacity-adaptive UI. Featuring voice actors, the creator, and exclusive events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abyss Con - Gachiakuta Convention",
    description:
      "From the depths, we rise. A Gachiakuta-themed convention showcasing capacity-adaptive UI.",
  },
}

export default function ConventionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
