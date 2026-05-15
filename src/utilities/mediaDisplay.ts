import { getServerSideURL } from '@/utilities/getURL'

/**
 * Normalize CMS media URLs for the storefront.
 * - Keeps same-origin paths relative (`/api/media/...`) so the browser always uses the live host
 *   (avoids broken images when `NEXT_PUBLIC_SERVER_URL` was set to localhost at build time).
 * - Rewrites absolute URLs that point at `localhost` / `127.0.0.1` to the path only, for the same reason.
 */
export function normalizeCmsMediaUrl(url: string): string {
  const u = url.trim()
  if (!u) return u

  if (u.startsWith('http://') || u.startsWith('https://')) {
    try {
      const parsed = new URL(u)
      if (/^(localhost|127\.0\.0\.1)$/i.test(parsed.hostname)) {
        return `${parsed.pathname}${parsed.search}` || '/'
      }
      // Absolute URL for this deployment → use path only so HTML never pins the wrong host/port.
      try {
        const serverHost = new URL(getServerSideURL()).hostname
        if (serverHost && parsed.hostname === serverHost) {
          return `${parsed.pathname}${parsed.search}` || '/'
        }
      } catch {
        /* ignore */
      }
    } catch {
      return u
    }
    return u
  }

  if (u.startsWith('/')) {
    return u
  }

  // Bare filename or unusual relative — best effort with public URL (legacy)
  const base = getServerSideURL().replace(/\/$/, '')
  return base ? `${base}/${u.replace(/^\//, '')}` : u
}

/** `NEXT_PUBLIC_MEDIA_PLACEHOLDERS_UNTIL_S3=true` — always replace S3-style URLs with placeholders (debug). */
export function useMediaPlaceholdersUntilS3(): boolean {
  return process.env.NEXT_PUBLIC_MEDIA_PLACEHOLDERS_UNTIL_S3 === 'true'
}

/**
 * Replace S3/cloud CDN URLs with placeholders until `NEXT_PUBLIC_S3_MEDIA_ENABLED=true`
 * (so the UI stays usable before the bucket is connected). Local `/api/media/...` URLs are kept.
 */
export function shouldBypassMediaUrlForPlaceholder(url: string): boolean {
  if (!/amazonaws\.com|cloudfront\.net|digitaloceanspaces\.com|\bs3\./i.test(url)) {
    return false
  }
  if (useMediaPlaceholdersUntilS3()) return true
  if (process.env.NEXT_PUBLIC_S3_MEDIA_ENABLED === 'true') return false
  return true
}

/** Next `/image` optimizer can fail on some hosts for Unsplash; skip optimizer for these URLs. */
export function shouldUseUnoptimizedImage(src: string): boolean {
  return /^https:\/\/(images\.)?unsplash\.com\//i.test(src.trim())
}
