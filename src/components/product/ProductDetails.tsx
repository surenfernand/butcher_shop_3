'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/payload-types'
import { AddToCart } from '@/components/Cart/AddToCart'
import { VariantSelector } from './VariantSelector'

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
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (
      purchaseOptions.length > 0 &&
      !purchaseOptions.some((option) => option.value === purchaseType)
    ) {
      setPurchaseType(purchaseOptions[0].value)
    }
  }, [purchaseOptions, purchaseType])

  return (
    <div className="rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-[0_18px_42px_rgba(39,32,21,0.08)] md:p-8">
      {product.eyebrow && (
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.eyebrow}
          </span>
        </div>
      )}

      <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">{product.title}</h1>

      {Array.isArray(product.badges) && product.badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {product.badges.map((badge, i) => (
            <span
              key={i}
              className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {product.meta?.description && (
        <p className="mb-8 text-base leading-8 text-muted-foreground">{product.meta.description}</p>
      )}

      {Array.isArray(product.whatsInside) && product.whatsInside.length > 0 && (
        <div className="mb-10 rounded-2xl border border-border bg-muted/50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-foreground">What&apos;s Inside</h3>

          <ul className="space-y-3 text-sm">
            {product.whatsInside.map((item, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="shrink-0 font-semibold text-primary">{item.quantity}</span>
                <span className="text-foreground">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.enableVariants && product.variants?.docs?.length ? (
        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Select Options
          </h3>
          <VariantSelector product={product} />
        </div>
      ) : null}

      {purchaseOptions.length > 0 && (
        <div className="mb-8">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
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
                  className={
                    isSelected
                      ? 'rounded-2xl border-2 border-primary bg-primary/10 px-4 py-5 text-center shadow-sm transition-colors'
                      : 'rounded-2xl border border-border bg-background px-4 py-5 text-center transition-colors hover:border-primary/40 hover:bg-muted/30'
                  }
                >
                  <span
                    className={
                      isSelected
                        ? 'block text-xs font-semibold uppercase tracking-[0.15em] text-primary'
                        : 'block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground'
                    }
                  >
                    {option.label}
                  </span>

                  {option.price && (
                    <span className="mt-2 block text-2xl font-semibold text-foreground">{option.price}</span>
                  )}

                  {option.subtext && (
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
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
        <AddToCart product={product} purchaseType={purchaseType} quantity={quantity} />
      </div>
    </div>
  )
}
