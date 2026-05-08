// src/components/Footer/index.tsx

import { FooterMenu } from '@/components/Footer/menu'
import { FooterSocialLink } from '@/components/Footer/FooterSocialLink'
import type { Footer as FooterType } from '@/payload-types'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Suspense } from 'react'

export async function Footer() {
  const footer: FooterType = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const socialLinks = footer.socialLinks || []
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e6dcc8] bg-[#f7f4ed] text-[#4f483c]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.9fr_1fr_1fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3 text-[#a8843b] transition-opacity hover:opacity-80"
            >
              {footer.logo && typeof footer.logo === 'object' ? (
                <Media
                  resource={footer.logo}
                  imgClassName="h-16 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-semibold uppercase tracking-wide text-[#2c2822]">
                  {footer.brandName || 'Filet Gourmet Atelier'}
                </span>
              )}
            </Link>

            {footer.description && (
              <p className="mb-8 text-sm leading-7 text-[#615b51]">
                {footer.description}
              </p>
            )}

            {(socialLinks?.length ?? 0) > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ id, link }) => (
                  <FooterSocialLink key={id} link={link} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-6 text-xs uppercase tracking-[0.28em] text-[#9b7a3a]">
              Useful Links
            </h3>

            <Suspense fallback={null}>
              <FooterMenu menu={menu} />
            </Suspense>
          </div>

          <div>
            <h3 className="mb-6 text-xs uppercase tracking-[0.28em] text-[#9b7a3a]">
              Contact
            </h3>

            <div className="flex flex-col gap-3">
              {footer.contactEmail && (
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-xs uppercase tracking-[0.22em] text-[#5f594f] transition-colors hover:text-[#8a6c31]"
                >
                  {footer.contactEmail}
                </a>
              )}

              {footer.contactPhone && (
                <a
                  href={`tel:${footer.contactPhone}`}
                  className="text-xs uppercase tracking-[0.22em] text-[#5f594f] transition-colors hover:text-[#8a6c31]"
                >
                  {footer.contactPhone}
                </a>
              )}

              {footer.address && (
                <p className="whitespace-pre-line text-xs uppercase tracking-[0.18em] leading-6 text-[#5f594f]">
                  {footer.address}
                </p>
              )}

              {footer.bottomBar?.locationText && (
                <p className="text-xs uppercase tracking-[0.22em] text-[#5f594f]">
                  {footer.bottomBar.locationText}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs uppercase tracking-[0.28em] text-[#9b7a3a]">
              Newsletter
            </h3>
            <p className="mb-4 text-sm leading-7 text-[#605b51]">
              Receive monthly menus, exclusive offers, and gourmet updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-[#dfd2b5] bg-white px-4 py-3 text-sm text-[#3f3a31] placeholder:text-[#8a816f] focus:border-[#b99956] focus:outline-none"
                aria-label="Email address"
              />
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#c6a15a] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1a12] transition hover:bg-[#b79047]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e6dcc8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-[10px] uppercase tracking-[0.22em] text-[#756b58] md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <p>
            © {currentYear} {footer.brandName || 'Filet Gourmet Atelier'}. All rights reserved.
          </p>

          {footer.bottomBar?.legalText && <p>{footer.bottomBar.legalText}</p>}

          {footer.bottomBar?.creditLabel && (
            <p>
              {footer.bottomBar.creditUrl ? (
                <a
                  href={footer.bottomBar.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#8a6c31]"
                >
                  {footer.bottomBar.creditLabel}
                </a>
              ) : (
                <span>{footer.bottomBar.creditLabel}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}