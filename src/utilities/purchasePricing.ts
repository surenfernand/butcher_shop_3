import type { Product, Variant } from '@/payload-types'

export type PurchaseType = 'one_time' | 'weekly' | 'monthly'

export const parsePriceOverride = (value?: string | null): number | undefined => {
  if (!value) return undefined

  const numericValue = Number(value.replace(/[^0-9.]/g, ''))

  if (Number.isNaN(numericValue)) return undefined

  return Math.round(numericValue * 100)
}

type ProductPricingFields = Pick<Product, 'priceInUSD' | 'purchaseFrequencies'>
type VariantPricingFields = Pick<Variant, 'priceInUSD'>

/**
 * Unit price in cents for cart/checkout/order display, matching add-to-cart logic.
 */
export const getPurchaseUnitPriceInCents = (
  product: ProductPricingFields | null | undefined,
  variant: VariantPricingFields | null | undefined,
  purchaseType: PurchaseType,
): number => {
  let price = variant?.priceInUSD ?? product?.priceInUSD ?? 0

  if (purchaseType === 'monthly') {
    price =
      parsePriceOverride(product?.purchaseFrequencies?.monthly?.priceOverride) || price
  }

  if (purchaseType === 'one_time') {
    price =
      parsePriceOverride(product?.purchaseFrequencies?.oneTime?.priceOverride) || price
  }

  return price
}
