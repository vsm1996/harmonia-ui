export default {
  entry: ["lib/capacity/index.ts", "lib/components/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@renge-ui/tokens", "motion", "motion/react", "@harmonia-core/ui"],
  treeshake: true,
}
