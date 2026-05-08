import type { Address } from '@/payload-types'

type Props = {
  address: Address
}

export function AddressPreviewCard({ address }: Props) {
  const heading = [address.firstName, address.lastName].filter(Boolean).join(' ') || address.title || 'Saved Address'

  return (
    <article className="rounded-lg border border-[#efe6d8] bg-[#fdfbf7] p-4">
      <p className="text-sm font-semibold text-foreground">{heading}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {address.addressLine1 || 'No address line'}
        {address.addressLine2 ? `, ${address.addressLine2}` : ''}
        {address.city ? `, ${address.city}` : ''}
        {address.state ? `, ${address.state}` : ''}
        {address.postalCode ? ` ${address.postalCode}` : ''}
      </p>
      {address.phone && <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">{address.phone}</p>}
    </article>
  )
}
