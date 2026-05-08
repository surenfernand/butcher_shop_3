import type { Block } from 'payload'

export const ContactPage: Block = {
  slug: 'contactPage',
  interfaceName: 'ContactPageBlock',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Page',
  },
  fields: [
    { name: 'heroEyebrow', type: 'text', defaultValue: 'Contact' },
    { name: 'heroTitle', type: 'text', defaultValue: 'Get In Touch' },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'We would love to hear from you. Reach out for questions, delivery details, custom requests, or product recommendations.',
    },
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
    { name: 'faqTitle', type: 'text', defaultValue: 'Frequently Asked Questions' },
    {
      name: 'faqItems',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'supportTitle', type: 'text', defaultValue: 'Need immediate assistance?' },
    {
      name: 'supportDescription',
      type: 'textarea',
      defaultValue:
        'Our team is available to help with orders, product details, delivery windows, and custom requests.',
    },
    { name: 'supportPrimaryLabel', type: 'text', defaultValue: 'Call Us' },
    { name: 'supportPrimaryUrl', type: 'text', defaultValue: 'tel:+14503131449' },
    { name: 'supportSecondaryLabel', type: 'text', defaultValue: 'Email Support' },
    { name: 'supportSecondaryUrl', type: 'text', defaultValue: 'mailto:info@filetgourmet.ca' },
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