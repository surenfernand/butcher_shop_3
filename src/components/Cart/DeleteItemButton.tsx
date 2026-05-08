'use client'

import type { CartItem } from '@/components/Cart'
import { getCartLineItemId } from '@/components/Cart/EditItemQuantityButton'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const rowId = getCartLineItemId(item)
  const apiLineId = rowId === undefined ? '' : String(rowId)

  return (
    <div className="contents">
      <button
        aria-label="Remove cart item"
        className={clsx(
          'ease flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:cursor-pointer hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
          {
            'cursor-not-allowed opacity-50 hover:border-border hover:bg-muted hover:text-muted-foreground': !apiLineId || isLoading,
          },
        )}
        disabled={!apiLineId || isLoading}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (apiLineId) void removeItem(apiLineId)
        }}
        type="button"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
