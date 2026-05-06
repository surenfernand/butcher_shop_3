import type { Block } from 'payload'

export const FeaturedCuts: Block = {
  slug: 'featuredCuts',
  interfaceName: 'FeaturedCutsBlock',
  labels: {
    singular: 'Featured Cuts',
    plural: 'Featured Cuts',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'EXCLUSIVE SELECTION',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Monthly Menu',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'text' },
        { name: 'tag', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          admin: {
            description:
              'Optional. Links “View product” to this product. If empty, the button opens the shop.',
          },
        },
      ],
    },
  ],
}