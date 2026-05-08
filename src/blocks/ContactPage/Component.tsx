'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowRight, Clock3, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { FormBlock } from '@/blocks/Form/Component'

const icons: Record<string, LucideIcon> = {
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
}

type Media = {
  url?: string | null
  alt?: string | null
}

type Card = {
  icon?: string | null
  title?: string | null
  line1?: string | null
  line2?: string | null
}

type StoreHour = {
  day?: string | null
  time?: string | null
}

type Props = {
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroDescription?: string | null
  formTitle?: string | null
  cards?: Card[] | null
  storeHours?: StoreHour[] | null
  storeNote?: string | null
  faqTitle?: string | null
  faqItems?: { question?: string | null; answer?: string | null }[] | null
  supportTitle?: string | null
  supportDescription?: string | null
  supportPrimaryLabel?: string | null
  supportPrimaryUrl?: string | null
  supportSecondaryLabel?: string | null
  supportSecondaryUrl?: string | null
  form?: FormType
  mapImage?: Media | number | string | null
  mapTitle?: string | null
  mapLabel?: string | null
  mapEmbedUrl?: string | null
}

export const ContactPageBlock: React.FC<Props> = ({
  heroEyebrow,
  heroTitle,
  heroDescription,
  formTitle,
  cards,
  storeHours,
  storeNote,
  faqTitle,
  faqItems,
  supportTitle,
  supportDescription,
  supportPrimaryLabel,
  supportPrimaryUrl,
  supportSecondaryLabel,
  supportSecondaryUrl,
  form,
  mapImage: _mapImage,
  mapTitle,
  mapLabel,
  mapEmbedUrl,
}) => {
  return (
    <section className="bg-background px-6 pb-20 text-foreground md:pb-24">
      <div className="mx-auto mb-12 mt-4 max-w-[1280px] overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_right,#fecaca_0%,#fff5f5_55%,#ffe4e6_100%)] p-8 md:mb-16 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {heroEyebrow || 'Contact'}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl">
          {heroTitle || 'Get In Touch'}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          {heroDescription ||
            'We would love to hear from you. Reach out for questions, delivery details, custom requests, or product recommendations.'}
        </p>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          {(cards || []).map((card, index) => {
            const Icon = icons[card.icon || 'map-pin'] || MapPin

            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6 shadow-[0_12px_34px_rgba(38,30,22,0.06)]"
              >
                <Icon className="mb-5 h-5 w-5 text-primary" />
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                  {card.title}
                </h3>
                {card.line1 && (
                  <p className="text-sm leading-7 text-muted-foreground">
                    {card.line1.includes('@') ? (
                      <a href={`mailto:${card.line1}`} className="hover:text-primary">
                        {card.line1}
                      </a>
                    ) : card.line1.includes('+') || card.line1.match(/\d{3}/) ? (
                      <a href={`tel:${card.line1.replace(/\s+/g, '')}`} className="hover:text-primary">
                        {card.line1}
                      </a>
                    ) : (
                      card.line1
                    )}
                  </p>
                )}
                {card.line2 && (
                  <p className="text-sm leading-7 text-muted-foreground">{card.line2}</p>
                )}
              </div>
            )
          })}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_12px_34px_rgba(38,30,22,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Store Hours</h3>
            </div>

            <div className="space-y-4">
              {(storeHours || []).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-border pb-3 text-sm"
                >
                  <span className="font-semibold uppercase tracking-[0.08em] text-foreground">{item.day}</span>
                  <span className="font-semibold text-primary">{item.time}</span>
                </div>
              ))}
            </div>

            {storeNote && (
              <p className="mt-6 text-xs italic text-muted-foreground">{storeNote}</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_18px_42px_rgba(38,30,22,0.08)] md:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {formTitle || 'Send An Inquiry'}
          </h2>
          <div className="mb-8 mt-4 h-[2px] w-14 bg-primary" />

          {form && (
            <div className="[&_button[type='submit']]:mt-2 [&_button[type='submit']]:h-12 [&_button[type='submit']]:rounded-full [&_button[type='submit']]:border-primary [&_button[type='submit']]:bg-primary [&_button[type='submit']]:px-8 [&_button[type='submit']]:text-xs [&_button[type='submit']]:font-semibold [&_button[type='submit']]:tracking-[0.18em] [&_button[type='submit']]:text-primary-foreground [&_button[type='submit']]:hover:bg-primary/90 [&_button[type='submit']]:hover:text-primary-foreground [&_button[type='submit']]:hover:scale-100 [&_input]:h-12 [&_input]:rounded-xl [&_input]:border-input [&_input]:bg-card [&_input]:text-foreground [&_input]:placeholder:text-muted-foreground [&_input]:focus-visible:border-ring [&_label]:mb-2 [&_label]:text-[11px] [&_label]:font-semibold [&_label]:tracking-[0.14em] [&_label]:text-muted-foreground [&_textarea]:rounded-xl [&_textarea]:border-input [&_textarea]:bg-card [&_textarea]:text-foreground [&_textarea]:placeholder:text-muted-foreground [&_textarea]:focus-visible:border-ring">
              <FormBlock form={form} enableIntro={false} />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1280px] md:mt-20">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border bg-muted shadow-[0_18px_42px_rgba(39,31,20,0.1)]">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.35]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Google Map not configured
            </div>
          )}

          {(mapTitle || mapLabel) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {mapTitle && (
                  <h3 className="text-4xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] md:text-5xl">
                    {mapTitle}
                  </h3>
                )}
                {mapLabel && (
                  <p className="mt-2 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {mapLabel}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1280px] gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_16px_38px_rgba(37,30,22,0.07)]">
          <h3 className="text-2xl font-semibold text-foreground">{faqTitle || 'Frequently Asked Questions'}</h3>
          <div className="mt-5">
            <Accordion type="single" collapsible defaultValue="faq-0">
              {(faqItems?.length
                ? faqItems
                : [
                    {
                      question: 'Do you offer delivery and pickup options?',
                      answer: 'Yes. We offer both delivery and pickup options depending on your location.',
                    },
                    {
                      question: 'Can I request custom cuts or portions?',
                      answer:
                        'Absolutely. Share your request in the contact form and our team will follow up with available options.',
                    },
                    {
                      question: 'How quickly can I receive a response?',
                      answer: 'Our team usually responds within one business day.',
                    },
                  ]
              ).map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-border">
                  <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 p-8 shadow-[0_16px_38px_rgba(50,38,19,0.1)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Customer Support</p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight text-foreground">
            {supportTitle || 'Need immediate assistance?'}
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {supportDescription ||
              'Our team is available to help with orders, product details, delivery windows, and custom requests.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={supportPrimaryUrl || 'tel:+14503131449'}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90"
            >
              {supportPrimaryLabel || 'Call Us'}
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
            <Link
              href={supportSecondaryUrl || 'mailto:info@filetgourmet.ca'}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-card/80 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-foreground"
            >
              {supportSecondaryLabel || 'Email Support'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}