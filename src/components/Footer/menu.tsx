// src/components/Footer/menu.tsx

import React from 'react'
import { CMSLink } from '@/components/Link'
import type { Footer } from '@/payload-types'

type Props = {
  menu: Footer['navItems']
  variant?: 'stack' | 'inline'
}

export function FooterMenu({ menu, variant = 'stack' }: Props) {
  if (!menu?.length) return null

  if (variant === 'inline') {
    return (
      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center gap-x-0.5 gap-y-1">
          {menu.map(({ id, link }, index) => (
            <li key={id} className="flex items-center">
              {index > 0 ? (
                <span className="mx-2 text-neutral-600 select-none" aria-hidden>
                  |
                </span>
              ) : null}
              <CMSLink
                {...link}
                appearance="inline"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
              />
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {menu.map(({ id, link }) => (
        <li key={id}>
          <CMSLink
            {...link}
            appearance="inline"
            className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-[#e53935]"
          />
        </li>
      ))}
    </ul>
  )
}