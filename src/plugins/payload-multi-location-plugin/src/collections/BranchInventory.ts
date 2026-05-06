import type { CollectionConfig, CollectionSlug } from 'payload'
import { adminOnly, publicRead } from '../utilities/access'

export const createBranchInventoryCollection = (
  productSlug: CollectionSlug = 'products',
  adminGroup = 'Shop',
): CollectionConfig => ({
  slug: 'branch-inventory',
  admin: {
    group: adminGroup,
    defaultColumns: ['branch', 'product',  'stockStatus', 'stockQuantity'],
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'branch', type: 'relationship', relationTo: 'branches', required: true, index: true },
    { name: 'product', type: 'relationship', relationTo: productSlug, required: true, index: true },
    // { name: 'price', type: 'number', min: 0, required: true },
    // { name: 'regularPrice', type: 'number', min: 0 },
    // { name: 'salePrice', type: 'number', min: 0 },
    { name: 'sku', type: 'text' },
    { name: 'manageStock', type: 'checkbox', defaultValue: true },
    { name: 'stockQuantity', type: 'number', defaultValue: 0 },
    {
      name: 'stockStatus',
      type: 'select',
      defaultValue: 'instock',
      options: [
        { label: 'In stock', value: 'instock' },
        { label: 'Out of stock', value: 'outofstock' },
        { label: 'Backorder', value: 'backorder' },
      ],
    },
    { name: 'allowBackorders', type: 'checkbox', defaultValue: false },
    {
      name: 'maxPickupOrdersPerDay',
      label: 'Maximum pickup orders per day for this product',
      type: 'number',
      min: 0,
      admin: { description: '0 or empty means no per-product pickup limit.' },
    },
    {
      name: 'maxDeliveryOrdersPerDay',
      label: 'Maximum delivery orders per day for this product',
      type: 'number',
      min: 0,
      admin: { description: '0 or empty means no per-product delivery limit.' },
    },
  ],
})