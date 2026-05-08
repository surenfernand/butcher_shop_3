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
    <div className="rounded-3xl border border-[#e8decc] bg-white p-7 shadow-[0_18px_42px_rgba(39,32,21,0.08)] md:p-8">
      {product.eyebrow && (
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a07d39]">
            {product.eyebrow}
          </span>
        </div>
      )}

      <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[#23201a] md:text-5xl">
        {product.title}
      </h1>

      {Array.isArray(product.badges) && product.badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {product.badges.map((badge, i) => (
            <span
              key={i}
              className="rounded-full border border-[#dcc9a2] bg-[#f8efdb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b6c2f]"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {product.meta?.description && (
        <p className="mb-8 text-base leading-8 text-[#5f5a50]">
          {product.meta.description}
        </p>
      )}

      {Array.isArray(product.whatsInside) && product.whatsInside.length > 0 && (
        <div className="mb-10 rounded-2xl border border-[#ece2d1] bg-[#fffdf9] p-6">
          <h3 className="mb-4 text-xl font-semibold text-[#2d2922]">What&apos;s Inside</h3>

          <ul className="space-y-3 text-sm text-[#3f3a31]">
            {product.whatsInside.map((item, i) => (
              <li key={i}>
                <span className="mr-2 font-semibold text-[#9d7b3b]">{item.quantity}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.enableVariants && product.variants?.docs?.length ? (
        <div className="mb-8 rounded-2xl border border-[#ece2d1] bg-[#fffdf9] p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f6f32]">
            Select Options
          </h3>
          <VariantSelector product={product} />
        </div>
      ) : null}

      {purchaseOptions.length > 0 && (
        <div className="mb-8">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#8f6f32]">
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
                      ? 'rounded-2xl border border-[#d2b47a] bg-[#f8edd7] px-4 py-5 text-center'
                      : 'rounded-2xl border border-[#ece2d1] bg-[#fffdf9] px-4 py-5 text-center'
                  }
                >
                  <span
                    className={
                      isSelected
                        ? 'block text-xs font-semibold uppercase tracking-[0.15em] text-[#8f6f32]'
                        : 'block text-xs font-semibold uppercase tracking-[0.15em] text-[#756f63]'
                    }
                  >
                    {option.label}
                  </span>

                  {option.price && (
                    <span className="mt-2 block text-2xl font-semibold text-[#25221c]">
                      {option.price}
                    </span>
                  )}

                  {option.subtext && (
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a7d46]">
                      {option.subtext}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mb-5">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8f6f32]">
          Quantity
        </span>
        <div className="inline-flex items-center rounded-full border border-[#d9caac] bg-[#fffdf9]">
          <button
            type="button"
            className="h-11 w-11 text-xl text-[#5e5548]"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-[#3e392f]">{quantity}</span>
          <button
            type="button"
            className="h-11 w-11 text-xl text-[#5e5548]"
            onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AddToCart
          product={product}
          purchaseType={purchaseType}
          quantity={quantity}
          className="flex h-13 items-center justify-center rounded-full border border-[#d2b37a] bg-[#d2b37a] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#231b10] transition hover:bg-[#c29f5a]"
        />
      </div>
    </div>
  )
}