import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import React from 'react'
import { RichText } from '@/components/RichText'
import type { Media as MediaType, MediaBlock as MediaBlockProps } from '@/payload-types'

import { fallbackUrlFor } from '@/constants/fallbackImage'
import { Media } from '../../components/Media'

export const MediaBlock: React.FC<
  MediaBlockProps & {
    id?: string | number
    breakout?: boolean
    captionClassName?: string
    className?: string
    enableGutter?: boolean
    imgClassName?: string
    staticImage?: StaticImageData
    disableInnerContainer?: boolean
  }
> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  const mediaObject =
    media && typeof media === 'object' && media !== null ? (media as MediaType) : undefined

  let caption
  if (mediaObject) caption = mediaObject.caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <Media
        fallbackContext="editorial"
        imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
        resource={mediaObject}
        src={
          staticImage ??
          (mediaObject ? undefined : fallbackUrlFor('editorial'))
        }
      />
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
