import * as React from 'react'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={`bg-renge-bg-subtle border border-renge-border rounded-renge-3 shadow-sm transition-all duration-renge-3 ${className ?? ''}`}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={`px-renge-5 pt-renge-5 pb-0 grid auto-rows-min gap-1.5 ${className ?? ''}`}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={`leading-none font-semibold text-renge-fg ${className ?? ''}`}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={`text-renge-fg-muted text-sm ${className ?? ''}`}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className ?? ''}`}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={`px-renge-5 pb-renge-5 ${className ?? ''}`}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={`flex items-center px-renge-5 pb-renge-5 ${className ?? ''}`}
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
