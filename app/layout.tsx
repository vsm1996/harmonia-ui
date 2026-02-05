import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Providers } from "@/components/providers"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Harmonia UI",
    template: "%s | Harmonia UI",
  },
  description: "UI that adapts to human capacity. Interfaces that meet you where you are.",
  generator: "v0.app",
  metadataBase: new URL("https://harmonia-ui.vercel.app"),
  keywords: [
    "adaptive UI",
    "capacity-aware design",
    "accessibility",
    "human-centered design",
    "React",
    "Next.js",
    "UI framework",
    "cognitive load",
    "inclusive design",
  ],
  authors: [{ name: "Vanessa Martin" }],
  creator: "Vanessa Martin",
  publisher: "Vanessa Martin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Harmonia UI",
    description: "A capacity-adaptive UI framework that treats human state as a first-class input.",
    url: "https://harmonia-ui.vercel.app",
    siteName: "Harmonia UI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Harmonia UI - Interfaces that adapt to human capacity",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harmonia UI",
    description: "A capacity-adaptive UI framework that treats human state as a first-class input.",
    images: ["/og-image.jpg"],
    creator: "",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://harmonia-ui.vercel.app",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
