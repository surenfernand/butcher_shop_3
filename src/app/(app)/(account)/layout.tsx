import type { ReactNode } from 'react'

import { AccountAreaChrome } from '@/components/account/AccountAreaChrome'
import { AccountNav } from '@/components/AccountNav'
import { RenderParams } from '@/components/RenderParams'
import { getRequestUser } from '@/utilities/getRequestUser'
import { headers as getHeaders } from 'next/headers.js'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const { user } = await getRequestUser(headers)

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <div className="container">
        <RenderParams className="" />
      </div>

      <AccountAreaChrome />

      <div className="container flex gap-8 pb-14 pt-8 lg:gap-12">
        {user && (
          <AccountNav className="hidden max-w-[280px] shrink-0 flex-col items-stretch md:flex" />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-10">{children}</div>
      </div>
    </div>
  )
}
