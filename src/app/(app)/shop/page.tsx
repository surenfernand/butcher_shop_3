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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-[0_10px_24px_rgba(36,29,20,0.05)] md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{products.docs.length}</span> of{' '}
          <span className="font-semibold text-foreground">{totalProducts}</span> {resultsText}
        </p>
        <ShopSortSelect />
      </div>

      {searchValue ? (
        <p className="text-sm text-muted-foreground">
          {products.docs.length === 0
            ? 'There are no products that match '
            : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-semibold text-foreground">&quot;{String(searchValue)}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {shopPage.emptyStateText || 'No products found. Please try different filters.'}
        </p>
      ) : null}

      {products.docs.length > 0 ? (
        <div className={cn('grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3')}>
          {products.docs.map((product) => {
            return <LuxuryProductCard key={product.id} product={product} />
          })}
        </div>
      ) : null}

      {totalPages > 1 ? (
        <nav
          aria-label="Shop pagination"
          className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-8"
        >
          <Link
            href={createPageHref(Math.max(1, currentPage - 1))}
            className={cn(
              'rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition',
              products.hasPrevPage
                ? 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
                : 'pointer-events-none border-border bg-muted/50 text-muted-foreground',
            )}
          >
            Prev
          </Link>
          <span className="rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Page {currentPage} / {totalPages}
          </span>
          <Link
            href={createPageHref(currentPage + 1)}
            className={cn(
              'rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition',
              products.hasNextPage
                ? 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
                : 'pointer-events-none border-border bg-muted/50 text-muted-foreground',
            )}
          >
            Next
          </Link>
        </nav>
      ) : null}

      <section className="rounded-3xl border border-border bg-gradient-to-br from-rose-50 via-orange-50/80 to-amber-50 p-8 text-neutral-900 shadow-[0_16px_34px_rgba(42,33,17,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Stay Informed</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold">Get monthly menus and premium offers</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-700">
          Join our list to receive curated seasonal product drops and chef recommendations.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Your email address"
            className="min-h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
          <button
            type="button"
            className="min-h-11 rounded-full bg-primary px-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90"
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}