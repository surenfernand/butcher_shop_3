import { CollectionConfig } from 'payload'

export const CutTypes: CollectionConfig = {
  slug: 'cut-types',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}