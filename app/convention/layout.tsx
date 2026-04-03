import React from "react"
import { createRengeTheme } from "@renge-ui/tokens"

const conventionTheme = createRengeTheme({
  profile: 'fire',
  mode: 'dark',
  selector: '.theme-gachiakuta',
})

export default function ConventionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: conventionTheme.css }} />
      {children}
    </>
  )
}
