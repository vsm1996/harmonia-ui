import * as React from 'react'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-renge-accent text-renge-fg-inverse',
  secondary: 'bg-renge-bg-muted text-renge-fg-subtle border border-renge-border',
  destructive: 'bg-renge-danger text-renge-fg-inverse',
  outline: 'bg-transparent border border-renge-border text-renge-fg-subtle',
}

function Badge({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-renge-full text-xs font-medium transition-all duration-renge-2 ${variantClasses[variant]} ${className ?? ''}`}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeVariant }
