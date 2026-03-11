/**
 * Gachiakuta-themed SVG decorative elements
 *
 * Redesigned with authentic trash-punk aesthetic:
 * - Recognizable salvaged objects (rebar, chain links, gear, bolt, shards)
 * - Heavy manga-style line weights and visible industrial damage
 * - Graffiti-influenced angular compositions
 *
 * SVG Optimization:
 * - CSS transforms over SMIL where possible (GPU-accelerated)
 * - will-change hints for animated elements
 * - All animations scoped by unique class names per component
 */

"use client"

import { memo } from "react"

/**
 * Bent rebar with scattered metal shards — debris of the Abyss
 */
export const FloatingDebris = memo(function FloatingDebris({
  className = "",
  size = 24,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>{`
        @keyframes rebarDrift {
          0%   { transform: rotate(0deg) translateY(0); }
          25%  { transform: rotate(8deg) translateY(-2px); }
          60%  { transform: rotate(-4deg) translateY(-4px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes shardDrift {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50%       { transform: translateY(-3px) rotate(14deg); opacity: 0.7; }
        }
        .rd-main  { animation: rebarDrift 7s ease-in-out infinite; transform-origin: 24px 24px; }
        .rd-sa    { animation: shardDrift 5s ease-in-out 0s infinite; transform-origin: 8px 10px; }
        .rd-sb    { animation: shardDrift 4.3s ease-in-out -2s infinite; transform-origin: 40px 38px; }
        .rd-sc    { animation: shardDrift 6s ease-in-out -3.5s infinite; transform-origin: 40px 9px; }
      `}</style>

      {/* Bent rebar: two segments meeting at a kinked, deformed joint */}
      <g className="rd-main">
        {/* Lower segment: bottom-left → kink */}
        <path d="M10 42 L14 44 L28 22 L24 20Z" fill="currentColor" opacity="0.7" />
        {/* Upper segment: kink → top-right, different angle */}
        <path d="M24 20 L28 22 L38 8 L34 6Z" fill="currentColor" opacity="0.65" />
        {/* Kink/deformation diamond where segments meet */}
        <path d="M22 21 L26 17 L30 21 L26 25Z" fill="currentColor" opacity="0.9" />
        {/* Jagged torn end at top */}
        <path d="M34 6 L38 8 L42 4 L44 6 L40 2Z" fill="currentColor" opacity="0.55" />
        {/* Rebar texture grooves */}
        <line x1="15" y1="39" x2="17" y2="41" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="19" y1="33" x2="21" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="30" y1="16" x2="32" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Shard A — top-left triangle */}
      <polygon className="rd-sa" points="3,5 11,4 7,13" fill="currentColor" opacity="0.45" />
      {/* Shard B — bottom-right quad */}
      <polygon className="rd-sb" points="37,37 44,35 46,44 39,45" fill="currentColor" opacity="0.38" />
      {/* Shard C — top-right splinter */}
      <polygon className="rd-sc" points="38,4 44,2 43,10 37,11" fill="currentColor" opacity="0.3" />
    </svg>
  )
})

/**
 * Heavy industrial chain links — snapped apart with a visible break
 */
