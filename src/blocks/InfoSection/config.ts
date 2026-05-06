import type { Block } from 'payload'

export const InfoSection: Block = {
  slug: 'infoSection',
  interfaceName: 'InfoSectionBlock',
  labels: {
    singular: 'Info Section',
    plural: 'Info Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'SINCE 1984',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our House',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'quote',
      type: 'textarea',
    },
    {
      name: 'linkLabel',
      type: 'text',
      defaultValue: 'OUR STORY',
    },
    {
      name: 'linkUrl',
      type: 'text',
      defaultValue: '/our-story',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}