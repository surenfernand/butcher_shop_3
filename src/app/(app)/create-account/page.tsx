import type { Metadata } from 'next'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestUser } from '@/utilities/getRequestUser'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const { user } = await getRequestUser(headers)

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <main className="relative min-h-[calc(100dvh-var(--app-header-offset))] overflow-hidden bg-[#fff5f5]">
      <div className="absolute inset-0 bg-[#fff5f5]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-var(--app-header-offset))] max-w-6xl justify-center px-6 py-12 sm:px-10 lg:px-8 lg:py-10">
        <div className="flex w-full max-w-md flex-col justify-center">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_12px_48px_rgba(0,0,0,0.07)] sm:p-10">
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Create account</h1>
            <p className="mb-8 text-neutral-600">
              Join Butchers Craft to track orders and save your details for faster checkout.
            </p>
            <RenderParams className="[&_.my-8]:mt-0 [&_.my-8]:mb-6" />
            <CreateAccountForm />
          </div>
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
