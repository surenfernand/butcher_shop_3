'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function ProductSortSelect({
  currentSort,
  onPendingChange,
}: {
  currentSort: string
  onPendingChange?: (pending: boolean) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)

    onPendingChange?.(true)

    startTransition(() => {
      router.push(`?${params.toString()}`, {
        scroll: false,
      })
    })
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="border border-white/20 bg-black px-3 py-2 text-white transition-all duration-300 hover:border-yellow-500 disabled:opacity-50"
    >
      <option value="-sortPriority">Featured</option>
      <option value="-createdAt">Newest</option>
      <option value="title">Name A-Z</option>
      <option value="priceInUSD">Price Low to High</option>
      <option value="-priceInUSD">Price High to Low</option>
    </select>
  )
}