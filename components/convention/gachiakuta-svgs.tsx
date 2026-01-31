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
 * Rat silhouette - Abyss dweller
 */
export const AbyssRat = memo(function AbyssRat({
  className = "",
  size = 28,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <style>
        {`
          @keyframes ratScurry {
            0%, 100% { transform: translateX(0) scaleX(1); }
            25% { transform: translateX(2px) scaleX(0.95); }
            50% { transform: translateX(0) scaleX(1); }
            75% { transform: translateX(-2px) scaleX(0.95); }
          }
          @keyframes tailWag {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
          .rat-body { animation: ratScurry 2s ease-in-out infinite; }
          .rat-tail { animation: tailWag 0.5s ease-in-out infinite; transform-origin: right center; }
        `}
      </style>
      <g className="rat-body">
        {/* Body */}
        <ellipse cx="14" cy="16" rx="7" ry="5" fill="currentColor" opacity="0.7" />
        {/* Head */}
        <ellipse cx="20" cy="14" rx="4" ry="3.5" fill="currentColor" opacity="0.7" />
        {/* Ears */}
        <circle cx="18" cy="11" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="22" cy="11" r="2" fill="currentColor" opacity="0.6" />
        {/* Eye */}
        <circle cx="22" cy="13" r="0.8" fill="var(--background, #000)" />
        {/* Snout */}
        <ellipse cx="24" cy="14.5" rx="1.5" ry="1" fill="currentColor" opacity="0.5" />
        {/* Legs */}
        <rect x="10" y="19" width="2" height="3" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="16" y="19" width="2" height="3" rx="1" fill="currentColor" opacity="0.6" />
      </g>
      {/* Tail */}
      <path
        className="rat-tail"
        d="M7 16Q4 14 3 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
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
 * Toxic drip - oozing contamination
 */
export const ToxicDrip = memo(function ToxicDrip({
  className = "",
  size = 20,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 20 30"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes dripFall {
            0% { transform: translateY(-5px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(30px); opacity: 0; }
          }
          .drip-drop { animation: dripFall 2.5s ease-in infinite; }
        `}
      </style>
      {/* Drip source blob */}
      <ellipse cx="10" cy="4" rx="6" ry="3" fill="currentColor" opacity="0.6" />
      {/* Falling drops */}
      <circle className="drip-drop" cx="10" cy="10" r="2" fill="currentColor" opacity="0.7" />
      <circle className="drip-drop" cx="8" cy="10" r="1.5" fill="currentColor" opacity="0.5" style={{ animationDelay: "0.8s" }} />
      <circle className="drip-drop" cx="12" cy="10" r="1" fill="currentColor" opacity="0.4" style={{ animationDelay: "1.6s" }} />
    </svg>
  )
})

/**
 * Flies buzzing - decay indicator
 */
export const BuzzingFlies = memo(function BuzzingFlies({
  className = "",
  size = 40,
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
      <style>
        {`
          @keyframes flyBuzz1 {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(3px, -2px); }
            50% { transform: translate(-2px, 3px); }
            75% { transform: translate(2px, 2px); }
          }
          @keyframes flyBuzz2 {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-3px, 2px); }
            50% { transform: translate(2px, -3px); }
            75% { transform: translate(-2px, -2px); }
          }
          @keyframes wingFlap {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(0.3); }
          }
          .fly1 { animation: flyBuzz1 1.5s ease-in-out infinite; }
          .fly2 { animation: flyBuzz2 1.8s ease-in-out infinite; }
          .fly3 { animation: flyBuzz1 2s ease-in-out infinite; animation-delay: -0.5s; }
          .wing { animation: wingFlap 0.05s linear infinite; transform-origin: center; }
        `}
      </style>
      <defs>
        <g id="fly">
          <ellipse cx="0" cy="0" rx="2" ry="1.5" fill="currentColor" />
          <ellipse className="wing" cx="-1" cy="-1" rx="1.5" ry="0.8" fill="currentColor" opacity="0.4" />
          <ellipse className="wing" cx="1" cy="-1" rx="1.5" ry="0.8" fill="currentColor" opacity="0.4" />
        </g>
      </defs>
      <use href="#fly" className="fly1" x="20" y="15" opacity="0.7" />
      <use href="#fly" className="fly2" x="15" y="22" opacity="0.5" />
      <use href="#fly" className="fly3" x="25" y="25" opacity="0.6" />
    </svg>
  )
})

/**
 * Weapon silhouette - salvaged makeshift weapon
 */
export const SalvagedWeapon = memo(function SalvagedWeapon({
  className = "",
  size = 48,
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
      <style>
        {`
          @keyframes weaponGlow {
            0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
            50% { filter: drop-shadow(0 0 6px currentColor); }
          }
          .weapon-glow { animation: weaponGlow 3s ease-in-out infinite; }
        `}
      </style>
      <g className="weapon-glow">
        {/* Handle - pipe */}
        <rect x="4" y="22" width="24" height="4" rx="2" fill="currentColor" opacity="0.6" />
        {/* Head - crushed can blade */}
        <path
          d="M28 18 L44 14 L42 24 L44 34 L28 30 Z"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Binding - tape/wire */}
        <rect x="24" y="20" width="6" height="8" fill="currentColor" opacity="0.4" />
        <line x1="25" y1="21" x2="29" y2="21" stroke="var(--background, #000)" strokeWidth="0.5" />
        <line x1="25" y1="23" x2="29" y2="23" stroke="var(--background, #000)" strokeWidth="0.5" />
        <line x1="25" y1="25" x2="29" y2="25" stroke="var(--background, #000)" strokeWidth="0.5" />
        <line x1="25" y1="27" x2="29" y2="27" stroke="var(--background, #000)" strokeWidth="0.5" />
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
