import { FormBlock } from '@/blocks/Form/Component'
import type {
  ContactPageBlock,
  Footer,
  FormBlock as FormBlockPayload,
  Page,
} from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const brandRed = '#e31e24'

function splitEntries(value: string | null | undefined): string[] {
  if (!value?.trim()) return []
  return value
    .split(/\n+|[,;]\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function resolveFormFromPage(page: Page): {
  form: FormType
  enableIntro: boolean
  introContent?: SerializedEditorState | null
} | null {
  const layout = page.layout
  if (!Array.isArray(layout)) return null

  for (const block of layout) {
    if (block.blockType === 'formBlock') {
      const b = block as FormBlockPayload
      const f = b.form
      if (f && typeof f === 'object' && 'fields' in f && Array.isArray((f as { fields?: unknown }).fields)) {
        return {
          form: f as unknown as FormType,
          enableIntro: Boolean(b.enableIntro),
          introContent: b.introContent ?? undefined,
        }
      }
    }
    if (block.blockType === 'contactPage') {
      const b = block as ContactPageBlock
      const f = b.form
      if (f && typeof f === 'object' && 'fields' in f && Array.isArray((f as { fields?: unknown }).fields)) {
        return {
          form: f as unknown as FormType,
          enableIntro: false,
        }
      }
    }
  }
  return null
}

type Props = {
  page: Page
  footer: Footer
}

export function CarneshopContactPage({ page, footer }: Props) {
  const resolved = resolveFormFromPage(page)
  const title = page.title || 'Contact Us'

  const phones = splitEntries(footer.contactPhone)
  const emails = splitEntries(footer.contactEmail)
  const addressLines = footer.address?.trim()
    ? footer.address.split('\n').map((l) => l.trim()).filter(Boolean)
    : []

  return (
    <div className="bg-[#faf7f2] text-neutral-950">
      <section className="relative border-b border-black/10 bg-neutral-950 pt-28 pb-10 md:pt-32 md:pb-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)',
          }}
          aria-hidden
        />
        <div className="container relative">
          <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li className="text-white/35" aria-hidden>
                /
              </li>
              <li className="font-medium text-white">{title}</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.5rem]">{title}</h1>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {/* Info row — Phone / Email / Address (Carneshop-style three columns) */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-neutral-200/90 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0" style={{ color: brandRed }} aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950">Phone Number</h2>
            </div>
            {phones.length > 0 ? (
              <ul className="space-y-2 text-sm leading-relaxed text-neutral-600">
                {phones.map((line) => (
                  <li key={line}>
                    <a href={`tel:${line.replace(/\s+/g, '')}`} className="transition hover:text-neutral-950">
                      {line}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">Add a phone number in Footer settings.</p>
            )}
          </div>

          <div className="border border-neutral-200/90 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0" style={{ color: brandRed }} aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950">Email Address</h2>
            </div>
            {emails.length > 0 ? (
              <ul className="space-y-2 text-sm leading-relaxed text-neutral-600">
                {emails.map((line) => (
                  <li key={line}>
                    <a href={`mailto:${line}`} className="transition hover:text-neutral-950">
                      {line}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">Add an email in Footer settings.</p>
            )}
          </div>

          <div className="border border-neutral-200/90 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0" style={{ color: brandRed }} aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950">Office Address</h2>
            </div>
            {addressLines.length > 0 ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">{footer.address}</p>
            ) : (
              <p className="text-sm text-neutral-500">Add your address in Footer settings.</p>
            )}
          </div>
        </div>

        {/* Get in touch + form */}
        <div className="mt-12 border border-neutral-200/90 bg-white p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] md:p-10 lg:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandRed }}>
            Contact
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">Get In Touch</h2>
          <div className="mt-4 h-px max-w-14 bg-neutral-900/90" aria-hidden />

          {resolved ? (
            <div
              className="mt-8 [&_button[type='submit']]:!mt-8 [&_button[type='submit']]:!min-h-12 [&_button[type='submit']]:!w-full [&_button[type='submit']]:!rounded-none [&_button[type='submit']]:!border-0 [&_button[type='submit']]:!bg-[#e31e24] [&_button[type='submit']]:!px-10 [&_button[type='submit']]:!py-4 [&_button[type='submit']]:!text-[11px] [&_button[type='submit']]:!font-semibold [&_button[type='submit']]:!uppercase [&_button[type='submit']]:!tracking-[0.22em] [&_button[type='submit']]:!text-white [&_button[type='submit']]:!transition [&_button[type='submit']]:hover:!brightness-110 [&_button[type='submit']]:hover:!scale-100 [&_input]:!h-11 [&_input]:!rounded-none [&_input]:!border-neutral-200 [&_input]:!bg-[#faf7f2] [&_select]:!h-11 [&_select]:!rounded-none [&_select]:!border-neutral-200 [&_select]:!bg-[#faf7f2] [&_textarea]:!min-h-[140px] [&_textarea]:!rounded-none [&_textarea]:!border-neutral-200 [&_textarea]:!bg-[#faf7f2] [&_label]:!mb-2 [&_label]:!text-[11px] [&_label]:!font-semibold [&_label]:!uppercase [&_label]:!tracking-[0.14em] [&_label]:!text-neutral-600"
            >
              <FormBlock
                form={resolved.form}
                enableIntro={resolved.enableIntro}
                introContent={resolved.introContent ?? undefined}
              />
            </div>
          ) : (
            <p className="mt-8 text-sm text-neutral-600">
              Add a <strong>Form</strong> or <strong>Contact Page</strong> block to this page in the CMS to display the
              inquiry form.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
