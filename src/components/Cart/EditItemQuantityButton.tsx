'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useMemo } from 'react'

export function EditItemQuantityButton({
  type,
  item,
  className,
}: {
  item: CartItem
  type: 'minus' | 'plus'
  className?: string
}) {
  const { decrementItem, incrementItem, isLoading } = useCart()

  const disabled = useMemo(() => {
    if (!item.id) return true

    // const target =
    //   item.variant && typeof item.variant === 'object'
    //     ? item.variant
    //     : item.product && typeof item.product === 'object'
    //       ? item.product
    //       : null

    // if (
    //   target &&
    //   typeof target === 'object' &&
    //   target.inventory !== undefined &&
    //   target.inventory !== null
    // ) {
    //   if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
    //     return item.quantity >= target.inventory
    //   }
    // }

    return false
  }, [item, type])

  return (
    <form>
      <button
        type="button"
        disabled={disabled || isLoading}
        aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()

          if (!item.id) return

          if (type === 'plus') {
            incrementItem(item.id)
          } else {
            decrementItem(item.id)
          }
        }}
        className={clsx(
          'flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center px-2 transition-all duration-200',
          {
            'cursor-not-allowed opacity-40': disabled || isLoading,
            'hover:opacity-80': !disabled && !isLoading,
            'ml-auto': type === 'minus',
          },
          className,
        )}
      >
        {type === 'plus' ? (
          <PlusIcon className="h-4 w-4 text-current" />
        ) : (
          <MinusIcon className="h-4 w-4 text-current" />
        )}
      </button>
    </form>
  )
}