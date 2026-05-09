'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
  menu: Header['navItems']
}

export function MobileMenu({ menu }: Props) {
  const { user } = useAuth()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/90 bg-white text-neutral-800 shadow-md transition-colors hover:bg-neutral-50 md:hidden">
        <MenuIcon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
      </SheetTrigger>

      <SheetContent side="right" className="border-neutral-200 bg-white px-4 text-neutral-900">
        <SheetHeader className="px-0 pt-4 pb-0">
          <SheetTitle className="font-semibold uppercase tracking-[0.14em] text-[#D32F2F]">Menu</SheetTitle>

          <SheetDescription />
        </SheetHeader>

        <div className="py-4">
          {menu?.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item) => (
                <li className="py-2" key={item.id}>
                  <CMSLink
                    {...item.link}
                    appearance="link"
                    className="text-sm font-medium text-neutral-800 hover:text-[#D32F2F]"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {user ? (
          <div className="mt-4 border-t border-neutral-200 pt-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">My account</h2>
            <ul className="flex flex-col gap-3 text-neutral-700">
              <li>
                <Link href="/orders" className="hover:text-[#D32F2F]">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/account/addresses" className="hover:text-[#D32F2F]">
                  Addresses
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#D32F2F]">
                  Manage account
                </Link>
              </li>
              <li className="mt-6">
                <Button asChild variant="outline" className="w-full border-neutral-300 hover:border-[#D32F2F] hover:text-[#D32F2F]">
                  <Link href="/logout">Log out</Link>
                </Button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="mt-4 border-t border-neutral-200 pt-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">My account</h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button asChild className="w-full border-neutral-300 sm:flex-1" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <span className="text-center text-sm text-neutral-500 sm:text-base">or</span>
              <Button asChild className="w-full bg-[#D32F2F] text-white hover:bg-[#b71c1c] sm:flex-1">
                <Link href="/create-account">Create an account</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
