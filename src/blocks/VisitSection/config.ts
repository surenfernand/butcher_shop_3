import type { Block } from 'payload'

export const VisitSection: Block = {
  slug: 'visitSection',
  interfaceName: 'VisitSectionBlock',
  labels: {
    singular: 'Visit Section',
    plural: 'Visit Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Visit Us',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Located in the heart of the historic district, our flagship boutique offers personal consultations with our master butchers.',
    },
    {
      name: 'hours',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Monday - Friday', value: '09:00 - 20:00' },
        { label: 'Saturday', value: '10:00 - 18:00' },
        { label: 'Sunday', value: 'Closed' },
      ],
    },
    {
      name: 'locationLabel',
      type: 'text',
      defaultValue: 'New York',
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}