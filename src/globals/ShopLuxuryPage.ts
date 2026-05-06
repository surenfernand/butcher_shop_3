import type { GlobalConfig } from 'payload'

export const ShopLuxuryPage: GlobalConfig = {
  slug: 'shop-luxury-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'sortLabel',
      type: 'text',
    },
  ],
}