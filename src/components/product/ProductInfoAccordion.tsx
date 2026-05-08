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
    <div className="mt-10 rounded-2xl border border-[#e8ddca] bg-white px-6 py-2 shadow-[0_10px_30px_rgba(36,29,20,0.05)]">
      <Accordion type="single" collapsible defaultValue="description">
        <AccordionItem value="description" className="border-[#eee4d2]">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#3e392f] hover:no-underline">
            Description
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-7 text-[#5d574d]">
            {description}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ingredients" className="border-[#eee4d2]">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#3e392f] hover:no-underline">
            Ingredients / Details
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            {product.whatsInside?.length ? (
              <ul className="space-y-2 text-sm leading-7 text-[#5d574d]">
                {product.whatsInside.map((item) => (
                  <li key={item.id || `${item.quantity}-${item.label}`}>
                    <span className="mr-2 font-semibold text-[#9b7a3b]">{item.quantity}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-7 text-[#5d574d]">
                Ingredient list placeholder - update this product in Payload CMS.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specs" className="border-[#eee4d2]">
          <AccordionTrigger className="py-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#3e392f] hover:no-underline">
            Product Information
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            {specs.length ? (
              <ul className="space-y-2 text-sm leading-7 text-[#5d574d]">
                {specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-7 text-[#5d574d]">
                Product specifications are being updated.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
