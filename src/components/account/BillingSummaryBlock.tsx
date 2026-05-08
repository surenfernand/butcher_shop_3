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
    <div className="rounded-lg border border-[#efe6d8] bg-[#fdfbf7] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[#8f7a58]">Billing Summary</p>
      <p className="mt-2 text-2xl font-semibold text-[#2f2a24]">{amountLabel}</p>
      <p className="mt-1 text-sm text-[#746a5a]">{cadenceLabel}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#8f7a58]">{paymentLabel}</p>
    </div>
  )
}
