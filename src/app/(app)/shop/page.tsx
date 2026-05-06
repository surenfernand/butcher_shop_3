import { LuxuryProductCard } from '@/components/Shop/LuxuryProductCard'
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
    draft: false,
    overrideAccess: false,
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

  return (
    <div>
      {searchValue ? (
        <p className="mb-6 text-sm text-[#b7b7b7]">
          {products.docs.length === 0 ? 'There are no products that match ' : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-semibold text-white">&quot;{String(searchValue)}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs.length === 0 ? (
        <p className="mb-6 text-sm text-[#b7b7b7]">
          {shopPage.emptyStateText || 'No products found. Please try different filters.'}
        </p>
      ) : null}

      {products.docs.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {products.docs.map((product) => {
            return <LuxuryProductCard key={product.id} product={product} />
          })}
        </div>
      ) : null}
    </div>
  )
}