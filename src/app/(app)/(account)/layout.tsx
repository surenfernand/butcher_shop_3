import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <div className="container">
        <RenderParams className="" />
      </div>

      <div className="container mt-10 pb-10 flex gap-8">
        {user && (
          <AccountNav className="max-w-72 grow flex-col items-start gap-4 hidden md:flex rounded-xl border border-[#e5dac8] bg-[#fffdfa] shadow-[0_12px_26px_rgba(42,34,22,0.05)]" />
        )}

        <div className="flex flex-col gap-12 grow">{children}</div>
      </div>
    </div>
  )
}
