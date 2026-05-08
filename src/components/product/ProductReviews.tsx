import type { Product } from '@/payload-types'

type Props = {
  product: Product
}

export default function ProductReviews({ product }: Props) {
  if (!product.reviews?.length) return null

  return (
    <section className="mt-20 border-t border-[#ece2cf] pt-14">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-semibold tracking-tight text-[#23201b] md:text-4xl">
            {product.reviewsHeading || 'Reviews'}
          </h2>
          {product.reviewsSummary && (
            <p className="text-[#645e54]">{product.reviewsSummary}</p>
          )}
        </div>

        <button className="w-fit rounded-full border border-[#d8c49b] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6535]">
          Write a Review
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {product.reviews.map((review, i) => (
          <div key={i} className="rounded-2xl border border-[#eadfcb] bg-white p-6 shadow-[0_12px_28px_rgba(37,30,20,0.06)]">
            <div className="mb-4 text-[#c59b4d]">
              {'★'.repeat(review.rating || 5)}
            </div>

            <p className="mb-6 italic leading-7 text-[#49443a]">
              &quot;{review.body}&quot;
            </p>

            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-[#26231d]">
                {review.name}
              </span>
              {review.role && (
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#837c70]">
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