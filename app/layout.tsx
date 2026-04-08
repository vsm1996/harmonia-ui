import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Providers } from "@/components/providers"
import ogImage from "@/public/images/ogImage.jpg"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = "https://harmonia-ui.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "Harmonia UI",
    template: "%s | Harmonia UI",
  },
  description: "UI that adapts to human capacity. Interfaces that meet you where you are.",
  generator: "v0.app",
  metadataBase: new URL(siteUrl),
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
  creator: "Vanessa Martin",
  publisher: "Vanessa Martin",
  openGraph: {
    title: "Harmonia UI - Capacity-Adaptive Framework",
    description: "A capacity-adaptive UI framework that treats human state as a first-class input.",
    url: siteUrl,
    siteName: "Harmonia UI",
    images: [
      {
        url: `${siteUrl}/images/ogImage.jpg`,
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
    title: "Harmonia UI - Capacity-Adaptive Framework",
    description: "A capacity-adaptive UI framework that treats human state as a first-class input.",
    images: [{
      url: `${siteUrl}/images/ogImage.jpg`,
      width: 1200,
      height: 630,
      alt: "Harmonia UI - Interfaces that adapt to human capacity",
    },],
    creator: "Vanessa Martin",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-profile="ocean" data-mode="dark">
      <head>
        <meta property="og:image" content={`${siteUrl}/images/ogImage.jpg`} />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
