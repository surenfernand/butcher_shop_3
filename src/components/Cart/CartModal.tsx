'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Product } from '@/payload-types'
import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'
import { resolveImageSrc } from '@/constants/fallbackImage'
import { CartTimerModal } from './CartTimerModal'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

const brandRed = '#e31e24'

export function CartModal() {
  const { cart, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const [purchaseTypeVersion, setPurchaseTypeVersion] = useState(0)

  const [settings, setSettings] = useState<any>(null)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [showTimerModal, setShowTimerModal] = useState(false)

  const hasAcknowledgedWarningRef = useRef(false)
  const isResettingTimerRef = useRef(false)

  type PurchaseType = 'one_time' | 'weekly' | 'monthly'

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return 0
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  const getPurchaseTypeKey = (productID: string, variantID?: string) => {
    return variantID ? `purchaseType:${productID}:${variantID}` : `purchaseType:${productID}`
  }

  const getPurchaseTypeLabel = (purchaseType: PurchaseType) => {
    if (purchaseType === 'weekly') return 'Weekly subscription'
    if (purchaseType === 'monthly') return 'Monthly subscription'
    return 'One-time purchase'
  }

  const getPurchasePrice = (product: any, variant: any, purchaseType: PurchaseType) => {
    const variantID = variant?.id ? String(variant.id) : undefined
    const key = getPurchaseTypeKey(String(product.id), variantID)

    if (typeof window !== 'undefined') {
      const storedPrice = localStorage.getItem(`${key}:price`)

      if (storedPrice) {
        const parsed = Number(storedPrice)
        if (!Number.isNaN(parsed)) return parsed
      }
    }

    return getPurchaseUnitPriceInCents(product, variant, purchaseType)
  }

  const adjustedSubtotal = useMemo(() => {
    if (!cart?.items?.length) return 0

    return cart.items.reduce((total, item) => {
      const product = item.product
      const variant = item.variant

      if (typeof product !== 'object' || !product) return total

      const isVariant = Boolean(variant) && typeof variant === 'object'
      const variantID = isVariant ? String(variant.id) : undefined

      const purchaseType =
        typeof window !== 'undefined'
          ? ((localStorage.getItem(getPurchaseTypeKey(String(product.id), variantID)) ||
            'one_time') as PurchaseType)
          : 'one_time'

      const price = getPurchasePrice(product, isVariant ? variant : undefined, purchaseType)

      return total + price * (item.quantity || 1)
    }, 0)
  }, [cart?.items, purchaseTypeVersion])

  useEffect(() => {
    if (!isOpen) return
    setPurchaseTypeVersion((version) => version + 1)
  }, [isOpen, cart?.items])

  useEffect(() => {
    fetch('/api/globals/cart-settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data)
      })
      .catch((err) => {
        console.error('Failed to load cart timer settings', err)
        setSettings(null)
      })
  }, [])

  useEffect(() => {
    if (!settings?.enabled || totalQuantity === 0) {
      hasAcknowledgedWarningRef.current = false
      isResettingTimerRef.current = false
      setSecondsLeft(null)
      setShowTimerModal(false)
      return
    }

    const timerSeconds = Number(settings?.timerSeconds ?? 0)

    if (!timerSeconds || timerSeconds <= 0) return

    isResettingTimerRef.current = true
    hasAcknowledgedWarningRef.current = false

    setSecondsLeft(timerSeconds)
    setShowTimerModal(false)

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current === null) return timerSeconds
        return Math.max(current - 1, 0)
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [totalQuantity, settings?.enabled, settings?.timerSeconds])

  useEffect(() => {
    if (!settings?.enabled || totalQuantity === 0 || secondsLeft === null) return

    if (secondsLeft === 0) {
      setShowTimerModal(false)
      setSecondsLeft(null)
      hasAcknowledgedWarningRef.current = false
      isResettingTimerRef.current = false

      void clearCart()
      return
    }

    if (isResettingTimerRef.current) {
      isResettingTimerRef.current = false
      return
    }

    const warningSeconds = Number(settings?.warningSeconds ?? 0)

    if (
      warningSeconds > 0 &&
      secondsLeft > 0 &&
      secondsLeft <= warningSeconds &&
      !hasAcknowledgedWarningRef.current
    ) {
      setShowTimerModal(true)
    }
  }, [secondsLeft, settings?.enabled, settings?.warningSeconds, totalQuantity, clearCart])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton
          quantity={totalQuantity}
          className="relative !text-neutral-900 hover:!text-[#e31e24] [&_.lucide]:!text-current [&>span]:!min-h-[18px] [&>span]:!min-w-[18px] [&>span]:!border-0 [&>span]:!bg-[#e31e24] [&>span]:!text-[10px] [&>span]:!font-semibold [&>span]:!text-white"
        />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-[410px] border-neutral-800 bg-neutral-950 p-0 text-neutral-50 [&>button]:right-7 [&>button]:top-8 [&>button]:rounded [&>button]:border [&>button]:border-[#e31e24] [&>button]:p-2 [&>button]:text-[#e31e24] [&>button]:opacity-100 [&>button]:ring-offset-neutral-950 [&>button]:hover:bg-[#e31e24]/15 [&>button]:focus:ring-[#e31e24]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-neutral-800 px-7 py-8 pr-16 text-left">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle
                  className="text-left font-serif text-[2.1rem] font-bold uppercase tracking-tight"
                  style={{ color: brandRed }}
                >
                  Cart
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          {!cart || cart?.items?.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingCart className="h-14 w-14" style={{ color: brandRed }} strokeWidth={1.25} />
              <p className="text-xl font-bold uppercase tracking-wide text-white">Your cart is empty</p>
              <p className="text-sm font-medium" style={{ color: brandRed }}>
                Add Items to view in Cart
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-6">
                  {cart?.items?.map((item, i) => {
                    const product = item.product
                    const variant = item.variant

                    if (typeof product !== 'object' || !item || !product || !product.slug) {
                      return <React.Fragment key={i} />
                    }

                    const metaImage =
                      product.meta?.image && typeof product.meta?.image === 'object'
                        ? product.meta.image
                        : undefined

                    const firstGalleryImage =
                      typeof product.productGallery?.[0]?.image === 'object'
                        ? product.productGallery?.[0]?.image
                        : undefined

                    let image = firstGalleryImage || metaImage
                    let price = product.priceInUSD

                    const isVariant = Boolean(variant) && typeof variant === 'object'
                    const variantID = isVariant ? String(variant.id) : undefined

                    const purchaseType =
                      typeof window !== 'undefined'
                        ? ((localStorage.getItem(
                          getPurchaseTypeKey(String(product.id), variantID),
                        ) || 'one_time') as PurchaseType)
                        : 'one_time'

                    if (isVariant) {
                      price = variant?.priceInUSD

                      const imageVariant = product.productGallery?.find(
                        (galleryItem: NonNullable<Product['productGallery']>[number]) => {
                          if (!galleryItem.image) return false

                          const variantOptionID =
                            typeof galleryItem.image === 'object'
                              ? galleryItem.id
                              : galleryItem.image

                          return variant?.options?.some(
                            (option: NonNullable<typeof variant.options>[number]) => {
                              if (typeof option === 'object') return option.id === variantOptionID
                              return option === variantOptionID
                            },
                          )
                        },
                      )

                      if (imageVariant && typeof imageVariant.image === 'object') {
                        image = imageVariant.image
                      }
                    }

                    price = getPurchasePrice(product, isVariant ? variant : undefined, purchaseType)

                    const variantText = isVariant
                      ? variant?.options
                        ?.map((option: NonNullable<typeof variant.options>[number]) => {
                          if (typeof option === 'object') return option.label
                          return null
                        })
                        .filter(Boolean)
                        .join(' ')
                      : ''

                    return (
                      <li key={i} className="flex items-start gap-4">
                        <Link
                          href={`/products/${(item.product as Product)?.slug}`}
                          className="block shrink-0"
                        >
                          <div className="relative h-[104px] w-[104px] overflow-hidden border border-border bg-muted">
                            <Image
                              alt={image?.alt || product?.title || ''}
                              className="h-full w-full object-cover"
                              height={120}
                              src={resolveImageSrc(image?.url)}
                              width={120}
                            />
                          </div>
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${(item.product as Product)?.slug}`}
                                className="block"
                              >
                                <h3 className="line-clamp-2 text-[1.05rem] font-extrabold uppercase leading-tight tracking-[0.02em] text-white">
                                  {product?.title}
                                </h3>
                              </Link>

                              {(variantText || item.quantity) && (
                                <p className="mt-2 text-[0.78rem] uppercase tracking-[0.08em] text-neutral-400">
                                  {variantText ? `Weight: ${variantText}` : ''}
                                </p>
                              )}

                              <p
                                className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em]"
                                style={{ color: brandRed }}
                              >
                                {getPurchaseTypeLabel(purchaseType)}
                              </p>
                            </div>

                            <DeleteItemButton item={item} />
                          </div>

                          <div className="mt-5 flex items-end justify-between gap-3">
                            <div className="flex h-8 items-center overflow-hidden rounded-md border border-neutral-700 bg-neutral-900">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                className="h-8 w-8 border-r border-neutral-700 text-neutral-400 hover:bg-[#e31e24]/10 hover:text-[#e31e24]"
                              />

                              <span className="flex h-8 w-9 items-center justify-center text-sm font-medium text-white">
                                {item.quantity}
                              </span>

                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                className="h-8 w-8 border-l border-neutral-700 text-neutral-400 hover:bg-[#e31e24]/10 hover:text-[#e31e24]"
                              />
                            </div>

                            {typeof price === 'number' && (
                              <Price
                                amount={price * (item.quantity || 1)}
                                className="text-right text-[1.05rem] font-bold text-[#e31e24]"
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="border-t border-neutral-800 bg-neutral-900 px-7 py-6">
                <div className="space-y-3 text-sm uppercase tracking-[0.14em]">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Subtotal</span>
                    {typeof cart?.subtotal === 'number' && (
                      <Price amount={adjustedSubtotal} className="text-base font-semibold text-white" />
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-4">
                    <span className="text-lg font-extrabold tracking-[0.14em] text-white">Total</span>
                    {typeof cart?.subtotal === 'number' && (
                      <Price amount={adjustedSubtotal} className="text-3xl font-black text-[#e31e24]" />
                    )}
                  </div>
                </div>

                <div className="mt-7">
                  <Link
                    href="/checkout"
                    className="flex h-14 w-full items-center justify-center bg-[#e31e24] px-5 text-center text-[11px] font-extrabold uppercase tracking-[0.28em] text-white shadow-sm transition hover:brightness-110"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      <CartTimerModal
        open={showTimerModal}
        secondsLeft={secondsLeft || 0}
        title={settings?.modalTitle || ''}
        message={settings?.modalMessage || ''}
        confirmLabel={settings?.confirmButtonLabel || ''}
        extendLabel={settings?.extendButtonLabel || ''}
        footerText={settings?.footerText}
        onConfirm={() => {
          hasAcknowledgedWarningRef.current = true
          setShowTimerModal(false)
        }}
        onExtend={() => {
          const extendSeconds = Number(settings?.extendSeconds ?? 0)

          if (!extendSeconds || extendSeconds <= 0) {
            setShowTimerModal(false)
            return
          }

          hasAcknowledgedWarningRef.current = false
          setSecondsLeft((current) => (current ?? 0) + extendSeconds)
          setShowTimerModal(false)
        }}
      />
    </Sheet>
  )
}