/**
 * Gachiakuta-themed SVG decorative elements
 * 
 * SVG Optimization techniques used:
 * - CSS transforms over SMIL animations (GPU-accelerated)
 * - Minimal path data with simple shapes
 * - Reusable elements with <defs> and <use>
 * - will-change hints for animated elements
 * - Inline styles for animation keyframes to avoid external CSS
 */

"use client"

import { memo } from "react"

/**
 * Floating debris pieces - scattered trash that drifts
 * Uses CSS transforms for smooth GPU-accelerated animation
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
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>
        {`
          @keyframes debrisSpin {
            0% { transform: rotate(0deg) translateY(0); }
            50% { transform: rotate(180deg) translateY(-3px); }
            100% { transform: rotate(360deg) translateY(0); }
          }
          .debris-piece { animation: debrisSpin 8s ease-in-out infinite; transform-origin: center; }
          .debris-piece:nth-child(2) { animation-delay: -2s; }
          .debris-piece:nth-child(3) { animation-delay: -4s; }
        `}
      </style>
      {/* Crushed can shape */}
      <path
        className="debris-piece"
        d="M6 8h12l-1 10H7L6 8z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Crumpled paper */}
      <path
        className="debris-piece"
        d="M10 4l2 3-1 2 3-1 2 2-1-4-2-1z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
})

/**
 * Broken chain links - representing freedom from the surface
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
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>
        {`
          @keyframes chainSwing {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          .chain-link { animation: chainSwing 3s ease-in-out infinite; transform-origin: top center; }
        `}
      </style>
      <defs>
        <path id="chainLink" d="M0 0c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V0z" />
      </defs>
      {/* Upper broken link */}
      <g className="chain-link" transform="translate(8, 2)">
        <use href="#chainLink" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      </g>
      {/* Lower broken link - offset */}
      <g className="chain-link" transform="translate(12, 16)" style={{ animationDelay: "-1.5s" }}>
        <use href="#chainLink" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
      {/* Break spark */}
      <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
})

/**
 * Cracked surface - damage from the fall
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
      viewBox="0 0 80 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes crackGrow {
            0% { stroke-dashoffset: 100; opacity: 0.3; }
            100% { stroke-dashoffset: 0; opacity: 0.6; }
          }
          .crack-line { 
            stroke-dasharray: 100; 
            animation: crackGrow 2s ease-out forwards;
          }
        `}
      </style>
      <path
        className="crack-line"
        d="M0 20 L15 22 L25 15 L35 25 L45 18 L55 28 L65 20 L80 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        className="crack-line"
        d="M25 15 L28 8 M35 25 L38 32 M55 28 L52 35"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
        style={{ animationDelay: "0.5s" }}
      />
    </svg>
  )
})

/**
 * Salvaged gear/cog - industrial trash aesthetic
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
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>
        {`
          @keyframes gearRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .gear-spin { animation: gearRotate 20s linear infinite; transform-origin: center; }
        `}
      </style>
      <g className="gear-spin">
        {/* Gear teeth - 8 teeth using rotation */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <rect
            key={angle}
            x="16"
            y="2"
            width="4"
            height="6"
            rx="1"
            fill="currentColor"
            opacity={i % 2 === 0 ? 0.6 : 0.4}
            transform={`rotate(${angle} 18 18)`}
          />
        ))}
        {/* Gear body */}
        <circle cx="18" cy="18" r="10" fill="currentColor" opacity="0.5" />
        {/* Center hole */}
        <circle cx="18" cy="18" r="4" fill="var(--background, #000)" />
        {/* Missing tooth - damage */}
        <rect
          x="16"
          y="2"
          width="4"
          height="6"
          rx="1"
          fill="var(--background, #000)"
          transform="rotate(90 18 18)"
        />
      </g>
    </svg>
  )
})

/**
 * Section divider with debris
 */
export const DebrisDivider = memo(function DebrisDivider({
  className = "",
}: {
  className?: string
}) {
  return (
    <svg
      width="100%"
      height="24"
      viewBox="0 0 400 24"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes debrisFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .divider-debris { animation: debrisFloat 4s ease-in-out infinite; }
        `}
      </style>
      {/* Center line with breaks */}
      <path
        d="M0 12 H150 M170 12 H230 M250 12 H400"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      {/* Debris pieces */}
      <rect className="divider-debris" x="155" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" transform="rotate(15 159 12)" />
      <rect className="divider-debris" x="235" y="10" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" transform="rotate(-20 238 13)" style={{ animationDelay: "-2s" }} />
      <circle className="divider-debris" cx="200" cy="12" r="3" fill="currentColor" opacity="0.5" style={{ animationDelay: "-1s" }} />
    </svg>
  )
})
