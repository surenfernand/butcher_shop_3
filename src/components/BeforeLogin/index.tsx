import Link from 'next/link'
import React from 'react'

const storefrontLogin = process.env.NEXT_PUBLIC_SERVER_URL
  ? `${process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')}/login`
  : '/login'

export const BeforeLogin: React.FC = () => {
  return (
    <div className="admin-auth-intro mx-auto mb-8 max-w-lg px-2 text-center text-[15px] leading-relaxed text-neutral-600">
      <p>
        <span className="font-semibold text-neutral-900">Welcome to your dashboard.</span>{' '}
        Admins sign in here to manage the store. Customers should{' '}
        <Link
          href={storefrontLogin}
          className="font-semibold text-[#D32F2F] underline decoration-[#D32F2F]/30 underline-offset-4 hover:text-[#B71C1C]"
        >
          sign in on the website
        </Link>{' '}
        for their account and orders.
      </p>
    </div>
  )
}
