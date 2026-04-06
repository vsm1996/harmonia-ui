/**
 * Post-build step: prepend "use client" to client-only bundles.
 *
 * esbuild and rollup both strip unknown module-level directives during
 * bundling, so the directive cannot be injected via tsup's banner option.
 * This script runs after tsup and prepends the directive at the file level.
 *
 * Only the client bundles get the directive — the server bundle intentionally
 * does not, so Server Components can import from "@harmonia-core/ui/server"
 * without hitting a client boundary.
 */

import { readFile, writeFile } from "fs/promises"

const CLIENT_BUNDLES = [
  "dist/capacity/index.js",
  "dist/capacity/index.mjs",
  "dist/components/index.js",
  "dist/components/index.mjs",
]

for (const file of CLIENT_BUNDLES) {
  const content = await readFile(file, "utf-8")
  if (!content.startsWith('"use client"')) {
    await writeFile(file, `"use client";\n${content}`)
  }
}

console.log('[harmonia] Prepended "use client" to client bundles.')
