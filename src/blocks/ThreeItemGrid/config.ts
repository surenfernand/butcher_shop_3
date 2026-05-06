import type { Block } from 'payload'

export const ThreeItemGrid: Block = {
  slug: 'threeItemGrid',
  fields: [
    {
      name: 'products',
      type: 'relationship',
      admin: {
        isSortable: true,
      },
      hasMany: true,
      label: 'Products to show',
      maxRows: 2,
      minRows: 2,
      relationTo: 'products',
    },
  ],
  interfaceName: 'ThreeItemGridBlock',
  labels: {
    plural: 'Three Item Grids',
    singular: 'Three Item Grid',
  },
}
