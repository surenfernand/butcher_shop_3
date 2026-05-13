import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestUser } from '@/utilities/getRequestUser'
import React from 'react'
import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { headers as getHeaders } from 'next/headers.js'

export default async function FindOrderPage() {
  const headers = await getHeaders()
  const { user } = await getRequestUser(headers)

  return (
    <div className="container py-16">
      <FindOrderForm initialEmail={user?.email} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Find your order using your email and order ID.',
  openGraph: mergeOpenGraph({
    title: 'Find order',
    url: '/find-order',
  }),
  title: 'Find order',
}
