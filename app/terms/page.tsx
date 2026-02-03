import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Harmonia UI and Abyss Con demo. Understand the demo nature of this project.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
          <p className="text-lg">
            <strong>Last updated:</strong> February 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
            <p>
              By accessing Harmonia UI, you agree to these terms. This is a demonstration 
              project for educational and portfolio purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Demo Nature</h2>
            <p>
              <strong>Abyss Con is a fictional convention.</strong> This site demonstrates 
              capacity-adaptive UI principles using a fictional anime convention as the example. 
              No real event is being promoted, and no real tickets are being sold.
            </p>
            <p>
              The guest information, event schedules, and ticket prices shown are for 
              demonstration purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Intellectual Property</h2>
            <p>
              Harmonia UI is open source under the MIT License. The Gachiakuta manga and 
              related characters are the property of Kei Urana and Shueisha.
            </p>
            <p>
              Voice actor names and likenesses are used for demonstration purposes in the 
              context of a fictional convention example.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">No Warranties</h2>
            <p>
              This demo is provided "as is" without warranty of any kind. We make no 
              guarantees about availability, accuracy, or fitness for any particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Limitation of Liability</h2>
            <p>
              In no event shall the creators of Harmonia UI be liable for any damages 
              arising from the use of this demonstration site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              For questions about these terms, please open an issue on our{" "}
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
