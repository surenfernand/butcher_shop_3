'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

const brandRed = '#e31e24'

type RouteMeta = {
  title: string
  eyebrow: string
  crumbs: { label: string; href?: string }[]
}

function getRouteMeta(pathname: string): RouteMeta {
  if (pathname === '/account') {
    return {
      title: 'My Account',
      eyebrow: 'Dashboard',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Account' }],
    }
  }
  if (pathname === '/account/addresses') {
    return {
      title: 'Addresses',
      eyebrow: 'Your profile',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Addresses' }],
    }
  }
  if (pathname === '/account/subscriptions') {
    return {
      title: 'Subscriptions',
      eyebrow: 'Recurring orders',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Subscriptions' }],
    }
  }
  if (pathname === '/orders') {
    return {
      title: 'Order History',
      eyebrow: 'Purchases',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Orders' }],
    }
  }
  const orderDetail = pathname.match(/^\/orders\/([^/]+)$/)
  if (orderDetail) {
    const id = orderDetail[1]
    const ref = id && /^\d+$/.test(id) ? `BC-${id}` : 'Details'
    return {
      title: 'Order details',
      eyebrow: 'Orders',
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Account', href: '/account' },
        { label: 'Orders', href: '/orders' },
        { label: ref },
      ],
    }
  }
  return {
    title: 'Account',
    eyebrow: 'Dashboard',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Account' }],
  }
}

const mobileLinks = [
  { href: '/account', label: 'Overview' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/orders', label: 'Orders' },
  { href: '/account/subscriptions', label: 'Subscriptions' },
]

function linkActive(pathname: string, href: string) {
  if (href === '/orders') {
    return pathname === '/orders' || pathname.startsWith('/orders/')
  }
  return pathname === href
}

export function AccountAreaChrome() {
  const pathname = usePathname()
  const meta = getRouteMeta(pathname)

  return (
    <>
      <section className="relative border-b border-black/10 bg-neutral-950 pt-24 pb-10 md:pt-28 md:pb-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)',
          }}
          aria-hidden
        />
        <div className="container relative">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55"
          >
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {meta.crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-x-2">
                  {i > 0 ? (
                    <span className="text-white/35" aria-hidden>
                      /
                    </span>
                  ) : null}
                  {c.href ? (
                    <Link href={c.href} className="transition hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandRed }}>
            {meta.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{meta.title}</h1>
        </div>
      </section>

      {/* Mobile section nav — matches desktop sidebar destinations */}
      <div className="border-b border-neutral-200 bg-neutral-50 md:hidden">
        <div className="container flex gap-2 overflow-x-auto py-3 [-webkit-overflow-scrolling:touch]">
          {mobileLinks.map(({ href, label }) => {
            const active = linkActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'shrink-0 whitespace-nowrap border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400',
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
