import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Harmonia UI and Abyss Con demo. Learn how we handle your information.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
          <p className="text-lg">
            <strong>Last updated:</strong> February 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Overview</h2>
            <p>
              Harmonia UI is a demonstration project showcasing capacity-adaptive interfaces. 
              This privacy policy explains how we handle information when you use this demo site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Information We Collect</h2>
            <p>
              <strong>We do not collect personal information.</strong> The capacity controls you adjust 
              (cognitive, temporal, emotional, valence) are stored only in your browser's memory and 
              are never sent to any server.
            </p>
            <p>
              We use Vercel Analytics and Speed Insights for aggregate, anonymous usage statistics. 
              These tools do not track individual users or collect personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Cookies</h2>
            <p>
              This site may use essential cookies for basic functionality. We do not use 
              tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Third-Party Services</h2>
            <p>
              This site is hosted on Vercel. Please refer to{" "}
              <a 
                href="https://vercel.com/legal/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vercel's Privacy Policy
              </a>{" "}
              for information about their data practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              For questions about this privacy policy, please open an issue on our{" "}
              <a 
                href="https://github.com/vsm1996/harmonia-ui/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/convention">Back to Abyss Con</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
