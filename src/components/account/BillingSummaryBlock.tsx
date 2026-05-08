type Props = {
  amountLabel: string
  cadenceLabel: string
  paymentLabel?: string
}

export function BillingSummaryBlock({
  amountLabel,
  cadenceLabel,
  paymentLabel = 'Stored payment method via Stripe',
}: Props) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Billing Summary</p>
      <p className="mt-2 text-2xl font-semibold">{amountLabel}</p>
      <p className="mt-1 text-sm text-muted-foreground">{cadenceLabel}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">{paymentLabel}</p>
    </div>
  )
}
