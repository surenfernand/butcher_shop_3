'use client'

import { Message } from '@/components/Message'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import React, { useCallback, FormEvent } from 'react'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { getPurchaseTypeForConfirmationFromCart, getPurchaseTypesForCartItems } from '@/utilities/localStoragePurchaseType'
import { Address } from '@/payload-types'


type Props = {
  customerEmail?: string
  billingAddress?: Partial<Address>
  setProcessingPayment: React.Dispatch<React.SetStateAction<boolean>>
  setPaymentElementComplete: React.Dispatch<React.SetStateAction<boolean>>
}

export const CheckoutForm: React.FC<Props> = ({
  customerEmail,
  billingAddress,
  setProcessingPayment,
  setPaymentElementComplete,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { clearCart, cart } = useCart()
  const { confirmOrder } = usePayments()

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setProcessingPayment(true)

      if (!stripe || !elements) {
        setError('Payment form is not ready yet.')
        setIsLoading(false)
        setProcessingPayment(false)
        return
      }

      const { error: submitError } = await elements.submit()

      if (submitError) {
        setError(submitError.message || 'Please complete your card details.')
        setIsLoading(false)
        setProcessingPayment(false)
        setPaymentElementComplete(false)
        return
      }

      try {
        const returnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/confirm-order${customerEmail ? `?email=${customerEmail}` : ''
          }`

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          confirmParams: {
            return_url: returnUrl,
            payment_method_data: {
              billing_details: {
                email: customerEmail,
                phone: billingAddress?.phone,
                address: {
                  line1: billingAddress?.addressLine1,
                  line2: billingAddress?.addressLine2,
                  city: billingAddress?.city,
                  state: billingAddress?.state,
                  postal_code: billingAddress?.postalCode,
                  country: billingAddress?.country,
                },
              },
            },
          },
          elements,
          redirect: 'if_required',
        })

        if (paymentIntent && paymentIntent.status === 'succeeded') {

          const fulfillment =
            typeof window !== 'undefined'
              ? JSON.parse(localStorage.getItem('fulfillment') || '{}')
              : {}



          const purchaseType = getPurchaseTypeForConfirmationFromCart(cart?.items)
          const purchaseTypes = getPurchaseTypesForCartItems(cart?.items)

          const confirmResult = await confirmOrder('stripe', {
            additionalData: {
              paymentIntentID: paymentIntent.id,
              ...(customerEmail ? { customerEmail } : {}),
              fulfillment,
              purchaseType,
              purchaseTypes,
            },
          })

          if (
            confirmResult &&
            typeof confirmResult === 'object' &&
            'orderID' in confirmResult &&
            confirmResult.orderID
          ) {
            const accessToken =
              'accessToken' in confirmResult ? (confirmResult.accessToken as string) : ''

            const queryParams = new URLSearchParams()

            if (customerEmail) queryParams.set('email', customerEmail)
            if (accessToken) queryParams.set('accessToken', accessToken)

            const fulfillment =
              typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('fulfillment') || '{}')
                : {}


            const purchaseTypeForOrder = getPurchaseTypeForConfirmationFromCart(cart?.items)


            if (customerEmail) queryParams.set('email', customerEmail)
            if (accessToken) queryParams.set('accessToken', accessToken)
            if (purchaseTypeForOrder) queryParams.set('purchaseType', purchaseTypeForOrder)

            if (fulfillment?.shippingCharge !== undefined) {
              queryParams.set('shippingCharge', String(fulfillment.shippingCharge))
            }

            if (fulfillment?.estimatedTax !== undefined) {
              queryParams.set('estimatedTax', String(fulfillment.estimatedTax))
            }

            const thankYouHref = `/thank-you/${confirmResult.orderID}${queryParams.toString() ? `?${queryParams.toString()}` : ''
              }`

            try {
              const purchaseTypeForOrder = getPurchaseTypeForConfirmationFromCart(cart?.items)
              const purchaseTypesForOrder = getPurchaseTypesForCartItems(cart?.items)


              console.log("fulfillment")
              console.log(fulfillment)
              console.log(purchaseTypeForOrder)
              console.log(purchaseTypesForOrder)

              fetch('/api/order-extra-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderID: confirmResult.orderID,
                  fulfillment,
                  purchaseType: purchaseTypeForOrder,
                  purchaseTypes: purchaseTypesForOrder,
                }),
              })

              clearCart()
              router.push(thankYouHref)

            } catch (e) {
              console.error(e)
            }

          }
        }

        if (stripeError?.message) {
          setError(stripeError.message)
          setIsLoading(false)
          setProcessingPayment(false)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.'
        setError(`Error while submitting payment: ${msg}`)
        setIsLoading(false)
        setProcessingPayment(false)
      }
    },
    [
      stripe,
      elements,
      customerEmail,
      billingAddress,
      confirmOrder,
      cart?.items,
      clearCart,
      router,
      setProcessingPayment,
      setPaymentElementComplete,
    ],
  )

  return (
    <form id="checkout-payment-form" onSubmit={handleSubmit}>
      {error && <Message error={error} />}

      <PaymentElement onChange={(event) => setPaymentElementComplete(event.complete)} />

      {isLoading && (
        <p className="mt-4 font-sans text-sm uppercase tracking-[0.16em] text-stone-400">
          Processing payment...
        </p>
      )}
    </form>
  )
}