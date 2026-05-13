import type { Metadata } from 'next'

import { LoginForm } from '@/components/forms/LoginForm'
import { RenderParams } from '@/components/RenderParams'
import { getRequestUser } from '@/utilities/getRequestUser'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Login() {
  const headers = await getHeaders()
  const { user } = await getRequestUser(headers)

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <main className="relative min-h-[calc(100dvh-var(--app-header-offset))] overflow-hidden bg-[#fff5f5]">
      {/* Full-bleed photo (lg+ shows more on the left; mobile uses a cropped hero) */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[center_22%] sm:bg-[center_28%] lg:bg-center"
        style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#fff5f5]/93 via-[#fff5f5]/88 to-[#fff5f5]/82 lg:bg-gradient-to-r lg:from-[#fff5f5]/55 lg:via-[#fff5f5]/82 lg:to-[#fff5f5]/96"
        aria-hidden
      />

      <section className="relative z-10 mx-auto grid min-h-[calc(100dvh-var(--app-header-offset))] max-w-6xl grid-cols-1 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-8 lg:py-10">
        <div className="hidden lg:block" aria-hidden />

        <div className="flex flex-col justify-center">
          <div className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-neutral-200/90 bg-white/95 p-8 shadow-[0_12px_48px_rgba(0,0,0,0.07)] backdrop-blur-[2px] sm:p-10">
            <RenderParams className="[&_.my-8]:mt-0 [&_.my-8]:mb-6" />

            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Welcome back</h1>
              <p className="text-base text-neutral-600">
                Enter your credentials to access your account.
              </p>
            </div>

            <LoginForm />

            <div className="mt-10 text-sm text-neutral-600">
              New to Butchers Craft?{' '}
              <Link
                href="/create-account"
                className="font-semibold text-[#D32F2F] underline underline-offset-4 hover:text-[#B71C1C]"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}