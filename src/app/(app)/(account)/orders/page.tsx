import type { Order, Product } from '@/payload-types'
import type { Metadata } from 'next'

import { DashboardCard } from '@/components/account/DashboardCard'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestUser } from '@/utilities/getRequestUser'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { ShoppingBasket, Truck } from 'lucide-react'
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

  const cls =
    s === 'completed'
      ? 'border-[#e31e24]/35 bg-[#e31e24]/10 text-[#e31e24]'
      : s === 'processing'
        ? 'border-neutral-200 bg-neutral-100 text-neutral-800'
        : 'border-neutral-200 bg-neutral-100 text-neutral-500'

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${cls}`}
    >
      {label}
    </span>
  )
}

export default async function Orders() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await getRequestUser(headers)

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

  const visibleOrders = orders || []

  return (
    <div className="w-full space-y-8">
      <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
          Order support:{' '}
          <a className="font-semibold text-[#e31e24] underline underline-offset-2 hover:brightness-110" href="mailto:info@filetgourmet.ca">
            info@filetgourmet.ca
          </a>
        </p>
      </div>

      <p className="max-w-2xl text-sm text-neutral-600">
        Track, review, and manage all your orders. Select an order for full details.
      </p>

      <DashboardCard title="Your orders" subtitle="Detailed order records with status and pricing.">
        {(!orders || orders.length === 0) && (
          <div className="rounded-sm border border-dashed border-neutral-200 bg-neutral-50 px-6 py-14 text-center text-neutral-600">
            You have no orders yet.
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="border-y border-neutral-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:px-7">
                    Order #
                  </th>
                  <th className="border-y border-neutral-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:px-6">
                    Date
                  </th>
                  <th className="border-y border-neutral-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:px-6">
                    Delivery method
                  </th>
                  <th className="min-w-[220px] border-y border-neutral-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:min-w-[260px] lg:px-6">
                    Items
                  </th>
                  <th className="border-y border-neutral-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:px-6">
                    Status
                  </th>
                  <th className="border-y border-neutral-200 px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e31e24] lg:px-7">
                    Total
                  </th>
                  <th className="w-12 border-y border-neutral-200 px-2 py-4 lg:w-14" aria-hidden />
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => {
                  const fulfillment = order.fulfillment
                  const isDelivery = fulfillment?.serviceType === 'delivery'
                  const isPickup = fulfillment?.serviceType === 'pickup'
                  const { primary, secondary } = getItemsLines(order)
                  const href = `/orders/${order.id}`

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="border-b border-neutral-200 px-5 py-5 align-middle lg:px-7">
                        <Link
                          href={href}
                          className="font-medium text-neutral-900 underline-offset-4 hover:text-[#e31e24]"
                        >
                          {formatOrderRef(order.id)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap border-b border-neutral-200 px-5 py-5 align-middle text-sm text-neutral-600 lg:px-6">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="border-b border-neutral-200 px-5 py-5 align-middle lg:px-6">
                        {isDelivery && (
                          <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
                            <Truck className="size-4 shrink-0 text-[#e31e24]" aria-hidden />
                            Delivery
                          </span>
                        )}
                        {isPickup && (
                          <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
                            <ShoppingBasket className="size-4 shrink-0 text-[#e31e24]" aria-hidden />
                            Pickup
                          </span>
                        )}
                        {!isDelivery && !isPickup && (
                          <span className="text-sm text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="max-w-[280px] border-b border-neutral-200 px-5 py-5 align-middle lg:max-w-[320px] lg:px-6">
                        <div className="text-sm font-medium text-neutral-900">{primary}</div>
                        <div className="mt-1 text-xs text-neutral-500">{secondary}</div>
                      </td>
                      <td className="border-b border-neutral-200 px-5 py-5 align-middle lg:px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap border-b border-neutral-200 px-5 py-5 text-right align-middle text-base font-semibold text-[#e31e24] lg:px-7">
                        {formatMoney(order.amount)}
                      </td>
                      <td className="border-b border-neutral-200 px-2 py-5 align-middle lg:px-3">
                        <Link
                          href={href}
                          aria-label={`View order ${formatOrderRef(order.id)}`}
                          className="flex justify-end text-neutral-400 transition-colors hover:text-[#e31e24]"
                        >
                          <span className="sr-only">View order</span>
                          →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      <footer className="rounded-sm border border-neutral-200 bg-neutral-50 px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Need order assistance?
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Contact support for invoice corrections, delivery updates, or account-specific help.
        </p>
      </footer>
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