export const BrokenChain = memo(function BrokenChain({
  className = "",
  size = 32,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>{`
        @keyframes bcTopSway {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg); }
        }
        @keyframes bcBottomDrop {
          0%   { transform: translateY(0) rotate(0deg); }
          35%  { transform: translateY(3px) rotate(9deg); }
          70%  { transform: translateY(1px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes bcSpark {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%       { opacity: 1; transform: scale(1); }
        }
        .bc-top    { animation: bcTopSway 3.5s ease-in-out infinite; transform-origin: 20px 9px; }
        .bc-bottom { animation: bcBottomDrop 3s ease-in-out infinite; transform-origin: 20px 31px; }
        .bc-spa    { animation: bcSpark 0.8s ease-in-out infinite; }
        .bc-spb    { animation: bcSpark 0.8s ease-in-out -0.4s infinite; }
      `}</style>

      {/* Top link — intact oval, swaying */}
      <g className="bc-top">
        <rect x="9" y="2" width="22" height="16" rx="9"
          stroke="currentColor" strokeWidth="3.5" fill="none" opacity="0.85" />
        {/* Centre pin — the bar through the inside of the link */}
        <line x1="9" y1="10" x2="31" y2="10"
          stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </g>

      {/* Break region — jagged torn edges on both sides */}
      <path d="M15 18 L13 21 L17 23 L15 26"
        stroke="currentColor" strokeWidth="2.5" fill="none"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.75" />
      <path d="M25 18 L27 21 L23 23 L25 26"
        stroke="currentColor" strokeWidth="2.5" fill="none"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.75" />

      {/* Sparks at break */}
      <g className="bc-spa">
        <circle cx="20" cy="21" r="1.5" fill="currentColor" opacity="0.95" />
        <line x1="20" y1="19" x2="18" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.8" />
        <line x1="20" y1="19" x2="22" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      </g>
      <g className="bc-spb">
        <line x1="17" y1="22" x2="14" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="23" y1="22" x2="26" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Bottom link — dropping away */}
      <g className="bc-bottom">
        <rect x="9" y="24" width="22" height="14" rx="7"
          stroke="currentColor" strokeWidth="3.5" fill="none" opacity="0.7" />
        <line x1="9" y1="31" x2="31" y2="31"
          stroke="currentColor" strokeWidth="2" opacity="0.4" />
      </g>
    </svg>
  )
})

/**
 * Branching concrete crack — the Abyss floor fracturing underfoot
 */
