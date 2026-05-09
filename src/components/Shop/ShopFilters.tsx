'use client'

import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const brandRed = '#e31e24'

type CategoryItem = {
  id: string
  title: string
}

type ShopFiltersProps = {
  categories?: CategoryItem[]
  labels?: {
    cutTypeLabel?: string
    agingProcessLabel?: string
    originLabel?: string
    priceRangeLabel?: string
  }
}

const meatTypes = [
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Pork', value: 'pork' },
  { label: 'Lamb', value: 'lamb' },
  { label: 'Seafood', value: 'seafood' },
  { label: 'Turkey', value: 'turkey' },
  { label: 'Sausage', value: 'processed' },
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

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-neutral-200 pb-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950">
      {children}
    </h3>
  )
}

const inputSelectClass =
  'w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-900/10'

export const ShopFilters = ({ categories = [], labels }: ShopFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentMeatType = searchParams.get('meatType') || ''
  const currentStorageType = searchParams.get('storageType') || ''
  const currentPreparationStyle = searchParams.get('preparationStyle') || ''
  const currentInStock = searchParams.get('inStock') || ''
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

  const hrefWithCategory = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (!categoryId) params.delete('category')
    else params.set('category', categoryId)
    const q = params.toString()
    return q ? `/shop?${q}` : '/shop'
  }

  return (
    <aside className="w-full border border-neutral-200/90 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)] lg:max-w-[280px]">
      <div className="space-y-10">
        {/* Categories — Carneshop sidebar block */}
        <div className="space-y-4">
          <SidebarHeading>Categories</SidebarHeading>
          <ul className="space-y-0 border border-neutral-200/80">
            <li className="border-b border-neutral-200/80 last:border-b-0">
              <Link
                href={hrefWithCategory(null)}
                className={clsx(
                  'block px-3 py-2.5 text-sm transition',
                  !currentCategory ? 'font-semibold' : 'text-neutral-600 hover:bg-[#faf7f2] hover:text-neutral-950',
                )}
                style={!currentCategory ? { color: brandRed, backgroundColor: 'rgba(227,30,36,0.06)' } : undefined}
              >
                All products
              </Link>
            </li>
            {categories.map((cat) => {
              const active = currentCategory === cat.id
              return (
                <li key={cat.id} className="border-b border-neutral-200/80 last:border-b-0">
                  <Link
                    href={hrefWithCategory(cat.id)}
                    className={clsx(
                      'block px-3 py-2.5 text-sm transition',
                      active ? 'font-semibold' : 'text-neutral-600 hover:bg-[#faf7f2] hover:text-neutral-950',
                    )}
                    style={active ? { color: brandRed, backgroundColor: 'rgba(227,30,36,0.06)' } : undefined}
                  >
                    {cat.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Filter */}
        <div className="space-y-5">
          <SidebarHeading>Filter</SidebarHeading>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {labels?.cutTypeLabel || 'Meat Type'}
            </p>
            <select
              className={inputSelectClass}
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
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {labels?.agingProcessLabel || 'Storage Type'}
            </p>
            <div className="flex flex-wrap gap-2">
              {storageTypes.map((item) => {
                const active = currentStorageType === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateParam('storageType', active ? '' : item.value)}
                    className={clsx(
                      'border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition',
                      active
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-[#faf7f2] text-neutral-600 hover:border-neutral-400',
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {labels?.originLabel || 'Preparation Style'}
            </p>
            <select
              className={inputSelectClass}
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
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Availability</p>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={currentInStock === 'true'}
                className="h-4 w-4 accent-[#e31e24]"
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
              />
              <span>In stock only</span>
            </label>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {labels?.priceRangeLabel || 'Price Range'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                className={inputSelectClass}
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
                className={inputSelectClass}
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
        </div>

        {/* Product tags — quick meat-type chips (Carneshop-style) */}
        <div className="space-y-4">
          <SidebarHeading>Product tags</SidebarHeading>
          <div className="flex flex-wrap gap-2">
            {meatTypes.map((item) => {
              const active = currentMeatType === item.value
              return (
                <button
                  key={`tag-${item.value}`}
                  type="button"
                  onClick={() => updateParam('meatType', active ? '' : item.value)}
                  className={clsx(
                    'border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition',
                    active
                      ? 'text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950',
                  )}
                  style={active ? { backgroundColor: brandRed, borderColor: brandRed } : undefined}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
