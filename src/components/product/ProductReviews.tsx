import type { Product } from '@/payload-types'

type Props = {
  product: Product
}

export default function ProductReviews({ product }: Props) {
  if (!product.reviews?.length) return null

  return (
    <section className="mt-24 border-t border-white/10 pt-16">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-bold uppercase text-white">
            {product.reviewsHeading || 'Reviews'}
          </h2>
          {product.reviewsSummary && (
            <p className="text-[#d8ccb7]">{product.reviewsSummary}</p>
          )}
        </div>

        <button className="w-fit border-b border-[#d4a63c] pb-1 text-sm uppercase tracking-[0.15em] text-[#d4a63c]">
          Write a Review
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {product.reviews.map((review, i) => (
          <div key={i} className="border-l-2 border-[#d4a63c] bg-[#161818] p-6">
            <div className="mb-4 text-[#d4a63c]">
              {'★'.repeat(review.rating || 5)}
            </div>

            <p className="mb-6 italic leading-7 text-white/90">
              &quot;{review.body}&quot;
            </p>

            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-white">
                {review.name}
              </span>
              {review.role && (
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#8f8679]">
                  {review.role}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}