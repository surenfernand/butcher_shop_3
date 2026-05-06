import type { DefaultDocumentIDType } from 'payload'
import Link from 'next/link'
import React from 'react'

type Item = {
  label?: string | null
  url?: string | null
}

type Props = {
  id?: DefaultDocumentIDType
  className?: string
  title?: string | null
  items?: Item[] | null
}

export const SocialLinksBlock: React.FC<Props> = ({ title, items, className }) => {
  return (
    <section className={['mx-auto max-w-[1280px] px-8 pb-20', className].filter(Boolean).join(' ')}>
      <div className="border-t border-white/10 pt-20 text-center">
        {title && <h3 className="mb-8 text-3xl font-semibold uppercase tracking-[0.12em] text-white">{title}</h3>}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {(items || []).map((item, index) => (
            <Link
              key={index}
              href={item.url || '#'}
              className="text-xs uppercase tracking-[0.3em] text-[#d2c5b1] transition hover:text-[#d3a84b]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}