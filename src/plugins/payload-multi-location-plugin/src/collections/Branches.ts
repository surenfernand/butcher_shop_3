import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../utilities/access'

export const createBranchesCollection = (adminGroup = 'Shop'): CollectionConfig => ({
  slug: 'branches',
  admin: {
    useAsTitle: 'name',
    group: adminGroup,
    defaultColumns: ['name', 'code', 'isActive'],
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', unique: true, index: true, required: true },
    { name: 'address', type: 'textarea' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, index: true },
    {
      name: 'openingHours',
      type: 'json',
      admin: { description: 'Optional branch opening hours. Example: {"monday":[{"open":"09:00","close":"18:00"}]}' },
    },
    {
      name: 'holidayMessage',
      type: 'textarea',
      defaultValue: 'This branch is closed today.',
    },
  ],
})
