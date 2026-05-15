import type { DefaultDocumentIDType } from 'payload'
import type { Media } from '@/payload-types'
import { resolveImageSrc } from '@/constants/fallbackImage'
import { shouldUseUnoptimizedImage } from '@/utilities/mediaDisplay'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

type Props = {
  id?: DefaultDocumentIDType
  className?: string
  title?: string | null
  lead?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  image?: Media | string | null
}

export const AboutStoryBlock: React.FC<Props> = ({
  title,
  lead,
  body,
  ctaLabel,
  ctaUrl,
  image,
  className,
}) => {
  const media = typeof image === 'object' && image ? image : null
  const imageUrl = media?.url
  const storySrc = resolveImageSrc(imageUrl, 'editorial')

  return (
    <section className={['container py-20', className].filter(Boolean).join(' ')}>
      <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="space-y-6">
          {title && (
            <h2 className="font-serif text-4xl font-semibold uppercase tracking-[0.08em] text-primary">{title}</h2>
          )}
          {lead && <p className="max-w-xl text-lg leading-8 text-muted-foreground">{lead}</p>}
          {body && <p className="max-w-xl text-base leading-8 text-muted-foreground">{body}</p>}

          {ctaLabel && ctaUrl && (
            <div className="pt-2">
              <Button asChild size="lg" className="uppercase tracking-[0.15em]">
                <Link href={ctaUrl}>{ctaLabel}</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={storySrc}
            alt={media?.alt || title || 'About story image'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={shouldUseUnoptimizedImage(storySrc)}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}