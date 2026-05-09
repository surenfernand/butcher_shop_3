'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/payload-types'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { VariantSelector } from './VariantSelector'
import { cn } from '@/utilities/cn'
import { Facebook, Link2, Twitter } from 'lucide-react'
import { usePathname } from 'next/navigation'

const carneshopRed = '#e53935'

const meatTypeLabels: Record<string, string> = {
  beef: 'Beef',
  chicken: 'Chicken',
  pork: 'Pork',
  lamb: 'Lamb',
  seafood: 'Seafood',
  turkey: 'Turkey',
  processed: 'Sausage',
}

const tagLabels: Record<string, string> = {
  'best-seller': 'Best seller',
  'top-rated': 'Top rated',
  new: 'New',
}

const flavorLabels: Record<string, string> = {
  plain: 'Plain',
  spicy: 'Spicy',
  bbq: 'BBQ',
  herb: 'Herb',
}

type PurchaseType = 'one_time' | 'monthly'

type ProductWithUIFields = Product & {
  title?: string
  slug?: string
  purchaseFrequencies?: {
    oneTime?: {
      enabled?: boolean | null
      priceOverride?: string | null
    } | null
    monthly?: {
      enabled?: boolean | null
      priceOverride?: string | null
      savingsText?: string | null
    } | null
  } | null
  meta?: {
    description?: string | null
    image?: unknown
  } | null
}

type Props = {
  product: ProductWithUIFields
}

export default function ProductDetails({ product }: Props) {
  const frequencies = product.purchaseFrequencies
  const pathname = usePathname()
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const purchaseOptions = useMemo<
    {
      label: string
      value: PurchaseType
      price?: string | null
      subtext?: string | null
    }[]
  >(() => {
    return [
      ...(frequencies?.oneTime?.enabled !== false
        ? [
            {
              label: 'One-Time',
              value: 'one_time' as PurchaseType,
              price: frequencies?.oneTime?.priceOverride,
            },
          ]
        : []),

      ...(frequencies?.monthly?.enabled !== false
        ? [
            {
              label: 'Monthly',
              value: 'monthly' as PurchaseType,
              price: frequencies?.monthly?.priceOverride,
              subtext: frequencies?.monthly?.savingsText,
            },
          ]
        : []),
    ]
  }, [frequencies])

  const [purchaseType, setPurchaseType] = useState<PurchaseType>(
    purchaseOptions[0]?.value || 'one_time',
  )
  const quantity = 1

  useEffect(() => {
    if (
      purchaseOptions.length > 0 &&
      !purchaseOptions.some((option) => option.value === purchaseType)
    ) {
      setPurchaseType(purchaseOptions[0].value)
    }
  }, [purchaseOptions, purchaseType])

  const reviewCount = product.reviews?.length ?? 0
  const categoryLabel = product.meatType ? meatTypeLabels[String(product.meatType)] || product.meatType : null

  const tagItems = useMemo(() => {
    const fromTags = (product.tags || []).map((t) => tagLabels[t] || String(t))
    const extra = product.flavor ? flavorLabels[String(product.flavor)] || product.flavor : null
    return [...fromTags, ...(extra ? [extra] : [])]
  }, [product.tags, product.flavor])

  const fallbackShareUrl = `${(process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')}${pathname}`
  const encodedShare = encodeURIComponent(shareUrl || fallbackShareUrl || pathname)

  return (
    <div className="rounded-sm border border-neutral-200 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)] md:p-8 lg:sticky lg:top-24 lg:self-start">
      {product.eyebrow && (
        <div className="mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: carneshopRed }}>
            {product.eyebrow}
          </span>
        </div>
      )}

      <h1 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">{product.title}</h1>

      <p className="mb-6 text-sm text-neutral-600">
        ({reviewCount} customer review{reviewCount !== 1 ? 's' : ''})
      </p>

      {typeof product.priceInUSD === 'number' ? (
        <div className="mb-6">
          <Price
            amount={product.priceInUSD}
            className="text-4xl font-semibold tabular-nums text-[#e53935] md:text-[2.75rem]"
            as="p"
          />
        </div>
      ) : null}

      {product.meta?.description && (
        <p className="mb-8 text-base leading-relaxed text-neutral-600">{product.meta.description}</p>
      )}

      {(categoryLabel || tagItems.length > 0) && (
        <div className="mb-8 space-y-3 border-b border-neutral-200 pb-8 text-sm text-neutral-700">
          {categoryLabel ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="font-semibold text-neutral-900">Category:</span>
              <span>{categoryLabel}</span>
            </div>
          ) : null}
          {tagItems.length > 0 ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="font-semibold text-neutral-900">Tags:</span>
              <span>{tagItems.join(', ')}</span>
            </div>
          ) : null}
        </div>
      )}

      {Array.isArray(product.badges) && product.badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {product.badges.map((badge, i) => (
            <span
              key={i}
              className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-700"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {Array.isArray(product.whatsInside) && product.whatsInside.length > 0 && (
        <div className="mb-10 rounded-sm border border-neutral-200 bg-neutral-50 p-5 md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">What&apos;s Inside</h3>

          <ul className="space-y-3 text-sm">
            {product.whatsInside.map((item, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="shrink-0 font-semibold" style={{ color: carneshopRed }}>
                  {item.quantity}
                </span>
                <span className="text-neutral-700">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.enableVariants && product.variants?.docs?.length ? (
        <div className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
            Select Options
          </h3>
          <VariantSelector product={product} />
        </div>
      ) : null}

      {purchaseOptions.length > 0 && (
        <div className="mb-8">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-900">
            Purchase Type
          </span>

          <div className="grid grid-cols-2 gap-3">
            {purchaseOptions.map((option) => {
              const isSelected = purchaseType === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPurchaseType(option.value)}
                  className={cn(
                    'rounded-sm border px-4 py-5 text-center transition-colors',
                    isSelected
                      ? 'border-[#e53935] bg-[#e53935]/10 shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50',
                  )}
                >
                  <span
                    className={cn(
                      'block text-[11px] font-semibold uppercase tracking-[0.15em]',
                      isSelected ? 'text-[#e53935]' : 'text-neutral-500',
                    )}
                  >
                    {option.label}
                  </span>

                  {option.price && (
                    <span className="mt-2 block text-2xl font-semibold text-neutral-900">{option.price}</span>
                  )}

                  {option.subtext && (
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: carneshopRed }}>
                      {option.subtext}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <AddToCart
          product={product}
          purchaseType={purchaseType}
          quantity={quantity}
          className="rounded-sm border-0 bg-[#e53935] py-6 text-white shadow-md hover:bg-[#c62828] hover:text-white"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-neutral-200 pt-6">
        <span className="text-sm font-semibold text-neutral-900">Share is Caring:</span>
        <div className="flex items-center gap-2">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-[#e53935] hover:text-[#e53935]"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-[#e53935] hover:text-[#e53935]"
            aria-label="Share on X"
          >
            <Twitter className="h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-[#e53935] hover:text-[#e53935]"
            aria-label="Copy link"
            onClick={() => {
              const url = shareUrl || window.location.href
              void navigator.clipboard.writeText(url)
            }}
          >
            <Link2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
