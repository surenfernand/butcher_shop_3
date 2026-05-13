import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100dvh-var(--app-header-offset))] bg-[#fff5f5] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_12px_48px_rgba(0,0,0,0.07)] sm:p-10">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password',
    url: '/forgot-password',
  }),
  title: 'Forgot Password',
}
