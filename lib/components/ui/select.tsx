'use client'

import * as React from 'react'
import { rengeVars } from '@renge-ui/tokens'

// Scoped styles for focus ring and hover — inline styles can't target :focus/:hover
const SELECT_STYLES = `
[data-renge-select]:focus {
  outline: none;
  border-color: ${rengeVars.color.borderFocus};
  box-shadow: 0 0 0 2px ${rengeVars.color.accentSubtle};
}
[data-renge-select]:hover:not(:disabled):not(:focus) {
  border-color: ${rengeVars.color.accent};
}
[data-renge-select]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
`

let stylesInjected = false

function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  style,
  ...props
}: React.ComponentProps<'select'> & {
  onValueChange?: (value: string) => void
}) {
  if (typeof document !== 'undefined' && !stylesInjected) {
    const el = document.createElement('style')
    el.setAttribute('data-renge-select-styles', '')
    el.textContent = SELECT_STYLES
    document.head.appendChild(el)
    stylesInjected = true
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e)
    props.onValueChange?.(e.target.value)
  }

  const { onValueChange: _, ...restProps } = props

  return (
    <select
      data-slot="select"
      data-renge-select=""
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      style={{
        width: '100%',
        padding: `${rengeVars.space[2]} ${rengeVars.space[3]}`,
        background: rengeVars.color.bg,
        color: rengeVars.color.fg,
        border: `1px solid ${rengeVars.color.border}`,
        borderRadius: rengeVars.radius[2],
        fontSize: rengeVars.fontSize.sm,
        lineHeight: rengeVars.lineHeight.sm,
        cursor: 'pointer',
        transition: `border-color ${rengeVars.duration[1]} ${rengeVars.easing.out},
                     box-shadow ${rengeVars.duration[1]} ${rengeVars.easing.out}`,
        ...style,
      }}
      {...restProps}
    >
      {children}
    </select>
  )
}

export { Select }
