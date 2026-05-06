import type { Media, Product, Variant } from '@/payload-types'

/** Ecommerce plugin adds `gallery` / `meta`; generated types may omit them. */
type ProductWithGalleryMeta = Product & {
  meta?: { image?: number | Media | null } | null
  gallery?:
    | {
        image?: number | Media | null
        variantOption?: number | { id: number } | null
      }[]
    | null
}

/**
 * Resolves a display image for order lines. Matches checkout sidebar logic:
 * variant-specific gallery row when possible, then custom productGallery, meta, default gallery.
 */
export function getOrderLineProductImage(
  product: Product,
  variant?: Variant | null,
): Media | undefined {
  const p = product as ProductWithGalleryMeta

  if (variant && Array.isArray(p.gallery)) {
    const matched = p.gallery.find((row) => {
      if (!row.variantOption) return false
      const voId =
        typeof row.variantOption === 'object' ? row.variantOption.id : row.variantOption

      return variant.options?.some((opt) => {
        const oid = typeof opt === 'object' ? opt.id : opt
        return oid === voId
      })
    })

    const img = matched?.image
    if (img && typeof img === 'object' && img !== null && 'url' in img) {
      return img as Media
    }
  }

  const pg = product.productGallery?.[0]?.image
  if (pg && typeof pg === 'object' && pg !== null && 'url' in pg) {
    return pg as Media
  }

  const metaImg = p.meta?.image
  if (metaImg && typeof metaImg === 'object' && metaImg !== null && 'url' in metaImg) {
    return metaImg as Media
  }

  const firstGallery = p.gallery?.[0]?.image
  if (
    firstGallery &&
    typeof firstGallery === 'object' &&
    firstGallery !== null &&
    'url' in firstGallery
  ) {
    return firstGallery as Media
  }

  return undefined
}
