import type { Block } from 'payload'

export const SocialLinks: Block = {
  slug: 'socialLinks',
  interfaceName: 'SocialLinksBlock',
  labels: {
    singular: 'Social Links',
    plural: 'Social Links',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Join the Inner Circle',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Instagram', url: '#' },
        { label: 'Facebook', url: '#' },
        { label: 'LinkedIn', url: '#' },
        { label: 'Pinterest', url: '#' },
      ],
    },
  ],
}