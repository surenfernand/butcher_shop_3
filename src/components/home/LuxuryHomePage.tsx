import { Media } from '@/components/Media'
import type { Footer, Header, Media as MediaType, Page, Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Star } from 'lucide-react'
import Link from 'next/link'

type LuxuryHomePageProps = {
  page: Page
  header: Header
  footer: Footer
  featuredProducts: Product[]
  newsPages: Page[]
}

const sectionTitleClass = 'text-3xl font-semibold tracking-tight text-[#232220] md:text-4xl'

const defaultCategories = [
  {
    title: 'Our Products',
    description: 'Premium seafood cuts selected daily for restaurant-level quality at home.',
    href: '/shop',
  },
  {
    title: 'Ready to Eat Meals',
    description: 'Chef-finished meals with refined flavors, ready in minutes.',
    href: '/shop?tab=ready-to-eat',
  },
  {
    title: 'Meat Boxes',
    description: 'Curated gourmet boxes crafted for gatherings and weekly meal plans.',
    href: '/shop?tab=meat-boxes',
  },
  {
    title: 'Subscriptions',
    description: 'Flexible premium subscriptions with curated monthly selections.',
    href: '/shop?tab=subscriptions',
  },
]

const reviewCards = [
  {
    name: 'Sophie R.',
    body: 'Exceptional quality and beautifully packed products. It genuinely feels like fine-dining ingredients at home.',
  },
  {
    name: 'Marc D.',
    body: 'Our monthly box has become a ritual. Always fresh, always premium, and incredibly convenient.',
  },
  {
    name: 'Anita L.',
    body: 'Customer service is warm and helpful. They recommended perfect cuts for our family dinner.',
  },
]

function extractMedia(resource: unknown): MediaType | null {
  if (!resource || typeof resource !== 'object') return null
  if ('url' in resource) return resource as MediaType
  return null
}

function formatPrice(value: number | null | undefined) {
  if (typeof value !== 'number') return null
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2,
  }).format(value)
}

