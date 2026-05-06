'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getPurchaseUnitPriceInCents } from '@/utilities/purchasePricing'

type PurchaseType = 'one_time' | 'weekly' | 'monthly'

type Props = {
  product: Product
  className?: string
  purchaseType?: PurchaseType
}

type BranchStock = {
  stockQuantity: number
  stockStatus: string
}

export function AddToCart({
  product,
  className,
  purchaseType = 'one_time',
}: Props) {
  const { addItem, cart, isLoading } = useCart()
  const searchParams = useSearchParams()

  const [branchStock, setBranchStock] = useState<BranchStock>({
    stockQuantity: 0,
    stockStatus: 'outofstock',
  })

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }

        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const cartItemKey = useMemo(() => {
    return selectedVariant?.id
      ? `purchaseType:${product.id}:${selectedVariant.id}`
      : `purchaseType:${product.id}`
  }, [product.id, selectedVariant?.id])

  useEffect(() => {
    const loadBranchStock = async () => {
      try {
        const fulfillment = JSON.parse(localStorage.getItem('fulfillment') || '{}')
        const branchId = fulfillment.branch

        if (!branchId) {
          setBranchStock({
            stockQuantity: 0,
            stockStatus: 'outofstock',
          })
          return
        }

        const res = await fetch(
          `/api/multi-location/product-price?product=${product.id}&branch=${branchId}`,
        )

        if (!res.ok) {
          setBranchStock({
            stockQuantity: 0,
            stockStatus: 'outofstock',
          })
          return
        }

        const data = await res.json()

        setBranchStock({
          stockQuantity: data.stockQuantity || 0,
          stockStatus: data.stockStatus || 'outofstock',
        })
      } catch {
        setBranchStock({
          stockQuantity: 0,
          stockStatus: 'outofstock',
        })
      }
    }

    if (product.enableVariants && !selectedVariant) {
      setBranchStock({
        stockQuantity: 0,
        stockStatus: 'outofstock',
      })
      return
    }

    loadBranchStock()
  }, [product.id, product.enableVariants, selectedVariant])

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      // if (branchStock.stockStatus === 'outofstock' || branchStock.stockQuantity <= 0) {
      //   toast.error('This item is out of stock at the selected branch.')
      //   return
      // }

      const selectedPrice = getPurchaseUnitPriceInCents(
        product,
        selectedVariant,
        purchaseType,
      )

      localStorage.setItem(cartItemKey, purchaseType)
      localStorage.setItem(`${cartItemKey}:price`, String(selectedPrice))


      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
        price: selectedPrice,
      }).then(() => {
        toast.success(
          purchaseType === 'one_time'
            ? 'Item added to cart.'
            : `${purchaseType === 'weekly' ? 'Weekly' : 'Monthly'} subscription added to cart.`,
        )
      })
    },
    [
      addItem,
      product.id,
      selectedVariant?.id,
      branchStock.stockQuantity,
      branchStock.stockStatus,
      purchaseType,
      cartItemKey,
    ],
  )

  const disabled = useMemo<boolean>(() => {

    // if (product.enableVariants && !selectedVariant) {
    //   console.log("1");
    //   return true
    // }

    // if (branchStock.stockStatus === 'outofstock' || branchStock.stockQuantity <= 0) {
    //   console.log("2");
    //   return true
    // }

    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product

      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          console.log("3");
          return variantID === selectedVariant?.id
        }

        return true
      }

      return false
    })

    if (existingItem) {
      console.log("4");
      return existingItem.quantity >= branchStock.stockQuantity
    }

    return false
  }, [
    selectedVariant,
    cart?.items,
    product.id,
    product.enableVariants,
    branchStock.stockQuantity,
    branchStock.stockStatus,
  ])

  return (
    <Button
      aria-label="Add to cart"
      variant="outline"
      // className={className}
      className="w-full rounded-none border border-[#c8a24d] bg-[#c8a24d] px-5 py-6 text-center text-[11px] font-extrabold uppercase tracking-[0.28em] text-black transition-all duration-300 ease-out hover:bg-transparent hover:text-[#c8a24d] hover:scale-[1.03] active:scale-[0.97]"
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
      style={{ borderRadius: '0px' }}
    >
      {isLoading ? 'Adding...' : product.primaryCTA?.label || 'Add To Cart'}
    </Button>
  )
}