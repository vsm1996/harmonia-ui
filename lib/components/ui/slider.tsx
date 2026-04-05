'use client'

import * as React from 'react'
import { rengeVars } from '@renge-ui/tokens'

// Track and thumb require pseudo-elements — inline styles can't reach them.
// These styles use CSS vars directly so they respond to createRengeTheme() at runtime.
const SLIDER_STYLES = `
[data-renge-slider] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
  outline: none;
  cursor: pointer;
  transition: background ${rengeVars.duration[1]} ${rengeVars.easing.out};
}
[data-renge-slider]:focus-visible {
  box-shadow: 0 0 0 2px ${rengeVars.color.bg}, 0 0 0 4px ${rengeVars.color.borderFocus};
}
[data-renge-slider]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* WebKit track */
[data-renge-slider]::-webkit-slider-runnable-track {
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
}

/* WebKit thumb */
[data-renge-slider]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: ${rengeVars.space[3]};
  height: ${rengeVars.space[3]};
  margin-top: calc((${rengeVars.space[1]} - ${rengeVars.space[3]}) / 2);
  border-radius: ${rengeVars.radius.full};
  background: ${rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform  ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-webkit-slider-thumb:hover {
  background: ${rengeVars.color.accentHover};
  transform: scale(1.2);
}
[data-renge-slider]:not(:disabled):active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox track */
[data-renge-slider]::-moz-range-track {
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
  border: none;
}

/* Firefox thumb */
[data-renge-slider]::-moz-range-thumb {
  width: ${rengeVars.space[3]};
  height: ${rengeVars.space[3]};
  border-radius: ${rengeVars.radius.full};
  background: ${rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform  ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-moz-range-thumb:hover {
  background: ${rengeVars.color.accentHover};
  transform: scale(1.2);
}
`

let stylesInjected = false

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step,
  onChange,
  disabled,
  style,
  ...props
}: {
  className?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  style?: React.CSSProperties
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'>) {
  if (typeof document !== 'undefined' && !stylesInjected) {
    const el = document.createElement('style')
    el.setAttribute('data-renge-slider-styles', '')
    el.textContent = SLIDER_STYLES
    document.head.appendChild(el)
    stylesInjected = true
  }

  return (
    <input
      data-slot="slider"
      data-renge-slider=""
      type="range"
      className={className}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value ?? defaultValue}
      onChange={(e) => onChange?.(parseFloat(e.target.value))}
      style={style}
      {...props}
    />
  )
}

export { Slider }
