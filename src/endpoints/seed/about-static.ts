import type { RequiredDataFromCollectionSlug } from 'payload'

export const aboutStaticData: () => RequiredDataFromCollectionSlug<'pages'> = () => ({
  slug: 'about',
  _status: 'published',
  title: 'About Us',
  hero: {
    type: 'none',
  },
  layout: [],
  meta: {
    description:
      'Learn about our butcher shop: quality meats, trusted sourcing, and service built for your table.',
    title: 'About Us',
  },
})
