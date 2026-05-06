import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import { ShopFilters } from '@/components/Shop/ShopFilters'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  const shopPage = await payload.findGlobal({
    slug: 'shop-page',
  })

  return (
    <Suspense fallback={null}>
      <div className="bg-black text-white">
        <div className="container py-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop' },
            ]}
          />
          <div className="mb-10">
            <h1 className="mb-2 text-3xl font-medium text-white">{shopPage.title || ''}</h1>
            <p className="max-w-3xl text-sm text-[#b7b7b7]">
              {shopPage.introText ||
                ""}
            </p>
          </div>

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