export const CrackPattern = memo(function CrackPattern({
  className = "",
  width = 80,
  height = 40,
}: {
  className?: string
  width?: number
  height?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 50"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes crackReveal {
          from { stroke-dashoffset: 220; opacity: 0.2; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        .cr-main   { stroke-dasharray: 220; animation: crackReveal 2s ease-out forwards; }
        .cr-branch { stroke-dasharray: 80; animation: crackReveal 2.5s ease-out 0.25s forwards; opacity: 0; }
        .cr-micro  { stroke-dasharray: 40; animation: crackReveal 3s ease-out 0.6s forwards; opacity: 0; }
      `}</style>

      {/* Main fracture — heavy variable-weight stroke */}
      <path
        className="cr-main"
        d="M0 25 L18 24 L28 17 L38 27 L52 19 L65 30 L79 21 L91 29 L105 20 L120 23"
        stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.65"
      />

      {/* Branch 1 — upward from ~38,27 */}
      <path
        className="cr-branch"
        d="M38 27 L33 17 L29 12 L31 6"
        stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Branch 2 — downward from ~52,19 */}
      <path
        className="cr-branch"
        d="M52 19 L57 30 L54 39 L58 46"
        stroke="currentColor" strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.45"
        style={{ animationDelay: "0.45s" }}
      />
      {/* Branch 3 — upward from ~79,21 */}
      <path
        className="cr-branch"
        d="M79 21 L74 13 L80 7"
        stroke="currentColor" strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
        style={{ animationDelay: "0.65s" }}
      />
      {/* Branch 4 — downward from ~91,29 */}
      <path
        className="cr-branch"
        d="M91 29 L95 38 L91 44"
        stroke="currentColor" strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.38"
        style={{ animationDelay: "0.85s" }}
      />

      {/* Micro-cracks — hairline offshoots */}
      <path
        className="cr-micro"
        d="M29 12 L25 9 M33 17 L29 15 M57 30 L61 33 M74 13 L70 9"
        stroke="currentColor" strokeWidth="0.6"
        strokeLinecap="round" opacity="0.3"
      />

      {/* Debris/gravel at main fracture epicentre */}
      <circle cx="38" cy="27" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="41" cy="24" r="1"   fill="currentColor" opacity="0.35" />
      <circle cx="36" cy="30" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  )
})

/**
 * Salvaged industrial gear — 10 teeth, 2 missing, cracked, bolt holes
 *
 * Geometry (center 24,24 · outer R=20 · inner R=14 · 18° step):
 *   Tooth positions 36° and 144° replaced with inner-radius stubs = missing teeth.
 */
export const SalvagedGear = memo(function SalvagedGear({
  className = "",
  size = 36,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>{`
        @keyframes sgSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sg-body { animation: sgSpin 18s linear infinite; transform-origin: 24px 24px; }
      `}</style>

      <g className="sg-body">
        {/*
          10-tooth gear polygon:
          Alternating outer (R=20) / inner (R=14) at 18° steps.
          Teeth at 36° and 144° are worn/missing → those outer points
          replaced with inner-radius values.
        */}
        <polygon
          points="
            44,24      37.3,28.33
            35.33,32.23  32.23,35.33
            30.18,43.02  24,38
            17.82,43.02  15.77,35.33
            12.67,32.23  10.7,28.33
            4,24       10.7,19.67
            7.82,12.24   15.77,12.67
            17.82,4.98   24,10
            30.18,4.98   32.23,12.67
            40.18,12.24  37.3,19.67
          "
          fill="currentColor"
          opacity="0.55"
        />

        {/* Inner ring — slight darkening between teeth and hub */}
        <circle cx="24" cy="24" r="13" fill="currentColor" opacity="0.08" />

        {/* 3 bolt holes at r=10, 120° apart (90° / 210° / 330°) */}
        <circle cx="24"   cy="34"   r="2.2" fill="var(--background, #000)" />
        <circle cx="15.3" cy="19"   r="2.2" fill="var(--background, #000)" />
        <circle cx="32.7" cy="19"   r="2.2" fill="var(--background, #000)" />

        {/* Hex centre hole (flat-top, r=6) */}
        <polygon
          points="29.2,27 24,30 18.8,27 18.8,21 24,18 29.2,21"
          fill="var(--background, #000)"
        />

        {/* Diagonal crack across the gear face */}
        <path
          d="M11 17 L17 21 L22 19 L28 24 L33 22 L37 27"
          stroke="var(--background, #000)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        />
      </g>
    </svg>
  )
})

/**
 * Section divider with salvaged debris objects:
 * a chain link · a gear-tooth stub · a broken hex bolt · a metal shard
 */
export const DebrisDivider = memo(function DebrisDivider({
  className = "",
}: {
  className?: string
}) {
  return (
    <svg
      width="100%"
      height="32"
      viewBox="0 0 400 32"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ddFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-2px); }
        }
        .dd-p1 { animation: ddFloat 4s ease-in-out 0s infinite; }
        .dd-p2 { animation: ddFloat 4s ease-in-out -1s infinite; }
        .dd-p3 { animation: ddFloat 4s ease-in-out -2s infinite; }
        .dd-p4 { animation: ddFloat 4s ease-in-out -3s infinite; }
      `}</style>

      {/* Left line */}
      <path d="M0 16 H140" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Right line */}
      <path d="M260 16 H400" stroke="currentColor" strokeWidth="1" opacity="0.2" />

      {/* Chain link — small oval ring with centre pin, at ~155 */}
      <g className="dd-p1" transform="translate(145,10)">
        <rect x="0" y="0" width="22" height="13" rx="6"
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.55" />
        <line x1="0" y1="6.5" x2="22" y2="6.5"
          stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Gear-tooth stub — trapezoid at ~195 */}
      <g className="dd-p2" transform="translate(183,4)">
        <path d="M5 24 L0 22 L1 6 L5 3 L9 6 L10 22 Z"
          fill="currentColor" opacity="0.45" />
        {/* Tooth tip: slightly wider */}
        <path d="M1 6 L-2 4 L5 0 L12 4 L10 6 Z"
          fill="currentColor" opacity="0.35" />
      </g>

      {/* Broken hex bolt at ~222 */}
      <g className="dd-p3" transform="translate(214,4)">
        {/* Hex head */}
        <polygon points="8,0 14,3.5 14,10.5 8,14 2,10.5 2,3.5"
          fill="currentColor" opacity="0.5" />
        {/* Bolt shaft */}
        <rect x="6" y="14" width="4" height="9" fill="currentColor" opacity="0.4" />
        {/* Thread marks on shaft */}
        <line x1="6" y1="17" x2="10" y2="17" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <line x1="6" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        {/* Jagged break at shaft end */}
        <path d="M6 23 L8 27 L10 23"
          stroke="currentColor" strokeWidth="1" fill="none"
          strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Metal shard — thin angular splinter at ~248 */}
      <g className="dd-p4" transform="translate(244,7)">
        <polygon points="0,18 3,0 9,2 5,18" fill="currentColor" opacity="0.35" />
      </g>
    </svg>
  )
})
