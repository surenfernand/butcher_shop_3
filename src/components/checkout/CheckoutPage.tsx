'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
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
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { DayPicker } from 'react-day-picker'
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
            ...(email ? { customerEmail: email } : {}),
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
      email,
      initiatePayment,
      shippingAddress,
    ],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="min-h-[60vh] bg-[#f8f6f2] py-20 text-center text-[#2f2a24]">
        <p className="mb-8 font-sans text-lg tracking-[0.2em] text-[#8f7442]">Processing your payment...</p>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="min-h-[60vh] bg-[#f8f6f2] px-6 py-20 text-center text-[#2f2a24]">
        <p className="mb-4 font-sans text-xl uppercase tracking-[0.2em] text-[#8f7442]">Your cart is empty.</p>
        <Link className="underline underline-offset-4" href="/shop">
          Continue shopping?
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-[#2f2a24]">
      <header className="border-b border-[#e8dfd0] bg-[#fafaf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link className="text-xs uppercase tracking-[0.24em] text-[#7a6b52]" href="/shop">
            Continue Shopping
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3f372b]">Secure Checkout</p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#7a6b52]">
            <Lock className="h-3.5 w-3.5" />
            SSL Protected
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <section className="space-y-12">
          <div className="rounded-xl border border-[#e8dfd0] bg-[#fffdfa] p-6 shadow-[0_8px_26px_rgba(40,33,20,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8f7a58]">Checkout Progress</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.18em]">
              <div className="rounded-md border border-[#d9c6a2] bg-[#f6ecdb] px-3 py-2 text-center text-[#5a4a2d]">
                Information
              </div>
              <div className="rounded-md border border-[#e9dfce] bg-[#fdfbf7] px-3 py-2 text-center text-[#7a6b52]">
                Shipping
              </div>
              <div className="rounded-md border border-[#e9dfce] bg-[#fdfbf7] px-3 py-2 text-center text-[#7a6b52]">
                Payment
              </div>
            </div>
          </div>

          <section>
            <div className="mb-8 flex items-center gap-4 border-b border-[#e5dac8] pb-6">
              <span className="font-sans text-2xl font-black text-[#b18c53]">01</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#312b24]">Customer & Shipping</h1>
            </div>

            <div className="space-y-8">
              {!user && (
                <div className="rounded-xl border border-[#eadfce] bg-white p-6 shadow-[0_8px_24px_rgba(44,34,20,0.04)]">
                  <p className="mb-4 font-sans text-sm uppercase tracking-[0.18em] text-[#7a6b52]">
                    Checkout as guest
                  </p>
                  <FormItem>
                    <Label className="font-sans text-xs uppercase tracking-[0.18em] text-[#7a6b52]" htmlFor="email">
                      Email Address
                    </Label>
                    <Input
                      className="mt-2 h-14 border-[#ddcfb4] bg-[#fffcf7] px-4 text-[#2f2a24] placeholder:text-[#9a8b72] focus-visible:ring-[#c2a56c]"
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
                      className="bg-[#c5a46a] px-8 font-sans font-black uppercase tracking-[0.18em] text-[#17130f] hover:bg-[#b99658]"
                      disabled={!email || !emailEditable}
                      onClick={(e) => {
                        e.preventDefault()
                        setEmailEditable(false)
                      }}
                    >
                      Continue as guest
                    </Button>
                    <Link className="text-sm text-[#7a6b52] underline underline-offset-4" href="/login">
                      Log in instead
                    </Link>
                  </div>
                </div>
              )}



              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-[#7a6b52]">
                  Signed in as
                </p>
                {user && (

                  <div className="rounded-xl border border-[#eadfce] bg-white p-6 shadow-[0_8px_24px_rgba(44,34,20,0.04)]">
                    {/* <p className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">Signed in as</p> */}
                    <p className="mt-2 text-[#2f2a24]">{user.email}</p>
                    <Link className="mt-2 inline-block text-sm text-[#9b7a43] underline underline-offset-4" href="/logout">
                      Not you? Log out
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-[#7a6b52]">
                  Billing Address
                </p>
                {billingAddress ? (
                  <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_8px_24px_rgba(44,34,20,0.04)]">
                    <AddressItem
                      actions={
                        <Button
                          className="border-[#d9c7a7] text-[#8f7140] hover:bg-[#efdfc2] hover:text-[#2f2a24]"
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
                <Label className="font-sans text-xs uppercase tracking-[0.18em] text-[#7a6b52]" htmlFor="shippingTheSameAsBilling">
                  Shipping is the same as billing
                </Label>
              </div>

              {!billingAddressSameAsShipping && (
                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-[#7a6b52]">
                    Shipping Address
                  </p>
                  {shippingAddress ? (
                    <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_8px_24px_rgba(44,34,20,0.04)]">
                      <AddressItem
                        actions={
                          <Button
                            className="border-[#d9c7a7] text-[#8f7140] hover:bg-[#efdfc2] hover:text-[#2f2a24]"
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
            <div className="mb-8 flex items-center gap-4 border-b border-[#e5dac8] pb-6">
              <span className="font-sans text-2xl font-black text-[#b18c53]">02</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#312b24]">Payment Details</h2>
            </div>

            <div className="rounded-xl border border-[#eadfce] bg-white p-6 shadow-[0_10px_30px_rgba(44,34,20,0.05)]">
              {!paymentData && (
                <Button
                  className="bg-[#c5a46a] px-10 py-6 font-sans font-black uppercase tracking-[0.18em] text-[#17130f] hover:bg-[#b99658] disabled:opacity-40"
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
                    className="mt-5 bg-[#c5a46a] font-sans font-black uppercase tracking-[0.18em] text-[#17130f] hover:bg-[#b99658]"
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
                    <p className="mb-6 font-sans text-sm uppercase tracking-[0.18em] text-[#7a6b52]">
                      Secure card payment
                    </p>
                    {error && <p className="mb-4 text-red-400">{`Error: ${error}`}</p>}
                    <Elements
                      options={{
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            borderRadius: '8px',
                            colorPrimary: '#c5a46a',
                            gridColumnSpacing: '20px',
                            gridRowSpacing: '20px',
                            colorBackground: '#fffdf8',
                            colorDanger: cssVariables.colors.error500,
                            colorDangerText: cssVariables.colors.error500,
                            colorIcon: '#7a6b52',
                            colorText: '#2f2a24',
                            colorTextPlaceholder: '#9a8b72',
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
                          customerEmail={email}
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

        <aside className="h-fit rounded-xl border border-[#e5dac8] bg-[#fffdfa] p-8 shadow-[0_18px_35px_rgba(44,34,20,0.07)] lg:sticky lg:top-8">
          <h2 className="font-sans text-sm uppercase tracking-wider text-[#8f7442]">Order Summary</h2>
          <div className="my-6 h-px bg-[#e9dbc2]" />

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
                  <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-lg border border-[#efe5d7] bg-white p-3" key={index}>
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-[#eadfcf] bg-[#f7f4ee]">
                      {image && typeof image !== 'string' && (
                        <Media className="" fill imgClassName="object-cover" resource={image} />
                      )}

                    </div>
                    <div>
                      <p className="font-sans text-base font-black uppercase text-[#2f2a24]">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="mt-1 font-sans text-xs italic text-[#7a6b52]">
                          {variant.options
                            ?.map((option: NonNullable<typeof variant.options>[number]) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#7a6b52]">Qty {quantity}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9b7a43]">
                        {getPurchaseTypeLabel(purchaseType)}
                      </p>
                    </div>
                    {typeof price === 'number' && (
                      <Price className="font-sans font-black text-[#8f7442]" amount={price} />
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="my-8 h-px bg-[#e9dbc2]" />

          <div className="mb-7 rounded-lg border border-[#eadfcf] bg-white p-4">
            <Label className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#7a6b52]" htmlFor="promoCode">
              Discount or Gift Card
            </Label>
            <div className="flex gap-2">
              <Input
                id="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="border-[#ddcfb4] bg-[#fffcf7] text-[#2f2a24] placeholder:text-[#9a8b72]"
              />
              <Button type="button" variant="outline" className="border-[#d9c7a7] bg-[#faf5ea] text-[#715e3f] hover:bg-[#efe2cb]">
                Apply
              </Button>
            </div>
          </div>

          <div className="space-y-5 font-sans text-sm uppercase tracking-wide">
            <div className="flex justify-between text-[#7a6b52]">
              <span>Subtotal</span>
              <span className="text-[#2f2a24]">{formatMoney(subtotal)}</span>
            </div>
            {fulfillmentMethod === 'delivery' && (
              <div className="flex justify-between text-[#7a6b52]">
                <span>Delivery</span>
                <span className="text-[#2f2a24]">
                  {shipping ? formatMoney(shipping) : '0.00'}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#7a6b52]">
              <span>Estimated Tax</span>
              <span className="text-[#2f2a24]">{formatMoney(estimatedTax)}</span>
            </div>
            <div className="h-px bg-[#e9dbc2]" />
            <div className="flex justify-between text-base text-[#8f7442]">
              <span>Total</span>
              <span>{formatMoney(displayTotal)}</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-xs font-black uppercase tracking-[0.24em] text-[#8f7442] text-left">
                Date: {selectedDate ? formatDisplayDate(formatDateForInput(selectedDate)) : 'Not selected'}
              </p>

              <button
                onClick={() => setIsDateModalOpen(true)}
                className="ml-4 rounded-md border border-[#d7c19a] px-3 py-1 text-xs font-sans uppercase tracking-[0.14em] text-[#8f7442] hover:bg-[#efe2cb] hover:text-[#2f2a24]"
              >
                Change
              </button>
            </div >

            <div className="grid grid-cols-2 rounded-md border border-[#e4d6bf]">
              <button
                type="button"
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.24em] ${fulfillmentMethod === 'pickup'
                  ? 'bg-[#d6be91] text-[#17130f]'
                  : 'bg-[#f7f2e8] text-[#7a6b52] hover:text-[#2f2a24]'
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
                  ? 'bg-[#d6be91] text-[#17130f]'
                  : 'bg-[#f7f2e8] text-[#7a6b52] hover:text-[#2f2a24]'
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
            className="mt-8 w-full bg-[#c5a46a] py-6 font-sans font-black uppercase tracking-[0.2em] text-[#17130f] hover:bg-[#b99658] disabled:cursor-not-allowed disabled:opacity-40"
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

          <div className="mt-6 space-y-3 rounded-lg border border-[#eadfcf] bg-white p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#7a6b52]">
              <ShieldCheck className="h-4 w-4 text-[#8f7442]" />
              Secure payment by Stripe
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#7a6b52]">
              <ShieldCheck className="h-4 w-4 text-[#8f7442]" />
              Encrypted billing details
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-[#8b7c62]">
            By placing your order, you agree to our terms and refund policy.
          </p>


        </aside>
      </main>

      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1912]/60 animate-[modalFadeIn_180ms_ease-out]">
          <div className="w-[420px] rounded-xl border border-[#e4d8c3] bg-[#fffdfa] p-6 text-[#2f2a24] shadow-xl animate-[modalScaleIn_240ms_cubic-bezier(0.16,1,0.3,1)]">

            {/* Header */}
            <p className="mb-2 text-center font-sans text-xs uppercase tracking-[0.3em] text-[#8f7442]">
              The Butcher’s Craft
            </p>

            <h2 className="mb-6 text-center font-sans text-xl font-black uppercase tracking-wide text-[#2f2a24]">
              Order Type
            </h2>

            {/* Delivery / Pickup */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/10 active:translate-y-0 ${fulfillmentMethod === 'delivery'
                  ? 'bg-[#d6be91] text-[#17130f]'
                  : 'bg-[#f7f2e8] text-[#7a6b52]'
                  }`}
                onClick={() => {
                  setFulfillmentMethod('delivery')
                  resetFulfillmentSelection()
                }}
              >
                Delivery
              </button>

              <button
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/10 active:translate-y-0 ${fulfillmentMethod === 'pickup'
                  ? 'bg-[#d6be91] text-[#17130f]'
                  : 'bg-[#f7f2e8] text-[#7a6b52]'
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
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c5a46a] border-t-transparent" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#7a6b52]">
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
                    className={`w-full rounded-md border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f5ecdb] hover:shadow-md active:translate-y-0 animate-[itemSlideIn_220ms_ease-out_both] ${selectedBranch?.id === branch.id
                      ? 'border-[#c5a46a]'
                      : 'border-[#e5d8c0]'
                      }`}
                  >
                    <p className="text-[#8f7442]">{branch.name}</p>
                    <p className="text-xs text-[#7a6b52]">{branch.address}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedBranch && fulfillmentMethod === 'delivery' && (
              <div className="mb-6">
                <label className="mb-2 mt-3 block text-xs uppercase tracking-[0.2em] text-[#7a6b52]">
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
                    className="border-[#ddcfb4] bg-[#fffcf7] text-[#2f2a24]"
                  />

                  <button
                    type="button"
                    onClick={() => void loadSchedules(selectedBranch.id, 'delivery')}
                    className="bg-[#c5a46a] px-4 font-sans text-xs font-black uppercase tracking-[0.16em] text-[#17130f]"
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
              <label className="mb-2 mt-3 block text-xs uppercase tracking-[0.2em] text-[#7a6b52]">
                Select Date
              </label>

              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                disabled={!selectedBranch || !availableSchedules.length}
                className="w-full rounded-md border border-[#ddcfb4] bg-[#fffcf7] px-3 py-3 text-left text-[#7a6b52] transition-all duration-200 hover:border-[#c5a46a] hover:text-[#2f2a24] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {selectedDate
                  ? formatDisplayDate(formatDateForInput(selectedDate))
                  : 'Choose a delivery date'}
              </button>

              {showCalendar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  {/* backdrop (click to close) */}
                  <div
                    className="absolute inset-0 bg-[#1e1912]/55"
                    onClick={() => setShowCalendar(false)}
                  />

                  {/* calendar popup */}
                  <div className="relative z-[101] rounded-md border border-[#e4d8c3] bg-[#fffdfa] p-4 text-[#2f2a24] shadow-2xl">
                    <DayPicker
                      mode="single"
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
              className="w-full rounded-md bg-[#c5a46a] py-3 font-sans font-black uppercase tracking-[0.2em] text-[#17130f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b99658] hover:shadow-lg hover:shadow-[#c5a46a]/20 active:translate-y-0"
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
              className="mt-4 w-full text-sm uppercase tracking-[0.2em] text-[#7a6b52]"
              onClick={() => setIsDateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
  .rdp {
    --rdp-accent-color: #c5a46a;
    --rdp-background-color: #fffcf7;
    --rdp-outline: 2px solid #c5a46a;
    margin: 0;
    color: #2f2a24;
  }

  .rdp-caption_label {
    color: #8f7442;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .rdp-head_cell {
    color: #7a6b52;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .rdp-day {
    color: #2f2a24;
    border-radius: 0;
  }

  .rdp-day:hover:not([disabled]) {
    background: #f2e8d6;
    color: #5d4d31;
  }

  .rdp-day_selected,
  .rdp-day_selected:hover {
    background: #c5a46a;
    color: #17130f;
    font-weight: 900;
  }

  .rdp-day_disabled {
    color: #a6977d;
    opacity: 0.45;
  }

  .rdp-day_outside {
    color: #b6aa95;
  }

  .rdp-nav_button {
    color: #8f7442;
  }

  .rdp-nav_button:hover {
    background: #f2e8d6;
  }
`}</style>

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
