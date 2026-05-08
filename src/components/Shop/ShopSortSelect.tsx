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
    <label className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#7d6a44]">
      Sort by
      <select
        className="rounded-full border border-[#e0d2b5] bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#443d32] outline-none focus:border-[#b8954f]"
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
