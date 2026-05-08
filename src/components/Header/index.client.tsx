'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/cn'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { Media } from '@/components/Media'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const fallbackMenu: NonNullable<Header['navItems']> = [
    { id: 'home', link: { type: 'custom', label: 'Home', url: '/' } },
    { id: 'shop', link: { type: 'custom', label: 'Shop', url: '/shop' } },
 
    { id: 'about', link: { type: 'custom', label: 'About Us', url: '/about' } },
    { id: 'contact', link: { type: 'custom', label: 'Contact', url: '/contact' } },
  ]

  const menu: NonNullable<Header['navItems']> =
    (header.navItems?.length || 0) >= 4 ? (header.navItems ?? []) : fallbackMenu
  const pathname = usePathname()

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="border-b border-border bg-muted text-muted-foreground">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-[10px] uppercase tracking-[0.16em] md:px-8">
          <p className="hidden sm:block">Premium Seafood & Gourmet Essentials</p>
          <div className="flex items-center gap-4">
            <a href="tel:+14503131449" className="transition hover:text-primary">
              450-313-1449
            </a>
            <a href="mailto:info@filetgourmet.ca" className="transition hover:text-primary">
              info@filetgourmet.ca
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 shadow-[0_10px_25px_rgba(42,34,22,0.05)] backdrop-blur-md">
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
                      'relative text-[11px] uppercase tracking-[0.12em] text-foreground transition-all duration-300 ease-out hover:text-primary',
                      {
                        'text-primary after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-full after:bg-primary':
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
        <div className="flex flex-1 items-center justify-end gap-4 text-primary transition-all duration-300 ease-out">
      

          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>

          <Link href="/account" className="hidden md:inline-flex transition hover:opacity-80">
            <User className="h-4 w-4" />
          </Link>

         
        </div>
        </nav>
      </div>
    </header>
  )
}