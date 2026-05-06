import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../utilities/access'

export const createBranchHolidaysCollection = (adminGroup = 'Shop'): CollectionConfig => ({
  slug: 'branch-holidays',
  admin: { useAsTitle: 'title', group: adminGroup },
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'branch', type: 'relationship', relationTo: 'branches', required: true, index: true },
    { name: 'date', type: 'date', required: true, index: true },
    { name: 'serviceTypes', type: 'select', hasMany: true, options: ['pickup', 'delivery'] },
    { name: 'message', type: 'textarea' },
  ],
})
