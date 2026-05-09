import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'

export default async function AddressesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
        Manage shipping and billing addresses for faster checkout and accurate delivery.
      </p>

      <div className="rounded-sm border border-neutral-200 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e31e24]">Shipping</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">Saved addresses</h2>
        <div className="mt-8 border-t border-neutral-100 pt-8">
          <AddressListing />
          <div className="mt-8 border-t border-neutral-100 pt-8">
            <CreateAddressModal />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Manage your addresses.',
  openGraph: mergeOpenGraph({
    title: 'Addresses',
    url: '/account/addresses',
  }),
  title: 'Addresses',
}
