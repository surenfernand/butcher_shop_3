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
    <div className="mt-5 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          Address Book
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Manage your billing details 
        </p>
      </div>

      {/* GRID */}
      <div className="grid">

        <h2 className="mb-5 text-xl font-bold uppercase tracking-wide text-primary">
           Shipping Address
        </h2>

        {/* LEFT - FORM / LIST */}
        <div className="rounded-xl border border-border bg-card p-8">
          {/* <h2 className="mb-8 text-xl font-bold uppercase tracking-[0.18em] text-[#E2B84F]">
            Shipping Address
          </h2> */}

          <div className="">
            <AddressListing />

            <div className="border-t border-border/40 pt-6">
              <CreateAddressModal />
            </div>
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