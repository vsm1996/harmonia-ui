'use client'

import * as React from 'react'

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step,
  onChange,
  disabled,
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
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'defaultValue' | 'type'>) {
  return (
    <input
      data-slot="slider"
      type="range"
      className={`range range-primary range-sm ${className ?? ''}`}
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
      {...props}
    />
  )
}

export { Slider }
