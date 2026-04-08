import * as React from 'react'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-renge-accent text-renge-fg-inverse hover:bg-renge-accent-hover',
  destructive: 'bg-renge-danger text-renge-fg-inverse hover:opacity-90',
  outline: 'border border-renge-border bg-transparent text-renge-fg hover:bg-renge-bg-muted',
  secondary: 'bg-renge-bg-muted text-renge-fg border border-renge-border-subtle hover:bg-renge-bg-subtle',
  ghost: 'bg-transparent text-renge-fg hover:bg-renge-bg-subtle',
  link: 'bg-transparent text-renge-accent underline-offset-4 hover:underline p-0 h-auto',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-renge-4 text-sm rounded-renge-2',
  sm: 'h-7 px-renge-3 text-xs rounded-renge-1',
  lg: 'h-11 px-renge-5 text-base rounded-renge-2',
  icon: 'h-9 w-9 rounded-renge-2',
  'icon-sm': 'h-7 w-7 rounded-renge-1',
  'icon-lg': 'h-11 w-11 rounded-renge-2',
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  return (
    <button
      data-slot="button"
      className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer select-none transition-all duration-renge-2 ease-renge-ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-renge-border-focus disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ''}`}
      {...props}
    />
  )
}

export { Button }
export type { ButtonVariant, ButtonSize }
