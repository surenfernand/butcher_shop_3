/**
 * Curated Unsplash placeholders by UI context (host is in `next.config` `images.remotePatterns`).
 */
export type ImageFallbackContext =
  | 'product'
  | 'hero'
  | 'brandLogo'
  | 'location'
  | 'editorial'
  | 'cuts'

const FALLBACKS: Record<ImageFallbackContext, string> = {
  /** Shop grids, cart, checkout, PDP — prime steak product */
  product:
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&q=80&auto=format&fit=crop',
  /** Full-width heroes and promo panels */
  hero:
    'https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80&auto=format&fit=crop',
  /** Header/footer when no CMS logo — knives / craft (reads well small) */
  brandLogo:
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80&auto=format&fit=crop',
  /** Visit / location / map-style block */
  location:
    'https://images.unsplash.com/photo-1555396273-367ea4eb66db?w=1400&q=80&auto=format&fit=crop',
  /** About, info sections, generic rich-text media */
  editorial:
    'https://images.unsplash.com/photo-1504674900240-798256f706ae?w=1200&q=80&auto=format&fit=crop',
  /** Featured cuts / category cards */
  cuts:
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80&auto=format&fit=crop',
}

export function fallbackUrlFor(context: ImageFallbackContext = 'product'): string {
  return FALLBACKS[context]
}

/** Default CMS/media fallback — same as `product` */
export const FALLBACK_IMAGE_URL = FALLBACKS.product

/** Use for `next/image` when CMS `url` is null/empty. Preserves non-empty relative URLs. */
export function resolveImageSrc(
  url: string | null | undefined,
  context: ImageFallbackContext = 'product',
): string {
  if (url != null && typeof url === 'string') {
    const t = url.trim()
    if (t) return url
  }
  return fallbackUrlFor(context)
}
