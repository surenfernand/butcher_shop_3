import type { FeaturedCutsBlock as FeaturedCutsBlockProps } from '@/payload-types'
import type { DefaultDocumentIDType } from 'payload'
import { resolveImageSrc } from '@/constants/fallbackImage'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = FeaturedCutsBlockProps & {
  id?: DefaultDocumentIDType
  className?: string
}

export const FeaturedCutsBlock: React.FC<Props> = ({
  eyebrow,
  title,
  intro,
  items,
  className,
}) => {
  if (!items || !items.length) return null

  return (
    <section className={['bg-black py-20', className].filter(Boolean).join(' ')}>
      <div className="container">
        <div className="mb-14 text-center md:mb-16">
          {eyebrow && (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#c4a457]">
              {eyebrow}
            </p>
          )}

          {title && (
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {title}
            </h2>
          )}

          <div className="mx-auto mt-6 h-px w-14 bg-[#c4a457] md:w-16" aria-hidden />

          {intro && (
            <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-[#a0a0a0] md:text-base">
              {intro}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const media =
              typeof item.image === 'object' && item.image !== null ? item.image : undefined
            const imageUrl = media?.url

            const p = item.product
            const productSlug =
              p && typeof p === 'object' && p !== null && 'slug' in p && p.slug
                ? p.slug
                : null
            const viewHref = productSlug ? `/products/${productSlug}` : '/shop'

            return (
              <article
                key={item.id || index}
                className="group flex flex-col bg-[#1a1a1a] text-center text-white transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <Image
                    src={resolveImageSrc(imageUrl)}
                    alt={media?.alt || item.name || 'Product'}
                    fill
                    className="object-cover transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[1.05] motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {item.tag && (
                    <span className="absolute bottom-3 left-3 border border-[#c4a457]/60 bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#c4a457] backdrop-blur-sm transition-colors duration-300 group-hover:border-[#c4a457] group-hover:bg-black/70">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col border border-transparent px-6 pb-8 pt-8 transition-[border-color] duration-300 group-hover:border-[#c4a457]/20">
                  <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#f5f0e6]">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="mx-auto mt-4 max-w-[28ch] text-sm leading-relaxed text-[#a0a0a0] transition-colors duration-300 group-hover:text-[#b8b8b8]">
                      {item.description}
                    </p>
                  )}

                  {item.price && (
                    <p className="mt-6 text-lg font-medium text-[#c4a457] transition-colors duration-300 group-hover:text-[#d4b76a]">
                      {item.price}
                    </p>
                  )}

                  <div className="mt-auto pt-8">
                    <Link
                      href={viewHref}
                      aria-label="View product in shop page"
                      className="inline-block w-full max-w-[240px] border border-white bg-transparent px-6 py-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-[background-color,color,border-color] duration-300 ease-out group-hover:bg-white group-hover:text-[#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4a457]"
                    >
                      View product
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
