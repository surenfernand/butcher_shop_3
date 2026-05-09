import { LuxuryProductCard } from '@/components/Shop/LuxuryProductCard'
import { ShopSortSelect } from '@/components/Shop/ShopSortSelect'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Where } from 'payload'

export const metadata = {
  description: 'Browse premium products in the shop.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const {
    q: searchValue,
    sort,
    meatType,
    storageType,
    preparationStyle,
    inStock,
    minPrice,
    maxPrice,
    category,
    page,
  } = await searchParams

  const payload = await getPayload({ config: configPromise })

  const shopPage = await payload.findGlobal({
    slug: 'shop-page',
  })

  const where: Where = {
    and: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        featuredInShop: {
          equals: true,
        },
      },
    ],
  }

  const andConditions = where.and as Record<string, unknown>[]

  if (searchValue) {
    andConditions.push({
      or: [
        {
          title: {
            like: String(searchValue),
          },
        },
        {
          shopCardShortDescription: {
            like: String(searchValue),
          },
        },
        {
          shopCardLabel: {
            like: String(searchValue),
          },
        },
      ],
    })
  }
  if (meatType) {
    andConditions.push({
      meatType: {
        equals: String(meatType),
      },
    })
  }

  if (storageType) {
    andConditions.push({
      storageType: {
        equals: String(storageType),
      },
    })
  }

  if (preparationStyle) {
    andConditions.push({
      preparationStyle: {
        equals: String(preparationStyle),
      },
    })
  }

  if (inStock === 'true') {
    andConditions.push({
      inStock: {
        equals: true,
      },
    })
  }
 

  if (category) {
    andConditions.push({
      categories: {
        in: [String(category)],
      },
    })
  }

  if (minPrice || maxPrice) {
    const priceCondition: Record<string, number> = {}

    if (minPrice) priceCondition.greater_than_equal = Number(minPrice)
    if (maxPrice) priceCondition.less_than_equal = Number(maxPrice)

    andConditions.push({
      priceInUSD: priceCondition,
    })
  }

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    draft: false,
    overrideAccess: false,
    page: page ? Number(page) : 1,
    limit: 9,
    sort: sort ? String(sort) : '-sortPriority',
    where,
    select: {
      title: true,
      slug: true,
      gallery: true,
      productGallery: true,
      priceInUSD: true,
      meta: true,
      shopCardLabel: true,
      shopCardShortDescription: true,
      origin: true,
      cardButtonLabel: true,
      featuredInShop: true,
      cutType: true,
      agingProcess: true,
      categories: true,
      meatType: true,
      storageType: true,
      preparationStyle: true,
      inStock: true,
    },
  })

  const resultsText =
    products.docs.length === 1
      ? shopPage.resultsLabelSingle || 'result'
      : shopPage.resultsLabelPlural || 'results'

  const totalProducts = products.totalDocs || 0
  const currentPage = products.page || 1
  const totalPages = products.totalPages || 1

  const createPageHref = (nextPage: number) => {
    const params = new URLSearchParams()
    if (searchValue) params.set('q', String(searchValue))
    if (sort) params.set('sort', String(sort))
    if (meatType) params.set('meatType', String(meatType))
    if (storageType) params.set('storageType', String(storageType))
    if (preparationStyle) params.set('preparationStyle', String(preparationStyle))
    if (inStock) params.set('inStock', String(inStock))
    if (minPrice) params.set('minPrice', String(minPrice))
    if (maxPrice) params.set('maxPrice', String(maxPrice))
    if (category) params.set('category', String(category))
    if (nextPage > 1) params.set('page', String(nextPage))
    const query = params.toString()
    return query ? `/shop?${query}` : '/shop'
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="space-y-10">
      {/* Toolbar — results + sort */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-950">{products.docs.length}</span> of{' '}
          <span className="font-semibold text-neutral-950">{totalProducts}</span> {resultsText}
        </p>
        <ShopSortSelect />
      </div>

      {searchValue ? (
        <p className="text-sm text-neutral-600">
          {products.docs.length === 0
            ? 'There are no products that match '
            : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-semibold text-neutral-950">&quot;{String(searchValue)}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs.length === 0 ? (
        <p className="text-sm text-neutral-600">
          {shopPage.emptyStateText || 'No products found. Please try different filters.'}
        </p>
      ) : null}

      {products.docs.length > 0 ? (
        <div className={cn('grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3')}>
          {products.docs.map((product) => {
            return <LuxuryProductCard key={product.id} product={product} />
          })}
        </div>
      ) : null}

      {totalPages > 1 ? (
        <nav aria-label="Shop pagination" className="flex flex-wrap items-center justify-center gap-2 border-t border-neutral-200 pt-10">
          <Link
            href={createPageHref(Math.max(1, currentPage - 1))}
            className={cn(
              'flex h-10 min-w-10 items-center justify-center border px-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              products.hasPrevPage
                ? 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                : 'pointer-events-none border-neutral-100 bg-neutral-50 text-neutral-400',
            )}
            aria-disabled={!products.hasPrevPage}
          >
            Prev
          </Link>
          {pageNumbers.map((n) => {
            const active = n === currentPage
            return (
              <Link
                key={n}
                href={createPageHref(n)}
                className={cn(
                  'flex h-10 min-w-10 items-center justify-center border text-sm font-semibold tabular-nums transition',
                  active
                    ? 'border-[#e31e24] bg-[#e31e24] text-white'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {n}
              </Link>
            )
          })}
          <Link
            href={createPageHref(currentPage + 1)}
            className={cn(
              'flex h-10 min-w-10 items-center justify-center border px-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              products.hasNextPage
                ? 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                : 'pointer-events-none border-neutral-100 bg-neutral-50 text-neutral-400',
            )}
            aria-disabled={!products.hasNextPage}
          >
            Next
          </Link>
        </nav>
      ) : null}

      <section className="border border-neutral-200 bg-white p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e31e24]">Newsletter</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">Stay updated on what&apos;s new</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
          Join our list for specials, new arrivals, and recipe ideas from the butcher block.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Your email address"
            className="min-h-11 flex-1 border border-neutral-200 bg-[#faf7f2] px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/15"
          />
          <button
            type="button"
            className="min-h-11 shrink-0 bg-[#e31e24] px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-105"
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}