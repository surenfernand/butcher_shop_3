import { LuxuryProductCard } from '@/components/Shop/LuxuryProductCard'
import type { ShopLuxuryPage } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type ShopLuxuryPageExtras = ShopLuxuryPage & {
  itemsPerPage?: number | null
  filterSections?:
    | {
        title?: string | null
        options?: { label?: string | null }[] | null
      }[]
    | null
}

export default async function ShopLuxuryPage() {
  const payload = await getPayload({ config: configPromise })

  const pageData = (await payload.findGlobal({
    slug: 'shop-luxury-page',
    depth: 1,
  })) as ShopLuxuryPageExtras

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: pageData.itemsPerPage ?? 6,
    where: {
      featuredInShop: {
        equals: true,
      },
    },
  })

  const filterSections = pageData.filterSections ?? []

  return (

    <main className="min-h-screen bg-black px-8 py-10 text-white mb-10">
      <br>
      </br>
      <div className="mx-auto max-w-7xl ">
        <div className="mb-10">
          {pageData.eyebrow ? (
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#c8a24d]">
              {pageData.eyebrow}
            </p>
          ) : null}

          {pageData.title ? (
            <h1 className="text-3xl font-medium">{pageData.title}</h1>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="border-r border-[#1f1f1f] pr-8">
            <div className="space-y-8">
             {filterSections.map((section, i) => (
                <div key={i}>
                  <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-[#c8a24d]">
                    {section.title}
                  </h2>

                  <div className="space-y-3 text-sm text-[#d1d1d1]">
                    {section.options?.map((option, j) => (
                      <label key={j} className="flex items-center gap-3">
                        <input type="checkbox" />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section>
            <div className="mb-8 flex items-center justify-end">
              <div className="text-sm uppercase tracking-[0.18em] text-[#c8a24d]">
                Sort by: {pageData.sortLabel || 'Recommended'}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {products.docs.map((product) => (
                <LuxuryProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}