import type { Order } from '@/payload-types'

import { Media } from '@/components/Media'
import { fallbackUrlFor } from '@/constants/fallbackImage'
import { getOrderLineProductImage } from '@/utilities/getOrderLineProductImage'
import { getPurchaseUnitPriceInCents, PurchaseType } from '@/utilities/purchasePricing'
import { batchResolveOrderLinesForPricing } from '@/utilities/resolveOrderLinePricingDocs'
import { getRequestUser } from '@/utilities/getRequestUser'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    email?: string
    accessToken?: string
    purchaseType?: string
    shippingCharge?: string
    estimatedTax?: string
  }>
}

const formatMoney = (amount?: number | null) =>
  typeof amount === 'number'
    ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
    : ''

const formatDate = (date?: string | null) =>
  date
    ? new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
    : ''

export default async function ThankYouPage({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })

  const { user } = await getRequestUser(headers)

  const { id } = await params


  const {
    email = '',
    accessToken = '',
    purchaseType: purchaseTypeFromUrl = '',
    shippingCharge: shippingChargeFromUrl = '',
    estimatedTax: estimatedTaxFromUrl = '',
  } = await searchParams

  const {
    docs: [order],
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
  })

  if (!order) {
    notFound()
  }

  const typedOrder = order as Order

  const linePricingDocs = await batchResolveOrderLinesForPricing(payload, typedOrder.items)

  const orderUrl = `/orders/${id}?${new URLSearchParams({
    ...(email ? { email } : {}),
    ...(accessToken ? { accessToken } : {}),
  }).toString()}`



  const purchaseTypeForPricing: PurchaseType =
    purchaseTypeFromUrl === 'weekly' ||
      purchaseTypeFromUrl === 'monthly' ||
      purchaseTypeFromUrl === 'one_time'
      ? purchaseTypeFromUrl
      : (typedOrder.purchaseType ?? 'one_time')


  const shippingChargeFromUrlNumber =
    shippingChargeFromUrl !== '' ? Number(shippingChargeFromUrl) : null

  const shippingTotal = Number.isFinite(shippingChargeFromUrlNumber)
    ? shippingChargeFromUrlNumber
    : typedOrder.fulfillment?.serviceType === 'delivery'
      ? Number(typedOrder.fulfillment?.shippingCharge || 0)
      : 0

  const fulfillmentWithTax = (typedOrder.fulfillment as
    | (typeof typedOrder.fulfillment & { estimatedTax?: number | null })
    | null
    | undefined)



  const itemsSubtotal =
    linePricingDocs.reduce((total, row) => {
      const { item, product, variant } = row

      if (!product) return total

      const unitPrice = getPurchaseUnitPriceInCents(product, variant, purchaseTypeForPricing)
      const quantity = item.quantity || 0

      return total + unitPrice * quantity
    }, 0) || 0


  const estimatedTaxFromUrlNumber =
    estimatedTaxFromUrl !== '' ? Number(estimatedTaxFromUrl) : null

  const estimatedTax =
    estimatedTaxFromUrlNumber !== null && Number.isFinite(estimatedTaxFromUrlNumber)
      ? estimatedTaxFromUrlNumber
      : Number(fulfillmentWithTax?.estimatedTax || 0)

  const safeShippingTotal = shippingTotal ?? 0
  const safeEstimatedTax = estimatedTax ?? 0

  const calculatedTotal = itemsSubtotal + safeShippingTotal + safeEstimatedTax

 
  const address = typedOrder.shippingAddress

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-800 bg-[#1a1a1a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            className="text-xs uppercase tracking-[0.24em] text-white/75 transition hover:text-white"
            href="/shop"
          >
            Continue Shopping
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
            Order Confirmed
          </p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/70">
            <Check className="h-3.5 w-3.5 text-[#e53935]" aria-hidden />
            Success
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 pb-20 md:px-10">
        <section className="mb-10 rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e53935] text-2xl font-black text-white">
            ✓
          </div>
          <h1 className="font-sans text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-4xl">
            Thank You for Your Order
          </h1>
          <p className="mt-4 font-sans text-lg text-neutral-600">
            Your order{' '}
            <span className="font-bold text-[#e53935]">#{typedOrder.id}</span> is being prepared.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="mb-8 flex flex-col gap-3 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-sans text-xl font-black uppercase tracking-[0.18em] text-[#e53935]">
                  Order Summary
                </h2>
                <p className="font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                  Placed {formatDate(typedOrder.createdAt)}
                </p>
              </div>

              <div className="space-y-6">
                {linePricingDocs.map(({ item, product, variant }, index) => {
                  if (!product) return null

                  const image = getOrderLineProductImage(product, variant)
                  const unitPrice = getPurchaseUnitPriceInCents(
                    product,
                    variant,
                    purchaseTypeForPricing,
                  )
                  const quantity = item.quantity || 1
                  const lineTotal = unitPrice * quantity

                  return (
                    <div
                      key={item.id || index}
                      className="flex items-center gap-5 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                        <Media
                          fallbackContext="product"
                          fill
                          imgClassName="object-cover"
                          resource={image ?? undefined}
                          src={image ? undefined : fallbackUrlFor('product')}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-sans font-black uppercase text-neutral-900">
                          {product.title}
                        </h3>

                        {purchaseTypeForPricing && purchaseTypeForPricing !== 'one_time' ? (
                          <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-[#e53935]">
                            {purchaseTypeForPricing === 'monthly'
                              ? 'Monthly subscription'
                              : 'Weekly subscription'}
                          </p>
                        ) : null}

                        {variant?.title ? (
                          <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                            {variant.title}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-sans font-black text-[#e53935]">{formatMoney(lineTotal)}</p>
                        <p className="mt-1 font-sans text-xs uppercase text-neutral-600">
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 space-y-3 border-t border-neutral-200 pt-6 font-sans text-sm uppercase tracking-[0.12em]">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="text-neutral-900">{formatMoney(itemsSubtotal)}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="text-neutral-900">{formatMoney(shippingTotal)}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span className="text-neutral-900">{formatMoney(estimatedTax)}</span>
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="flex justify-between text-lg font-black text-[#e53935]">
                  <span className="uppercase">Total Amount</span>
                  <span>{formatMoney(calculatedTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/shop"
                className="bg-[#e53935] py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#c62828]"
              >
                Return to Shop
              </Link>

              <Link
                href={orderUrl}
                className="border border-neutral-200 bg-white py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-[#e53935] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition hover:border-[#e53935]/40 hover:bg-neutral-50"
              >
                View Order
              </Link>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              {typedOrder.fulfillment?.date ? (
                <div className="mb-6">
                  <p className="font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                    Estimated Arrival
                  </p>
                  <p className="mt-1 font-sans text-xl font-bold text-neutral-900">
                    {formatDate(typedOrder.fulfillment.date)}
                  </p>
                </div>
              ) : null}

              {address ? (
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                    Shipping Address
                  </p>

                  <p className="leading-relaxed text-neutral-900">
                    {[address.firstName, address.lastName].filter(Boolean).join(' ')}
                    <br />
                    {address.addressLine1}
                    {address.addressLine2 ? (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    ) : null}
                    <br />
                    {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                    <br />
                    {address.country}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-neutral-200 border-l-4 border-l-[#e53935] bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <p className="font-sans text-lg italic leading-relaxed text-neutral-700">
                “Every cut that leaves our atelier is a testament to heritage, craft, and the pursuit
                of culinary perfection.”
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-8 bg-[#e53935]" />
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#e53935]">
                  Artisan Curator
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}