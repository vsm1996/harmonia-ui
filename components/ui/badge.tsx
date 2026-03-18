import * as React from 'react'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'badge-primary',
  secondary: 'badge-secondary',
  destructive: 'badge-error',
  outline: 'badge-outline',
}

function Badge({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={`badge ${variantClasses[variant]} transition-all duration-200 p-2 ${className ?? ''}`}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeVariant }
