import * as React from 'react'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

const variantClasses: Record<ButtonVariant, string> = {
  default: 'btn-primary',
  destructive: 'btn-error',
  outline: 'btn-outline shadow-sm',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  link: 'btn-link',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: '',
  sm: 'btn-sm',
  lg: 'btn-lg',
  icon: 'btn-square',
  'icon-sm': 'btn-square btn-sm',
  'icon-lg': 'btn-square btn-lg',
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
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-renge-2 ${className ?? ''}`}
      {...props}
    />
  )
}

export { Button }
export type { ButtonVariant, ButtonSize }
