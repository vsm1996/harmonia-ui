'use client'

import * as React from 'react'
import { rengeVars } from '@renge-ui/tokens'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

// Injected once per page — scoped to data-renge-btn attribute so there are no
// collisions with the consumer's own button styles.
const BUTTON_STYLES = `
[data-renge-btn] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  user-select: none;
  transition:
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    color ${rengeVars.duration[1]} ${rengeVars.easing.out},
    box-shadow ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-btn]:active:not(:disabled) {
  transform: scale(0.97);
}
[data-renge-btn]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
[data-renge-btn]:focus-visible {
  box-shadow: 0 0 0 2px ${rengeVars.color.bg}, 0 0 0 4px ${rengeVars.color.borderFocus};
}

[data-renge-btn="default"]:hover:not(:disabled) { background: ${rengeVars.color.accentHover}; }
[data-renge-btn="destructive"]:hover:not(:disabled) { filter: brightness(1.1); }
[data-renge-btn="outline"]:hover:not(:disabled) {
  background: ${rengeVars.color.bgSubtle};
  border-color: ${rengeVars.color.accent};
  color: ${rengeVars.color.accent};
}
[data-renge-btn="secondary"]:hover:not(:disabled) { background: ${rengeVars.color.bgMuted}; }
[data-renge-btn="ghost"]:hover:not(:disabled) { background: ${rengeVars.color.bgSubtle}; }
[data-renge-btn="link"]:hover:not(:disabled) { color: ${rengeVars.color.accentHover}; }
`

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    background: rengeVars.color.accent,
    color: rengeVars.color.fgInverse,
  },
  destructive: {
    background: rengeVars.color.danger,
    color: rengeVars.color.fgInverse,
  },
  outline: {
    background: 'transparent',
    color: rengeVars.color.fg,
    border: `1px solid ${rengeVars.color.border}`,
  },
  secondary: {
    background: rengeVars.color.bgSubtle,
    color: rengeVars.color.fg,
  },
  ghost: {
    background: 'transparent',
    color: rengeVars.color.fg,
  },
  link: {
    background: 'transparent',
    color: rengeVars.color.accent,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  default: {
    padding: `${rengeVars.space[2]} ${rengeVars.space[4]}`,
    fontSize: rengeVars.fontSize.sm,
    borderRadius: rengeVars.radius[2],
    gap: rengeVars.space[2],
  },
  sm: {
    padding: `${rengeVars.space[1]} ${rengeVars.space[3]}`,
    fontSize: rengeVars.fontSize.xs,
    borderRadius: rengeVars.radius[2],
    gap: rengeVars.space[1],
  },
  lg: {
    padding: `${rengeVars.space[3]} ${rengeVars.space[5]}`,
    fontSize: rengeVars.fontSize.base,
    borderRadius: rengeVars.radius[3],
    gap: rengeVars.space[2],
  },
  icon: {
    width: rengeVars.space[6],
    height: rengeVars.space[6],
    padding: rengeVars.space[2],
    borderRadius: rengeVars.radius[2],
    flexShrink: 0,
  },
  'icon-sm': {
    width: rengeVars.space[5],
    height: rengeVars.space[5],
    padding: rengeVars.space[1],
    borderRadius: rengeVars.radius[2],
    flexShrink: 0,
  },
  'icon-lg': {
    width: rengeVars.space[7],
    height: rengeVars.space[7],
    padding: rengeVars.space[3],
    borderRadius: rengeVars.radius[3],
    flexShrink: 0,
  },
}

let stylesInjected = false

function Button({
  className,
  variant = 'default',
  size = 'default',
  style,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  // Inject once per client session
  if (typeof document !== 'undefined' && !stylesInjected) {
    const el = document.createElement('style')
    el.setAttribute('data-renge-button-styles', '')
    el.textContent = BUTTON_STYLES
    document.head.appendChild(el)
    stylesInjected = true
  }

  return (
    <button
      data-slot="button"
      data-renge-btn={variant}
      className={className}
      style={{ ...variantStyles[variant], ...sizeStyles[size], ...style }}
      {...props}
    />
  )
}

export { Button }
export type { ButtonVariant, ButtonSize }
