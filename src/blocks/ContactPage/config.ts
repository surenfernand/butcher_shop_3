import type { Block } from 'payload'

export const ContactPage: Block = {
  slug: 'contactPage',
  interfaceName: 'ContactPageBlock',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Page',
  },
  fields: [
    { name: 'formTitle', type: 'text', defaultValue: 'Send An Inquiry' },
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'map-pin',
          options: [
            { label: 'Map Pin', value: 'map-pin' },
            { label: 'Phone', value: 'phone' },
            { label: 'Mail', value: 'mail' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
      ],
    },
    {
      name: 'storeHours',
      type: 'array',
      fields: [
        { name: 'day', type: 'text', required: true },
        { name: 'time', type: 'text', required: true },
      ],
    },
    { name: 'storeNote', type: 'text' },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'mapTitle', type: 'text', defaultValue: 'Toronto' },
    { name: 'mapLabel', type: 'text', defaultValue: "The Butcher's Craft Atelier" },
    {
      name: 'mapEmbedUrl',
      type: 'textarea',
      label: 'Google Map Embed URL',
      required: true,
    }
  ],
}