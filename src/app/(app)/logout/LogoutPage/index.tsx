'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
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

  return (
    <main className="relative min-h-screen overflow-hidden   text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{
          backgroundImage: `url('/images/butcher-bg.jpg')`,
        }}
      />

      <div className="absolute inset-0  " />
 

      <section className="relative z-10 flex min-h-[calc(100vh-160px)] items-center px-12">
        {(error || success) && (
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-lg border border-yellow-600/40 bg-yellow-900/20 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-yellow-500">
              
               {error || success}
            </div>

            <h1 className="mb-6 text-lg font-medium text-white/90">
          
            </h1>

            <p className="mb-10 max-w-md text-lg leading-relaxed text-white/75">
              What would you like to do next? Return to our collections or
              access your account.
            </p>

            <div className="flex items-center gap-8">
              <Link
                href="/search"
                className="bg-yellow-500 px-10 py-5 text-sm font-medium uppercase tracking-[0.35em] text-black transition hover:bg-yellow-400"
              >
                Click here to shop
              </Link>

              <Link
                href="/login"
                className="group text-base text-white/90"
              >
                To log back in, click here
                <span className="ml-3 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

           
          </div>
        )}
      </section>

        
    </main>
  )
}