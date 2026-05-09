import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import { LuxuryProductCard } from '@/components/Shop/LuxuryProductCard'
import ProductDetails from '@/components/product/ProductDetails'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfoAccordion from '@/components/product/ProductInfoAccordion'
import ProductReviews from '@/components/product/ProductReviews'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params

  if (!slug) return notFound()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1,
    pagination: false,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const product = result.docs?.[0]

  if (!product) return notFound()

  const relatedProducts = await payload.find({
    collection: 'products',
    limit: 3,
    depth: 2,
    where: {
      and: [
        {
          id: {
            not_equals: product.id,
          },
        },
        ...(product.meatType
          ? [
              {
                meatType: {
                  equals: product.meatType,
                },
              },
            ]
          : []),
      ],
    },
  })

  return (
    <div className="bg-neutral-50 pb-20 pt-20 text-neutral-900">
      <div className="container">
        <Breadcrumbs
          className="mb-10"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: product.title || 'Product' },
          ]}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:pr-4">
            <ProductGallery product={product} />
            <ProductInfoAccordion product={product} />
          </div>

          <div className="lg:col-span-5">
            <ProductDetails product={product} />
          </div>
        </div>

        <ProductReviews product={product} />

        {relatedProducts.docs.length ? (
          <section className="mt-20 border-t border-neutral-200 bg-neutral-50 pt-14">
            <div className="mb-8">
              <p
                className="text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: '#e53935' }}
              >
                You May Also Like
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.docs.map((relatedProduct) => (
                <LuxuryProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
            <p className="mt-10 text-center">
              <Link
                href="/shop"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-600 transition hover:text-[#e53935]"
              >
                See all products
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </div>
  )
}