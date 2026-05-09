'use client'

import { createUrl } from '@/utilities/createUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const sorting = [
  { label: 'Featured', value: '-sortPriority' },
  { label: 'Alphabetic A-Z', value: 'title' },
  { label: 'Latest arrivals', value: '-createdAt' },
  { label: 'Price: Low to high', value: 'priceInUSD' },
  { label: 'Price: High to low', value: '-priceInUSD' },
]

export function ShopSortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || '-sortPriority'

  return (
    <label className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
      Sort by
      <select
        className="min-h-10 min-w-[200px] border border-neutral-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-950 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/15"
        value={currentSort}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          if (e.target.value) params.set('sort', e.target.value)
          else params.delete('sort')
          params.delete('page')
          router.push(createUrl(pathname, params))
        }}
      >
        {sorting.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
