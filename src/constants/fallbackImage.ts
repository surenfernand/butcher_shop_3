import { normalizeCmsMediaUrl, shouldBypassMediaUrlForPlaceholder } from '@/utilities/mediaDisplay'

/**
 * Stable `images.unsplash.com` URLs (allowed in `next.config` `images.remotePatterns`).
 * Use `auto=format&fit=crop` so Next and browsers get a consistent CDN response.
 */
function unsplashPhoto(photoPath: string, width: number): string {
  const id = photoPath.replace(/^\/+/, '')
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`
}

/**
 * Curated online placeholders by UI context.
 */
export type ImageFallbackContext =
  | 'product'
  | 'hero'
  | 'brandLogo'
  | 'location'
  | 'editorial'
  | 'cuts'

const FALLBACKS: Record<ImageFallbackContext, string> = {
  /** Shop grids, cart, checkout, PDP — raw steaks / prime cuts */
  product: unsplashPhoto('photo-1607623814075-e51df1bdc82f', 1200),
  /** Full-width heroes — wide butcher / grill spread */
  hero: unsplashPhoto('photo-1544025162-d76694265947', 1920),
  /** Header/footer when no CMS logo — knives & craft (reads small) */
  brandLogo: unsplashPhoto('photo-1556910103-1c02745aae4d', 600),
  /** Visit / location — market hall / dining atmosphere */
  location: unsplashPhoto('photo-1555396273-367ea4eb66db', 1400),
  /** About, info blocks — plated meal / craft food */
  editorial: unsplashPhoto('photo-1504674900240-798256f706ae', 1200),
  /** Featured cuts / category-style cards — steak on board */
  cuts: unsplashPhoto('photo-1600891964092-4316c288032e', 1200),
}

/**
 * Homepage “Shop by category” cards — distinct meat photography per category.
 */
export const homeCategoryPlaceholderImages = {
  beef: unsplashPhoto('photo-1600891964092-4316c288032e', 1200),
  pork: unsplashPhoto('photo-1588347818039-8eca19537898', 1200),
  poultry: unsplashPhoto('photo-1604503468506-a8da13d82791', 1200),
  lamb: unsplashPhoto('photo-1615937657715-bc7b4b7962c1', 1200),
} as const

export function fallbackUrlFor(context: ImageFallbackContext = 'product'): string {
  return FALLBACKS[context]
}

/** Intrinsic size for `next/image` when only a fallback URL is passed (no CMS `width`/`height`). */
export function fallbackDimensionsFor(
  context: ImageFallbackContext = 'product',
): { width: number; height: number } {
  const width = Number(new URL(FALLBACKS[context]).searchParams.get('w')) || 1200
  return { width, height: Math.round((width * 2) / 3) }
}

/** Read `w` from Unsplash-style query strings (`?w=600`). */
export function parseWidthFromImageUrl(url: string): number | undefined {
  try {
    const w = new URL(url).searchParams.get('w')
    if (!w) return undefined
    const width = parseInt(w, 10)
    return width > 0 ? width : undefined
  } catch {
    return undefined
  }
}

/** Default CMS/media fallback — same as `product` */
export const FALLBACK_IMAGE_URL = FALLBACKS.product

/** Use for `next/image` when CMS `url` is null/empty. Normalizes `/api/...` and optional S3 bypass. */
export function resolveImageSrc(
  url: string | null | undefined,
  context: ImageFallbackContext = 'product',
): string {
  if (url != null && typeof url === 'string') {
    const t = url.trim()
    if (t) {
      const normalized = normalizeCmsMediaUrl(t)
      if (shouldBypassMediaUrlForPlaceholder(normalized)) {
        return fallbackUrlFor(context)
      }
      return normalized
    }
  }
  return fallbackUrlFor(context)
}
