import type { Order } from '@/payload-types'

import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'

type Props = {
  order: Order
}

const formatMoney = (amount?: number | null) =>
  typeof amount === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
    : '—'

const statusLabel: Record<string, string> = {
  completed: 'Delivered',
  processing: 'Processing',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function OrderPreviewCard({ order }: Props) {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const itemCount = order.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
  const status = statusLabel[order.status || 'processing'] || 'Processing'

  return (
    <article className="rounded-sm border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-neutral-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#e31e24]">
          <Package className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.14em]">Order #{order.id}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{status}</p>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{date}</p>
      <p className="mt-3 text-sm text-neutral-600">{itemCount} items</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-base font-semibold text-neutral-900">{formatMoney(order.amount)}</p>
        <Link
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-[#e31e24] hover:underline"
          href={`/orders/${order.id}`}
        >
          View <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
