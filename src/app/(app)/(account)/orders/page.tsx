import type { Order, Product } from '@/payload-types'
import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { Truck, ShoppingBasket, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

function formatOrderRef(id: number) {
  return `BC-${id}`
}

function formatMoney(amount?: number | null) {
  if (typeof amount !== 'number') return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}

function formatOrderDate(iso?: string | null) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

function getItemsLines(order: Order): { primary: string; secondary: string } {
  const items = order.items || []
  const withProducts = items.filter(
    (line) => line.product && typeof line.product === 'object',
  ) as { product: Product; quantity: number }[]

  if (withProducts.length === 0) {
    const totalQty = items.reduce((n, l) => n + (l.quantity || 0), 0)
    return {
      primary: 'Order items',
      secondary: totalQty > 0 ? `${totalQty} items total` : '—',
    }
  }

  const first = withProducts[0].product
  const primary = first.title || 'Order items'
  const lineCount = items.length
  const totalQty = items.reduce((n, l) => n + (l.quantity || 0), 0)

  if (lineCount === 1) {
    return {
      primary,
      secondary: totalQty <= 1 ? '1 item total' : `${totalQty} items total`,
    }
  }

  const additional = lineCount - 1
  return {
    primary,
    secondary: `+ ${additional} additional ${additional === 1 ? 'item' : 'items'}`,
  }
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const s = status || 'processing'
  const label =
    s === 'completed'
      ? 'Delivered'
      : s === 'processing'
        ? 'Processing'
        : s === 'cancelled'
          ? 'Cancelled'
          : s === 'refunded'
            ? 'Refunded'
            : 'Processing'

  if (s === 'completed') {
    return (
      <span className="inline-block border border-[#d4af5f] bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d4af5f]">
        {label.toUpperCase()}
      </span>
    )
  }

  return (
    <span className="inline-block bg-[#2c2c2c] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a3a3a3]">
      {label.toUpperCase()}
    </span>
  )
}

export default async function Orders() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Please login to access your orders.')}`)
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 100,
      pagination: false,
      depth: 2,
      sort: '-createdAt',
      user,
      overrideAccess: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch {
    orders = []
  }

  return (
    <div className="w-full space-y-10 text-[#e5e5e5]">
      <div className="mt-3">
        <h1 className="text-5xl font-bold tracking-tight text-white">Order History</h1>
        <p className="mt-3 text-sm text-[#9ca3af]">Manage your order history.</p>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#2a2a2a] bg-black">
        {(!orders || orders.length === 0) && (
          <div className="px-6 py-14 text-center text-[#9ca3af]">You have no orders.</div>
        )}

        {orders && orders.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#161616]">
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:px-7">
                    Order #
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:px-6">
                    Date
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:px-6">
                    Delivery method
                  </th>
                  <th className="min-w-[220px] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:min-w-[260px] lg:px-6">
                    Items
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:px-6">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af5f] lg:px-7">
                    Total
                  </th>
                  <th className="w-10 px-2 py-4 lg:w-12" aria-hidden />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const fulfillment = order.fulfillment
                  const isDelivery = fulfillment?.serviceType === 'delivery'
                  const isPickup = fulfillment?.serviceType === 'pickup'
                  const { primary, secondary } = getItemsLines(order)

                  const href = `/orders/${order.id}`

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[#2a2a2a] transition-colors hover:bg-[#141414]"
                    >
                      <td className="px-5 py-5 align-middle text-sm lg:px-7">
                        <Link
                          href={href}
                          className="font-medium text-[#c4c4c4] underline-offset-4 hover:text-[#d4af5f]"
                        >
                          {formatOrderRef(order.id)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 align-middle text-sm text-[#e5e5e5] lg:px-6">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-5 align-middle lg:px-6">
                        {isDelivery && (
                          <span className="inline-flex items-center gap-2 text-sm text-[#a3a3a3]">
                            <Truck className="size-4 shrink-0 text-[#737373]" aria-hidden />
                            Delivery
                          </span>
                        )}
                        {isPickup && (
                          <span className="inline-flex items-center gap-2 text-sm text-[#a3a3a3]">
                            <ShoppingBasket className="size-4 shrink-0 text-[#737373]" aria-hidden />
                            Pickup
                          </span>
                        )}
                        {!isDelivery && !isPickup && (
                          <span className="text-sm text-[#737373]">—</span>
                        )}
                      </td>
                      <td className="max-w-[280px] px-5 py-5 align-middle lg:max-w-[320px] lg:px-6">
                        <div className="text-sm font-medium text-[#ececec]">{primary}</div>
                        <div className="mt-1 text-xs text-[#737373]">{secondary}</div>
                      </td>
                      <td className="px-5 py-5 align-middle lg:px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-right align-middle text-base font-semibold text-[#d4af5f] lg:px-7">
                        {formatMoney(order.amount)}
                      </td>
                      <td className="px-2 py-5 align-middle text-[#737373] lg:px-3">
                        <Link
                          href={href}
                          aria-label={`View order ${formatOrderRef(order.id)}`}
                          className="flex justify-end text-[#737373] transition-colors hover:text-[#d4af5f]"
                        >
                          <ChevronRight className="size-5" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Your orders.',
  openGraph: mergeOpenGraph({
    title: 'Orders',
    url: '/orders',
  }),
  title: 'Orders',
}
