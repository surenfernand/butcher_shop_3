import type { Metadata } from 'next'

import { LoginForm } from '@/components/forms/LoginForm'
import { RenderParams } from '@/components/RenderParams'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        <div
          className="hidden bg-cover bg-center lg:block"
          style={{
            backgroundImage: "url('/butcher-portrait.jpg')",
          }}
        />
        <div className="hidden lg:block" />
      </div>

      <div className="absolute inset-0 bg-background/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-background/90 lg:to-background" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-8 lg:py-12">
        <div className="hidden lg:block" />

        <div className="flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card/95 p-8 shadow-[0_20px_50px_rgba(26,28,28,0.08)] backdrop-blur-sm sm:p-10">
            <RenderParams />

            <div className="mb-10">
              <h1 className="mb-3 text-lg font-medium text-foreground">Welcome back</h1>
              <p className="text-base text-muted-foreground">
                Enter your credentials to access your account.
              </p>
            </div>

            <LoginForm />

            <div className="mt-10 text-sm text-muted-foreground">
              New to Butchers Craft?{' '}
              <Link
                href="/create-account"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
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