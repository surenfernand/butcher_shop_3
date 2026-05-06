import { CollectionConfig } from 'payload'

export const Qualities: CollectionConfig = {
  slug: 'qualities',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}