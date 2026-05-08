import type { Metadata } from 'next'

import { AddressPreviewCard } from '@/components/account/AddressPreviewCard'
import { DashboardCard } from '@/components/account/DashboardCard'
import { OrderPreviewCard } from '@/components/account/OrderPreviewCard'
import { ProfileSummaryCard } from '@/components/account/ProfileSummaryCard'
import { SettingsShortcutCard } from '@/components/account/SettingsShortcutCard'
import { AccountForm } from '@/components/forms/AccountForm'
import type { Address, Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  const [ordersResult, addressesResult] = await Promise.all([
    payload.find({
      collection: 'orders',
      user,
      overrideAccess: false,
      depth: 1,
      limit: 3,
      sort: '-createdAt',
      where: { customer: { equals: user.id } },
    }),
    payload.find({
      collection: 'addresses',
      user,
      overrideAccess: false,
      depth: 0,
      limit: 2,
      sort: '-updatedAt',
      where: { customer: { equals: user.id } },
    }),
  ])

  const recentOrders = (ordersResult.docs || []) as Order[]
  const savedAddresses = (addressesResult.docs || []) as Address[]
  const activeSubscriptions = recentOrders.filter((order) =>
    order.purchaseTypes?.some((line) => line.purchaseType === 'weekly' || line.purchaseType === 'monthly'),
  ).length

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-muted/40 px-6 py-3">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Need help with your account? Contact support at{' '}
          <a className="font-medium text-primary underline underline-offset-2 hover:text-primary/90" href="mailto:info@filetgourmet.ca">
            info@filetgourmet.ca
          </a>
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-7 text-card-foreground shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">My Account Dashboard</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Welcome back, {user.name || 'Guest'}</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Review your profile, track recent orders, manage saved addresses, and access subscription details from one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard
            title="Account Overview"
            subtitle="Your profile and loyalty status at a glance."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileSummaryCard user={user} />
              <div className="rounded-lg border border-border bg-muted/50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Rewards & Loyalty</p>
                <p className="mt-3 text-2xl font-semibold">Gold Member</p>
                <p className="mt-2 text-sm text-muted-foreground">Earn points on every premium order. Redeem perks soon.</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard
            title="Settings Shortcuts"
            subtitle="Quick access to common account actions."
          >
            <SettingsShortcutCard
              shortcuts={[
                {
                  href: '/account/addresses',
                  label: 'Manage Addresses',
                  description: 'Update delivery and billing locations.',
                },
                {
                  href: '/orders',
                  label: 'View Orders',
                  description: 'Track your recent purchases and invoices.',
                },
                {
                  href: '/account/subscriptions',
                  label: 'Subscriptions',
                  description: 'Manage recurring delivery preferences.',
                },
                {
                  href: '/account',
                  label: 'Profile & Security',
                  description: 'Update your email, name, and password.',
                },
              ]}
            />
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard
            title="Recent Orders"
            subtitle="A quick preview of your latest purchases."
            action={
              <Link href="/orders" className="text-xs uppercase tracking-[0.14em] text-primary hover:text-primary/90">
                View all
              </Link>
            }
          >
            {recentOrders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                You have no recent orders yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <OrderPreviewCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <DashboardCard
            title="Saved Addresses"
            subtitle="Your default delivery locations."
            action={
              <Link href="/account/addresses" className="text-xs uppercase tracking-[0.14em] text-primary hover:text-primary/90">
                Edit
              </Link>
            }
          >
            {savedAddresses.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                No saved addresses. Add one to speed up checkout.
              </p>
            ) : (
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <AddressPreviewCard key={address.id} address={address} />
                ))}
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Subscriptions" subtitle="Recurring order overview.">
            <div className="rounded-lg border border-border bg-muted/50 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Active Plans</p>
              <p className="mt-2 text-2xl font-semibold">{activeSubscriptions}</p>
              <Link href="/account/subscriptions" className="mt-4 inline-block text-xs uppercase tracking-[0.14em] text-primary hover:text-primary/90">
                Manage subscriptions
              </Link>
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="Wishlist & Favourites" subtitle="Placeholder section for future favourite products integration.">
        <p className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          Wishlist functionality is not currently enabled in this project. This slot is ready for future integration.
        </p>
      </DashboardCard>

      <DashboardCard title="Profile & Security Settings" subtitle="Update account details and password.">
        <AccountForm />
      </DashboardCard>
    </div>
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