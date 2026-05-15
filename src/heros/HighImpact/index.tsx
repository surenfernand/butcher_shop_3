'use client'

import type { Header, Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/cn'
import { normalizeCmsMediaUrl, shouldUseUnoptimizedImage } from '@/utilities/mediaDisplay'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import React, { useEffect, useMemo } from 'react'

const HERO_FALLBACK_IMAGE = '/images/hero-butcher-craft.png'

type HeroLink = NonNullable<NonNullable<Page['hero']['links']>[number]['link']>

function heroLinkHref(link: HeroLink): string | null {
  if (!link) return null
  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value &&
    'slug' in link.reference.value &&
    link.reference.value.slug
  ) {
    const slug = link.reference.value.slug
    const prefix =
      link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${slug}`
  }
  return link.url ?? null
}

type HighImpactHeroProps = Page['hero'] & {
  brandLogo?: Header['logo']
  pageSlug?: string
}

export const HighImpactHero: React.FC<HighImpactHeroProps> = ({
  links,
  media,
  eyebrow,
  heading,
  description,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const mediaUrlRaw = media && typeof media === 'object' && media.url ? media.url : null
  const mediaUrl = mediaUrlRaw ? normalizeCmsMediaUrl(mediaUrlRaw) : null

  const isVideo = media && typeof media === 'object' && media.mimeType?.startsWith('video')

  const imageSrc = mediaUrl || HERO_FALLBACK_IMAGE
  const imageAlt =
    (media && typeof media === 'object' && media.alt) || 'Butcher preparing exceptional cuts'

  const reduceMotion = useReducedMotion()
  const heroItem = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [reduceMotion],
  )

  const heroContainer = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.11,
          delayChildren: reduceMotion ? 0 : 0.28,
        },
      },
    }),
    [reduceMotion],
  )

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black text-white"
      data-theme="dark"
      style={{ marginTop: 'calc(-1 * var(--app-header-offset, 13rem))' }}
    >
      <div className="absolute inset-0">
        <div className="relative h-full min-h-screen w-full">
          {mediaUrl && isVideo ? (
            <video autoPlay muted loop playsInline className="h-full w-full object-cover">
              <source src={mediaUrl} type={media.mimeType || 'video/mp4'} />
            </video>
          ) : (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              priority
              unoptimized={
                typeof imageSrc === 'string' && shouldUseUnoptimizedImage(imageSrc)
              }
              className="object-cover object-center"
            />
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.4)_62%,rgba(0,0,0,0.92)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container w-full px-4 md:px-8">
          <motion.div
            className="mx-auto flex max-w-4xl flex-col items-center pt-24 text-center md:pt-32"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {(eyebrow || heading) && (
              <motion.div className="mb-8 flex w-full flex-col items-center" variants={heroItem}>
                <div className="mb-5 h-px w-14 bg-[#D32F2F] md:w-16" aria-hidden />
                {eyebrow && (
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#D32F2F]">
                    {eyebrow}
                  </p>
                )}
              </motion.div>
            )}

            {heading && (
              <motion.h1
                className="text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl"
                variants={heroItem}
              >
                {heading}
              </motion.h1>
            )}

            {description && (
              <motion.p
                className="mt-6 max-w-2xl text-pretty font-serif text-lg italic leading-relaxed text-white md:text-xl md:leading-relaxed"
                variants={heroItem}
              >
                {description}
              </motion.p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <motion.ul
                className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center"
                variants={heroItem}
              >
                {links.map(({ link }, i) => {
                  if (!link) return null
                  const href = heroLinkHref(link as HeroLink)
                  if (!href) return null

                  const isOutline = link.appearance === 'outline'
                  const newTabProps = link.newTab
                    ? { rel: 'noopener noreferrer' as const, target: '_blank' as const }
                    : {}

                  return (
                    <li key={i} className="flex w-full justify-center sm:w-auto">
                      <Link
                        href={href}
                        {...newTabProps}
                        className={cn(
                          'inline-flex min-h-[48px] min-w-[min(100%,280px)] items-center justify-center px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition sm:min-w-[240px]',
                          isOutline
                            ? 'border border-white bg-transparent text-white hover:bg-white/10'
                            : 'border border-[#D32F2F] bg-[#D32F2F] text-white hover:brightness-105',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
