import type { Product } from '@/payload-types'

type Props = {
  product: Product
}

export default function ProductReviews({ product }: Props) {
  if (!product.reviews?.length) return null

  return (
    <section id="reviews" className="mt-20 border-t border-neutral-200 pt-14">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {product.reviewsHeading || 'Reviews'}
          </h2>
          {product.reviewsSummary && <p className="text-neutral-600">{product.reviewsSummary}</p>}
        </div>

        <button
          type="button"
          className="w-fit rounded-sm border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700 transition hover:border-[#e53935] hover:text-[#e53935]"
        >
          Write a Review
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {product.reviews.map((review, i) => (
          <div
            key={i}
            className="rounded-sm border border-neutral-200 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-4 text-[#e53935]">{'★'.repeat(review.rating || 5)}</div>

            <p className="mb-6 italic leading-7 text-neutral-700">&quot;{review.body}&quot;</p>

            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">
                {review.name}
              </span>
              {review.role && (
                <span className="block text-[10px] uppercase tracking-[0.18em] text-neutral-500">{review.role}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
