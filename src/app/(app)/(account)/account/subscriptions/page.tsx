import { BillingSummaryBlock } from '@/components/account/BillingSummaryBlock'
import { DashboardCard } from '@/components/account/DashboardCard'
import { ProductThumbnailRow } from '@/components/account/ProductThumbnailRow'
import { SubscriptionStatusBadge } from '@/components/account/SubscriptionStatusBadge'
import type { Order } from '@/payload-types'
import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'
import configPromise from '@payload-config'
import { CalendarDays, CreditCard, PauseCircle, Truck } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const formatMoney = (amount?: number | null) =>
  typeof amount === 'number'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount / 100)
    : '—'

const formatDate = (date?: string | null) =>
  date
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(date))
    : '—'

const getID = (value: unknown) => {
  if (typeof value === 'object' && value && 'id' in value) {
    return String((value as { id: string | number }).id)
  }

  return value ? String(value) : ''
}

const getLinePurchaseType = (order: Order, item: NonNullable<Order['items']>[number]) => {
  const productID = getID(item.product)
  const variantID = getID(item.variant)

  const line = order.purchaseTypes?.find((purchaseLine: any) => {
    const sameProduct = getID(purchaseLine.product) === productID
    const sameVariant = variantID ? String(purchaseLine.variant || '') === variantID : true

    return sameProduct && sameVariant
  }) as any

  if (line?.purchaseType === 'weekly' || line?.purchaseType === 'monthly') {
    return line.purchaseType
  }

  if (order.purchaseType === 'weekly' || order.purchaseType === 'monthly') {
    return order.purchaseType
  }

  return 'one_time'
}

export default async function SubscriptionsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Please login to access your subscriptions.')}`)
  }

  const result = await payload.find({
    collection: 'orders',
    user,
    overrideAccess: false,
    depth: 3,
    limit: 50,
    sort: '-createdAt',
    where: {
      customer: {
        equals: user.id,
      },
    },
  })

  const orders = result.docs as Order[]

  const subscriptionItems = orders.flatMap((order) =>
    (order.items || [])
      .map((item, index) => {
        const product = typeof item.product === 'object' ? item.product : undefined
        const variant = typeof item.variant === 'object' ? item.variant : undefined
        const purchaseType = getLinePurchaseType(order, item)

        if (!product || (purchaseType !== 'weekly' && purchaseType !== 'monthly')) {
          return null
        }

        const unitPrice = getPurchaseUnitPriceInCents(product, variant, purchaseType)

        return {
          order,
          item,
          index,
          product,
          variant,
          purchaseType,
          amount: unitPrice * (item.quantity || 1),
        }
      })
      .filter(Boolean),
  )

  const nextShipment = subscriptionItems[0] as (typeof subscriptionItems)[number] | undefined

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-5 py-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-600">
          Subscription support:{' '}
          <a className="font-semibold text-[#e31e24] underline underline-offset-2 hover:brightness-110" href="mailto:info@filetgourmet.ca">
            info@filetgourmet.ca
          </a>
        </p>
      </div>

      <p className="max-w-2xl text-sm text-neutral-600">
        Manage recurring deliveries, billing context, and subscription lines tied to your orders.
      </p>

      {subscriptionItems.length === 0 ? (
        <DashboardCard title="Active Subscriptions" subtitle="No recurring plans found.">
          <p className="rounded-sm border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            You do not have any active subscriptions yet.
          </p>
        </DashboardCard>
      ) : (
        <div className="grid gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <DashboardCard title="Active Subscription Cards" subtitle="Your recurring seafood and gourmet boxes.">
              <div className="space-y-6">
                {subscriptionItems.map((subscription: any) => {
                  const { order, item, index, product, purchaseType, amount } = subscription
                  const fulfillment = order.fulfillment as any
                  const address = order.shippingAddress
                  const cadenceLabel = purchaseType === 'monthly' ? 'Monthly delivery' : 'Weekly delivery'

                  return (
                    <section
                      key={`${order.id}-${index}`}
                      className="rounded-sm border border-neutral-200 bg-white p-5 text-neutral-900 shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-start">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <SubscriptionStatusBadge status={order.status} />
                            <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                              Subscription #{order.stripeSubscriptionID || order.id}
                            </p>
                          </div>
                          <h2 className="text-xl font-bold uppercase">
                            {product?.title || 'Subscription Box'}
                          </h2>
                          <p className="mt-2 text-sm text-neutral-600">Quantity: {item.quantity || 1}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-semibold text-[#e31e24]">{formatMoney(amount)}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">{cadenceLabel}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 border-b border-neutral-200 py-5 md:grid-cols-2">
                        <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                            <CalendarDays className="h-4 w-4" />
                            Upcoming Shipment
                          </p>
                          <p className="mt-2 text-sm font-semibold">{formatDate(fulfillment?.date)}</p>
                        </div>
                        <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                            <Truck className="h-4 w-4" />
                            Delivery Address
                          </p>
                          <p className="mt-2 text-sm">
                            {address?.addressLine1
                              ? `${address.addressLine1}, ${address.city || ''}`
                              : 'Not available'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="bg-[#e31e24] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:brightness-110"
                        >
                          View Order
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-neutral-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:bg-neutral-200"
                        >
                          <PauseCircle className="h-3.5 w-3.5" />
                          Pause
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </section>
                  )
                })}
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <DashboardCard title="Upcoming Shipment" subtitle="Next recurring delivery preview.">
              {nextShipment ? (
                <div className="space-y-3">
                  <ProductThumbnailRow product={nextShipment.product} fallbackLabel="Monthly Menu Box" />
                  <p className="rounded-sm border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                    Scheduled for {formatDate((nextShipment.order.fulfillment as any)?.date)}.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">No upcoming shipments.</p>
              )}
            </DashboardCard>

            <DashboardCard title="Billing Information" subtitle="Subscription billing and payment summary.">
              <div className="space-y-3">
                <BillingSummaryBlock
                  amountLabel={nextShipment ? formatMoney(nextShipment.amount) : '$0.00'}
                  cadenceLabel={nextShipment?.purchaseType === 'monthly' ? 'Charged monthly' : 'Charged weekly'}
                />
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </p>
                  <p className="mt-2 text-sm">Card on file via Stripe (managed securely)</p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}

    

      <footer className="rounded-sm border border-neutral-200 bg-neutral-50 px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Subscription Terms</p>
        <p className="mt-2 text-sm text-neutral-600">
          Renewal and plan changes are subject to account terms. For custom requests, contact support.
        </p>
      </footer>
    </div>
  )
}
