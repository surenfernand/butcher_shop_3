import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: {
  doc: Page | Product | null | undefined
}): Promise<Metadata> => {
  const { doc } = args || {}
  if (!doc || typeof doc !== 'object') {
    return {
      openGraph: mergeOpenGraph({
        title: 'Payload Ecommerce Template',
        url: '/',
      }),
      title: 'Payload Ecommerce Template',
    }
  }

  const pageMeta = 'meta' in doc ? doc.meta : undefined

  const ogImage =
    typeof pageMeta?.image === 'object' &&
    pageMeta.image !== null &&
    'url' in pageMeta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${pageMeta.image.url}`

  return {
    description: pageMeta?.description,
    openGraph: mergeOpenGraph({
      ...(pageMeta?.description
        ? {
            description: pageMeta.description,
          }
        : {}),
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: pageMeta?.title || doc?.title || 'Payload Ecommerce Template',
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title: pageMeta?.title || doc?.title || 'Payload Ecommerce Template',
  }
}
