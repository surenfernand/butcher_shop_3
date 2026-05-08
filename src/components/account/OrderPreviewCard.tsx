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
    <article className="rounded-lg border border-[#efe6d8] bg-[#fdfbf7] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#8f7442]">
          <Package className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.14em]">Order #{order.id}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#8f7a58]">{status}</p>
      </div>
      <p className="mt-2 text-sm text-[#746a5a]">{date}</p>
      <p className="mt-3 text-sm text-[#746a5a]">{itemCount} items</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-base font-semibold text-[#2f2a24]">{formatMoney(order.amount)}</p>
        <Link
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-[#8f7442] hover:text-[#6f5933]"
          href={`/orders/${order.id}`}
        >
          View <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
