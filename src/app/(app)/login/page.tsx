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
    <main className="relative min-h-screen overflow-hidden text-[#d8c7a0]" style={{margin: "80px 40px 80px 40px"}}>
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        <div
          className="hidden lg:block bg-cover bg-center"
          style={{
            backgroundImage: "url('/butcher-portrait.jpg')",
          }}
        />
        <div className=" " />
      </div>

      <div className="absolute inset-0" />
 
      <section className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-end px-8 pb-10">
        

           
        </div>

        <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-28">
          <div className="w-full max-w-md mx-auto mt-10">
            <RenderParams />

            <div className="mb-16">
               
               

              <h1 className="text-white text-lg font-medium mb-3">Welcome back</h1>
              <p className="text-[#b9ad9a] text-base">
                Enter your credentials to access your account.
              </p>
            </div>

            <LoginForm />

            <div className="mt-36 text-sm text-[#c6bca8]">
              New to Butchers Craft ? {' '}
              <Link
                href="/create-account"
                className="ml-2 text-white underline underline-offset-4 hover:text-[#d6a941]"
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