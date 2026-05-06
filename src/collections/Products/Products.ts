import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cutType',
      type: 'select',
      options: [
        'Prime Rib',
        'Wagyu Strips',
        'Filet Mignon',
        'Tomahawk',
      ],
    },
    {
      name: 'aging',
      type: 'select',
      options: [
        '21 Days Dry-Aged',
        '45 Days Dry-Aged',
        'Wet-Aged Prime',
      ],
    },
    {
      name: 'origin',
      type: 'select',
      options: [
        'Japanese Miyazaki',
        'Australian Wagyu',
        'Heritage Angus',
      ],
    },
    {
      name: 'tag',
      type: 'text',
    },

    {
      name: 'purchaseFrequencies',
      type: 'group',
      label: 'Purchase Frequencies',
      
      fields: [
        {
          name: 'oneTimeEnabled',
          type: 'checkbox',
          label: 'Show One-Time Purchase',
          defaultValue: true,
        },
        {
          name: 'weeklyEnabled',
          type: 'checkbox',
          label: 'Show Weekly Subscription',
          defaultValue: true,
        },
        {
          name: 'monthlyEnabled',
          type: 'checkbox',
          label: 'Show Monthly Subscription',
          defaultValue: true,
        },
      ],
    },
  ],
}