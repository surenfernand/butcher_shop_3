import { getServerSideURL } from '@/utilities/getURL'

/**
 * Turn `/api/media/...` into an absolute URL so `next/image` and SSR resolve the same host.
 */
export function normalizeCmsMediaUrl(url: string): string {
  const u = url.trim()
  if (!u) return u
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  if (u.startsWith('/')) {
    const base = getServerSideURL().replace(/\/$/, '')
    return base ? `${base}${u}` : u
  }
  return u
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
