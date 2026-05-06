import { RequiredDataFromCollectionSlug } from 'payload'

export const homeStaticData: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'highImpact',
      eyebrow: 'EXCELLENCE IN EVERY CUT.',
      heading: "The Butcher's Craft",
      description:
        'Discover a rigorous selection of exceptional meats, carefully dry-aged in our atelier.',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'EXPLORE THE COLLECTION',
            url: '/shop',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'OUR SOURCING PHILOSOPHY',
            url: '/shop-luxury',
          },
        },
      ],
    },
    layout: [],
    meta: {
      description: 'An open-source ecommerce site built with Payload and Next.js.',
      title: 'Payload Ecommerce Template',
    },
    title: 'Home',
  }
}
