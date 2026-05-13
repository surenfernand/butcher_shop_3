'use client'

import { AuthProvider, useAuth } from '@/providers/Auth'
import { EcommerceProvider, useEcommerce } from '@payloadcms/plugin-ecommerce/client/react'
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import React, { useEffect, useRef } from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'

function EcommerceAuthSync() {
  const { user: authUser } = useAuth()
  const { user: ecUser, onLogin } = useEcommerce()
  const busy = useRef(false)

  useEffect(() => {
    const authId = authUser?.id != null ? String(authUser.id) : ''
    const ecId = ecUser?.id != null ? String(ecUser.id) : ''
    if (!authId || ecId === authId || busy.current) return
    busy.current = true
    void onLogin()
      .catch(() => {})
      .finally(() => {
        busy.current = false
      })
  }, [authUser?.id, ecUser?.id, onLogin])

  return null
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <EcommerceProvider
            enableVariants={true}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    priceInUSD: true,
                    purchaseFrequencies: true,
                    productGallery: true,
                    // inventory: true,
                  },
                  variants: {
                    title: true,
                    priceInUSD: true,
                    inventory: true,
                  },
                },
              },
            }}
            paymentMethods={[
              stripeAdapterClient({
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
              }),
            ]}
          >
            <EcommerceAuthSync />
            {children}
          </EcommerceProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
