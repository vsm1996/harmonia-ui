const shared = {
  format: ["cjs", "esm"] as const,
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: false,
  external: ["react", "react-dom", "@renge-ui/tokens", "motion", "motion/react", "@harmonia-core/ui"],
  treeshake: true,
}

// Note: "use client" is NOT injected here — esbuild/rollup strip unknown
// directives from banners during bundling. The directive is prepended to
// client bundles by scripts/prepend-use-client.mjs after this step.

export default [
  // Client bundle — provider, hooks, browser-dependent utilities.
  {
    ...shared,
    entry: { "capacity/index": "lib/capacity/index.ts" },
    outDir: "dist",
    clean: true,
  },
  // Server bundle — pure functions safe for SSR / RSC / edge.
  // No "use client" so Server Components can import this directly.
  {
    ...shared,
    entry: { "capacity/server": "lib/capacity/server.ts" },
    outDir: "dist",
  },
  // Components bundle
  {
    ...shared,
    entry: { "components/index": "lib/components/index.ts" },
    outDir: "dist",
  },
]
