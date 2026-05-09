import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="nav"
      size="clear"
      className={clsx(
        'relative inline-flex h-5 w-5 items-center justify-center p-0 text-[#e31e24]',
        className,
      )}
      {...rest}
    >
      <ShoppingCart className="h-4 w-4 lucide lucide-search" strokeWidth={1.5} />

      <span className="absolute left-[10px] top-[-7px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-0 bg-[#e31e24] px-1 text-[10px] font-semibold leading-none text-white">
        {quantity ?? 0}
      </span>
    </Button>
  )
}