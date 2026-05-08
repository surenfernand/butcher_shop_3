import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import { ShopFilters } from '@/components/Shop/ShopFilters'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  const shopPage = await payload.findGlobal({
    slug: 'shop-page',
  })

  return (
    <Suspense fallback={null}>
      <div className="bg-background text-foreground">
        <section className="border-b border-border bg-[radial-gradient(circle_at_right_top,#fecaca_0%,#fff5f5_55%,#ffe4e6_100%)] pt-30">
          <div className="container py-14 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Collection</p>
                <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                  {shopPage.title || 'Our Products'}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700">
                  {shopPage.introText ||
                    'Discover premium seafood and gourmet selections, carefully curated for elevated everyday meals.'}
                </p>
                <Link
                  href="/shop?sort=-createdAt"
                  className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-primary bg-card px-6 text-xs font-semibold uppercase tracking-[0.16em] text-card-foreground shadow-sm transition hover:bg-muted"
                >
                  Latest Arrivals
                </Link>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/60 shadow-[0_20px_42px_rgba(38,31,20,0.08)]">
                <div className="flex aspect-[16/9] items-center justify-center px-6 text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Collection hero image placeholder - replace from CMS media
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop' },
            ]}
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="w-full lg:max-w-[260px]">
              <ShopFilters
                labels={{
                  cutTypeLabel: shopPage.filters?.cutTypeLabel || 'Cut Type',
                  agingProcessLabel: shopPage.filters?.agingProcessLabel || 'Aging Process',
                  originLabel: shopPage.filters?.originLabel || 'Origin',
                  priceRangeLabel: shopPage.filters?.priceRangeLabel || 'Price Range',
                }}
                sortLabel={shopPage.sortLabel || 'Sort by'}
              />
            </div>

            <div className="min-h-screen flex-1">{children}</div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
