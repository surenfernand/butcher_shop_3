'use client'

import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type ShopFiltersProps = {
  labels?: {
    cutTypeLabel?: string
    agingProcessLabel?: string
    originLabel?: string
    priceRangeLabel?: string
  }
  sortLabel?: string
}

const meatTypes = [
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Pork', value: 'pork' },
  { label: 'Lamb / Mutton', value: 'lamb' },
  { label: 'Seafood', value: 'seafood' },
  { label: 'Turkey', value: 'turkey' },
  { label: 'Processed Meats', value: 'processed' },
]

const storageTypes = [
  { label: 'Fresh', value: 'fresh' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Chilled', value: 'chilled' },
  { label: 'Marinated', value: 'marinated' },
]

const preparationStyles = [
  { label: 'Curry Cut', value: 'curry-cut' },
  { label: 'BBQ / Grill', value: 'bbq' },
  { label: 'Stir Fry', value: 'stir-fry' },
  { label: 'Soup Bones', value: 'soup' },
  { label: 'Ready to Cook', value: 'ready' },
]

const sorting = [
  { label: 'Featured', value: '-sortPriority' },
  { label: 'Alphabetic A-Z', value: 'title' },
  { label: 'Latest arrivals', value: '-createdAt' },
  { label: 'Price: Low to high', value: 'priceInUSD' },
  { label: 'Price: High to low', value: '-priceInUSD' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#9f8650]">
      {children}
    </h3>
  )
}

export const ShopFilters = ({ labels, sortLabel }: ShopFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentMeatType = searchParams.get('meatType') || ''
  const currentStorageType = searchParams.get('storageType') || ''
  const currentPreparationStyle = searchParams.get('preparationStyle') || ''
  const currentInStock = searchParams.get('inStock') || ''
  const currentSort = searchParams.get('sort') || '-sortPriority'
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) params.delete(key)
    else params.set(key, value)

    params.delete('page')
    router.push(createUrl(pathname, params))
  }

  const updateMany = (entries: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(entries).forEach(([key, value]) => {
      if (!value) params.delete(key)
      else params.set(key, value)
    })

    params.delete('page')
    router.push(createUrl(pathname, params))
  }

  return (
    <aside className="w-full max-w-[260px] bg-black text-white">
      <div className="space-y-8">
        <div>
          <SectionTitle>{labels?.cutTypeLabel || 'Meat Type'}</SectionTitle>
          <select
            className="w-full border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white outline-none"
            value={currentMeatType}
            onChange={(e) => updateParam('meatType', e.target.value)}
          >
            <option value="">All</option>
            {meatTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <SectionTitle>{labels?.agingProcessLabel || 'Storage Type'}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {storageTypes.map((item) => {
              const active = currentStorageType === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateParam('storageType', active ? '' : item.value)}
                  className={clsx(
                    'border px-4 py-2 text-xs uppercase tracking-[0.2em] transition',
                    active
                      ? 'border-[#c8a24d] bg-[#c8a24d] text-black'
                      : 'border-[#2a2a2a] text-white hover:border-[#c8a24d]',
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <SectionTitle>{labels?.originLabel || 'Preparation Style'}</SectionTitle>
          <select
            className="w-full border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white outline-none"
            value={currentPreparationStyle}
            onChange={(e) => updateParam('preparationStyle', e.target.value)}
          >
            <option value="">All</option>
            {preparationStyles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <SectionTitle>Availability</SectionTitle>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={currentInStock === 'true'}
              className="h-4 w-4 accent-[#c8a24d]"
              onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        <div>
          <SectionTitle>{labels?.priceRangeLabel || 'Price Range'}</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white outline-none"
              value={currentMinPrice}
              placeholder="Min"
              type="number"
              onChange={(e) =>
                updateMany({
                  minPrice: e.target.value,
                  maxPrice: currentMaxPrice,
                })
              }
            />
            <input
              className="border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white outline-none"
              value={currentMaxPrice}
              placeholder="Max"
              type="number"
              onChange={(e) =>
                updateMany({
                  minPrice: currentMinPrice,
                  maxPrice: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <SectionTitle>{sortLabel || 'Sort by'}</SectionTitle>
          <select
            className="w-full border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white outline-none"
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            {sorting.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  )
}