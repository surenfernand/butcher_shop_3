import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Product, Variant } from '@/payload-types'
import { getOrderLineProductImage } from '@/utilities/getOrderLineProductImage'
import Link from 'next/link'

type Props = {
  product: Product
  style?: 'compact' | 'default'
  variant?: Variant
  quantity?: number
  lineSubtotalInCents?: number
  currencyCode?: string
}

export const ProductItem: React.FC<Props> = ({
  product,
  quantity,
  variant,
  lineSubtotalInCents,
  currencyCode,
}) => {
  const { title } = product

  const image = getOrderLineProductImage(product, variant)


  const itemPrice = variant?.priceInUSD ?? product.priceInUSD

  const displayLineAmount =
    typeof lineSubtotalInCents === 'number'
      ? lineSubtotalInCents
      : itemPrice != null && quantity
        ? itemPrice * quantity
        : undefined

  const itemURL = `/products/${product.slug}${variant ? `?variant=${variant.id}` : ''}`

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-stretch justify-stretch h-20 w-20 p-2 rounded-lg border">
        <div className="relative w-full h-full">
          {image ? (
            <Media fill imgClassName="rounded-lg object-cover" resource={image} />
          ) : null}
        </div>
      </div>

      <div className="flex grow justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-lg">
            <Link href={itemURL}>{title}</Link>
          </p>

          {variant && (
            <p className="text-sm font-mono text-primary/50 tracking-widest">
              {variant.options
                .map((option) => (typeof option === 'object' ? option.label : null))
                .filter(Boolean)
                .join(', ')}
            </p>
          )}

          {quantity != null && <div>x{quantity}</div>}
        </div>

        {displayLineAmount !== undefined && quantity != null && (
          <div className="text-right">
            <p className="font-medium text-lg">Subtotal</p>
            <Price
              className="font-mono text-primary/50 text-sm"
              amount={displayLineAmount}
              currencyCode={currencyCode}
            />
          </div>
        )}
      </div>
    </div>
  )
}