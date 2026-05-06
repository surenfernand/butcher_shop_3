import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { ProductSortSelect } from './ProductSortSelect'

type SearchParams = { [key: string]: string | string[] | undefined }

export const ProductGridBlock = async ({
  searchParams,
}: {
  searchParams?: SearchParams
}) => {
  const payload = await getPayload({ config })

  const sort =
    typeof searchParams?.sort === 'string'
      ? searchParams.sort
      : '-sortPriority'

  const allowedSorts = [
    '-sortPriority',
    '-createdAt',
    'title',
    'priceInUSD',
    '-priceInUSD',
  ]

  const safeSort = allowedSorts.includes(sort) ? sort : '-sortPriority'

  const products = await payload.find({
    collection: 'products',
    limit: 12,
    depth: 2,
    sort: safeSort,
  })

  return (
    <section className="bg-black py-16 text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-8 md:grid-cols-4">
        <div className="md:col-span-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl uppercase">Our Products</h2>
              <p className="text-sm text-gray-400">
                Curated selections of the world&apos;s finest prime cuts.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>SORT BY:</span>
              <ProductSortSelect currentSort={safeSort} />
            </div>
          </div>

          <Suspense
            fallback={
              <div className="relative min-h-[500px]">
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                </div>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {products.docs.map((product: any) => {
                const image =
                  product.gallery?.[0]?.image && typeof product.gallery[0].image === 'object'
                    ? product.gallery[0].image
                    : null

                let price = product.priceInUSD

                const variants = product.variants?.docs
                if (variants && variants.length > 0) {
                  const variant = variants[0]
                  if (
                    variant &&
                    typeof variant === 'object' &&
                    typeof variant.priceInUSD === 'number'
                  ) {
                    price = variant.priceInUSD
                  }
                }

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block overflow-hidden border border-white/5 bg-[#121414] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#d3a84b]/40 hover:shadow-2xl hover:shadow-black/40"
                  >
                    <div className="relative h-[300px] overflow-hidden bg-black">
                      {image ? <Media
                        resource={image}
                        fill
                        imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      /> : null}

                      {product.eyebrow ? (
                        <span className="absolute left-3 top-3 bg-black px-2 py-1 text-xs text-yellow-400 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-yellow-500 group-hover:text-black">
                          {product.eyebrow}
                        </span>
                      ) : null}
                    </div>

                    <div className="p-6 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4 transition-colors duration-300">
                        <h3 className="text-lg transition-colors duration-300 group-hover:text-[#d3a84b]">
                          {product.title}
                        </h3>

                        {typeof price === 'number' && (
                          <span className="text-yellow-400">
                            <Price amount={price} />
                          </span>
                        )}
                      </div>

                      {product.meta?.description ? (
                        <p className="mt-3 text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-300">
                          {product.meta.description}
                        </p>
                      ) : null}

                      <button className="mt-6 w-full border border-yellow-500 bg-yellow-500 py-3 text-sm uppercase text-black transition-all duration-300 ease-out group-hover:bg-transparent group-hover:text-yellow-400 hover:scale-[1.02] active:scale-[0.98]">
                        View Product
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  )
}