'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/payload-types'
import { AddToCart } from '@/components/Cart/AddToCart'

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

  useEffect(() => {
    if (
      purchaseOptions.length > 0 &&
      !purchaseOptions.some((option) => option.value === purchaseType)
    ) {
      setPurchaseType(purchaseOptions[0].value)
    }
  }, [purchaseOptions, purchaseType])

  return (
    <div className="flex flex-col">
      {product.eyebrow && (
        <div className="mb-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#d4a63c]">
            {product.eyebrow}
          </span>
        </div>
      )}

      <h1 className="mb-4 text-5xl font-bold uppercase tracking-tight text-foreground">
        {product.title}
      </h1>

      {Array.isArray(product.badges) && product.badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {product.badges.map((badge, i) => (
            <span
              key={i}
              className="rounded-full border border-[#d4a63c]/40 px-3 py-1 text-xs uppercase tracking-[0.15em] text-[#d4a63c]"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {product.meta?.description && (
        <p className="mb-8 text-lg leading-8 text-muted-foreground">
          {product.meta.description}
        </p>
      )}

      {Array.isArray(product.whatsInside) && product.whatsInside.length > 0 && (
        <div className="mb-10 border border-border bg-card p-6">
          <h3 className="mb-4 text-2xl font-semibold text-foreground">What&apos;s Inside</h3>

          <ul className="space-y-3 text-base text-foreground">
            {product.whatsInside.map((item, i) => (
              <li key={i}>
                <span className="mr-2 font-bold text-[#d4a63c]">{item.quantity}</span>
                <span className="text-foreground">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {purchaseOptions.length > 0 && (
        <div className="mb-8">
          <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Purchase Type
          </span>

          <div className="grid grid-cols-2 border border-border bg-card">
            {purchaseOptions.map((option) => {
              const isSelected = purchaseType === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPurchaseType(option.value)}
                  className={
                    isSelected
                      ? 'border border-[#d4a63c] bg-[#d4a63c]/10 px-4 py-5 text-center'
                      : 'border-r border-border px-4 py-5 text-center last:border-r-0'
                  }
                >
                  <span
                    className={
                      isSelected
                        ? 'block text-xs font-bold uppercase tracking-[0.15em] text-[#d4a63c]'
                        : 'block text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground'
                    }
                  >
                    {option.label}
                  </span>

                  {option.price && (
                    <span className="mt-2 block text-2xl font-semibold text-foreground">
                      {option.price}
                    </span>
                  )}

                  {option.subtext && (
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#b89e62]">
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
          className="flex h-16 items-center justify-center bg-[#d4a63c] text-sm font-bold uppercase tracking-[0.2em] text-black"
        />
      </div>
    </div>
  )
}