import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product> & {
    shopCardLabel?: string | null
    shopCardShortDescription?: string | null
    origin?: string | null
    cardButtonLabel?: string | null
    productGallery?: { image?: unknown }[] | null
  }
}

const originLabels: Record<string, string> = {
  'japanese-heritage': 'Japanese Heritage',
  'black-angus-heritage': 'Black Angus Heritage',
  'midwest-corn-fed': 'Midwest Corn-Fed',
}

const meatTypeLabels: Record<string, string> = {
  beef: 'Beef',
  chicken: 'Chicken',
  pork: 'Pork',
  lamb: 'Lamb',
  seafood: 'Seafood',
  turkey: 'Turkey',
  processed: 'Processed',
}

export const LuxuryProductCard: React.FC<Props> = ({ product }) => {
  const firstImage = product.productGallery?.[0]?.image
  const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null

  const originText = product.origin ? originLabels[product.origin] || product.origin : ''
  const categoryText =
    (product.meatType && meatTypeLabels[String(product.meatType)]) ||
    (product.cutType ? String(product.cutType).replaceAll('-', ' ') : '')

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e8dfcf] bg-white text-[#2c2821] shadow-[0_14px_38px_rgba(37,31,21,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#d7c094] hover:shadow-[0_20px_44px_rgba(37,31,21,0.14)]">
      <Link className="group block h-full w-full" href={`/products/${product.slug}`}>
        <div className="relative">
          {product.shopCardLabel ? (
            <div className="absolute left-5 top-5 z-10 rounded-full border border-[#d8bf8f] bg-[#f8ecd0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e5524] transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg">
              {product.shopCardLabel}
            </div>
          ) : null}

          {image ? (
            <Media
              className="relative aspect-[4/4.5] w-full bg-[#f6f1e7]"
              imgClassName={clsx(
                'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]',
              )}
              resource={image as never}
            />
          ) : (
            <div className="flex aspect-[4/4.5] items-center justify-center px-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-[#8f7a52]">
              Product image placeholder
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          {categoryText ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7b3c]">{categoryText}</p>
          ) : null}

          <div className="flex items-start justify-between gap-4 transition-all duration-300 group-hover:translate-y-[-2px]">
            <h3 className="text-xl font-medium text-[#24211b]">{product.title}</h3>

            {typeof product.priceInUSD === 'number' ? (
              <div className="shrink-0 text-[#9e7c39]">
                <Price amount={product.priceInUSD} />
              </div>
            ) : null}
          </div>

          {originText ? (
            <p className="line-clamp-2 text-sm leading-6 text-[#655f55] transition-colors duration-300 group-hover:text-[#4d473f]">
              {originText}
            </p>
          ) : null}

          {product.shopCardShortDescription ? (
            <p className="line-clamp-3 text-sm leading-6 text-[#655f55]">
              {product.shopCardShortDescription}
            </p>
          ) : null}

          <div className="pt-2">
            <div className="rounded-full border border-[#d2b47a] bg-[#f6ebd0] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4e3d20] transition-all duration-300 ease-out group-hover:bg-[#d1b072] group-hover:text-[#261c0f]">
              {product.cardButtonLabel || 'Select Options'}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}