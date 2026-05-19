// src/globals/Footer.ts

import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Footer logo. Upload the transparent gold logo here.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contactEmail',
          type: 'email',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'contactPhone',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
    {
      name: 'bottomBar',
      type: 'group',
      fields: [
        {
          name: 'legalText',
          type: 'text',
        },
        {
          name: 'locationText',
          type: 'text',
        },
        {
          name: 'creditLabel',
          type: 'text',
        },
        {
          name: 'creditUrl',
          type: 'text',
        },
      ],
    },
  ],
}