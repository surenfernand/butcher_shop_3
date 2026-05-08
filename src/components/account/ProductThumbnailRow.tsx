import type { Media, Product } from '@/payload-types'

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
    <div className="flex items-center gap-3 rounded-lg border border-[#efe6d8] bg-[#fdfbf7] p-3">
      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-[#e6dac4] bg-[#f4efe4]">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || product?.title || fallbackLabel}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.1em] text-[#8f7a58]">
            Image
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#2f2a24]">
          {product?.title || fallbackLabel}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8f7a58]">Premium selection</p>
      </div>
    </div>
  )
}
