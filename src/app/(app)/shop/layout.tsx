import { ShopFilters } from '@/components/Shop/ShopFilters'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  const [shopPage, categoriesResult] = await Promise.all([
    payload.findGlobal({
      slug: 'shop-page',
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
      depth: 0,
    }),
  ])

  const shopTitle = shopPage.title || 'Shop'

  return (
    <Suspense fallback={null}>
      <div className="bg-[#faf7f2] text-neutral-950">
        {/* Inner-page header — Carneshop-style title band */}
        <section className="relative border-b border-black/10 bg-neutral-950 pt-8 pb-10 md:pt-10 md:pb-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)',
            }}
            aria-hidden
          />
          <div className="container relative">
            <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="text-white/35" aria-hidden>
                  /
                </li>
                <li className="font-medium text-white">{shopTitle}</li>
              </ol>
            </nav>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
              {shopTitle}
            </h1>
            {shopPage.introText ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">{shopPage.introText}</p>
            ) : (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
                Browse premium cuts, prepared daily. Filter by category, tag, or price — same-week preparation available.
              </p>
            )}
            <Link
              href="/shop?sort=-createdAt"
              className="mt-8 inline-flex min-h-10 items-center border border-white/25 bg-white/5 px-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Latest arrivals
            </Link>
          </div>
        </section>

        <div className="container py-10 md:py-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="w-full shrink-0 lg:max-w-[280px]">
              <ShopFilters
                categories={categoriesResult.docs.map((c) => ({
                  id: String(c.id),
                  title: c.title,
                }))}
                labels={{
                  cutTypeLabel: shopPage.filters?.cutTypeLabel || 'Meat Type',
                  agingProcessLabel: shopPage.filters?.agingProcessLabel || 'Storage Type',
                  originLabel: shopPage.filters?.originLabel || 'Preparation Style',
                  priceRangeLabel: shopPage.filters?.priceRangeLabel || 'Price Range',
                }}
              />
            </div>

            <div className="min-h-[50vh] min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
