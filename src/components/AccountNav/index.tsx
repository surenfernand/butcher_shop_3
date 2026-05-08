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
  'text-muted-foreground hover:text-primary hover:bg-accent'

const linkActive =
  'bg-accent text-primary'

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
        <div className="border-b border-[#eadfcf] px-5 py-6">
          <p className="text-lg font-bold uppercase tracking-[0.18em] text-primary">
            FILET GOURMET
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

      <div className="border-t border-[#eadfcf] px-3 pb-3">
        <Button
          asChild
          variant="link"
          className="h-auto w-full p-0"
        >
          <Link
            href="/logout"
            className={clsx(
              linkBase,
              'text-[#9b5f52] hover:bg-[#f7e7e4] hover:text-[#7f463a]',
              pathname === '/logout' && 'bg-[#f7e7e4]',
            )}
          >
            Log out
          </Link>
        </Button>
      </div>
    </div>
  )
}