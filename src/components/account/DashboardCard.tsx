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
        'rounded-xl border border-border bg-white p-6 shadow-[0_12px_26px_rgba(42,34,22,0.05)]',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-foreground">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
