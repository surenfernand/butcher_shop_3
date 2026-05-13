import clsx from 'clsx'
import React from 'react'

/* [
          classes.message,
          className,
          error && classes.error,
          success && classes.success,
          warning && classes.warning,
          !error && !success && !warning && classes.default,
        ]
          .filter(Boolean)
          .join(' '), */

export const Message: React.FC<{
  className?: string
  error?: React.ReactNode
  message?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
}> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  if (messageToRender) {
    return (
      <div
        className={clsx(
          'my-8 rounded-lg border p-4 text-sm font-medium text-neutral-900',
          {
            'border-emerald-200 bg-emerald-50': Boolean(success),
            'border-amber-200 bg-amber-50': Boolean(warning),
            'border-red-200 bg-red-50': Boolean(error),
          },
          className,
        )}
      >
        {messageToRender}
      </div>
    )
  }
  return null
}
