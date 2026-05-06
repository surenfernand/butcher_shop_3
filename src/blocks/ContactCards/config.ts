import type { Block } from 'payload'

export const ContactCards: Block = {
  slug: 'contactCards',
  interfaceName: 'ContactCardsBlock',
  labels: {
    singular: 'Contact Cards',
    plural: 'Contact Cards',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Get In Touch',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Reservations & Inquiries',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'map-pin',
          options: [
            { label: 'Map Pin', value: 'map-pin' },
            { label: 'Phone', value: 'phone' },
            { label: 'Mail', value: 'mail' },
            { label: 'Clock', value: 'clock-3' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
      ],
      defaultValue: [
        {
          icon: 'map-pin',
          title: "THE BUTCHER'S CRAFT",
          line1: '1245 Gourmet Boulevard',
          line2: 'Culinary District, NY 10012',
        },
        {
          icon: 'phone',
          title: 'Direct Line',
          line1: '+1 (212) 555-0198',
          line2: 'Mon - Sat: 9am - 8pm',
        },
        {
          icon: 'mail',
          title: 'Correspondence',
          line1: 'atelier@filetgourmet.com',
          line2: 'press@filetgourmet.com',
        },
      ],
    },
  ],
}