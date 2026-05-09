import Link from 'next/link'
import { Share2 } from 'lucide-react'
import type { Footer } from '@/payload-types'
import { cn } from '@/utilities/cn'

type FooterSocialLinkShape = NonNullable<Footer['socialLinks']>[number]['link']

function resolveHref(link: FooterSocialLinkShape): string | null {
  if (
    link.type === 'reference' &&
    link.reference?.value &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value
  ) {
    const slug = link.reference.value.slug
    const relationTo = link.reference.relationTo
    return `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${slug}`
  }
  if (link.url) return link.url
  return null
}

type SocialKind = 'youtube' | 'facebook' | 'x' | 'instagram'

function detectSocialFromUrl(url: string): SocialKind | null {
  const trimmed = url.trim().toLowerCase()
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const host = new URL(withProto).hostname.replace(/^www\./, '')
    if (host.includes('youtube') || host === 'youtu.be') return 'youtube'
    if (host.includes('facebook') || host === 'fb.com' || host.includes('fb.')) return 'facebook'
    if (host === 'x.com' || host.includes('twitter.')) return 'x'
    if (host.includes('instagram')) return 'instagram'
  } catch {
    return null
  }
  return null
}

function detectSocialFromLabel(label: string): SocialKind | null {
  const u = label.trim().toUpperCase()
  if (u === 'Y' || u.includes('YOUTUBE')) return 'youtube'
  if (u === 'F' || u.includes('FACEBOOK')) return 'facebook'
  if (u === 'T' || u === 'X' || u.includes('TWITTER')) return 'x'
  if (u.includes('INSTAGRAM')) return 'instagram'
  return null
}

function SocialSvg({ kind, className }: { kind: SocialKind; className?: string }) {
  const common = cn('h-5 w-5 shrink-0', className)
  switch (kind) {
    case 'youtube':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'x':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      )
    default:
      return null
  }
}

type Props = {
  link: FooterSocialLinkShape
  className?: string
}

export function FooterSocialLink({ link, className }: Props) {
  const href = resolveHref(link)
  if (!href) return null

  const fromUrl = detectSocialFromUrl(href)
  const fromLabel = detectSocialFromLabel(link.label || '')
  const kind = fromUrl ?? fromLabel

  const newTabProps = link.newTab ? { rel: 'noopener noreferrer' as const, target: '_blank' as const } : {}

  return (
    <Link
      href={href}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af5f]/35 bg-transparent text-[#d4af5f] transition-all hover:border-[#d4af5f] hover:bg-[#d4af5f]/10 hover:text-[#d4af5f]',
        className,
      )}
      aria-label={link.label || 'Social profile'}
      {...newTabProps}
    >
      {kind ? <SocialSvg kind={kind} /> : <Share2 className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />}
    </Link>
  )
}
