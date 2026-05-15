// src/components/Footer/index.tsx

import { FooterBackToTop } from '@/components/Footer/FooterBackToTop'
import { FooterMenu } from '@/components/Footer/menu'
import { FooterSocialLink } from '@/components/Footer/FooterSocialLink'
import type { Footer as FooterType } from '@/payload-types'
import { Media } from '@/components/Media'
import { FALLBACK_IMAGE_URL } from '@/constants/fallbackImage'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

export async function Footer() {
  const footer: FooterType = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const socialLinks = footer.socialLinks || []
  const currentYear = new Date().getFullYear()
  const showContactPanel =
    Boolean(footer.contactPhone || footer.address || footer.contactEmail) ||
    (socialLinks?.length ?? 0) > 0

  return (
    <footer className="relative z-0 bg-[#1a1a1a] text-neutral-400">
      <div className="mx-auto max-w-7xl overflow-visible px-6 pb-14 pt-10 md:px-10 md:pt-12 lg:px-12">
        <div
          className={cn(
            'grid grid-cols-1 items-start gap-10 lg:gap-8 xl:gap-12',
            showContactPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-2',
          )}
        >
          {/* Brand + intro */}
          <div className="max-w-md lg:pt-4">
            <Link
              href="/"
              className="mb-6 block opacity-95 transition-opacity hover:opacity-100"
            >
              <span className="sr-only">{footer.brandName || 'Butcher shop'}</span>
              <Media
                resource={footer.logo && typeof footer.logo === 'object' ? footer.logo : undefined}
                src={footer.logo && typeof footer.logo === 'object' ? undefined : FALLBACK_IMAGE_URL}
                imgClassName="h-14 w-auto max-w-[220px] object-contain object-left"
              />
            </Link>

            {footer.description ? (
              <p className="text-sm leading-relaxed text-white/85">{footer.description}</p>
            ) : null}
          </div>

          {/* Overlapping contact panel */}
          {showContactPanel ? (
            <div className="flex justify-center lg:justify-center">
              <div className="relative z-10 w-full max-w-md -translate-y-0 shadow-xl lg:-mt-14 lg:max-w-none xl:-mt-16">
                <div className="flex min-h-[240px] flex-col justify-between bg-[#e53935] px-8 py-9 text-white md:px-10 md:py-10">
                  <div className="flex flex-col gap-6">
                    {footer.contactPhone ? (
                      <div className="flex gap-4">
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10">
                          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                            Call Us
                          </p>
                          <a
                            href={`tel:${footer.contactPhone}`}
                            className="mt-1 block text-base font-medium tracking-wide text-white transition hover:text-white/90"
                          >
                            {footer.contactPhone}
                          </a>
                        </div>
                      </div>
                    ) : null}

                    {footer.contactEmail ? (
                      <div className="flex gap-4">
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10">
                          <Mail className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">Email</p>
                          <a
                            href={`mailto:${footer.contactEmail}`}
                            className="mt-1 block text-base font-medium tracking-wide text-white transition hover:text-white/90"
                          >
                            {footer.contactEmail}
                          </a>
                        </div>
                      </div>
                    ) : null}

                    {footer.address ? (
                      <div className="flex gap-4">
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10">
                          <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">Address</p>
                          <p className="mt-1 whitespace-pre-line text-base leading-snug text-white/95">
                            {footer.address}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {(socialLinks?.length ?? 0) > 0 ? (
                    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/20 pt-6">
                      {socialLinks.map(({ id, link }) => (
                        <FooterSocialLink
                          key={id}
                          link={link}
                          className="h-9 w-9 border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {/* Newsletter */}
          <div className="lg:pt-4">
            <h3 className="mb-2 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-6 text-sm leading-relaxed text-white/80">
              Stay updated on all that&apos;s new and noteworthy
            </p>
            <form className="relative" action="/contact-us" method="get">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                placeholder="Email"
                className="h-12 w-full rounded-full border border-white/20 bg-[#141414] py-3 pl-5 pr-14 text-sm text-white placeholder:text-neutral-500 focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#e53935] text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-neutral-500">
                © {currentYear} {footer.brandName || 'Butcher shop'}. All rights reserved.
              </p>
              {footer.bottomBar?.legalText ? (
                <p className="text-xs text-neutral-600">{footer.bottomBar.legalText}</p>
              ) : null}
              {footer.bottomBar?.creditLabel ? (
                <p className="text-xs text-neutral-600">
                  {footer.bottomBar.creditUrl ? (
                    <a
                      href={footer.bottomBar.creditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-neutral-400"
                    >
                      {footer.bottomBar.creditLabel}
                    </a>
                  ) : (
                    <span>{footer.bottomBar.creditLabel}</span>
                  )}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-5 md:justify-end">
              <FooterMenu menu={menu} variant="inline" />
              <FooterBackToTop />
            </div>
          </div>

          {footer.bottomBar?.locationText ? (
            <p className="mt-4 border-t border-neutral-800 pt-4 text-center text-xs uppercase tracking-[0.14em] text-neutral-600 md:text-left">
              {footer.bottomBar.locationText}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
