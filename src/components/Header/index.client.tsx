'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'
import { Globe, Search, User } from 'lucide-react'

import { Media } from '@/components/Media'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const fallbackMenu: NonNullable<Header['navItems']> = [
    { id: 'home', link: { type: 'custom', label: 'Home', url: '/' } },
    { id: 'shop', link: { type: 'custom', label: 'Shop', url: '/shop' } },
    { id: 'our-products', link: { type: 'custom', label: 'Our products', url: '/shop' } },
    {
      id: 'ready-meals',
      link: { type: 'custom', label: 'Ready to Eat Meals', url: '/shop?tab=ready-to-eat' },
    },
    { id: 'meat-boxes', link: { type: 'custom', label: 'Meat Boxes', url: '/shop?tab=meat-boxes' } },
    {
      id: 'subscriptions',
      link: { type: 'custom', label: 'Subscriptions', url: '/shop?tab=subscriptions' },
    },
    { id: 'about', link: { type: 'custom', label: 'About Us', url: '/about' } },
    { id: 'contact', link: { type: 'custom', label: 'Contact', url: '/contact' } },
  ]

  const menu: NonNullable<Header['navItems']> =
    (header.navItems?.length || 0) >= 8 ? (header.navItems ?? []) : fallbackMenu
  const pathname = usePathname()

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="border-b border-[#e8decb] bg-[#f2ecdf] text-[#4f483b]">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-[10px] uppercase tracking-[0.16em] md:px-8">
          <p className="hidden sm:block">Premium Seafood & Gourmet Essentials</p>
          <div className="flex items-center gap-4">
            <a href="tel:+14503131449" className="transition hover:text-[#8b6d2e]">
              450-313-1449
            </a>
            <a href="mailto:info@filetgourmet.ca" className="transition hover:text-[#8b6d2e]">
              info@filetgourmet.ca
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-[#e7dcc5] bg-[#fafaf8]/95 shadow-[0_10px_25px_rgba(42,34,22,0.05)] backdrop-blur-md">
        <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center">
            <Media
              resource={header.logo ?? undefined}
              imgClassName="h-14 w-auto object-contain md:h-16"
            />
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden flex-1 justify-center md:flex">
          {menu.length ? (
            <ul className="flex items-center gap-6">
              {menu.map((item) => (
                <li key={item.id}>
                  <CMSLink
                    {...item.link}
                    appearance="nav"
                    size="clear"
                    className={cn(
                      'relative text-[11px] uppercase tracking-[0.12em] text-[#3f3a31] transition-all duration-300 ease-out hover:text-[#9e7c39]',
                      {
                        'text-[#9e7c39] after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-full after:bg-[#b5924f]':
                          item.link?.url === '/'
                            ? pathname === '/'
                            : item.link?.url
                              ? pathname.startsWith(item.link.url)
                              : false,
                      },
                    )}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Right: icons */}
        <div className="flex flex-1 items-center justify-end gap-4 text-[#8f6f2f] transition-all duration-300 ease-out">
          <button
            type="button"
            className="hidden md:inline-flex transition hover:opacity-80"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>

          <Link href="/account" className="hidden md:inline-flex transition hover:opacity-80">
            <User className="h-4 w-4" />
          </Link>

          <Link
            href="/fr"
            className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6f6040] md:inline-flex"
          >
            <Globe className="h-3.5 w-3.5" />
            Francais
          </Link>
        </div>
        </nav>
      </div>
    </header>
  )
}