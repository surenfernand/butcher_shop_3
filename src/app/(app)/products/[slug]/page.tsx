import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import ProductDetails from '@/components/product/ProductDetails'
import ProductGallery from '@/components/product/ProductGallery'
import ProductReviews from '@/components/product/ProductReviews'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

type Args = {
  params: {
    slug: string
  }
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

  return (
    <main className="bg-background pt-32 pb-20 text-foreground">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: product.title || 'Product' },
          ]}
        />
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          <div className="lg:col-span-5">
            <ProductDetails product={product} />
          </div>
        </div>

        <ProductReviews product={product} />
      </div>
    </main>
  )
}