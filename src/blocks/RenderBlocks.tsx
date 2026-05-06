import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { FeaturedCutsBlock } from '@/blocks/FeaturedCuts/Component'
import { InfoSectionBlock } from '@/blocks/InfoSection/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { AboutStoryBlock } from '@/blocks/AboutStory/Component'
import { ContactCardsBlock } from '@/blocks/ContactCards/Component'
import { VisitSectionBlock } from '@/blocks/VisitSection/Component'
import { SocialLinksBlock } from '@/blocks/SocialLinks/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'
import { ProductGridBlock } from '@/blocks/ProductGrid/Component'
import type { ComponentType } from 'react'
import { MonthlyMenuPromo } from '@/components/home/MonthlyMenuPromo'


import type { Page } from '../payload-types'
import { ContactPageBlock } from './ContactPage/Component'

const blockComponents: Record<string, ComponentType<any>> = {
  aboutStory: AboutStoryBlock,
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  contactCards: ContactCardsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featuredCuts: FeaturedCutsBlock,
  formBlock: FormBlock,
  infoSection: InfoSectionBlock,
  mediaBlock: MediaBlock,
  testimonials: TestimonialsBlock,
  threeItemGrid: ThreeItemGridBlock,
  visitSection: VisitSectionBlock,
  socialLinks: SocialLinksBlock,
  productGrid: ProductGridBlock,
  contactPage: ContactPageBlock,
}



type SearchParams = { [key: string]: string | string[] | undefined }

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  searchParams?: SearchParams
  slug?: string
}> = (props) => {
  const { blocks, searchParams, slug } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
         

            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Block
                    id={toKebabCase(blockName!)}
                    searchParams={searchParams}
                    {...block}
                  />
                  {slug === 'home' && (blockType === 'infoSection' || blockType === 'aboutStory') ? (
                    <MonthlyMenuPromo />
                  ) : null}
                </div>
              )
            }
          }

          return null
        })}
      </Fragment>
    )
  }

  return null
}