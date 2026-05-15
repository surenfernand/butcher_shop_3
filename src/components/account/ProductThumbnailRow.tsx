import type { Media, Product } from '@/payload-types'
import { resolveImageSrc } from '@/constants/fallbackImage'

type Props = {
  product?: Product | null
  fallbackLabel?: string
}

const getProductImage = (product?: Product | null): Media | undefined => {
  const image = product?.productGallery?.[0]?.image
  return image && typeof image === 'object' ? image : undefined
}

export function ProductThumbnailRow({ product, fallbackLabel = 'Subscription Product' }: Props) {
  const image = getProductImage(product)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-border bg-muted">
        <img
          src={resolveImageSrc(image?.url, 'product')}
          alt={image?.alt || product?.title || fallbackLabel}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold uppercase tracking-[0.08em]">
          {product?.title || fallbackLabel}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Premium selection</p>
      </div>
    </div>
  )
}
