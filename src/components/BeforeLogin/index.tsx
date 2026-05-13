'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const storefrontLogin = process.env.NEXT_PUBLIC_SERVER_URL
  ? `${process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')}/login`
  : '/login'

const linkClass =
  'font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-2 transition hover:text-sky-300'

export const BeforeLogin: React.FC = () => {
  const pathname = usePathname() ?? ''
  const isCreateFirstUser = pathname.includes('create-first-user')

  if (isCreateFirstUser) {
    return (
      <div className="admin-auth-wrap mx-auto mb-8 w-full max-w-lg px-2">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white">Welcome</h2>
        <p className="mt-2 text-center text-sm text-neutral-400">To begin, create your first user.</p>
        <div className="admin-auth-info mt-6 rounded-lg border border-white/10 bg-neutral-800/90 px-4 py-4 text-center text-[14px] leading-relaxed text-neutral-300 shadow-sm">
          <p>
            Welcome to your dashboard! This is where site admins will log in to manage your store. Customers will need
            to{' '}
            <Link href={storefrontLogin} className={linkClass}>
              log in to the site instead
            </Link>{' '}
            to access their user account, order history, and more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-auth-wrap mx-auto mb-6 w-full max-w-lg px-2">
      <div className="admin-auth-info rounded-lg border border-white/10 bg-neutral-800/90 px-4 py-4 text-center text-[14px] leading-relaxed text-neutral-300 shadow-sm">
        <p>
          <span className="font-semibold text-white">Welcome to your dashboard.</span> Admins sign in here to manage
          the store. Customers should{' '}
          <Link href={storefrontLogin} className={linkClass}>
            sign in on the website
          </Link>{' '}
          for their account and orders.
        </p>
      </div>
    </div>
  )
}
