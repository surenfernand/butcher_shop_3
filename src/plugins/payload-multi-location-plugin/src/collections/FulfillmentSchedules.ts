import type { CollectionConfig, CollectionSlug } from 'payload'
import { adminOnly, publicRead } from '../utilities/access'

const weeklyDayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]

export const createFulfillmentSchedulesCollection = (
  productSlug: CollectionSlug = 'products',
  adminGroup = 'Shop',
): CollectionConfig => ({
  slug: 'fulfillment-schedules',
  admin: { useAsTitle: 'name', group: adminGroup },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },

    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      hasMany: true,
      index: true,
    },

    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'delivery',
      options: [
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pickup', value: 'pickup' },
      ],
      required: true,
      index: true,
      admin: {
        description:
          'Create one schedule for Pickup and another schedule for Delivery if they have different days or dates.',
      },
    },

    {
      name: 'postalCodes',
      label: 'Delivery postal codes / FSA prefixes',
      type: 'array',
      admin: {
        condition: (_data, siblingData) => siblingData?.serviceType === 'delivery',
        description:
          'Only used for delivery schedules. Use full postal codes or prefixes such as M5V.',
      },
      fields: [{ name: 'code', type: 'text', required: true }],
    },

    {
      name: 'weeklyDays',
      label: 'Weekly Days',
      type: 'select',
      hasMany: true,
      required: true,
      options: weeklyDayOptions,
      admin: {
        description:
          'Only these days will be selectable in the checkout calendar for this branch and service type.',
      },
    },

    {
      name: 'availableDates',
      label: 'Extra available dates',
      type: 'array',
      fields: [{ name: 'date', type: 'date', required: true }],
    },
    {
      name: 'shippingCharge',
      label: 'Shipping Charge',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        condition: (_data, siblingData) => siblingData?.serviceType === 'delivery',
        description: 'Applies only to delivery orders.',
      },
    },

    {
      name: 'product',
      label: 'Product',
      type: 'relationship',
      relationTo: productSlug,
      hasMany: true,
      required: false,
      index: true,
      admin: {
        description:
          'Optional. Select a product to make this fulfillment schedule apply only to that product. Leave empty to keep it branch-wide.',
      },
    },

    {
      name: 'timeSlots',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
  ],
})