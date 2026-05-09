'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Product } from '@/payload-types'

type Props = {
  product: Product & {
    meta?: {
      description?: string | null
    } | null
  }
}

export default function ProductInfoAccordion({ product }: Props) {
  const description =
    product.shopCardShortDescription ||
    product.meta?.description ||
    'Premium quality product prepared with exceptional care.'

  const specs = [
    product.meatType ? `Category: ${product.meatType}` : null,
    product.storageType ? `Storage: ${product.storageType}` : null,
    product.preparationStyle ? `Preparation: ${product.preparationStyle}` : null,
    product.origin ? `Origin: ${product.origin}` : null,
    typeof product.weight === 'number' ? `Weight: ${product.weight}` : null,
  ].filter(Boolean) as string[]

  return (
    <div className="mt-10 rounded-sm border border-neutral-200 bg-white px-1 py-2 shadow-sm md:px-2">
      <Accordion type="single" collapsible defaultValue="description">
        <AccordionItem value="description" className="border-neutral-200">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900 hover:no-underline">
            Description
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-7 text-neutral-600">{description}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="ingredients" className="border-neutral-200">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900 hover:no-underline">
            Ingredients / Details
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            {product.whatsInside?.length ? (
              <ul className="space-y-2 text-sm leading-7 text-neutral-600">
                {product.whatsInside.map((item) => (
                  <li key={item.id || `${item.quantity}-${item.label}`}>
                    <span className="mr-2 font-semibold text-[#e53935]">{item.quantity}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-7 text-neutral-600">
                Ingredient list placeholder - update this product in Payload CMS.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specs" className="border-neutral-200">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900 hover:no-underline">
            Product Information
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            {specs.length ? (
              <ul className="space-y-2 text-sm leading-7 text-neutral-600">
                {specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-7 text-neutral-600">Product specifications are being updated.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
