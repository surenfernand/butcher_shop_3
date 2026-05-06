'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { Clock3, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
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
  formTitle?: string | null
  cards?: Card[] | null
  storeHours?: StoreHour[] | null
  storeNote?: string | null
  form?: FormType
  mapImage?: Media | number | string | null
  mapTitle?: string | null
  mapLabel?: string | null
  mapEmbedUrl?: string | null
}

export const ContactPageBlock: React.FC<Props> = ({
  formTitle,
  cards,
  storeHours,
  storeNote,
  form,
  mapImage: _mapImage,
  mapTitle,
  mapLabel,
  mapEmbedUrl,
}) => {
  return (
    <section className="bg-dark px-6 py-20 text-foreground">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[400px_1fr]">
        <div className="space-y-6">
          {(cards || []).map((card, index) => {
            const Icon = icons[card.icon || 'map-pin'] || MapPin

            return (
              <div
                key={index}
                className="border border-border bg-card p-7 shadow-sm"
              >
                <Icon className="mb-5 h-5 w-5 text-[#d9aa45]" />
                <h3 className="mb-3 text-sm font-semibold text-foreground">{card.title}</h3>
                {card.line1 && (
                  <p className="text-sm leading-7 text-muted-foreground">{card.line1}</p>
                )}
                {card.line2 && (
                  <p className="text-sm leading-7 text-muted-foreground">{card.line2}</p>
                )}
              </div>
            )
          })}

          <div className="border border-border bg-card p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#d9aa45]" />
              <h3 className="text-sm font-semibold uppercase text-[#d9aa45]">Store Hours</h3>
            </div>

            <div className="space-y-4">
              {(storeHours || []).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-border pb-3 text-sm"
                >
                  <span className="font-bold uppercase text-foreground">{item.day}</span>
                  <span className="font-bold text-[#d9aa45]">{item.time}</span>
                </div>
              ))}
            </div>

            {storeNote && (
              <p className="mt-6 text-xs italic text-muted-foreground">{storeNote}</p>
            )}
          </div>
        </div>

        <div className="border border-border bg-card p-8 shadow-sm md:p-12">
          <h2 className="text-3xl font-extrabold uppercase text-foreground">
            {formTitle || 'Send An Inquiry'}
          </h2>
          <div className="mb-10 mt-4 h-[3px] w-12 bg-[#d9aa45]" />

          {form && <FormBlock form={form} enableIntro={false} />}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1280px]">
        <div className="relative h-[440px] overflow-hidden rounded-md border border-border bg-muted">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Google Map not configured
            </div>
          )}

          {(mapTitle || mapLabel) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {mapTitle && (
                  <h3 className="text-5xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                    {mapTitle}
                  </h3>
                )}
                {mapLabel && (
                  <p className="mt-2 border border-white/20 bg-black/75 px-4 py-2 text-xs uppercase text-white backdrop-blur-sm">
                    {mapLabel}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}