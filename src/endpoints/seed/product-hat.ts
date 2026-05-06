import type { Category, Product, VariantOption, VariantType } from '@/payload-types'
import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ProductArgs = {
  galleryImage: Media
  metaImage: Media
  variantTypes: VariantType[]
  categories: Category[]
  relatedProducts: Product[]
}


export const productHatData: (args: ProductArgs) => RequiredDataFromCollectionSlug<'products'> = ({
  galleryImage,
  relatedProducts,
  metaImage,
  categories,
}) => {
  return {
    meta: {
      title: 'Hat | Payload Ecommerce Template',
      image: metaImage,
      description:
        'Top off your look with our classic hat, crafted for style and comfort.',
    },
    _status: 'published',

    title: 'Hat',
    slug: 'hat',

    cutType: 'prime-rib',
    agingProcess: 'dry-aged',
    origin: 'japanese-heritage',

    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'Top off your look with our classic hat, crafted for style and comfort.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },

    categories,
    gallery: [{ image: galleryImage }],

    priceInUSDEnabled: true,
    priceInUSD: 2500,

    relatedProducts,
  }
}
