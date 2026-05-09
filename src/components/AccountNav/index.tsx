'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const brandRed = '#e31e24'

type Props = {
  className?: string
}

const linkBase =
  'w-full justify-start rounded-sm px-5 py-3.5 text-sm font-medium tracking-wide transition-colors hover:no-underline'

const linkInactive = 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'

const linkActive =
  'border border-[#e31e24] bg-[#e31e24]/08 font-semibold text-[#e31e24]'

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  const ordersActive = pathname === '/orders' || pathname.startsWith('/orders/')

  return (
    <div
      className={clsx(
        'flex min-h-full flex-col justify-between overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)]',
        className,
      )}
    >
      <div>
        <div className="border-b border-neutral-200 px-5 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandRed }}>
            Account
          </p>
          <p className="mt-2 font-serif text-lg font-semibold tracking-tight text-neutral-900">My dashboard</p>
          <p className="mt-1 text-xs text-neutral-500">Orders, addresses & subscriptions</p>
        </div>

        <ul className="mt-4 flex flex-col gap-1 px-3 pb-4">
          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link href="/account" className={clsx(linkBase, pathname === '/account' ? linkActive : linkInactive)}>
                Overview
              </Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link
                href="/account/addresses"
                className={clsx(linkBase, pathname === '/account/addresses' ? linkActive : linkInactive)}
              >
                Addresses
              </Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link href="/orders" className={clsx(linkBase, ordersActive ? linkActive : linkInactive)}>
                Order history
              </Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link
                href="/account/subscriptions"
                className={clsx(
                  linkBase,
                  pathname === '/account/subscriptions' ? linkActive : linkInactive,
                )}
              >
                Subscriptions
              </Link>
            </Button>
          </li>
        </ul>
      </div>

      <div className="border-t border-neutral-200 px-3 pb-3">
        <Button asChild variant="link" className="h-auto w-full p-0">
          <Link
            href="/logout"
            className={clsx(
              linkBase,
              'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900',
              pathname === '/logout' && 'bg-neutral-100',
            )}
          >
            Log out
          </Link>
        </Button>
      </div>
    </div>
  )
}
