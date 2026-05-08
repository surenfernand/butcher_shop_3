import { BillingSummaryBlock } from '@/components/account/BillingSummaryBlock'
import { DashboardCard } from '@/components/account/DashboardCard'
import { ProductThumbnailRow } from '@/components/account/ProductThumbnailRow'
import { SubscriptionStatusBadge } from '@/components/account/SubscriptionStatusBadge'
import type { Order } from '@/payload-types'
import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'
import configPromise from '@payload-config'
import { CalendarDays, CreditCard, PauseCircle, SkipForward, Truck } from 'lucide-react'
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
      <div className="rounded-lg border border-border bg-muted/40 px-6 py-3">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Subscription support:{' '}
          <a className="font-medium text-primary underline underline-offset-2 hover:text-primary/90" href="mailto:info@filetgourmet.ca">
            info@filetgourmet.ca
          </a>
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-7 text-card-foreground shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subscription Management</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Manage Your Deliveries</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Control schedule, billing, and product selections for your recurring premium orders.
        </p>
      </div>

      {subscriptionItems.length === 0 ? (
        <DashboardCard title="Active Subscriptions" subtitle="No recurring plans found.">
          <p className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
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
                      className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-start">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <SubscriptionStatusBadge status={order.status} />
                            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                              Subscription #{order.stripeSubscriptionID || order.id}
                            </p>
                          </div>
                          <h2 className="text-xl font-bold uppercase">
                            {product?.title || 'Subscription Box'}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">Quantity: {item.quantity || 1}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-semibold text-primary">{formatMoney(amount)}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{cadenceLabel}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 border-b border-border py-5 md:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            Upcoming Shipment
                          </p>
                          <p className="mt-2 text-sm font-semibold">{formatDate(fulfillment?.date)}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            Delivery Address
                          </p>
                          <p className="mt-2 text-sm">
                            {address?.addressLine1
                              ? `${address.addressLine1}, ${address.city || ''}`
                              : 'Not available'}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Delivery Frequency</p>
                          <select
                            defaultValue={purchaseType}
                            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="rounded-md bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
                        >
                          Manage Subscription
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground hover:bg-secondary/80"
                        >
                          <PauseCircle className="h-3.5 w-3.5" />
                          Pause
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground hover:bg-secondary/80"
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                          Skip Next
                        </button>
                        <button
                          type="button"
                          className="rounded-md border border-border bg-muted px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:bg-muted/80"
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
                  <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Scheduled for {formatDate((nextShipment.order.fulfillment as any)?.date)}.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming shipments.</p>
              )}
            </DashboardCard>

            <DashboardCard title="Billing Information" subtitle="Subscription billing and payment summary.">
              <div className="space-y-3">
                <BillingSummaryBlock
                  amountLabel={nextShipment ? formatMoney(nextShipment.amount) : '$0.00'}
                  cadenceLabel={nextShipment?.purchaseType === 'monthly' ? 'Charged monthly' : 'Charged weekly'}
                />
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
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

      {subscriptionItems.length > 0 && (
        <DashboardCard title="Shipment/Product Summary" subtitle="All recurring products in this account.">
          <div className="grid gap-3 md:grid-cols-2">
            {subscriptionItems.map((subscription: any) => (
              <ProductThumbnailRow
                key={`thumb-${subscription.order.id}-${subscription.index}`}
                product={subscription.product}
                fallbackLabel="Subscription Product"
              />
            ))}
          </div>
        </DashboardCard>
      )}

      <footer className="rounded-xl border border-border bg-muted/50 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Subscription Terms</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Renewal and plan changes are subject to account terms. For custom requests, contact support.
        </p>
      </footer>
    </div>
  )
}
