type Props = {
  status?: string | null
}

const labelMap: Record<string, string> = {
  completed: 'Active',
  processing: 'Active',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function SubscriptionStatusBadge({ status }: Props) {
  const key = status || 'processing'
  const label = labelMap[key] || 'Active'
  const isActive = key === 'processing' || key === 'completed'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
        isActive
          ? 'border-[#e31e24]/35 bg-[#e31e24]/10 text-[#e31e24]'
          : 'border-neutral-200 bg-neutral-100 text-neutral-600',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