function ProductCard({ product }: { product: Product }) {
  const image = extractMedia(product.productGallery?.[0]?.image)
  const price = formatPrice(product.priceInUSD)

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ebe4d7] bg-white shadow-[0_16px_44px_rgba(34,30,22,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_52px_rgba(34,30,22,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[5/4] w-full bg-[linear-gradient(160deg,#f8f4ea_0%,#f2ecdd_100%)]">
          {image ? (
            <Media resource={image} className="h-full w-full" imgClassName="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-xs font-medium uppercase tracking-[0.18em] text-[#8d7c59]">
              Replace product image
            </div>
          )}
          {product.shopCardLabel ? (
            <span className="absolute left-4 top-4 rounded-full bg-[#f6e4b9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5a4a2a]">
              {product.shopCardLabel}
            </span>
          ) : null}
        </div>
        <div className="space-y-3 px-5 py-5">
          <h3 className="line-clamp-2 text-lg font-semibold text-[#1f1d1a]">{product.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-[#655f53]">
            {product.shopCardShortDescription || 'Premium selection prepared with exceptional care.'}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold tracking-wide text-[#a8843b]">{price || 'View details'}</span>
            <span className="rounded-full border border-[#d9c69a] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#58482d]">
              Discover
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export function LuxuryHomePage({
  page,
  header,
  footer,
  featuredProducts,
  newsPages,
}: LuxuryHomePageProps) {
  const heroMedia = extractMedia(page.hero?.media)
  const heading = page.hero?.heading || 'Luxury Seafood Delivered'
  const description =
    page.hero?.description ||
    'The quality of a fine restaurant in the comfort of your home, crafted for refined everyday dining.'

  return (
    <article className="bg-[#f8f6f2] text-[#232220]">
      <section className="relative isolate overflow-hidden border-b border-[#ece3d3] bg-[radial-gradient(circle_at_top_right,#f6ecd6_0%,#fafaf8_44%,#f8f6f2_100%)] pt-30 md:pt-34">
        <div className="container pb-18 pt-10 md:pb-24 md:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">
                Premium Gourmet Collection
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[#1f1e1a] md:text-5xl lg:text-6xl">
                {heading}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5a544b]">{description}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c9a45a] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1a12] transition hover:bg-[#b99245]"
                >
                  Shop Premium Selection
                </Link>
                <Link
                  href="/shop?tab=subscriptions"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cbb27a] bg-white/80 px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3422] transition hover:bg-white"
                >
                  Discover Subscriptions
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-[#ebddc2] bg-[#f2ecdf] shadow-[0_35px_70px_rgba(35,30,20,0.14)]">
                {heroMedia ? (
                  <Media
                    resource={heroMedia}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm font-medium uppercase tracking-[0.16em] text-[#8b7750]">
                    Hero image placeholder - replace in Pages {'>'} Home {'>'} Hero media
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-18 md:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">Why Shop With Us?</p>
          <h2 className={cn(sectionTitleClass, 'mt-4')}>Crafted for Elevated Everyday Dining</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Craftsmanship',
              body: 'Our specialists hand-select and prepare every cut with precision for exceptional texture and consistency.',
            },
            {
              title: 'Gourmet Creations',
              body: 'Chef-developed marinades, tartares, and ready-to-eat options designed for effortless gourmet meals.',
            },
            {
              title: 'Human Touch',
              body: 'Real experts support your choices with tailored recommendations, portions, and delivery preferences.',
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#ece3d6] bg-white p-7 shadow-[0_14px_38px_rgba(36,30,22,0.07)]"
            >
              <h3 className="text-xl font-semibold text-[#22211e]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#5f5b54]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#ece3d6] bg-[#fafaf8] py-18 md:py-24">
        <div className="container">
          <h2 className={sectionTitleClass}>Our Signature Categories</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {defaultCategories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-[#ebe2d3] bg-white p-7 shadow-[0_12px_34px_rgba(40,35,26,0.06)]"
              >
                <h3 className="text-2xl font-semibold text-[#1f1d19]">{category.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#615c53]">{category.description}</p>
                <Link
                  href={category.href}
                  className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.18em] text-[#a8843b] hover:text-[#8e6d2e]"
                >
                  Discover
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-18 md:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">Customer Favourites</p>
            <h2 className={cn(sectionTitleClass, 'mt-4')}>Monthly Menu Highlights</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-[#eadfc9] bg-[linear-gradient(140deg,#f8efd9_0%,#f3e4c2_100%)] p-8 shadow-[0_24px_54px_rgba(65,51,24,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7f6229]">Monthly Menu</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight text-[#2d2618]">Best value for premium quality</h3>
            <p className="mt-5 text-sm leading-7 text-[#5a4d36]">
              Limited-time curated box pricing with freshness-focused vacuum sealing and seasonal chef selections.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#4f4533]">
              <li>Regular butcher price vs promotional monthly pricing</li>
              <li>$10 vacuum-sealing fee per box for quality assurance</li>
              <li>Small-batch preparation and freshness guarantee</li>
            </ul>
            <Link
              href="/shop?tab=meat-boxes"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f2a22] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#f8f2e5] transition hover:bg-[#1f1b15]"
            >
              Don&apos;t Miss The Offer
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#ece3d5] bg-[#faf9f6] py-18 md:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-[#e6dcc8] bg-[#f2ecdf] shadow-[0_24px_54px_rgba(38,32,25,0.12)]">
            {heroMedia ? (
              <Media resource={heroMedia} className="h-full w-full" imgClassName="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs font-medium uppercase tracking-[0.15em] text-[#8d7854]">
                About section image placeholder
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">
              See Our Quality Up Close
            </p>
            <h2 className={cn(sectionTitleClass, 'mt-4')}>Fresh Selections, Expertly Prepared Every Day</h2>
            <p className="mt-6 text-base leading-8 text-[#5f5a52]">
              Visit us in-store to meet our specialists, explore premium options, and discover the craftsmanship
              behind our products.
            </p>
            <div className="mt-7 space-y-2 text-sm leading-7 text-[#4d473e]">
              <p className="font-semibold text-[#2a2925]">{footer.brandName || 'Filet Gourmet'}</p>
              {footer.address ? <p className="whitespace-pre-line">{footer.address}</p> : null}
              {footer.contactPhone ? <p>{footer.contactPhone}</p> : null}
              {footer.contactEmail ? <p>{footer.contactEmail}</p> : null}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#ccb27a] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#4a3c22] transition hover:bg-white"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-18 md:py-24">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">Google Reviews</p>
          <h2 className={cn(sectionTitleClass, 'mt-4')}>Loved by Gourmet Food Lovers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviewCards.map((review) => (
            <article key={review.name} className="rounded-2xl border border-[#ece3d7] bg-white p-6 shadow-[0_12px_34px_rgba(40,32,22,0.07)]">
              <div className="mb-4 flex gap-1 text-[#d3ad5a]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-7 text-[#5d584f]">{review.body}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7748]">{review.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#ece3d7] bg-[#faf9f6] py-18 md:py-24">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#ebe0cc] bg-white p-8 shadow-[0_18px_42px_rgba(35,30,20,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a8843b]">Get In Touch</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#24221d]">Contact & Store Information</h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-[#5d584f]">
              <p>{footer.address || 'Store address placeholder - update in Footer global settings.'}</p>
              <p>{footer.contactPhone || 'Phone placeholder'}</p>
              <p>{footer.contactEmail || 'Email placeholder'}</p>
            </div>
            <div className="mt-7 rounded-2xl border border-dashed border-[#d9c9a4] bg-[#fbf4e5] px-4 py-5 text-xs uppercase tracking-[0.16em] text-[#7f6a3d]">
              Opening hours editable slot: integrate from CMS global if needed.
            </div>
          </article>

          <article className="rounded-3xl border border-[#e9ddc8] bg-[linear-gradient(130deg,#f8f2e5_0%,#f4ead6_100%)] p-8 shadow-[0_18px_42px_rgba(55,42,18,0.1)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6e2c]">Stay Informed</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#2b2418]">News & Blog Preview</h2>
            <div className="mt-6 space-y-5">
              {newsPages.slice(0, 3).map((newsItem) => (
                <div key={newsItem.id} className="border-b border-[#d9c9a4] pb-5 last:border-0 last:pb-0">
                  <h3 className="text-base font-semibold text-[#2d2618]">{newsItem.title}</h3>
                  <p className="mt-2 text-sm text-[#5d5139]">
                    {newsItem.meta?.description || 'Fresh stories, recipes, and product spotlights coming soon.'}
                  </p>
                  <Link
                    href={`/${newsItem.slug}`}
                    className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-[#7d622c]"
                  >
                    Read Article
                  </Link>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <div className="sr-only">
        Header source: {header.navItems?.length || 0} items
      </div>
    </article>
  )
}
