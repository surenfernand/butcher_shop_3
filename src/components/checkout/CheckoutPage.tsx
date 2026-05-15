'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { FALLBACK_IMAGE_URL } from '@/constants/fallbackImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { cssVariables } from '@/cssVariables'
import { Address } from '@/payload-types'
import {
  getPurchaseUnitPriceInCents,
  type PurchaseType,
} from '@/utilities/purchasePricing'
import { cn } from '@/utilities/cn'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { DayPicker, getDefaultClassNames, type ClassNames } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { toast } from 'sonner'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

const formatMoney = (amount = 0) => `$${(amount / 100).toFixed(2)}`

const getPurchaseTypeLabel = (purchaseType: PurchaseType) => {
  if (purchaseType === 'weekly') return 'Weekly subscription'
  if (purchaseType === 'monthly') return 'Monthly subscription'
  return 'One-time purchase'
}

const getPurchaseTypeKey = (productID: string, variantID?: string) => {
  return variantID ? `purchaseType:${productID}:${variantID}` : `purchaseType:${productID}`
}

const getPurchasePrice = (
  product: any,
  variant: any,
  purchaseType: PurchaseType,
) => getPurchaseUnitPriceInCents(product, variant, purchaseType)

/** react-day-picker v9 uses `rdp-day_button` / `rdp-selected`; legacy `.rdp-day` overrides never applied. */
function checkoutDayPickerClassNames(): ClassNames {
  const base = getDefaultClassNames()
  return {
    ...base,
    root: cn(base.root, 'w-full'),
    caption_label: cn(base.caption_label, 'font-black uppercase tracking-[0.12em] text-[#e53935]'),
    weekday: cn(base.weekday, 'text-[0.7rem] font-semibold uppercase text-neutral-600'),
    day_button: cn(
      base.day_button,
      'rounded-md font-medium text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900',
    ),
    selected: cn(
      base.selected,
      'rounded-md bg-[#e53935] [&_.rdp-day_button]:bg-transparent [&_.rdp-day_button]:text-white [&_.rdp-day_button]:hover:bg-transparent [&_.rdp-day_button]:hover:text-white',
    ),
    disabled: cn(base.disabled, 'opacity-45'),
    outside: cn(base.outside, '[&_.rdp-day_button]:text-neutral-500/55'),
    today: cn(
      base.today,
      'font-semibold text-[#e53935] [&_.rdp-day_button]:ring-1 [&_.rdp-day_button]:ring-[#e53935]/45 [&_.rdp-day_button]:ring-offset-1',
    ),
    button_previous: cn(base.button_previous, 'rounded-md text-[#e53935] hover:bg-neutral-100'),
    button_next: cn(base.button_next, 'rounded-md text-[#e53935] hover:bg-neutral-100'),
    chevron: cn(base.chevron, 'fill-[#e53935]'),
    nav: cn(base.nav, 'flex items-center gap-1'),
  }
}

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const [error, setError] = useState<null | string>(null)
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [paymentElementComplete, setPaymentElementComplete] = useState(false)
  // src/components/checkout/CheckoutPage.tsx

  const [allowedWeeklyDays, setAllowedWeeklyDays] = useState<string[]>([])

  const cartIsEmpty = !cart || !cart.items || !cart.items.length
  const subtotal =
    cart?.items?.reduce((total, item) => {
      if (typeof item.product !== 'object' || !item.product) return total

      const product = item.product
      const quantity = item.quantity || 0

      const variant =
        item.variant && typeof item.variant === 'object' ? item.variant : undefined

      const variantID = variant ? String(variant.id) : undefined

      const purchaseType =
        typeof window !== 'undefined'
          ? ((localStorage.getItem(
            getPurchaseTypeKey(String(product.id), variantID),
          ) || 'one_time') as PurchaseType)
          : 'one_time'

      const price = getPurchasePrice(product, variant, purchaseType)

      return total + price * quantity
    }, 0) || 0

  const [shippingCharge, setShippingCharge] = useState(0)
  const [taxRate, setTaxRate] = useState(0)

  const shipping = fulfillmentMethod === 'delivery' ? shippingCharge : 0
  const estimatedTax = subtotal * taxRate
  const displayTotal = subtotal + shipping + estimatedTax

  const [showCalendar, setShowCalendar] = useState(false)

  const [postalCode, setPostalCode] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([])
  const [timeSlot, setTimeSlot] = useState('')
  const [branchError, setBranchError] = useState('')
  const [promoCode, setPromoCode] = useState('')

  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [branches, setBranches] = useState<any[]>([])

  const [isLoadingBranches, setIsLoadingBranches] = useState(false)

  useEffect(() => {
    if (isDateModalOpen) {
      fetch('/api/multi-location/branches')
        .then((res) => res.json())
        .then((data) => {
          const loadedBranches = data.branches || []

          setBranches(loadedBranches)

          if (loadedBranches.length && !selectedBranch) {
            const firstBranch = loadedBranches[0]

            setSelectedBranch(firstBranch)

            if (fulfillmentMethod === 'pickup') {
              void loadSchedules(firstBranch.id, 'pickup')
            }
          }
        })
    }
  }, [isDateModalOpen, selectedBranch, fulfillmentMethod])

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (value: string) =>
    new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)


  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  /** Logged-in users never fill the guest email field; payment initiate still needs this when `req.user` is unset (Better Auth). */
  const customerEmailForPayment =
    (user?.email && String(user.email).trim()) || email.trim() || ''

  const hasPaymentForm = Boolean(paymentData?.['clientSecret'])



  const normalizePostalCode = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '')

  const resetFulfillmentSelection = () => {
    setAvailableSchedules([])
    setTimeSlot('')
    setBranchError('')
    setShowCalendar(false)
    setShippingCharge(0)
    setSelectedDate(undefined)
    setAllowedWeeklyDays([])


  }

  const loadSchedules = async (
    branchId: string,
    type: 'pickup' | 'delivery',
    postalValue = postalCode,
  ) => {
    setBranchError('')
    setAvailableSchedules([])
    setAllowedWeeklyDays([])
    setTimeSlot('')

    if (!branchId) {
      setBranchError('Please select a branch first.')
      return
    }

    const cleanedPostalCode = normalizePostalCode(postalValue)

    if (type === 'delivery' && !cleanedPostalCode) {
      setBranchError('Please enter your postal code.')
      return
    }

    // inside fetchFulfillmentOptions(), before let url = ...

    const productIds =
      cart?.items
        ?.map((item) => (typeof item.product === 'object' ? item.product?.id : item.product))
        .filter(Boolean)
        .map(String) || []

    let url = `/api/multi-location/fulfillment-options?branch=${branchId}&serviceType=${type}`

    if (productIds.length) {
      url += `&products=${encodeURIComponent(productIds.join(','))}`
    }

    if (type === 'delivery') {
      url += `&postalCode=${encodeURIComponent(cleanedPostalCode)}`
    }

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        setBranchError(data?.error || 'Could not load fulfillment options.')
        return
      }

      const schedules = data.schedules || []

      if (!schedules.length) {
        setBranchError(
          type === 'delivery'
            ? 'Sorry, this branch does not deliver to that postal code.'
            : 'Sorry, pickup is not available for this branch.',
        )
        return
      }

      setPostalCode(cleanedPostalCode)
      setAvailableSchedules(schedules)

      const nextAllowedWeeklyDays = (
        data.allowedWeeklyDays || schedules.flatMap((schedule: any) => schedule.weeklyDays || [])
      ).map((day: any) => String(day).toLowerCase())

      if (!nextAllowedWeeklyDays.length) {
        setBranchError('Sorry, there are no common available dates for all products in your cart.')
        return
      }

      setAllowedWeeklyDays(nextAllowedWeeklyDays)

      const firstSchedule = schedules[0]

      setShippingCharge(
        type === 'delivery'
          ? Number(firstSchedule?.shippingCharge || 0) * 100
          : 0,
      )

    } catch {
      setBranchError('Something went wrong while loading fulfillment options.')
    }
  }



  const dayMap: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }



  const isDateAllowed = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selected = new Date(date)
    selected.setHours(0, 0, 0, 0)

    if (selected <= today) return false
    if (!selectedBranch) return false
    if (!allowedWeeklyDays.length) return false

    const dayName = dayMap[date.getDay()]

    return allowedWeeklyDays.includes(dayName)
  }


  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses, shippingAddress])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {


        const fulfillment =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('fulfillment') || '{}')
            : {}

        const purchaseTypes =
          typeof window !== 'undefined'
            ? cart?.items?.map((item) => {
              const productID =
                typeof item.product === 'object' ? item.product.id : item.product

              const variantID = item.variant
                ? typeof item.variant === 'object'
                  ? item.variant.id
                  : item.variant
                : undefined

              return {
                product: productID,
                variant: variantID,
                purchaseType:
                  localStorage.getItem(
                    variantID
                      ? `purchaseType:${productID}:${variantID}`
                      : `purchaseType:${productID}`
                  ) || 'one_time',
              }
            })
            : []

        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(customerEmailForPayment ? { customerEmail: customerEmailForPayment } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
            fulfillment,
            purchaseTypes, // ✅ ADD THIS LINE
          }
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [
      billingAddress,
      billingAddressSameAsShipping,
      cart?.items,
      customerEmailForPayment,
      initiatePayment,
      shippingAddress,
    ],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="min-h-[60vh] bg-neutral-50 py-20 text-center text-neutral-900">
        <p className="mb-8 font-sans text-lg tracking-[0.2em] text-[#e53935]">Processing your payment...</p>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="min-h-[60vh] bg-neutral-50 px-6 py-20 text-center text-neutral-900">
        <p className="mb-4 font-sans text-xl uppercase tracking-[0.2em] text-[#e53935]">Your cart is empty.</p>
        <Link className="font-semibold text-[#e53935] underline underline-offset-4 hover:text-[#c62828]" href="/shop">
          Continue shopping?
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-800 bg-[#1a1a1a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link className="text-xs uppercase tracking-[0.24em] text-white/75 transition hover:text-white" href="/shop">
            Continue Shopping
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Secure Checkout</p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/70">
            <Lock className="h-3.5 w-3.5 text-[#e53935]" />
            SSL Protected
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <section className="space-y-12">
        

          <section>
            <div className="mb-8 flex items-center gap-4 border-b border-neutral-200 pb-6">
              <span className="font-sans text-2xl font-black text-[#e53935]">01</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">Customer & Shipping</h1>
            </div>

            <div className="space-y-8">
              {!user && (
                <div className="rounded-xl border border-neutral-200 bg-white text-neutral-900 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                  <p className="mb-4 font-sans text-sm uppercase tracking-[0.18em] text-neutral-600">
                    Checkout as guest
                  </p>
                  <FormItem>
                    <Label className="font-sans text-xs uppercase tracking-[0.18em] text-neutral-600" htmlFor="email">
                      Email Address
                    </Label>
                    <Input
                      className="mt-2 h-14 border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-[#e53935]/35"
                      disabled={!emailEditable}
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    />
                  </FormItem>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <Button
                      className="bg-[#e53935] px-8 font-sans font-black uppercase tracking-[0.18em] text-white hover:bg-[#c62828]"
                      disabled={!email || !emailEditable}
                      onClick={(e) => {
                        e.preventDefault()
                        setEmailEditable(false)
                      }}
                    >
                      Continue as guest
                    </Button>
                    <Link className="text-sm text-neutral-600 underline underline-offset-4" href="/login">
                      Log in instead
                    </Link>
                  </div>
                </div>
              )}



              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                  Signed in as
                </p>
                {user && (

                  <div className="rounded-xl border border-neutral-200 bg-white text-neutral-900 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                    {/* <p className="font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">Signed in as</p> */}
                    <p className="mt-2 text-neutral-900">{user.email}</p>
                    <Link className="mt-2 inline-block text-sm text-[#e53935] underline underline-offset-4" href="/logout">
                      Not you? Log out
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                  Billing Address
                </p>
                {billingAddress ? (
                  <div className="rounded-xl border border-neutral-200 bg-white text-neutral-900 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                    <AddressItem
                      actions={
                        <Button
                          className="border-neutral-200 text-[#e53935] hover:bg-neutral-100 hover:text-neutral-900"
                          variant="outline"
                          disabled={Boolean(paymentData)}
                          onClick={(e) => {
                            e.preventDefault()
                            setBillingAddress(undefined)
                          }}
                        >
                          Remove
                        </Button>
                      }
                      address={billingAddress}
                    />
                  </div>
                ) : user ? (
                  <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} />
                ) : (
                  <CreateAddressModal
                    disabled={!email || Boolean(emailEditable)}
                    callback={(address) => {
                      setBillingAddress(address)
                    }}
                    skipSubmission={true}
                  />
                )}
              </div>

              <div className="flex items-center gap-4">
                <Checkbox
                  id="shippingTheSameAsBilling"
                  checked={billingAddressSameAsShipping}
                  disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
                  onCheckedChange={(state) => {
                    setBillingAddressSameAsShipping(state as boolean)
                  }}
                />
                <Label className="font-sans text-xs uppercase tracking-[0.18em] text-neutral-600" htmlFor="shippingTheSameAsBilling">
                  Shipping is the same as billing
                </Label>
              </div>

              {!billingAddressSameAsShipping && (
                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-neutral-600">
                    Shipping Address
                  </p>
                  {shippingAddress ? (
                    <div className="rounded-xl border border-neutral-200 bg-white text-neutral-900 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <AddressItem
                        actions={
                          <Button
                            className="border-neutral-200 text-[#e53935] hover:bg-neutral-100 hover:text-neutral-900"
                            variant="outline"
                            disabled={Boolean(paymentData)}
                            onClick={(e) => {
                              e.preventDefault()
                              setShippingAddress(undefined)
                            }}
                          >
                            Remove
                          </Button>
                        }
                        address={shippingAddress}
                      />
                    </div>
                  ) : user ? (
                    <CheckoutAddresses
                      heading="Shipping address"
                      description="Please select a shipping address."
                      setAddress={setShippingAddress}
                    />
                  ) : (
                    <CreateAddressModal
                      callback={(address) => {
                        setShippingAddress(address)
                      }}
                      disabled={!email || Boolean(emailEditable)}
                      skipSubmission={true}
                    />
                  )}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-8 flex items-center gap-4 border-b border-neutral-200 pb-6">
              <span className="font-sans text-2xl font-black text-[#e53935]">02</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">Payment Details</h2>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white text-neutral-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
              {!paymentData && (
                <Button
                  className="bg-[#e53935] px-10 py-6 font-sans font-black uppercase tracking-[0.18em] text-white hover:bg-[#c62828] disabled:opacity-40"
                  disabled={!canGoToPayment}
                  onClick={(e) => {
                    e.preventDefault()
                    void initiatePaymentIntent('stripe')
                  }}
                >
                  Show Payment method
                </Button>
              )}

              {!paymentData?.['clientSecret'] && error && (
                <div className="mt-8">
                  <Message error={error} />
                  <Button
                    className="mt-5 bg-[#e53935] font-sans font-black uppercase tracking-[0.18em] text-white hover:bg-[#c62828]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.refresh()
                    }}
                    variant="default"
                  >
                    Try again
                  </Button>
                </div>
              )}

              <Suspense fallback={<React.Fragment />}>
                {/* @ts-ignore */}
                {paymentData && paymentData?.['clientSecret'] && (
                  <div>
                    <p className="mb-6 font-sans text-sm uppercase tracking-[0.18em] text-neutral-600">
                      Secure card payment
                    </p>
                    {error && <p className="mb-4 text-red-400">{`Error: ${error}`}</p>}
                    <Elements
                      options={{
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            borderRadius: '8px',
                            colorPrimary: '#e53935',
                            gridColumnSpacing: '20px',
                            gridRowSpacing: '20px',
                            colorBackground: '#ffffff',
                            colorDanger: cssVariables.colors.error500,
                            colorDangerText: cssVariables.colors.error500,
                            colorIcon: '#e53935',
                            colorText: '#171717',
                            colorTextPlaceholder: '#737373',
                            fontFamily: 'GeistSans, sans-serif',
                            fontSizeBase: '16px',
                            fontWeightBold: '700',
                            fontWeightNormal: '500',
                            spacingUnit: '4px',
                          },
                        },
                        clientSecret: paymentData['clientSecret'] as string,
                      }}
                      stripe={stripe}
                    >
                      <div className="flex flex-col gap-8">
                        <CheckoutForm
                          customerEmail={customerEmailForPayment}
                          billingAddress={billingAddress}
                          setProcessingPayment={setProcessingPayment}
                          setPaymentElementComplete={setPaymentElementComplete}
                        />

                      </div>
                    </Elements>
                  </div>
                )}
              </Suspense>
            </div>
          </section>
        </section>

        <aside className="h-fit rounded-xl border border-neutral-200 bg-white text-neutral-900 p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)] lg:sticky lg:top-8">
          <h2 className="font-sans text-sm uppercase tracking-wider text-[#e53935]">Order Summary</h2>
          <div className="my-6 h-px bg-border" />

          <div className="space-y-6">
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object' && item.product) {
                const {
                  product,
                  product: { meta, title, gallery },
                  quantity,
                  variant,
                } = item

                if (!quantity) return null

                let image = product.productGallery?.[0]?.image || product.meta?.image
                let price = product?.priceInUSD

                const isVariant = Boolean(variant) && typeof variant === 'object'

                const variantID =
                  variant && typeof variant === 'object' ? String(variant.id) : undefined

                const purchaseType =
                  typeof window !== 'undefined'
                    ? ((localStorage.getItem(
                      getPurchaseTypeKey(String(product.id), variantID),
                    ) || 'one_time') as PurchaseType)
                    : 'one_time'

                if (isVariant) {
                  price = variant?.priceInUSD

                  const imageVariant = product.gallery?.find(
                    (galleryItem: NonNullable<typeof product.gallery>[number]) => {
                      if (!galleryItem.variantOption) return false

                      const variantOptionID =
                        typeof galleryItem.variantOption === 'object'
                          ? galleryItem.variantOption.id
                          : galleryItem.variantOption

                      const hasMatch = variant?.options?.some(
                        (option: NonNullable<typeof variant.options>[number]) => {
                          if (typeof option === 'object') return option.id === variantOptionID
                          return option === variantOptionID
                        },
                      )

                      return hasMatch
                    },
                  )

                  if (imageVariant && typeof imageVariant.image !== 'string') {
                    image = imageVariant.image
                  }
                }

                price = getPurchasePrice(
                  product,
                  isVariant ? variant : undefined,
                  purchaseType,
                )

                return (
                  <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-lg border border-neutral-200 bg-white text-neutral-900 p-3" key={index}>
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                      <Media
                        className=""
                        fill
                        imgClassName="object-cover"
                        resource={image && typeof image !== 'string' ? image : undefined}
                        src={image && typeof image !== 'string' ? undefined : FALLBACK_IMAGE_URL}
                      />
                    </div>
                    <div>
                      <p className="font-sans text-base font-black uppercase text-neutral-900">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="mt-1 font-sans text-xs italic text-neutral-600">
                          {variant.options
                            ?.map((option: NonNullable<typeof variant.options>[number]) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-600">Qty {quantity}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#e53935]">
                        {getPurchaseTypeLabel(purchaseType)}
                      </p>
                    </div>
                    {typeof price === 'number' && (
                      <Price className="font-sans font-black text-[#e53935]" amount={price} />
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="my-8 h-px bg-border" />
 

          <div className="space-y-5 font-sans text-sm uppercase tracking-wide">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="text-neutral-900">{formatMoney(subtotal)}</span>
            </div>
            {fulfillmentMethod === 'delivery' && (
              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span className="text-neutral-900">
                  {shipping ? formatMoney(shipping) : '0.00'}
                </span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Tax</span>
              <span className="text-neutral-900">{formatMoney(estimatedTax)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-base text-[#e53935]">
              <span>Total</span>
              <span>{formatMoney(displayTotal)}</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-xs font-black uppercase tracking-[0.24em] text-[#e53935] text-left">
                Date: {selectedDate ? formatDisplayDate(formatDateForInput(selectedDate)) : 'Not selected'}
              </p>

              <button
                onClick={() => setIsDateModalOpen(true)}
                className="ml-4 rounded-md border border-neutral-200 px-3 py-1 text-xs font-sans uppercase tracking-[0.14em] text-[#e53935] hover:bg-neutral-100 hover:text-neutral-900"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 rounded-md border border-neutral-200">
              <button
                type="button"
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.24em] ${fulfillmentMethod === 'pickup'
                  ? 'bg-[#e53935] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                  }`}
                onClick={() => {
                  setFulfillmentMethod('pickup')
                  resetFulfillmentSelection()
                  if (selectedBranch) {
                    void loadSchedules(selectedBranch.id, 'pickup')
                  }
                }}
              >
                Pickup
              </button>
              <button
                type="button"
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.24em] ${fulfillmentMethod === 'delivery'
                  ? 'bg-[#e53935] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                  }`}
                onClick={() => {
                  setFulfillmentMethod('delivery')
                  resetFulfillmentSelection()
                }}
              >
                Delivery
              </button>
            </div>
          </div>

          <Button
            className="mt-8 w-full bg-[#e53935] py-6 font-sans font-black uppercase tracking-[0.2em] text-white hover:bg-[#c62828] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={
              !canGoToPayment ||
              isProcessingPayment ||
              (hasPaymentForm && !paymentElementComplete) ||
              !selectedDate
            }
            type={hasPaymentForm ? 'submit' : 'button'}
            form={hasPaymentForm ? 'checkout-payment-form' : undefined}
            onClick={
              hasPaymentForm
                ? undefined
                : (e) => {
                  e.preventDefault()
                  void initiatePaymentIntent('stripe')
                }
            }
          >
            {isProcessingPayment ? 'Processing...' : 'Complete Purchase'}
          </Button>

          <div className="mt-6 space-y-3 rounded-lg border border-neutral-200 bg-white text-neutral-900 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-600">
              <ShieldCheck className="h-4 w-4 text-[#e53935]" />
              Secure payment by Stripe
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-600">
              <ShieldCheck className="h-4 w-4 text-[#e53935]" />
              Encrypted billing details
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-neutral-600">
            By placing your order, you agree to our terms and refund policy.
          </p>


        </aside>
      </main>

      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[modalFadeIn_180ms_ease-out]">
          <div className="w-[420px] rounded-xl border border-neutral-200 bg-white text-neutral-900 p-6 shadow-xl animate-[modalScaleIn_240ms_cubic-bezier(0.16,1,0.3,1)]">

            {/* Header */}
            <p className="mb-2 text-center font-sans text-xs uppercase tracking-[0.3em] text-[#e53935]">
              The Butcher’s Craft
            </p>

            <h2 className="mb-6 text-center font-sans text-xl font-black uppercase tracking-wide text-neutral-900">
              Order Type
            </h2>

            {/* Delivery / Pickup */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e53935]/12 active:translate-y-0 ${fulfillmentMethod === 'delivery'
                  ? 'bg-[#e53935] text-white'
                  : 'bg-neutral-100 text-neutral-600'
                  }`}
                onClick={() => {
                  setFulfillmentMethod('delivery')
                  resetFulfillmentSelection()
                }}
              >
                Delivery
              </button>

              <button
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e53935]/12 active:translate-y-0 ${fulfillmentMethod === 'pickup'
                  ? 'bg-[#e53935] text-white'
                  : 'bg-neutral-100 text-neutral-600'
                  }`}
                onClick={() => {
                  setFulfillmentMethod('pickup')
                  resetFulfillmentSelection()
                  if (selectedBranch) {
                    void loadSchedules(selectedBranch.id, 'pickup')
                  }
                }}
              >
                Pickup
              </button>
            </div>

            {/* Address */}
            {isLoadingBranches ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e53935] border-t-transparent" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-600">
                  Loading locations...
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch)
                      resetFulfillmentSelection()
                      if (fulfillmentMethod === 'pickup') {
                        void loadSchedules(branch.id, 'pickup')
                      }
                    }}
                    className={`w-full rounded-md border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md active:translate-y-0 animate-[itemSlideIn_220ms_ease-out_both] ${selectedBranch?.id === branch.id
                      ? 'border-[#e53935]'
                      : 'border-neutral-200'
                      }`}
                  >
                    <p className="text-[#e53935]">{branch.name}</p>
                    <p className="text-xs text-neutral-600">{branch.address}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedBranch && fulfillmentMethod === 'delivery' && (
              <div className="mb-6">
                <label className="mb-2 mt-3 block text-xs uppercase tracking-[0.2em] text-neutral-600">
                  Postal Code
                </label>

                <div className="flex gap-2">
                  <Input
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value)
                      setAvailableSchedules([])
                      setTimeSlot('')
                      setShowCalendar(false)
                      setBranchError('')
                    }}
                    placeholder="Example: J7K 0Z6"
                    className="border-neutral-300 bg-white text-neutral-900"
                  />

                  <button
                    type="button"
                    onClick={() => void loadSchedules(selectedBranch.id, 'delivery')}
                    className="bg-[#e53935] px-4 font-sans text-xs font-black uppercase tracking-[0.16em] text-white"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}

            {branchError && (
              <p className="mb-6 text-xs text-red-600">{branchError}</p>
            )}

            {/* Date Picker */}
            <div className="relative mb-6">
              <label className="mb-2 mt-3 block text-xs uppercase tracking-[0.2em] text-neutral-600">
                Select Date
              </label>

              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                disabled={!selectedBranch || !availableSchedules.length}
                className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-left transition-all duration-200 hover:border-[#e53935] disabled:cursor-not-allowed disabled:opacity-40 ${selectedDate ? 'text-neutral-900' : 'text-neutral-600'}`}
              >
                {selectedDate
                  ? formatDisplayDate(formatDateForInput(selectedDate))
                  : 'Choose a delivery date'}
              </button>

              {showCalendar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  {/* backdrop (click to close) */}
                  <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setShowCalendar(false)}
                  />

                  {/* calendar popup */}
                  <div className="relative z-[101] rounded-md border border-neutral-200 bg-white p-4 text-neutral-900 shadow-2xl">
                    <DayPicker
                      mode="single"
                      classNames={checkoutDayPickerClassNames()}
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date && isDateAllowed(date)) {
                          setSelectedDate(date)
                          setShowCalendar(false)
                        }
                      }}
                      disabled={(date) => !isDateAllowed(date)}
                      showOutsideDays
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              className="w-full rounded-md bg-[#e53935] py-3 font-sans font-black uppercase tracking-[0.2em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c62828] hover:shadow-lg hover:shadow-[#e53935]/25 active:translate-y-0"
              onClick={() => {
                if (!selectedBranch) {
                  setBranchError('Please select a branch first.')
                  return
                }

                if (!availableSchedules.length) {
                  setBranchError(
                    fulfillmentMethod === 'delivery'
                      ? 'Please check your postal code first.'
                      : 'Pickup is not available for this branch.',
                  )
                  return
                }

                if (!selectedDate || !isDateAllowed(selectedDate)) {
                  setBranchError('Please select an available date.')
                  return
                }

                localStorage.setItem(
                  'fulfillment',
                  JSON.stringify({
                    branch: selectedBranch.id,
                    branchName: selectedBranch.name,
                    serviceType: fulfillmentMethod,
                    date: formatDateForInput(selectedDate),
                    timeSlot,
                    postalCode: fulfillmentMethod === 'delivery' ? normalizePostalCode(postalCode) : '',
                    schedule: availableSchedules[0]?.id,
                    shippingCharge: shipping,
                    taxRate,
                    estimatedTax,
                  }),
                )

                setIsDateModalOpen(false)
              }}
            >
              Confirm and Proceed
            </button>

            <button
              className="mt-4 w-full text-sm uppercase tracking-[0.2em] text-neutral-600"
              onClick={() => setIsDateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalScaleIn {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`}</style>
    </div>


  )


}
