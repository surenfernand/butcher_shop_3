import { Media } from '@/components/Media'
import { HighImpactHero } from '@/heros/HighImpact'
import type { Footer, Header, Media as MediaType, Page, Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Award, Check, Clock, ShieldCheck, Star, Truck } from 'lucide-react'
import Link from 'next/link'

type LuxuryHomePageProps = {
  page: Page
  header: Header
  footer: Footer
  featuredProducts: Product[]
  newsPages: Page[]
}

/** Same red as site header / Carne Shop bar */
const brandRed = '#D32F2F'

const defaultCategories = [
  {
    title: 'Prime Beef',
    subtitle: 'Dry-aged steaks & roasts',
    href: '/shop',
    gradient: 'from-[#D32F2F] via-[#6e1216] to-neutral-950',
  },
  {
    title: 'Heritage Pork',
    subtitle: 'Chops, ribs & specialty cuts',
    href: '/shop',
    gradient: 'from-[#D32F2F] via-[#5c181c] to-neutral-950',
  },
  {
    title: 'Poultry',
    subtitle: 'Air-chilled & prepared daily',
    href: '/shop',
    gradient: 'from-amber-900 via-[#6b4c2a] to-neutral-950',
  },
  {
    title: 'Lamb & Game',
    subtitle: 'Seasonal selections',
    href: '/shop',
    gradient: 'from-stone-800 via-[#3d3830] to-neutral-950',
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
    <article className="group overflow-hidden rounded-sm border border-neutral-200/90 bg-white text-neutral-900 shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full bg-neutral-900">
          {image ? (
            <Media resource={image} className="h-full w-full" imgClassName="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Add product image
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition group-hover:opacity-90"
            aria-hidden
          />
          {product.shopCardLabel ? (
            <span
              className="absolute left-3 top-3 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: brandRed, color: brandRed, backgroundColor: 'rgba(0,0,0,0.65)' }}
            >
              {product.shopCardLabel}
            </span>
          ) : null}
        </div>
        <div className="space-y-2 px-4 py-5">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">{product.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {product.shopCardShortDescription || 'Premium cuts prepared with care by our butchers.'}
          </p>
          <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
            <span className="text-sm font-semibold tabular-nums" style={{ color: brandRed }}>
              {price || 'View details'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition group-hover:text-neutral-800">
              View product →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function SectionTitle({
  eyebrow,
  title,
  dark,
  align = 'center',
}: {
  eyebrow: string
  title: string
  dark?: boolean
  align?: 'center' | 'left'
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', align === 'left' && 'text-left')}>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.28em]"
        style={{ color: brandRed }}
      >
        {eyebrow}
      </p>
      <div
        className={cn(
          'mt-4 flex items-center gap-3',
          align === 'center' && 'justify-center',
          align === 'left' && 'justify-start',
        )}
      >
        <span
          className="h-px w-10 bg-current opacity-30"
          style={{ color: dark ? brandRed : undefined }}
          aria-hidden
        />
        <h2
          className={cn(
            'max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl',
            dark ? 'text-white' : 'text-neutral-950',
          )}
        >
          {title}
        </h2>
        <span
          className="h-px w-10 bg-current opacity-30"
          style={{ color: dark ? brandRed : undefined }}
          aria-hidden
        />
      </div>
    </div>
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

  return (
    <article className="bg-white text-neutral-800">
      <HighImpactHero {...page.hero} />

      {/* Promo strip — classic butcher banner */}
      <div
        className="border-y border-black/10 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white"
        style={{ backgroundColor: brandRed }}
      >
        <span className="inline-block px-4">
          Same-week preparation · Vacuum-sealed for freshness · Visit our counter for custom cuts
        </span>
      </div>

      {/* Categories */}
      <section className="border-b border-neutral-200/80 bg-white py-16 md:py-22">
        <div className="container">
          <SectionTitle eyebrow="Shop by category" title="Premium cuts for every occasion" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {defaultCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className={cn(
                  'group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-sm border border-black/10 p-6 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(0,0,0,0.25)]',
                  'bg-gradient-to-br',
                  category.gradient,
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  aria-hidden
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold tracking-tight">{category.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{category.subtitle}</p>
                  <span className="mt-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: brandRed }}>
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us — dark band */}
      <section className="border-b border-black/20 bg-neutral-950 py-16 text-white md:py-22">
        <div className="container">
          <SectionTitle eyebrow="The Carneshop difference" title="Quality you can see and taste" dark />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: 'Careful delivery',
                body: 'Temperature-conscious packing so your order arrives in peak condition.',
              },
              {
                icon: ShieldCheck,
                title: 'Trusted sourcing',
                body: 'Transparent partnerships with farms and suppliers we know by name.',
              },
              {
                icon: Clock,
                title: 'Cut to order',
                body: 'Skilled butchers prepare many items fresh when you order — not days ahead.',
              },
            ].map((item) => (
              <article key={item.title} className="text-center md:text-left">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border md:mx-0"
                  style={{ borderColor: brandRed }}
                >
                  <item.icon className="h-6 w-6" style={{ color: brandRed }} aria-hidden />
                </div>
                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-b border-neutral-200/80 bg-white py-16 md:py-22">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl text-left">
              <SectionTitle eyebrow="Butcher's picks" title="Featured this week" align="left" />
            </div>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center border border-neutral-900 bg-transparent px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              View all products
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer / promo card row */}
      <section className="border-b border-neutral-200/80 bg-neutral-50 py-14 md:py-18">
        <div className="container">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col justify-center border border-neutral-900/10 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: brandRed }}>
                Limited offer
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
                Family meat boxes — curated & vacuum-sealed
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
                Chef-selected combinations for weeknight dinners and weekend roasts. Seasonal updates so you always get
                what&apos;s tasting best right now.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <Award className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brandRed }} aria-hidden />
                  Premium grades and transparent labeling on every box.
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brandRed }} aria-hidden />
                  Optional vacuum sealing for peak freshness.
                </li>
              </ul>
              <Link
                href="/shop?tab=meat-boxes"
                className="mt-8 inline-flex min-h-12 max-w-fit items-center bg-[#D32F2F] px-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110"
              >
                Shop meat boxes
              </Link>
            </div>
            <aside className="relative min-h-[280px] overflow-hidden rounded-sm border border-neutral-900/10 bg-neutral-900 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
              {heroMedia ? (
                <Media resource={heroMedia} className="h-full min-h-[280px] w-full" imgClassName="h-full w-full object-cover opacity-90" />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 px-6 text-center text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Hero image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
              <p className="absolute bottom-6 left-6 right-6 text-sm font-medium text-white">
                Ask our butchers for custom trims and aging preferences.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-neutral-200/80 bg-white py-16 md:py-22">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm border border-neutral-200 bg-neutral-900 shadow-[0_28px_60px_rgba(0,0,0,0.12)]">
            {heroMedia ? (
              <Media resource={heroMedia} className="h-full w-full" imgClassName="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.18em] text-neutral-500">
                About image
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: brandRed }}>
              Our story
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              Traditional craft, modern standards
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600">
              Visit us in-store to meet our team, explore the case, and learn how we select and prepare every product.
              We combine old-school butchery with the transparency today&apos;s shoppers expect.
            </p>
            <div className="mt-8 space-y-2 text-sm leading-relaxed text-neutral-700">
              <p className="font-semibold text-neutral-950">{footer.brandName || 'Our butcher shop'}</p>
              {footer.address ? <p className="whitespace-pre-line">{footer.address}</p> : null}
              {footer.contactPhone ? <p>{footer.contactPhone}</p> : null}
              {footer.contactEmail ? <p>{footer.contactEmail}</p> : null}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex min-h-12 items-center border border-neutral-950 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              About us
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b border-neutral-200/80 bg-neutral-50 py-16 md:py-22">
        <div className="container">
          <SectionTitle eyebrow="Testimonials" title="What our customers say" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviewCards.map((review) => (
              <article
                key={review.name}
                className="border border-neutral-200/90 bg-white p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-4 flex gap-0.5" style={{ color: brandRed }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">{review.body}</p>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden border-b border-black/20 bg-neutral-950 py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 10px)',
          }}
          aria-hidden
        />
        <div className="container relative z-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brandRed }}>
            Newsletter
          </p>
          <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold text-white md:text-3xl">
            Get specials, new arrivals & recipe ideas
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-400">
            Join the list for weekly drops from the butcher block. No spam — unsubscribe anytime.
          </p>
          <form
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
            action="/contact-us"
            method="get"
          >
            <label htmlFor="home-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="home-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              className="min-h-12 flex-1 border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-neutral-500 focus:border-[#D32F2F] focus:outline-none focus:ring-1 focus:ring-[#D32F2F]"
            />
            <button
              type="submit"
              className="min-h-12 shrink-0 bg-[#D32F2F] px-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-neutral-500">
            By subscribing you agree to be contacted about shop updates. Use our{' '}
            <Link href="/contact-us" className="underline underline-offset-2 hover:text-white">
              contact page
            </Link>{' '}
            for specific orders.
          </p>
        </div>
      </section>

      {/* Contact + blog */}
      <section className="bg-white py-16 md:py-22">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="border border-neutral-200/90 bg-white p-8 shadow-[0_16px_44px_rgba(0,0,0,0.06)] md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: brandRed }}>
              Visit & contact
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-neutral-950 md:text-3xl">We&apos;re here to help</h2>
            <div className="mt-6 space-y-3 text-sm leading-relaxed text-neutral-600">
              <p>{footer.address || 'Update your address in Footer settings.'}</p>
              <p>{footer.contactPhone || ''}</p>
              <p>{footer.contactEmail || ''}</p>
            </div>
            <Link
              href="/contact-us"
              className="mt-8 inline-flex min-h-11 items-center border border-neutral-950 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              Contact us
            </Link>
          </article>

          <article className="border border-neutral-200/90 bg-neutral-50 p-8 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: brandRed }}>
              From the blog
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-neutral-950 md:text-3xl">Latest stories</h2>
            <div className="mt-6 space-y-6">
              {newsPages.slice(0, 3).map((newsItem) => (
                <div key={newsItem.id} className="border-b border-neutral-300/80 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-base font-semibold text-neutral-950">{newsItem.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    {newsItem.meta?.description || 'Recipes, sourcing notes, and shop news.'}
                  </p>
                  <Link
                    href={`/${newsItem.slug}`}
                    className="mt-3 inline-flex text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: brandRed }}
                  >
                    Read more
                  </Link>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <div className="sr-only">Navigation items: {header.navItems?.length || 0}</div>
    </article>
  )
}
