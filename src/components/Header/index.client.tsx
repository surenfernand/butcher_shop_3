'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/cn'
import { Mail, MapPin, Search, Smartphone, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { Media } from '@/components/Media'

/** Carne Shop reference red */
const BRAND_RED = '#D32F2F'

/** Left column: lines up top-bar spacer with logo (split header) */
const LOGO_COLUMN = 'w-40 shrink-0 sm:w-48 md:w-56 lg:w-64'

/** Past this scroll offset: compact sticky header (top bar hidden, tighter nav) */
const SCROLL_COMPACT_PX = 64

type ContactStrip = {
  address?: string | null
  email?: string | null
  phone?: string | null
}

type Props = {
  header: Header
  contact?: ContactStrip
}

const FALLBACK_CONTACT = {
  address: '219 Bedford Street\nBirmingham, AL 35211',
  email: 'info@filetgourmet.ca',
  phone: '+1 450-313-1449',
} as const

export function HeaderClient({ header, contact }: Props) {
  const [compact, setCompact] = useState(false)

  const fallbackMenu: NonNullable<Header['navItems']> = [
    { id: 'home', link: { type: 'custom', label: 'Home', url: '/' } },
    { id: 'shop', link: { type: 'custom', label: 'Shop', url: '/shop' } },
    { id: 'about', link: { type: 'custom', label: 'About Us', url: '/about' } },
    { id: 'contact', link: { type: 'custom', label: 'Contact', url: '/contact-us' } },
  ]

  const menu: NonNullable<Header['navItems']> =
    (header.navItems?.length || 0) >= 4 ? (header.navItems ?? []) : fallbackMenu
  const pathname = usePathname()

  const address = (contact?.address ?? '').trim() || FALLBACK_CONTACT.address
  const email = (contact?.email ?? '').trim() || FALLBACK_CONTACT.email
  const phone = (contact?.phone ?? '').trim() || FALLBACK_CONTACT.phone

  useEffect(() => {
    const syncCompact = () => {
      setCompact(window.scrollY > SCROLL_COMPACT_PX)
    }

    syncCompact()
    window.addEventListener('scroll', syncCompact, { passive: true })
    return () => window.removeEventListener('scroll', syncCompact)
  }, [])

  const cartTriggerClass = cn(
    'relative !text-neutral-900 hover:!text-[#D32F2F] [&_.lucide]:!text-current',
    '[&>span]:!min-h-[18px] [&>span]:!min-w-[18px] [&>span]:!border-0 [&>span]:!bg-[#D32F2F] [&>span]:!px-1 [&>span]:!text-[10px] [&>span]:!font-semibold [&>span]:!text-white [&>span]:!shadow-none',
  )

  const iconBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 hover:text-[#D32F2F]'

  const contactInner = (
    <>
    
      <a
        href={`mailto:${email}`}
        className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap transition hover:underline"
      >
        <Mail className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        <span>{email}</span>
      </a>
      <a
        href={`tel:${phone.replace(/\s/g, '')}`}
        className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap transition hover:underline"
      >
        <Smartphone className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        <span>{phone}</span>
      </a>
    </>
  )

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-50 w-full bg-white transition-[box-shadow] duration-300 ease-out',
        compact && 'shadow-[0_6px_30px_rgba(0,0,0,0.08)]',
      )}
    >
      {/* Split top bar — collapses on scroll down for sticky “compact” mode */}
      <div
        className={cn(
          'overflow-hidden border-b border-black/5 transition-[max-height,opacity] duration-300 ease-in-out motion-reduce:transition-none',
          compact ? 'pointer-events-none max-h-0 border-transparent opacity-0' : 'max-h-[240px] opacity-100',
        )}
        aria-hidden={compact}
      >
        {/* Mobile: full-width red, centered contacts */}
        <div
          className="flex flex-col items-center justify-center gap-3 px-4 py-3 text-center text-xs text-white sm:hidden"
          style={{ backgroundColor: BRAND_RED }}
        >
          {contactInner}
        </div>

        {/* sm+: logo column in max-w-7xl; red bleeds to viewport right (avoids gap past 7xl) */}
        <div className="relative hidden min-h-[46px] w-full sm:block">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-0 sm:left-[calc((100vw-min(100vw,80rem))/2+12rem)] md:left-[calc((100vw-min(100vw,80rem))/2+14rem)] lg:left-[calc((100vw-min(100vw,80rem))/2+16rem)]"
            style={{
              backgroundColor: BRAND_RED,
              clipPath: 'polygon(32px 0, 100% 0, 100% 100%, 0 100%)',
            }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex max-w-7xl">
            <div className={cn(LOGO_COLUMN, 'bg-white')} aria-hidden />
            <div className="flex min-h-[46px] min-w-0 flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-4 py-2.5 text-xs text-white md:px-6 md:text-[13px]">
              {contactInner}
            </div>
          </div>
        </div>
      </div>

      {/* Main bar — white, logo / centered nav / utilities */}
      <div
        className={cn(
          'border-b bg-white transition-[box-shadow] duration-300 ease-out motion-reduce:transition-none',
          compact
            ? 'border-neutral-200/90 shadow-none'
            : 'border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        )}
      >
        <nav
          className={cn(
            'mx-auto flex max-w-7xl items-center gap-2 px-4 transition-[min-height,padding,gap] duration-300 ease-out motion-reduce:transition-none md:gap-4 md:px-8',
            compact ? 'min-h-[3.25rem] py-1.5 md:min-h-[3.5rem]' : 'min-h-[4.25rem] py-2 md:min-h-[4.75rem]',
          )}
        >
          <div className={cn('flex min-w-0 items-center', LOGO_COLUMN)}>
            <Link href="/" className="inline-flex max-w-[min(100%,240px)] items-center">
              <Media
                resource={header.logo ?? undefined}
                imgClassName={cn(
                  'w-auto object-contain object-left transition-[height] duration-300 ease-out motion-reduce:transition-none',
                  compact ? 'h-9 md:h-10' : 'h-11 md:h-[3.35rem]',
                )}
              />
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            {menu.length ? (
              <ul className="flex flex-wrap items-center justify-center gap-4 lg:gap-7">
                {menu.map((item) => {
                  const active =
                    item.link?.url === '/'
                      ? pathname === '/'
                      : item.link?.url
                        ? pathname === item.link.url || pathname.startsWith(`${item.link.url}/`)
                        : false
                  return (
                    <li key={item.id}>
                      <CMSLink
                        {...item.link}
                        appearance="nav"
                        size="clear"
                        className={cn(
                          '!normal-case !font-sans !tracking-normal text-[15px] font-bold text-neutral-900 transition-colors hover:text-[#D32F2F]',
                          active && '!text-[#D32F2F]',
                        )}
                      />
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          {/* Carne order: user → search → cart → menu */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
            <Link href="/account" className={iconBtn} aria-label="Account">
              <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            </Link>

            <Link href="/shop" className={iconBtn} aria-label="Search products">
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            </Link>

            <Suspense fallback={<OpenCartButton className={cartTriggerClass} />}>
              <Cart />
            </Suspense>

            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
        </nav>
      </div>
    </header>
  )
}
