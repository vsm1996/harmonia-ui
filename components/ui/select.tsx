'use client'

import * as React from 'react'

function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<'select'> & {
  onValueChange?: (value: string) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e)
    if (props.onValueChange) {
      props.onValueChange(e.target.value)
    }
  }

  // Remove onValueChange from props before spreading
  const { onValueChange: _, ...restProps } = props

  return (
    <select
      data-slot="select"
      className={`select select-bordered w-full ${className ?? ''}`}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...restProps}
    >
      {children}
    </select>
  )
}

export { Select }
