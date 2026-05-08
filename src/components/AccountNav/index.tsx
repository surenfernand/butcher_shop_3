'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

const linkBase =
  'w-full justify-start rounded-md px-5 py-4 text-sm font-medium tracking-wide hover:no-underline transition-colors'

const linkInactive =
  'text-muted-foreground hover:bg-muted hover:text-primary'

const linkActive =
  'border border-primary/25 bg-primary/10 font-semibold text-primary'

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div
      className={clsx(
        'flex min-h-full flex-col justify-between',
        'text-foreground',
        className,
      )}
    >
      <div>
        <div className="border-b border-border px-5 py-6">
          <p className="font-serif text-lg font-semibold tracking-tight text-primary">
            The Butcher&apos;s Craft
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Customer Dashboard</p>
        </div>

        <ul className="mt-6 flex flex-col gap-1 px-3">
          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link
                href="/account"
                className={clsx(
                  linkBase,
                  pathname === '/account' ? linkActive : linkInactive,
                )}
              >
                Account settings
              </Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link" className="h-auto w-full p-0">
              <Link
                href="/account/addresses"
                className={clsx(
                  linkBase,
                  pathname === '/account/addresses' ? linkActive : linkInactive,
                )}
              >
                Addresses
              </Link>
            </Button>
          </li>

          <li>
            <Button
              asChild
              variant="link"
              className="h-auto w-full p-0"
            >
              <Link
                href="/orders"
                className={clsx(
                  linkBase,
                  pathname === '/orders' || pathname.includes('/orders')
                    ? linkActive
                    : linkInactive,
                )}
              >
                Orders
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

      <div className="border-t border-border px-3 pb-3">
        <Button
          asChild
          variant="link"
          className="h-auto w-full p-0"
        >
          <Link
            href="/logout"
            className={clsx(
              linkBase,
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              pathname === '/logout' && 'bg-muted',
            )}
          >
            Log out
          </Link>
        </Button>
      </div>
    </div>
  )
}