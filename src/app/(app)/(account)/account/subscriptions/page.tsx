import type { Media, Order, Product } from '@/payload-types'

import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'
import configPromise from '@payload-config'
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

const getProductImage = (product?: Product | null): Media | undefined => {
  const image = product?.productGallery?.[0]?.image
  return image && typeof image === 'object' ? image : undefined
}

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

  return (
    <div className="space-y-12 text-foreground">
      <div className="mt-3">
        <h1 className="text-5xl font-bold tracking-tight">My Subscriptions</h1>
        <p className="mt-3 text-muted-foreground">View your all Subscriptions</p>
      </div>

      {subscriptionItems.length === 0 ? (
        <div className="border border-border bg-card p-10 text-muted-foreground">
          You do not have any active subscriptions yet.
        </div>
      ) : (
        <div className="space-y-8">
          {subscriptionItems.map((subscription: any) => {
            const { order, item, index, product, purchaseType, amount } = subscription
            const image = getProductImage(product)
            const fulfillment = order.fulfillment as any
            const address = order.shippingAddress

            return (
              <section
                key={`${order.id}-${index}`}
                className="grid overflow-hidden border border-border bg-card lg:grid-cols-[320px_1fr]"
              >
                <div className="relative bg-muted">
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.alt || product?.title || 'Subscription product'}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">No product image</div>
                    )}
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex flex-col gap-6 border-b border-border/40 pb-8 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold uppercase">
                        {product?.title || 'Subscription Box'}
                      </h2>

                      <p className="mt-2 text-muted-foreground">Quantity: {item.quantity || 1}</p>

                      <p className="mt-2 text-muted-foreground">
                        Subscription ID: {order.stripeSubscriptionID || `#${order.id}`}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xl font-bold text-[#E2B84F]">
                        {formatMoney(amount)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{purchaseType === 'monthly' ? 'mo' : 'wk'}
                        </span>
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {purchaseType === 'monthly'
                          ? 'Monthly Subscription'
                          : 'Weekly Subscription'}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-8 border-b border-border/40 py-8 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Next Delivery
                      </p>
                      <p className="mt-3 font-semibold">{formatDate(fulfillment?.date)}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Shipping To
                      </p>
                      <p className="mt-3 font-semibold">
                        {address?.addressLine1
                          ? `${address.addressLine1}, ${address.city || ''}`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-[#E2B84F] px-8 py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-black"
                    >
                      Manage Selection
                    </Link>

                    <button
                      type="button"
                      className="border border-border/60 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground"
                    >
                      Pause Subscription
                    </button>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
