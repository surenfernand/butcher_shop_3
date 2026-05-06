import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: [
      'title',
      'cutType',
      'agingProcess',
      'origin',
      'priceInUSD',
      '_status',
    ],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    gallery: true,
    categories: true,
    meta: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    priceInUSD: true,
    // inventory: true,
    productGallery: true,
    shopCardLabel: true,
    shopCardShortDescription: true,
    origin: true,
    cutType: true,
    agingProcess: true,
    sortPriority: true,
    cardButtonLabel: true,
    featuredInShop: true,
    purchaseFrequencies: true,
  },
  fields: [
    ...(defaultCollection?.fields || []).filter((field) => {
      if ('name' in field && field.name === 'inventory') return false
      return true
    }),
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    slugField({
      fieldToUse: 'title',
    }),

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Shop Card Content',
          fields: [
            {
              name: 'shopCardLabel',
              type: 'text',
              label: 'Card Label',
              defaultValue: 'Chef’s Selection',
            },
            {
              name: 'shopCardShortDescription',
              type: 'textarea',
              label: 'Card Short Description',
            },
            {
              name: 'cutType',
              type: 'select',
              required: true,
              options: [
                { label: 'Prime Rib', value: 'prime-rib' },
                { label: 'Wagyu Strips', value: 'wagyu-strips' },
                { label: 'Filet Mignon', value: 'filet-mignon' },
                { label: 'Tomahawk', value: 'tomahawk' },
              ],
            },
            {
              name: 'agingProcess',
              type: 'select',
              required: true,
              options: [
                { label: 'Dry-Aged', value: 'dry-aged' },
                { label: 'Wet-Aged', value: 'wet-aged' },
              ],
            },
            {
              name: 'origin',
              type: 'select',
              required: true,
              options: [
                { label: 'Japanese Heritage', value: 'japanese-heritage' },
                { label: 'Black Angus Heritage', value: 'black-angus-heritage' },
                { label: 'Midwest Corn-Fed', value: 'midwest-corn-fed' },
              ],
            },
            {
              name: 'sortPriority',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'featuredInShop',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'cardButtonLabel',
              type: 'text',
              defaultValue: 'Add to Atelier Box',
            },
            {
              name: 'productGallery',
              type: 'array',
              label: 'Gallery Images',
              maxRows: 6,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },

            // 🥩 Meat Type (Primary filter)
            {
              name: 'meatType',
              type: 'select',
              options: [
                { label: 'Beef', value: 'beef' },
                { label: 'Chicken', value: 'chicken' },
                { label: 'Pork', value: 'pork' },
                { label: 'Lamb / Mutton', value: 'lamb' },
                { label: 'Seafood', value: 'seafood' },
                { label: 'Turkey', value: 'turkey' },
                { label: 'Processed Meats', value: 'processed' },
              ],
            },

            // ⚖️ Weight
            {
              name: 'weight',
              type: 'number',
            },

            // 🌡️ Storage Type
            {
              name: 'storageType',
              type: 'select',
              options: [
                { label: 'Fresh', value: 'fresh' },
                { label: 'Frozen', value: 'frozen' },
                { label: 'Chilled', value: 'chilled' },
                { label: 'Marinated', value: 'marinated' },
              ],
            },

            // 🍽️ Preparation Style
            {
              name: 'preparationStyle',
              type: 'select',
              options: [
                { label: 'Curry Cut', value: 'curry-cut' },
                { label: 'BBQ / Grill', value: 'bbq' },
                { label: 'Stir Fry', value: 'stir-fry' },
                { label: 'Soup Bones', value: 'soup' },
                { label: 'Ready to Cook', value: 'ready' },
              ],
            },

            // 🌱 Quality
            {
              name: 'quality',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Organic', value: 'organic' },
                { label: 'Free Range', value: 'free-range' },
                { label: 'Grass Fed', value: 'grass-fed' },
                { label: 'Antibiotic Free', value: 'antibiotic-free' },
                { label: 'Halal', value: 'halal' },
              ],
            },

            // 🧂 Flavor
            {
              name: 'flavor',
              type: 'select',
              options: [
                { label: 'Plain', value: 'plain' },
                { label: 'Spicy', value: 'spicy' },
                { label: 'BBQ', value: 'bbq' },
                { label: 'Herb', value: 'herb' },
              ],
            },

            // 🕒 Availability
            {
              name: 'inStock',
              type: 'checkbox',
              defaultValue: true,
            },

            // ⭐ Tags
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Best Seller', value: 'best-seller' },
                { label: 'Top Rated', value: 'top-rated' },
                { label: 'New Arrival', value: 'new' },
              ],
            },




          ],
        },
        {
          label: 'Luxury Product Content',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              defaultValue: 'Curated Collection',
            },
            {
              name: 'badges',
              type: 'array',
              label: 'Badges',
              maxRows: 4,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'whatsInside',
              type: 'array',
              label: "What's Inside",
              fields: [
                {
                  name: 'quantity',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
            // {
            //   name: 'purchaseOptions',
            //   type: 'array',
            //   label: 'Purchase Options',
            //   minRows: 1,
            //   maxRows: 2,
            //   fields: [
            //     {
            //       name: 'label',
            //       type: 'text',
            //       required: true,
            //     },
            //     {
            //       name: 'price',
            //       type: 'text',
            //       required: true,
            //     },
            //     {
            //       name: 'subtext',
            //       type: 'text',
            //     },
            //     {
            //       name: 'highlighted',
            //       type: 'checkbox',
            //       defaultValue: false,
            //     },
            //   ],
            // },
            {
              name: 'purchaseFrequencies',
              type: 'group',
              label: 'Delivery Options',
              fields: [
                {
                  name: 'oneTime',
                  type: 'group',
                  label: 'One-Time Purchase',
                  fields: [

                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Enable',
                      defaultValue: true,
                    },
                    {
                      name: 'priceOverride',
                      type: 'text',
                      label: 'Override Price (e.g. $295)',
                    },
                  ],
                },
                {
                  name: 'monthly',
                  type: 'group',
                  label: 'Monthly Subscription',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Enable',
                      defaultValue: true,
                    },
                    {
                      name: 'priceOverride',
                      type: 'text',
                      label: 'Override Price (e.g. $249)',
                    },
                    {
                      name: 'savingsText',
                      type: 'text',
                      label: 'Savings Label (e.g. SAVE 15%)',
                    },
                  ],
                },
              ],
            },
            {
              name: 'primaryCTA',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Subscribe Now' },
                { name: 'url', type: 'text', defaultValue: '#' },
              ],
            },
            // {
            //   name: 'secondaryCTA',
            //   type: 'group',
            //   fields: [
            //     { name: 'label', type: 'text', defaultValue: 'One-Time Purchase' },
            //     { name: 'url', type: 'text', defaultValue: '#' },
            //   ],
            // },
            {
              name: 'reviewsHeading',
              type: 'text',
              defaultValue: 'Reviews',
            },
            {
              name: 'reviewsSummary',
              type: 'text',
              defaultValue: '4.9 Based on 128 Reviews',
            },
            {
              name: 'reviews',
              type: 'array',
              label: 'Reviews',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text' },
                { name: 'body', type: 'textarea', required: true },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                },
              ],
            },
          ],
        },


      ],
    },


  ],
})