import * as React from 'react'
import { rengeVars } from '@renge-ui/tokens'

function Card({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={className}
      style={{
        background: rengeVars.color.bgSubtle,
        border: `1px solid ${rengeVars.color.border}`,
        borderRadius: rengeVars.radius[4],
        boxShadow: `0 1px 3px color-mix(in oklch, ${rengeVars.color.fg} 8%, transparent)`,
        transition: `box-shadow ${rengeVars.duration[2]} ${rengeVars.easing.out}`,
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    />
  )
}

function CardHeader({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={className}
      style={{
        padding: `${rengeVars.space[4]} ${rengeVars.space[4]} 0`,
        display: 'grid',
        gridAutoRows: 'min-content',
        gap: rengeVars.space[1],
        ...style,
      }}
      {...props}
    />
  )
}

function CardTitle({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={className}
      style={{
        fontSize: rengeVars.fontSize.base,
        lineHeight: rengeVars.lineHeight.base,
        fontWeight: 600,
        color: rengeVars.color.fg,
        ...style,
      }}
      {...props}
    />
  )
}

function CardDescription({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={className}
      style={{
        fontSize: rengeVars.fontSize.sm,
        lineHeight: rengeVars.lineHeight.sm,
        color: rengeVars.color.fgSubtle,
        ...style,
      }}
      {...props}
    />
  )
}

function CardAction({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={className}
      style={{
        gridColumn: '2',
        gridRow: '1 / span 2',
        alignSelf: 'start',
        justifySelf: 'end',
        ...style,
      }}
      {...props}
    />
  )
}

function CardContent({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={className}
      style={{
        padding: `0 ${rengeVars.space[4]} ${rengeVars.space[4]}`,
        ...style,
      }}
      {...props}
    />
  )
}

function CardFooter({ className, style, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${rengeVars.space[4]} ${rengeVars.space[4]}`,
        ...style,
      }}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
