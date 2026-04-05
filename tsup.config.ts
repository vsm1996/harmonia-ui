export default {
  entry: ["lib/capacity/index.ts", "lib/components/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@renge-ui/tokens", "motion", "motion/react"],
  treeshake: true,
}
