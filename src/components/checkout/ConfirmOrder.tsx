'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { getPurchaseTypeForConfirmationFromCart, getPurchaseTypesForCartItems } from '@/utilities/localStoragePurchaseType'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const ConfirmOrder: React.FC = () => {
  const { confirmOrder } = usePayments()
  const { cart } = useCart()

  const searchParams = useSearchParams()
  const router = useRouter()
  // Ensure we only confirm the order once, even if the component re-renders
  const isConfirming = useRef(false)

  useEffect(() => {
    const run = async () => {
      const paymentIntentID = searchParams.get('payment_intent')
      const email = searchParams.get('email')

      if (!paymentIntentID) {
        router.push('/')
        return
      }

      if (isConfirming.current) return
      isConfirming.current = true

      const fulfillment =
        typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('fulfillment') || '{}')
          : {}

      const purchaseType = getPurchaseTypeForConfirmationFromCart(cart?.items)

      const purchaseTypes =
        cart?.items?.map((item) => {
          const productID =
            typeof item.product === 'object' ? item.product.id : item.product

          const purchaseType =
            localStorage.getItem(`purchaseType:${productID}`) || 'one_time'

          const price =
            localStorage.getItem(`purchaseType:${productID}:price`) || null

          return {
            product: productID,
            purchaseType,
            price,
          }
        }) || []

      const orderPurchaseType = purchaseTypes[0]?.purchaseType || 'one_time'

      console.log(" one_time fulfillment")
      console.log(fulfillment)

      const result = await confirmOrder('stripe', {
        additionalData: {
          paymentIntentID,
          ...(email ? { customerEmail: email } : {}),
          fulfillment,
          purchaseType,
          purchaseTypes,
        },
      })

      if (result && typeof result === 'object' && 'orderID' in result && result.orderID) {
        const accessToken = 'accessToken' in result ? (result.accessToken as string) : ''
        const queryParams = new URLSearchParams()

        if (email) {
          queryParams.set('email', email)
        }
        if (accessToken) {
          queryParams.set('accessToken', accessToken)
        }

        if (purchaseType) {
          queryParams.set('purchaseType', purchaseType)
        }

        if (fulfillment?.shippingCharge !== undefined) {
          queryParams.set('shippingCharge', String(fulfillment.shippingCharge))
        }

        const thankYouHref = `/thank-you/${result.orderID}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        let response = null;

        try {

          console.log('ORDER EXTRA DATA PAYLOAD', {
            orderID: result.orderID,
            fulfillment: JSON.parse(localStorage.getItem('fulfillment') || '{}'),
            purchaseType: purchaseTypes[0]?.purchaseType || 'one_time',
            purchaseTypes,
          })


          const response = await fetch('/api/order-extra-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderID: result.orderID,
              fulfillment,
              purchaseType: orderPurchaseType,
              purchaseTypes,
            }),
          })

          const responseData = await response.json()

          console.log('ORDER EXTRA DATA RESPONSE', {
            ok: response.ok,
            status: response.status,
            data: responseData,
          })

          
        } catch (e) {
          console.error(e)
        } finally {
          router.push(thankYouHref)
        }
      } else {
        router.push('/')
      }
    }

    run()

  }, [cart, confirmOrder, router, searchParams])

  return (
    <div className="flex w-full flex-col items-center justify-start gap-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e53935]">Almost there</p>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">Confirming your order</h1>
      <p className="max-w-md text-sm text-neutral-600">Please wait while we finalize your payment.</p>

      <LoadingSpinner className="h-6 w-12 text-[#e53935]" />
    </div>
  )
}
