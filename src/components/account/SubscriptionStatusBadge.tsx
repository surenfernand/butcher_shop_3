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
          ? 'border-[#d9c7a7] bg-[#f4ead8] text-[#7c6235]'
          : 'border-[#e5d6cf] bg-[#f8f2ef] text-[#8b6359]',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
