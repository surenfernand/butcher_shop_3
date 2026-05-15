import type { InfoSectionBlock as InfoSectionBlockProps, Media } from '@/payload-types'
import { resolveImageSrc } from '@/constants/fallbackImage'
import Image from 'next/image'
import Link from 'next/link'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type Props = InfoSectionBlockProps & {
  id?: DefaultDocumentIDType
  className?: string
}

export const InfoSectionBlock: React.FC<Props> = ({
  eyebrow,
  title,
  description,
  quote,
  linkLabel,
  linkUrl,
  image,
  className,
}) => {
  const media = image as Media | undefined
  const imageUrl = media?.url

  return (
    <section className={['py-20', className].filter(Boolean).join(' ')}>
      <div className="container">
        <div className="grid items-center gap-10 md:grid-cols-[1.35fr_0.95fr]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
            <Image
              src={resolveImageSrc(imageUrl)}
              alt={media?.alt || title || 'Info section image'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-md text-white">
            {eyebrow && (
              <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#d4a63c]">
                {eyebrow}
              </p>
            )}

            {/* {title && <h2 className="mb-8 text-3xl font-light">{title}</h2>} */}

            {linkLabel && linkUrl && (
              <Link
                href={linkUrl}
                className="inline-block border-b border-[#d4a63c] pb-2 text-2xl uppercase tracking-[0.08em] text-white mb-5"
              >
                {linkLabel}
              </Link>
            )}

            {description && (
              <p className="mb-8 text-lg leading-9 text-neutral-800 dark:text-[#eadfbf]">
                {description}
              </p>
            )}

            {quote && (
              <p className="mb-10 text-xl italic leading-9 text-neutral-800 dark:text-[#eadfbf]">
                “{quote}”
              </p>
            )}


          </div>
        </div>
      </div>
    </section>
  )
}