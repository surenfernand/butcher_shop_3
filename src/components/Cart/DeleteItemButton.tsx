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
          'ease flex h-8 w-8 items-center justify-center rounded-full border border-neutral-600 bg-neutral-800/60 text-neutral-300 transition-all duration-200 hover:cursor-pointer hover:border-[#e31e24]/45 hover:bg-[#e31e24]/10 hover:text-[#e31e24]',
          {
            'cursor-not-allowed opacity-50 hover:border-neutral-600 hover:bg-neutral-800/60 hover:text-neutral-300':
              !apiLineId || isLoading,
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
