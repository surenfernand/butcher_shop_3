/** Remote placeholder when media has no URL (allowed in `next.config` `images.remotePatterns`). */
export const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop'

/** Use for `next/image` `src` when CMS `url` is null/empty. Preserves non-empty relative URLs. */
export function resolveImageSrc(url: string | null | undefined): string {
  if (url != null && typeof url === 'string') {
    const t = url.trim()
    if (t) return url
  }
  return FALLBACK_IMAGE_URL
}
