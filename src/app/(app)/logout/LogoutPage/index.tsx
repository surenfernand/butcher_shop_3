'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const LogoutPage = () => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Logged out successfully.')
      } catch {
        setError('You are already logged out.')
      }
    }

    void performLogout()
  }, [logout])

  const done = Boolean(error || success)

  return (
    <main className="relative min-h-[calc(100dvh-var(--app-header-offset))] overflow-hidden bg-[#fff5f5]">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[center_22%] sm:bg-[center_28%] lg:bg-center"
        style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f5]/93 via-[#fff5f5]/88 to-[#fff5f5]/82 lg:bg-gradient-to-r lg:from-[#fff5f5]/55 lg:via-[#fff5f5]/82 lg:to-[#fff5f5]/96" aria-hidden />

      <section className="relative z-10 mx-auto grid min-h-[calc(100dvh-var(--app-header-offset))] max-w-6xl grid-cols-1 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-8 lg:py-10">
        <div className="hidden lg:block" />

        <div className="flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_12px_48px_rgba(0,0,0,0.07)] sm:p-10 mt-5">
            {!done ? (
              <>
                <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Signing you out</h1>
                <p className="text-neutral-600">Please wait a moment…</p>
                <div className="mt-6 flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#D32F2F] [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#D32F2F] [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#D32F2F]" />
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    error
                      ? 'mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
                      : 'mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'
                  }
                >
                  {error || success}
                </div>

                <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">
                  {error ? 'Session ended' : "You're signed out"}
                </h1>

                <p className="mb-8 text-neutral-600">
                  {error
                    ? 'You can keep browsing the shop or sign in again whenever you like.'
                    : 'Return to the shop or sign in again to access your account.'}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-xl bg-[#D32F2F] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#B71C1C]"
                  >
                    Continue shopping
                  </Link>

                  <Link
                    href="/login"
                    className="text-center text-sm font-semibold text-[#D32F2F] underline underline-offset-4 hover:text-[#B71C1C] sm:text-left"
                  >
                    Sign back in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
