import type { Block } from 'payload'

export const ProductGrid: Block = {
  slug: 'productGrid',
  interfaceName: 'ProductGridBlock',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'The Shop',
    },
    {
      name: 'description',
      type: 'text',
      defaultValue: "Curated selections of the world's finest prime cuts.",
    },
  ],
}