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
  processed: 'Sausage',
}

const brandRed = '#e53935'

export const LuxuryProductCard: React.FC<Props> = ({ product }) => {
  const firstImage = product.productGallery?.[0]?.image
  const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null

  const originText = product.origin ? originLabels[product.origin] || product.origin : ''
  const categoryText =
    (product.meatType && meatTypeLabels[String(product.meatType)]) ||
    (product.cutType ? String(product.cutType).replaceAll('-', ' ') : '')

  return (
    <article className="group overflow-hidden border border-neutral-200/90 bg-white text-neutral-950 shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
      <Link className="flex h-full min-h-0 flex-col" href={`/products/${product.slug}`}>
        <div className="relative bg-neutral-100">
          {product.shopCardLabel ? (
            <div
              className="absolute left-3 top-3 z-10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: brandRed }}
            >
              {product.shopCardLabel}
            </div>
          ) : null}

          {image ? (
            <Media
              className="relative aspect-square w-full"
              imgClassName={clsx(
                'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]',
              )}
              resource={image as never}
            />
          ) : (
            <div className="flex aspect-square items-center justify-center px-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Product image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col border-t border-neutral-100 p-5">
          {categoryText ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{categoryText}</p>
          ) : null}

          <h3 className="mt-1 text-base font-semibold leading-snug tracking-tight md:text-lg">{product.title}</h3>

          <div className="mt-3 flex items-baseline justify-between gap-3">
            {typeof product.priceInUSD === 'number' ? (
              <div className="text-lg font-semibold tabular-nums" style={{ color: brandRed }}>
                <Price amount={product.priceInUSD} />
              </div>
            ) : (
              <span className="text-sm font-medium text-neutral-500">See details</span>
            )}
          </div>

          {originText ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">{originText}</p>
          ) : null}

          {product.shopCardShortDescription ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">{product.shopCardShortDescription}</p>
          ) : null}

          <div className="mt-5 border-t border-neutral-100 pt-4">
            <span
              className="flex min-h-10 w-full items-center justify-center text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition group-hover:brightness-105"
              style={{ backgroundColor: brandRed }}
            >
              {product.cardButtonLabel || 'Add to cart'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
