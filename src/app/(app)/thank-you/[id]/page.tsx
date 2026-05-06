import type { Order } from '@/payload-types'

import { Media } from '@/components/Media'
import { getOrderLineProductImage } from '@/utilities/getOrderLineProductImage'
import { getPurchaseUnitPriceInCents, PurchaseType } from '@/utilities/purchasePricing'
import { batchResolveOrderLinesForPricing } from '@/utilities/resolveOrderLinePricingDocs'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
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

  const { user } = await payload.auth({ headers })

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
    <main className="min-h-screen text-[#e2e2e2]">
      <section className="relative flex h-[520px] items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-dark" />

        <div className="relative z-10 px-6">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#D3A84B] text-2xl font-black text-black">
            ✓
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Thank You for Your Order
          </h1>

          <p className="mt-5 text-lg text-[#d2c5b1]">
            Your order{' '}
            <span className="font-bold text-[#D3A84B]">#{typedOrder.id}</span>{' '}
            is being prepared.
          </p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 grid max-w-7xl grid-cols-1 gap-6 px-6 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="border border-[#333535] bg-[#1e2020] p-8">
            <div className="mb-8 flex items-end justify-between border-b border-[#333535] pb-4">
              <h2 className="text-2xl font-bold uppercase tracking-[0.18em] text-[#D3A84B]">
                Order Summary
              </h2>

              <p className="text-xs uppercase tracking-[0.18em] text-[#9a8f7e]">
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
                  <div key={item.id || index} className="flex items-center gap-5">
                    <div className="relative h-24 w-24 overflow-hidden bg-[#333535]">
                      {image ? (
                        <Media fill imgClassName="object-cover" resource={image} />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold uppercase text-white">{product.title}</h3>

                      {purchaseTypeForPricing && purchaseTypeForPricing !== 'one_time' ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#D3A84B]">
                          {purchaseTypeForPricing === 'monthly'
                            ? 'Monthly subscription'
                            : 'Weekly subscription'}
                        </p>
                      ) : null}

                      {variant?.title ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9a8f7e]">
                          {variant.title}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-[#D3A84B]">{formatMoney(lineTotal)}</p>
                      <p className="mt-1 text-xs uppercase text-[#9a8f7e]">Qty: {quantity}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 space-y-3 border-t border-[#333535] pt-6">
              <div className="flex justify-between text-sm uppercase tracking-[0.12em] text-[#d2c5b1]">
                <span>Subtotal</span>
                <span>{formatMoney(itemsSubtotal)}</span>
              </div>

              <div className="flex justify-between text-sm uppercase tracking-[0.12em] text-[#d2c5b1]">
                <span>Shipping</span>
                {/* <span>{shippingTotal > 0 ? formatMoney(shippingTotal) : '0.00'}</span> */}
                <span>{formatMoney(shippingTotal)}</span>
              </div>

              <div className="flex justify-between text-sm uppercase tracking-[0.12em] text-[#d2c5b1]">
                <span>Tax</span>
                <span>{formatMoney(estimatedTax)}</span>
              </div>

              <div className="flex justify-between border-t border-[#333535] pt-4 text-2xl font-black">
                <span className="uppercase text-[#D3A84B]">Total Amount</span>
                <span>{formatMoney(calculatedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Link
              href="/shop"
              className="bg-[#D3A84B] py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Return to Shop
            </Link>

            <Link
              href={orderUrl}
              className="border border-[#D3A84B] py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-[#D3A84B]"
            >
              View Order
            </Link>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="border border-[#333535] bg-[#282a2b] p-7">

            {typedOrder.fulfillment?.date ? (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9a8f7e]">
                  Estimated Arrival
                </p>
                <p className="mt-1 text-xl font-bold">
                  {formatDate(typedOrder.fulfillment.date)}
                </p>
              </div>
            ) : null}

            {address ? (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9a8f7e]">
                  Shipping Address
                </p>

                <p className="leading-relaxed text-[#e2e2e2]">
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

          <div className="border border-[#D3A84B]/30 bg-black p-7">
            <p className="text-lg italic leading-relaxed text-[#e2e2e2]">
              “Every cut that leaves our atelier is a testament to heritage, craft, and the pursuit
              of culinary perfection.”
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-[#D3A84B]" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D3A84B]">
                Artisan Curator
              </p>
            </div>
          </div>


        </aside>
      </section>
    </main>
  )
}