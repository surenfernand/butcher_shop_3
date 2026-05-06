import { CollectionConfig } from 'payload'

export const Flavors: CollectionConfig = {
  slug: 'flavors',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}