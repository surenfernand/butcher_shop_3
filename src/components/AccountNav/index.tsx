'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

const linkBase =
  'w-full justify-start rounded-none px-5 py-4 text-sm font-medium tracking-wide hover:no-underline transition-colors'

const linkInactive =
  'text-muted-foreground hover:text-[#E2B84F] hover:bg-muted/40'

const linkActive =
  'border-r-2 border-[#E2B84F] bg-muted/60 text-[#E2B84F]'

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div
      className={clsx(
        'flex min-h-full flex-col justify-between text-white',
        'text-foreground',
        className,
      )}
    >
      <div>
        <div className="border-b border-border/40 px-5 py-6">
          <p className="text-lg font-bold uppercase tracking-[0.18em] text-[#E2B84F]">
            THE BUTCHER'S CRAFT
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Artisan Butchery</p>
        </div>

        <ul className="mt-6 flex flex-col">
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

      <div className="border-t border-border/40">
        <Button
          asChild
          variant="link"
          className="h-auto w-full p-0"
        >
          <Link
            href="/logout"
            className={clsx(
              linkBase,
              'text-[#F2B8A8] hover:bg-muted/40 hover:text-[#FFD1C7]',
              pathname === '/logout' && 'bg-muted/60',
            )}
          >
            Log out
          </Link>
        </Button>
      </div>
    </div>
  )
}