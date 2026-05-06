import type { DefaultDocumentIDType } from 'payload'
import type { Media } from '@/payload-types'
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

  return (
    <section className={['py-20', className].filter(Boolean).join(' ')}>
      <div data-theme="dark" className="mx-auto grid max-w-[1280px] grid-cols-1 items-stretch gap-6 px-8 md:grid-cols-12">
        <div className="bg-[#282a2b] p-10 md:col-span-4">
          {title && <h2 className="mb-6 text-4xl font-semibold uppercase tracking-[0.08em] text-white">{title}</h2>}
          {description && <p className="mb-10 text-base leading-8 text-[#d2c5b1]">{description}</p>}

          <div className="space-y-4">
            {(hours || []).map((item, index) => (
              <div key={index} className="flex justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d3a84b]">{item.label}</span>
                <span className="text-base text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#1a1c1c] md:col-span-8">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={media?.alt || locationLabel || 'Location image'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-60 transition duration-700 hover:opacity-100"
            />
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center px-10 text-center text-sm uppercase tracking-[0.2em] text-[#9a8f7e]">
              Upload a map or location image from the admin panel
            </div>
          )}

          {locationLabel && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl uppercase tracking-[0.4em] text-white/30">
              {locationLabel}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}