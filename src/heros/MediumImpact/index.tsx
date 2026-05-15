import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { fallbackUrlFor } from '@/constants/fallbackImage'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container ">
        <div>
          <Media
            className="-mx-4 md:-mx-8 2xl:-mx-16"
            fallbackContext="hero"
            imgClassName=""
            priority
            resource={media && typeof media === 'object' ? media : undefined}
            src={media && typeof media === 'object' ? undefined : fallbackUrlFor('hero')}
          />
          {media && typeof media === 'object' && media?.caption ? (
            <div className="mt-3">
              <RichText data={media.caption} enableGutter={false} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
