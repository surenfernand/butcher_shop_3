'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useMemo } from 'react'

/** Non-empty cart line id for API calls (preserve number vs string — plugin uses strict ===). */
export function getCartLineItemId(item: CartItem): string | number | undefined {
  const raw = item.id as string | number | undefined | null
  if (raw === undefined || raw === null) return undefined
  if (typeof raw === 'string' && raw.trim() === '') return undefined
  return raw
}

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
  const rowId = getCartLineItemId(item)
  const apiLineId = rowId === undefined ? '' : String(rowId)

  const disabled = useMemo(() => {
    if (!apiLineId) return true

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
  }, [apiLineId, type])

  return (
    <div className="contents">
      <button
        type="button"
        disabled={disabled || isLoading}
        aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()

          if (!apiLineId) return

          if (type === 'plus') {
            void incrementItem(apiLineId)
          } else {
            void decrementItem(apiLineId)
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
    </div>
  )
}