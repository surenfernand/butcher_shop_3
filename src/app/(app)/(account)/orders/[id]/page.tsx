import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestUser } from '@/utilities/getRequestUser'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { ProductItem } from '@/components/ProductItem'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { OrderStatus } from '@/components/OrderStatus'
import { AddressItem } from '@/components/addresses/AddressItem'
import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'
import { batchResolveOrderLinesForPricing } from '@/utilities/resolveOrderLinePricingDocs'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

const getID = (value: unknown) => {
  if (typeof value === 'object' && value && 'id' in value) {
    return String((value as { id: string | number }).id)
  }

  return value != null ? String(value) : ''
}

const getLinePurchaseType = (order: Order, item: NonNullable<Order['items']>[number]) => {
  const productID = getID(item.product)
  const variantID = getID(item.variant)

  const line = order.purchaseTypes?.find((purchaseLine: any) => {
    if (getID(purchaseLine.product) !== productID) return false
    return String(purchaseLine.variant || '') === String(variantID || '')
  }) as any

  if (line?.purchaseType === 'weekly' || line?.purchaseType === 'monthly') {
    return line.purchaseType
  }

  if (order.purchaseType === 'weekly' || order.purchaseType === 'monthly') {
    return order.purchaseType
  }

  return 'one_time'
}

export default async function Order({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await getRequestUser(headers)

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null




  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 1,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
              {
                customer: {
                  equals: user.id,
                },
              },
            ]
            : [
              {
                accessToken: {
                  equals: accessToken,
                },
              },
              ...(email
                ? [
                  {
                    customerEmail: {
                      equals: email,
                    },
                  },
                ]
                : []),
            ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        purchaseType: true,
        purchaseTypes: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
        fulfillment: true, // ✅ ADD THIS
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email

    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  const linePricingDocs = await batchResolveOrderLinesForPricing(payload, order.items)

  const getPurchaseTypeLabel = (purchaseType: string) => {
    if (purchaseType === 'monthly') return 'Monthly subscription'
    if (purchaseType === 'weekly') return 'Weekly subscription'
    return 'One-time purchase'
  }


  const itemsSubtotal =
    linePricingDocs.reduce((total, row) => {
      const { item, product, variant } = row

      if (!product) return total

      const purchaseTypeForLine = getLinePurchaseType(order, item)
      const unitPrice = getPurchaseUnitPriceInCents(product, variant, purchaseTypeForLine)
      const quantity = item.quantity || 0

      return total + unitPrice * quantity
    }, 0) || 0

  const fulfillment = (order as any).fulfillment

  const shippingTotal =
    fulfillment?.serviceType === 'delivery'
      ? Number(fulfillment?.shippingCharge || 0)
      : 0
  const estimatedTax = Number(fulfillment?.estimatedTax || 0)
  const computedTotal = itemsSubtotal + shippingTotal + estimatedTax


  return (
    <div className="w-full space-y-10 text-neutral-800">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {user ? (
            <Button
              asChild
              variant="ghost"
              className="px-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 hover:bg-transparent hover:text-[#e31e24]"
            >
              <Link href="/orders">
                <ChevronLeftIcon className="mr-1 inline size-4" />
                All orders
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div className="border-b border-neutral-200 pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e31e24]">Order</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            #{order.id}
          </h2>

          <p className="mt-3 text-sm text-neutral-600">
            Placed on{' '}
            <time dateTime={order.createdAt}>
              {formatDateTime({ date: order.createdAt, format: 'MMMM dd, yyyy' })}
            </time>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-sm border border-neutral-200 bg-white px-6 py-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.12em] text-neutral-900">
                Order Items
              </h2>

              {linePricingDocs.length > 0 && (
                <ul className="flex flex-col gap-6">
                  {linePricingDocs.map(({ item, product, variant }, index) => {
                    if (typeof item.product === 'string') {
                      return null
                    }

                    if (!product) {
                      return (
                        <li key={index} className="text-muted-foreground">
                          This item is no longer available.
                        </li>
                      )
                    }




                    const linePurchaseType = getLinePurchaseType(order, item)

                    const unitPriceInCents = getPurchaseUnitPriceInCents(
                      product,
                      variant,
                      linePurchaseType,
                    )

                    const lineSubtotalInCents = unitPriceInCents * (item.quantity || 1)

                    return (
                      <li
                        key={item.id}
                        className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0"
                      >
                        <ProductItem
                          product={product}
                          quantity={item.quantity}
                          variant={variant}
                          lineSubtotalInCents={lineSubtotalInCents}
                        />

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                          <span className="rounded-full border border-neutral-200 px-3 py-1 font-mono uppercase tracking-[0.12em] text-[#e31e24]">
                            {getPurchaseTypeLabel(linePurchaseType)}
                          </span>


                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="mb-3 flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <Price amount={itemsSubtotal} className="text-neutral-900" />
                </div>

                <div className="mb-5 flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <Price amount={shippingTotal} className="text-neutral-900" />
                </div>

                <div className="flex justify-between border-t border-neutral-200 pt-5">
                  <span className="text-xl font-semibold uppercase tracking-[0.12em] text-neutral-900">
                    Total
                  </span>

                  <Price
                    className="text-2xl font-bold text-[#e31e24]"
                    amount={computedTotal}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-sm border border-neutral-200 bg-white px-6 py-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.12em] text-neutral-900">
                Order Progress
              </h2>

              <div>
                {order.status && <OrderStatus className="text-sm" status={order.status} />}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {order.shippingAddress && (
              <section className="rounded-sm border border-neutral-200 bg-white px-6 py-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
                <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.12em] text-neutral-900">
                  Shipping Address
                </h2>

                <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3">
                  {/* @ts-expect-error - some kind of type hell */}
                  <AddressItem address={order.shippingAddress} hideActions />
                </div>

              
                  <h2 className="mb-6 mt-8 text-lg font-semibold uppercase tracking-[0.12em] text-neutral-900">
                    Fulfillment
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-500">Service</span>
                      <span className="text-right font-medium text-neutral-900">
                        {fulfillment?.serviceType === 'delivery'
                          ? 'Delivery'
                          : fulfillment?.serviceType === 'pickup'
                            ? 'Pickup'
                            : 'Not selected'}
                      </span>
                    </div>

                    {fulfillment?.branchName && (
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">Branch</span>
                        <span className="text-right font-medium text-neutral-900">
                          {fulfillment.branchName}
                        </span>
                      </div>
                    )}

                    {fulfillment?.date && (
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">Date</span>
                        <span className="max-w-[200px] break-words text-right font-medium text-neutral-900 sm:max-w-none">
                          {fulfillment.date}
                        </span>
                      </div>
                    )}

                   
                  </div>



                

              </section>
            )}




          </aside>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Order ${id}`,
  }
}