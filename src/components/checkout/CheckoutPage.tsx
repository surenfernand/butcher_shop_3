'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
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
  const { theme } = useTheme()
  const isDark = theme !== 'light'
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

      console.log("res")
      console.log(res)

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
      <div className="min-h-[60vh] bg-background py-20 text-center text-foreground">
        <p className="mb-8 font-sans text-lg tracking-[0.2em] text-amber-400">Processing your payment...</p>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="min-h-[60vh] bg-background px-6 py-20 text-center text-foreground">
        <p className="mb-4 font-sans text-xl uppercase tracking-[0.2em] text-amber-400">Your cart is empty.</p>
        <Link className="underline underline-offset-4" href="/shop">
          Continue shopping?
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-5 min-h-screen bg-background text-foreground">


      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <section className="space-y-12">
          <p className="font-sans text-sm uppercase tracking-wider text-amber-400">Checkout</p>

          <section>
            <div className="mb-8 flex items-center gap-4 border-b  pb-6">
              <span className="font-sans text-2xl font-black text-amber-400">01</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">Shipping Information</h1>
            </div>

            <div className="space-y-8">
              {!user && (
                <div className="border border-border bg-card p-6">
                  <p className="mb-4 font-sans text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Checkout as guest
                  </p>
                  <FormItem>
                    <Label className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground" htmlFor="email">
                      Email Address
                    </Label>
                    <Input
                      className="mt-2 h-14 rounded-none border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500"
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
                      className="rounded-none bg-amber-400 px-8 font-sans font-black uppercase tracking-[0.18em] text-black hover:bg-amber-300"
                      disabled={!email || !emailEditable}
                      onClick={(e) => {
                        e.preventDefault()
                        setEmailEditable(false)
                      }}
                    >
                      Continue as guest
                    </Button>
                    <Link className="text-sm text-muted-foreground underline underline-offset-4" href="/login">
                      Log in instead
                    </Link>
                  </div>
                </div>
              )}



              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Signed in as
                </p>
                {user && (

                  <div className="border border-border bg-card p-6">
                    {/* <p className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">Signed in as</p> */}
                    <p className="mt-2 text-foreground">{user.email}</p>
                    <Link className="mt-2 inline-block text-sm text-amber-400 underline underline-offset-4" href="/logout">
                      Not you? Log out
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Billing Address
                </p>
                {billingAddress ? (
                  <div className="border border-border bg-card p-5">
                    <AddressItem
                      actions={
                        <Button
                          className="rounded-none  text-amber-400 hover:bg-amber-400 hover:text-black"
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
                <Label className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground" htmlFor="shippingTheSameAsBilling">
                  Shipping is the same as billing
                </Label>
              </div>

              {!billingAddressSameAsShipping && (
                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Shipping Address
                  </p>
                  {shippingAddress ? (
                    <div className="border border-border bg-card p-5">
                      <AddressItem
                        actions={
                          <Button
                            className="rounded-none  text-amber-400 hover:bg-amber-400 hover:text-black"
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
            <div className="mb-8 flex items-center gap-4 border-b  pb-6">
              <span className="font-sans text-2xl font-black text-amber-400">02</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Payment Details</h2>
            </div>

            <div className="border border-border bg-card p-6">
              {!paymentData && (
                <Button
                  className="rounded-none bg-amber-400 px-10 py-6 font-sans font-black uppercase tracking-[0.18em] text-black hover:bg-amber-300 disabled:opacity-40"
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
                    className="mt-5 rounded-none bg-amber-400 font-sans font-black uppercase tracking-[0.18em] text-black hover:bg-amber-300"
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
                    <p className="mb-6 font-sans text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      Secure card payment
                    </p>
                    {error && <p className="mb-4 text-red-400">{`Error: ${error}`}</p>}
                    <Elements
                      options={{
                        appearance: isDark
                          ? {
                              theme: 'night',
                              variables: {
                                borderRadius: '0px',
                                colorPrimary: '#d8ad45',
                                gridColumnSpacing: '20px',
                                gridRowSpacing: '20px',
                                colorBackground: '#000000',
                                colorDanger: cssVariables.colors.error500,
                                colorDangerText: cssVariables.colors.error500,
                                colorIcon: '#a8a29e',
                                colorText: '#f5f5f4',
                                colorTextPlaceholder: '#64748b',
                                fontFamily: 'GeistSans, sans-serif',
                                fontSizeBase: '16px',
                                fontWeightBold: '700',
                                fontWeightNormal: '500',
                                spacingUnit: '4px',
                              },
                            }
                          : {
                              theme: 'stripe',
                              variables: {
                                borderRadius: '0px',
                                colorPrimary: '#d8ad45',
                                gridColumnSpacing: '20px',
                                gridRowSpacing: '20px',
                                colorBackground: '#ffffff',
                                colorDanger: cssVariables.colors.error500,
                                colorDangerText: cssVariables.colors.error500,
                                colorIcon: '#57534e',
                                colorText: '#0c0a09',
                                colorTextPlaceholder: '#78716c',
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

        <aside className="h-fit border border-border bg-card p-8 lg:sticky lg:top-8">
          <h2 className="font-sans text-sm uppercase tracking-wider text-amber-400">Order Summary</h2>
          <div className="my-6 h-px bg-amber-500/30" />

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
                  <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4" key={index}>
                    <div className="relative h-20 w-20 border border-border bg-muted">
                      {image && typeof image !== 'string' && (
                        <Media className="" fill imgClassName="object-cover" resource={image} />
                      )}

                    </div>
                    <div>
                      <p className="font-sans text-base font-black uppercase text-foreground">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="mt-1 font-sans text-xs italic text-muted-foreground">
                          {variant.options
                            ?.map((option: NonNullable<typeof variant.options>[number]) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Qty {quantity}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-400">
                        {getPurchaseTypeLabel(purchaseType)}
                      </p>
                    </div>
                    {typeof price === 'number' && (
                      <Price className="font-sans font-black text-amber-400" amount={price} />
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="my-8 h-px bg-amber-500/30" />

          <div className="space-y-5 font-sans text-sm uppercase tracking-wide">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatMoney(subtotal)}</span>
            </div>
            {fulfillmentMethod === 'delivery' && (
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-foreground">
                  {shipping ? formatMoney(shipping) : '0.00'}
                </span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax</span>
              <span className="text-foreground">{formatMoney(estimatedTax)}</span>
            </div>
            <div className="h-px bg-amber-500/30" />
            <div className="flex justify-between text-base text-amber-400">
              <span>Total</span>
              <span>{formatMoney(displayTotal)}</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-amber-400 text-left">
                Date: {selectedDate ? formatDisplayDate(formatDateForInput(selectedDate)) : 'Not selected'}
              </p>

              <button
                onClick={() => setIsDateModalOpen(true)}
                className="ml-4 border border-amber-400 px-3 py-1 text-xs font-sans uppercase tracking-[0.2em] text-amber-400 hover:bg-amber-400 hover:text-black"
              >
                Change
              </button>
            </div >

            <div className="grid grid-cols-2 border-2 border-border">
              <button
                type="button"
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.24em] ${fulfillmentMethod === 'pickup'
                  ? 'bg-amber-400 text-black'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
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
                  ? 'bg-amber-400 text-black'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
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
            className="mt-8 w-full rounded-none bg-amber-400 py-6 font-sans font-black uppercase tracking-[0.2em] text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
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


        </aside>
      </main>

      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-[modalFadeIn_180ms_ease-out]">
          <div className="w-[420px] border border-border bg-card p-6 text-card-foreground shadow-xl animate-[modalScaleIn_240ms_cubic-bezier(0.16,1,0.3,1)]">

            {/* Header */}
            <p className="mb-2 text-center font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
              The Butcher’s Craft
            </p>

            <h2 className="mb-6 text-center font-sans text-xl font-black uppercase tracking-wide text-foreground">
              Order Type
            </h2>

            {/* Delivery / Pickup */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                className={`py-3 font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/10 active:translate-y-0 ${fulfillmentMethod === 'delivery'
                  ? 'bg-amber-400 text-black'
                  : 'bg-muted text-muted-foreground'
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
                  ? 'bg-amber-400 text-black'
                  : 'bg-muted text-muted-foreground'
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
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
                    className={`w-full border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400/10 hover:shadow-md active:translate-y-0 animate-[itemSlideIn_220ms_ease-out_both] ${selectedBranch?.id === branch.id
                      ? 'border-amber-400'
                      : 'border-amber-500/30'
                      }`}
                  >
                    <p className="text-amber-400">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">{branch.address}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedBranch && fulfillmentMethod === 'delivery' && (
              <div className="mb-6">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">
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
                    className="rounded-none border-amber-500/30 bg-background text-foreground"
                  />

                  <button
                    type="button"
                    onClick={() => void loadSchedules(selectedBranch.id, 'delivery')}
                    className="bg-amber-400 px-4 font-sans text-xs font-black uppercase tracking-[0.16em] text-black"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}

            {branchError && (
              <p className="mb-6 text-xs text-red-400">{branchError}</p>
            )}

            {/* Date Picker */}
            <div className="relative mb-6">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">
                Select Date
              </label>

              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                disabled={!selectedBranch || !availableSchedules.length}
                className="w-full border border-amber-500/30 bg-background px-3 py-3 text-left text-muted-foreground transition-all duration-200 hover:border-amber-400 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                {selectedDate
                  ? formatDisplayDate(formatDateForInput(selectedDate))
                  : 'Choose a delivery date'}
              </button>

              {showCalendar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  {/* backdrop (click to close) */}
                  <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setShowCalendar(false)}
                  />

                  {/* calendar popup */}
                  <div className="relative z-[101] rounded-md border border-border bg-card p-4 text-card-foreground shadow-2xl">
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
              className="w-full bg-amber-400 py-3 font-sans font-black uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 active:translate-y-0"
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
              className="mt-4 w-full text-sm uppercase tracking-[0.2em] text-muted-foreground"
              onClick={() => setIsDateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
  .rdp {
    --rdp-accent-color: #fbbf24;
    --rdp-background-color: #1c1917;
    --rdp-outline: 2px solid #fbbf24;
    margin: 0;
    color: #f5f5f4;
  }

  .rdp-caption_label {
    color: #fbbf24;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .rdp-head_cell {
    color: #a8a29e;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .rdp-day {
    color: #f5f5f4;
    border-radius: 0;
  }

  .rdp-day:hover:not([disabled]) {
    background: #292524;
    color: #fbbf24;
  }

  .rdp-day_selected,
  .rdp-day_selected:hover {
    background: #fbbf24;
    color: #000;
    font-weight: 900;
  }

  .rdp-day_disabled {
    color: #57534e;
    opacity: 0.45;
  }

  .rdp-day_outside {
    color: #44403c;
  }

  .rdp-nav_button {
    color: #fbbf24;
  }

  .rdp-nav_button:hover {
    background: #292524;
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
