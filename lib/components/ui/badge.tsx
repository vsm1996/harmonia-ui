import * as React from 'react'
import { rengeVars } from '@renge-ui/tokens'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: rengeVars.color.accent,
    color: rengeVars.color.fgInverse,
  },
  secondary: {
    background: rengeVars.color.accentSubtle,
    color: rengeVars.color.fg,
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
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${rengeVars.space[1]} ${rengeVars.space[2]}`,
  borderRadius: rengeVars.radius.full,
  fontSize: rengeVars.fontSize.xs,
  lineHeight: rengeVars.lineHeight.xs,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  border: 'none',
  transition: `background ${rengeVars.duration[1]} ${rengeVars.easing.out},
               color ${rengeVars.duration[1]} ${rengeVars.easing.out}`,
}

function Badge({
  className,
  variant = 'default',
  style,
  ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeVariant }
