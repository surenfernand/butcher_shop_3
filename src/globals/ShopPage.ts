import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const ShopPage: GlobalConfig = {
  slug: 'shop-page',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Shop By Categories',
    },
    {
      name: 'introText',
      type: 'textarea',
      defaultValue: "Our ready-to-eat meals are crafted with fresh, high-quality ingredients and fully cooked for your convenience—just heat and enjoy a wholesome, delicious meal anytime.",
    },
    {
      name: 'emptyStateText',
      type: 'text',
      defaultValue: 'No products found. Please try different filters.',
    },
    {
      name: 'resultsLabelSingle',
      type: 'text',
      defaultValue: 'result',
    },
    {
      name: 'resultsLabelPlural',
      type: 'text',
      defaultValue: 'results',
    },
    {
      name: 'sortLabel',
      type: 'text',
      defaultValue: 'Sort by',
    },
    {
      name: 'filters',
      type: 'group',
      fields: [
        {
          name: 'cutTypeLabel',
          type: 'text',
          defaultValue: 'Cut Type',
        },
        {
          name: 'agingProcessLabel',
          type: 'text',
          defaultValue: 'Aging Process',
        },
        {
          name: 'originLabel',
          type: 'text',
          defaultValue: 'Origin',
        },
        {
          name: 'priceRangeLabel',
          type: 'text',
          defaultValue: 'Price Range',
        },
      ],
    },
  ],
}