'use client'

import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { GridTileImage } from '@/components/Grid/tile'
import { fallbackUrlFor } from '@/constants/fallbackImage'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type Props = {
  gallery: NonNullable<Product['productGallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values && api) {
      const index = gallery.findIndex((item: NonNullable<Product['productGallery']>[number]) => {
        if (!item.id) return false
        return Boolean(values.find((value) => value === String(item.id)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery])

  const currentItem = gallery[current] ?? gallery[0]
  const rawMain = currentItem?.image
  const mainResource =
    typeof rawMain === 'object' && rawMain !== null ? (rawMain as MediaType) : undefined

  return (
    <div>
      <div className="relative w-full overflow-hidden mb-8">
        <Media
          fallbackContext="product"
          resource={mainResource}
          src={mainResource ? undefined : fallbackUrlFor('product')}
          className="w-full"
          imgClassName="w-full rounded-lg"
        />
      </div>

      <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
        <CarouselContent>
          {gallery.map((item: NonNullable<Product['productGallery']>[number], i: number) => {
            if (typeof item.image !== 'object') return null

            return (
              <CarouselItem
                className="basis-1/5"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={item.image} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
