// src/components/Footer/menu.tsx

import React from 'react'
import { CMSLink } from '@/components/Link'
import type { Footer } from '@/payload-types'

type Props = {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <ul className="flex flex-col gap-4">
      {menu.map(({ id, link }) => (
        <li key={id}>
          <CMSLink
            {...link}
            appearance="inline"
            className="text-xs uppercase tracking-[0.22em] text-[#8f8f8f] transition-colors hover:text-[#d4a63c]"
          />
        </li>
      ))}
    </ul>
  )
}