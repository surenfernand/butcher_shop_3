'use client'

import type { Media, Product } from '@/payload-types'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/utilities/cn'

type Props = {
  product: Product
}

export default function ProductGallery({ product }: Props) {
  const gallery = (product.productGallery || [])
    .map((item) => item.image)
    .filter((image): image is Media => typeof image === 'object' && image !== null)

  const [activeIndex, setActiveIndex] = useState(0)

  const mainImage = gallery[activeIndex] ?? gallery[0]

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="relative aspect-[6/4.5] w-full overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
        {mainImage?.url ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || 'Product image'}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Product main image placeholder
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: Math.max(4, gallery.length) }).map((_, slotIndex) => {
          const img = gallery[slotIndex]
          const isActive = activeIndex === slotIndex

          return (
            <button
              key={slotIndex}
              type="button"
              disabled={!img?.url}
              onClick={() => img?.url && setActiveIndex(slotIndex)}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-sm bg-neutral-100 transition',
                img?.url ? 'cursor-pointer hover:opacity-95' : 'cursor-default',
                isActive
                  ? 'border-2 border-[#e53935]'
                  : 'border border-neutral-200 hover:border-neutral-400',
              )}
              aria-label={img?.url ? `View image ${slotIndex + 1}` : 'Empty gallery slot'}
            >
              {img?.url ? (
                <Image
                  src={img.url}
                  alt={img.alt || `Product image ${slotIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 25vw, 10vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-200/60" aria-hidden />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
