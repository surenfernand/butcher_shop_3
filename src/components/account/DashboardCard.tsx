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
        'rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.14em]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
