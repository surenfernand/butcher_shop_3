import type { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardCard({ title, subtitle, action, children, className }: Props) {
  return (
    <section
      className={cn(
        'rounded-sm border border-neutral-200 bg-white p-6 text-neutral-900 shadow-[0_8px_28px_rgba(0,0,0,0.05)]',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
