import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Check, Quote } from 'lucide-react'

import { Button } from '@/components/ui/button'

const accent = '#e53935'

const photos = {
  hero: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80',
  intro: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1200&q=80',
  firm: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
  meatStrip: [
    'https://images.unsplash.com/photo-1602470520998-f4a296911770?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588347818036-4568cca6bf23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80',
  ],
  team: [
    'https://images.unsplash.com/photo-1560250097-9b93507d9fc7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  ],
}

const services = [
  {
    title: 'Veal Entrecôte',
    body: 'Lorem ipsum dolor sit amet, consec tetur adipis',
    href: '/shop',
  },
  {
    title: 'Pork Tenderloin',
    body: 'Lorem ipsum dolor sit amet, consec tetur adipis',
    href: '/shop',
  },
  {
    title: 'Beef Ribs',
    body: 'Lorem ipsum dolor sit amet, consec tetur adipis',
    href: '/shop',
  },
]

const benefits = ['Expert Customer', 'Free Shipping', 'Free Return', 'Amazing Deals']

const testimonials = [
  {
    quote:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    name: 'Richard K. Le',
    role: 'HR Manager',
  },
  {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore — excellent quality and service every time.',
    name: 'Donnell J. Creech',
    role: 'Sonographer',
  },
]

const stats = [
  { value: '250', label: 'Finished Projects' },
  { value: '640', label: 'Creative Materials' },
  { value: '180', label: 'Experienced Masters' },
  { value: '42', label: 'Professional Awards' },
]

const team = [
  { name: 'David Smith', role: 'Design Expert' },
  { name: 'Barbara Smith', role: 'Painting Director' },
  { name: 'Robert Pineda', role: 'Project Manager' },
  { name: 'Jenna Sue', role: 'Manager' },
]

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-2 text-xs font-semibold uppercase tracking-[0.35em]"
      style={{ color: accent }}
    >
      {children}
    </p>
  )
}

export function CarneshopAboutPage() {
  return (
    <div className="bg-white text-neutral-800">
      {/* Page hero — breadcrumb + title */}
      <section className="relative isolate min-h-[240px] overflow-hidden md:min-h-[300px]">
        <Image
          src={photos.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="relative z-[1] mx-auto flex max-w-7xl flex-col justify-center px-6 pb-14 pt-10 md:px-10 lg:px-12 lg:pb-20 lg:pt-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/85">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li className="text-white/50" aria-hidden>
                /
              </li>
              <li className="font-medium text-white">About Us</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
            About Us
          </h1>
        </div>
      </section>

      {/* We provide best meat */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={photos.intro}
              alt="Premium cuts at our butcher counter"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionLabel>About Us</SectionLabel>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              We Provide Best Meat
            </h2>
            <p className="mb-6 leading-relaxed text-neutral-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <ul className="mb-8 space-y-3">
              {['100% Organic Meat', 'Payment Securation'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-neutral-800">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="rounded-sm px-8 font-semibold uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: accent }}>
              <Link href="/shop">View More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <SectionLabel>What we do</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Services for You</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className="flex flex-col border border-neutral-200 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold text-neutral-900">{s.title}</h3>
                <p className="mb-6 flex-1 leading-relaxed text-neutral-600">{s.body}</p>
                <Link
                  href={s.href}
                  className="inline-flex w-fit items-center text-sm font-semibold uppercase tracking-wider transition hover:underline"
                  style={{ color: accent }}
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About our firm */}
      <section id="benefits" className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <SectionLabel>About Us</SectionLabel>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              About Our Firm&apos;s
            </h2>
            <p className="mb-6 leading-relaxed text-neutral-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <ul className="mb-8 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-3 text-neutral-800">
                  <Check className="h-5 w-5 shrink-0" style={{ color: accent }} strokeWidth={2.5} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact-us" className="text-sm font-semibold uppercase tracking-wider hover:underline" style={{ color: accent }}>
              Learn more about our benefit
            </Link>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-sm shadow-lg lg:order-2 lg:aspect-auto lg:min-h-[400px]">
            <Image
              src={photos.firm}
              alt="Butcher preparing quality meat"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Meat showcase strip */}
      <section className="bg-neutral-950 py-12 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-3 md:px-10 lg:px-12">
          {photos.meatStrip.map((src, i) => (
            <figure key={src} className="group relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt={`Meat selection ${i + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-16 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">Meat</span>
                <p className="mt-1 text-lg font-semibold text-white">Pork tenderloin</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Why People Believe in Us!</h2>
          <p className="mt-4 leading-relaxed text-neutral-600">
            Lorem magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="relative rounded-sm border border-neutral-200 bg-neutral-50 p-8 pt-12 shadow-sm md:p-10"
            >
              <Quote
                className="absolute left-8 top-6 h-10 w-10 opacity-[0.12]"
                style={{ color: accent }}
                aria-hidden
              />
              <p className="relative z-[1] leading-relaxed text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-8 border-t border-neutral-200 pt-6">
                <p className="font-semibold text-neutral-900">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 text-white" style={{ backgroundColor: accent }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-10 lg:px-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold tabular-nums md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionLabel>Meet Our Team</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Our Creative Team</h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <article key={member.name} className="text-center">
              <div className="relative mx-auto mb-5 aspect-square max-w-[280px] overflow-hidden rounded-sm shadow-md">
                <Image
                  src={photos.team[i % photos.team.length]}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{member.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
