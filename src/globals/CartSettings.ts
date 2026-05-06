import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const CartSettings: GlobalConfig = {
  slug: 'cart-settings',
  label: 'Cart Timer Settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Shop',
  },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'timerSeconds', type: 'number', defaultValue: 120, min: 10, required: true },
    { name: 'warningSeconds', type: 'number', defaultValue: 30, min: 1, required: true },
    { name: 'extendSeconds', type: 'number', defaultValue: 30, min: 1, required: true },
    { name: 'modalTitle', type: 'text', defaultValue: 'Preserving Freshness', required: true },
    {
      name: 'modalMessage',
      type: 'textarea',
      defaultValue:
        'Our artisanal selections are limited. Your cart is about to be cleared to ensure other patrons can enjoy these prime cuts.',
      required: true,
    },
    { name: 'confirmButtonLabel', type: 'text', defaultValue: 'OK', required: true },
    { name: 'extendButtonLabel', type: 'text', defaultValue: 'Add 30 sec more', required: true },
    { name: 'footerText', type: 'text', defaultValue: "The Butcher's Craft — Est. 1982" },
  ],
}