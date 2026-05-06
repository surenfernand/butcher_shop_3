import {
    Clock3,
    Mail,
    MapPin,
    Phone,
    type LucideIcon,
} from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

const icons: Record<string, LucideIcon> = {
  'clock-3': Clock3,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
}

type Item = {
  icon?: string | null
  title?: string | null
  line1?: string | null
  line2?: string | null
}

type Props = {
  id?: DefaultDocumentIDType
  className?: string
  title?: string | null
  subtitle?: string | null
  items?: Item[] | null
}

export const ContactCardsBlock: React.FC<Props> = ({ title, subtitle, items, className }) => {
  return (
    <section
      className={['border-y border-border bg-muted py-20 text-foreground', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-16 text-center">
          {title && (
            <h2 className="text-5xl font-bold uppercase tracking-[0.12em] text-foreground">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#d3a84b]">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(items || []).map((item, index) => {
            const Icon = icons[item.icon || 'map-pin'] || MapPin

            return (
              <div
                key={index}
                className="border border-border bg-card p-10 text-center shadow-sm transition hover:border-[#d3a84b]/40"
              >
                <Icon className="mx-auto mb-6 h-10 w-10 text-[#d3a84b]" strokeWidth={1.5} />
                {item.title && (
                  <h3 className="mb-3 text-2xl uppercase tracking-[0.08em] text-foreground">{item.title}</h3>
                )}
                {item.line1 && (
                  <p className="text-base leading-7 text-muted-foreground">{item.line1}</p>
                )}
                {item.line2 && (
                  <p className="text-base leading-7 text-muted-foreground">{item.line2}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}