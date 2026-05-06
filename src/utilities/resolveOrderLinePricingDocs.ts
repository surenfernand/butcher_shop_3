import type { BasePayload } from 'payload'

import type { Order, Product, Variant } from '@/payload-types'

const productId = (ref: number | Product | null | undefined): number | undefined => {
  if (typeof ref === 'number') return ref
  if (ref && typeof ref === 'object' && 'id' in ref && ref.id != null) return ref.id
  return undefined
}

const variantId = (ref: number | Variant | null | undefined): number | undefined => {
  if (typeof ref === 'number') return ref
  if (ref && typeof ref === 'object' && 'id' in ref && ref.id != null) return ref.id
  return undefined
}

export type OrderLineForPricing = NonNullable<Order['items']>[number]

export type ResolvedOrderLine = {
  item: OrderLineForPricing
  product: Product | undefined
  variant: Variant | undefined
}

/**
 * Loads full product + variant docs for pricing in 2 queries (not 2×N findByID).
 * Uses depth so nested media (galleries, meta image) resolves for order summaries.
 */
export const batchResolveOrderLinesForPricing = async (
  payload: BasePayload,
  lines: OrderLineForPricing[] | null | undefined,
): Promise<ResolvedOrderLine[]> => {
  if (!lines?.length) return []

  const productIds = new Set<number>()
  const variantIds = new Set<number>()

  for (const item of lines) {
    const pid = productId(item.product)
    if (pid != null) productIds.add(pid)
    const vid = variantId(item.variant)
    if (vid != null) variantIds.add(vid)
  }

  const [productsResult, variantsResult] = await Promise.all([
    productIds.size
      ? payload.find({
          collection: 'products',
          where: { id: { in: [...productIds] } },
          limit: productIds.size,
          pagination: false,
          // Populate uploads (productGallery, gallery, meta.image) for order UI thumbnails.
          depth: 2,
        })
      : Promise.resolve({ docs: [] as Product[] }),
    variantIds.size
      ? payload.find({
          collection: 'variants',
          where: { id: { in: [...variantIds] } },
          limit: variantIds.size,
          pagination: false,
          depth: 2,
        })
      : Promise.resolve({ docs: [] as Variant[] }),
  ])

  const productById = new Map<number, Product>()
  for (const doc of productsResult.docs as Product[]) {
    productById.set(doc.id, doc)
  }

  const variantById = new Map<number, Variant>()
  for (const doc of variantsResult.docs as Variant[]) {
    variantById.set(doc.id, doc)
  }

  return lines.map((item) => {
    const embeddedProduct = item.product && typeof item.product === 'object' ? item.product : undefined
    const embeddedVariant = item.variant && typeof item.variant === 'object' ? item.variant : undefined

    const pid = productId(item.product)
    const vid = variantId(item.variant)

    const product =
      pid != null ? (productById.get(pid) ?? embeddedProduct) : embeddedProduct
    const variant =
      vid != null ? (variantById.get(vid) ?? embeddedVariant) : embeddedVariant

    return { item, product, variant }
  })
}
