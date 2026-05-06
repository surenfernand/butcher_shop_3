import { CollectionConfig } from 'payload'

export const MeatTypes: CollectionConfig = {
  slug: 'meat-types',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}