"use client"

import { motion } from "motion/react"

interface AnimatedDumpsterProps {
  className?: string
  size?: number
}

/**
 * Animated Dumpster SVG - Gachiakuta themed
 * Features a lid that opens and closes periodically
 */
export function AnimatedDumpster({ className = "", size = 48 }: AnimatedDumpsterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Dumpster body */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, -1, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatDelay: 1 
        }}
      >
        {/* Main body - trapezoidal shape */}
        <path
          d="M8 28L12 54H52L56 28H8Z"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Body ridges for texture */}
        <line x1="20" y1="30" x2="18" y2="52" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
        <line x1="32" y1="30" x2="32" y2="52" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
        <line x1="44" y1="30" x2="46" y2="52" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
        
        {/* Front lip / rim */}
        <rect
          x="6"
          y="24"
          width="52"
          height="6"
          rx="1"
          fill="currentColor"
          fillOpacity="0.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        
        {/* Wheels */}
        <circle cx="18" cy="56" r="4" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="46" cy="56" r="4" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Wheel details */}
        <circle cx="18" cy="56" r="1.5" fill="currentColor" fillOpacity="0.3" />
        <circle cx="46" cy="56" r="1.5" fill="currentColor" fillOpacity="0.3" />
        
        {/* Side handles */}
        <rect x="4" y="34" width="3" height="8" rx="1" fill="currentColor" fillOpacity="0.5" />
        <rect x="57" y="34" width="3" height="8" rx="1" fill="currentColor" fillOpacity="0.5" />
      </motion.g>
      
      {/* Animated lid */}
      <motion.g
        style={{ transformOrigin: "6px 24px" }}
        initial={{ rotateX: 0 }}
        animate={{ 
          rotateX: [0, -45, -45, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut"
        }}
      >
        {/* Lid */}
        <path
          d="M6 24L10 10H54L58 24H6Z"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Lid handle */}
        <rect
          x="28"
          y="14"
          width="8"
          height="3"
          rx="1.5"
          fill="currentColor"
          fillOpacity="0.7"
          stroke="currentColor"
          strokeWidth="1"
        />
        
        {/* Lid ridge */}
        <line x1="12" y1="17" x2="52" y2="17" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      </motion.g>
      
      {/* Floating trash particles (visible when lid opens) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.2, 0.8, 1],
        }}
      >
        {/* Small debris particles */}
        <motion.circle
          cx="24"
          cy="18"
          r="2"
          fill="currentColor"
          fillOpacity="0.5"
          animate={{ y: [0, -8, -12], opacity: [0.5, 0.8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.6, delay: 0.3 }}
        />
        <motion.rect
          x="38"
          y="16"
          width="3"
          height="3"
          fill="currentColor"
          fillOpacity="0.4"
          style={{ transformOrigin: "39.5px 17.5px" }}
          animate={{ y: [0, -10, -14], rotate: [0, 45, 90], opacity: [0.4, 0.7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.6, delay: 0.5 }}
        />
        <motion.circle
          cx="32"
          cy="14"
          r="1.5"
          fill="currentColor"
          fillOpacity="0.6"
          animate={{ y: [0, -12, -18], opacity: [0.6, 0.9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.6, delay: 0.1 }}
        />
      </motion.g>
    </motion.svg>
  )
}
