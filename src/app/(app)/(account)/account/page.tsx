import type { Metadata } from 'next'

import { AddressPreviewCard } from '@/components/account/AddressPreviewCard'
import { DashboardCard } from '@/components/account/DashboardCard'
import { OrderPreviewCard } from '@/components/account/OrderPreviewCard'
import { ProfileSummaryCard } from '@/components/account/ProfileSummaryCard'
import { SettingsShortcutCard } from '@/components/account/SettingsShortcutCard'
import { AccountForm } from '@/components/forms/AccountForm'
import type { Address, Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestUser } from '@/utilities/getRequestUser'
import configPromise from '@payload-config'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await getRequestUser(headers)

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
      <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-5 py-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-600">
          Need help with your account? Contact{' '}
          <a
            className="font-semibold text-[#e31e24] underline underline-offset-2 hover:brightness-110"
            href="mailto:info@filetgourmet.ca"
          >
            info@filetgourmet.ca
          </a>
        </p>
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-neutral-600">
        Welcome back{user.name ? `, ${user.name}` : ''}. Review your profile, recent orders, saved addresses, and
        subscriptions below.
      </p>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard
            title="Account Overview"
            subtitle="Your profile and loyalty status at a glance."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileSummaryCard user={user} />
              <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Rewards & Loyalty</p>
                <p className="mt-3 text-2xl font-semibold text-neutral-900">Gold Member</p>
                <p className="mt-2 text-sm text-neutral-600">Earn points on every premium order. Redeem perks soon.</p>
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
              <Link href="/orders" className="text-[11px] uppercase tracking-[0.14em] text-[#e31e24] hover:underline">
                View all
              </Link>
            }
          >
            {recentOrders.length === 0 ? (
              <p className="rounded-sm border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
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
              <Link href="/account/addresses" className="text-[11px] uppercase tracking-[0.14em] text-[#e31e24] hover:underline">
                Edit
              </Link>
            }
          >
            {savedAddresses.length === 0 ? (
              <p className="rounded-sm border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
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
            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Active Plans</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{activeSubscriptions}</p>
              <Link href="/account/subscriptions" className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-[#e31e24] hover:underline">
                Manage subscriptions
              </Link>
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="Wishlist & Favourites" subtitle="Placeholder section for future favourite products integration.">
        <p className="rounded-sm border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
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