import type { DefaultDocumentIDType } from 'payload'
import type { Media } from '@/payload-types'
import { resolveImageSrc } from '@/constants/fallbackImage'
import { shouldUseUnoptimizedImage } from '@/utilities/mediaDisplay'
import Image from 'next/image'
import React from 'react'

type Hour = {
  label?: string | null
  value?: string | null
}

type Props = {
  id?: DefaultDocumentIDType
  className?: string
  title?: string | null
  description?: string | null
  hours?: Hour[] | null
  locationLabel?: string | null
  mapImage?: Media | string | null
}

export const VisitSectionBlock: React.FC<Props> = ({
  title,
  description,
  hours,
  locationLabel,
  mapImage,
  className,
}) => {
  const media = typeof mapImage === 'object' && mapImage ? mapImage : null
  const imageUrl = media?.url
  const mapSrc = resolveImageSrc(imageUrl, 'location')

  return (
    <section className={['py-20', className].filter(Boolean).join(' ')}>
      <div className="container grid grid-cols-1 items-stretch gap-6 md:grid-cols-12">
        <div className="rounded-lg border border-border bg-card p-10 text-card-foreground md:col-span-4">
          {title && (
            <h2 className="mb-6 font-serif text-4xl font-semibold uppercase tracking-[0.08em] text-foreground">
              {title}
            </h2>
          )}
          {description && <p className="mb-10 text-base leading-8 text-muted-foreground">{description}</p>}

          <div className="space-y-4">
            {(hours || []).map((item, index) => (
              <div key={index} className="flex justify-between gap-4 border-b border-border pb-4 last:border-b-0">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{item.label}</span>
                <span className="text-base text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-muted md:col-span-8">
          <Image
            src={mapSrc}
            alt={media?.alt || locationLabel || 'Location image'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={shouldUseUnoptimizedImage(mapSrc)}
            className="object-cover opacity-90 transition duration-700 hover:opacity-100"
          />

          {locationLabel && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl uppercase tracking-[0.4em] text-muted-foreground/80">
              {locationLabel}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}