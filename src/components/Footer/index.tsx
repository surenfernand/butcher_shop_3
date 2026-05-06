// src/components/Footer/index.tsx

import { FooterMenu } from '@/components/Footer/menu'
import { FooterSocialLink } from '@/components/Footer/FooterSocialLink'
import type { Footer as FooterType } from '@/payload-types'
// import { LogoIcon } from '@/components/icons/logo'
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
    <footer data-theme="dark" className="border-t border-[#1a1a1a] bg-black text-[#8f8f8f]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand / Description */}
          <div className="max-w-md">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3 text-[#d4a63c] transition-opacity hover:opacity-80"
            >
              {footer.logo && typeof footer.logo === 'object' ? (
                <Media
                  resource={footer.logo}
                  imgClassName="h-16 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-semibold uppercase tracking-wide">
                  {footer.brandName || 'The Butcher’s Craft'}
                </span>
              )}
            </Link>

            {footer.description && (
              <p className="mb-8 text-sm leading-7 text-[#9b9b9b]">
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

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-[0.28em] text-[#d4a63c]">
              Explore
            </h3>

            <Suspense fallback={null}>
              <FooterMenu menu={menu} />
            </Suspense>
          </div>

          {/* Concierge / Contact */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-[0.28em] text-[#d4a63c]">
              Concierge
            </h3>

            <div className="flex flex-col gap-3">
              {footer.contactEmail && (
                <a
                  href={`mailto:${footer.contactEmail}`}
                  className="text-xs uppercase tracking-[0.22em] text-[#8f8f8f] transition-colors hover:text-[#d4a63c]"
                >
                  {footer.contactEmail}
                </a>
              )}

              {footer.contactPhone && (
                <a
                  href={`tel:${footer.contactPhone}`}
                  className="text-xs uppercase tracking-[0.22em] text-[#8f8f8f] transition-colors hover:text-[#d4a63c]"
                >
                  {footer.contactPhone}
                </a>
              )}

              {footer.address && (
                <p className="whitespace-pre-line text-xs uppercase tracking-[0.18em] leading-6 text-[#8f8f8f]">
                  {footer.address}
                </p>
              )}

              {footer.bottomBar?.locationText && (
                <p className="text-xs uppercase tracking-[0.22em] text-[#8f8f8f]">
                  {footer.bottomBar.locationText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-[10px] uppercase tracking-[0.26em] text-[#5f5f5f] md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
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
                  className="transition-colors hover:text-[#d4a63c]"
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