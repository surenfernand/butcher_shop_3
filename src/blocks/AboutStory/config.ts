import type { Block } from 'payload'

export const AboutStory: Block = {
  slug: 'aboutStory',
  interfaceName: 'AboutStoryBlock',
  labels: {
    singular: 'About Story',
    plural: 'About Story Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'The Legacy of Excellence',
    },
    {
      name: 'lead',
      type: 'textarea',
      required: true,
      defaultValue:
        "Founded in 1982, The Butcher's Craft began as a small family atelier dedicated to the pursuit of the perfect steak.",
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      defaultValue:
        'Our master butchers hand-select every cut, aging them with patience and precision to achieve remarkable depth of flavor.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Explore Our Cuts',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/shop',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}