'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import {
  fallbackDimensionsFor,
  fallbackUrlFor,
  parseWidthFromImageUrl,
} from '@/constants/fallbackImage'
import { cssVariables } from '@/cssVariables'
import {
  normalizeCmsMediaUrl,
  shouldBypassMediaUrlForPlaceholder,
  shouldUseUnoptimizedImage,
} from '@/utilities/mediaDisplay'

const { breakpoints } = cssVariables

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fallbackContext,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined | null = widthFromProps
  let height: number | undefined | null = heightFromProps
  let alt = altFromProps
  let src: StaticImageData | string = (srcFromProps as StaticImageData | string | undefined) ?? ''

  if (srcFromProps && typeof srcFromProps === 'object' && 'width' in srcFromProps) {
    width = width ?? srcFromProps.width
    height = height ?? srcFromProps.height
  }

  let resourceHadMissingUrl = false

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = widthFromProps ?? fullWidth
    height = heightFromProps ?? fullHeight
    alt = altFromResource

    let resolved = url?.startsWith('http') ? url : url || ''
    if (resolved) resolved = normalizeCmsMediaUrl(resolved)
    if (!resolved || !resolved.trim()) {
      resourceHadMissingUrl = true
    } else if (shouldBypassMediaUrlForPlaceholder(resolved)) {
      resourceHadMissingUrl = true
      resolved = ''
    }
    src = resolved
  }

  if (typeof src === 'string' && src.trim()) {
    src = normalizeCmsMediaUrl(src)
    if (shouldBypassMediaUrlForPlaceholder(src)) {
      src = fallbackUrlFor(fallbackContext ?? 'product')
      if (!alt) alt = 'Image'
    }
  }

  if (typeof src === 'string' && !src.trim() && resourceHadMissingUrl) {
    src = fallbackUrlFor(fallbackContext ?? 'product')
    if (!alt) alt = 'Image'
  }

  const unoptimized = typeof src === 'string' && shouldUseUnoptimizedImage(src)

  if (!fill && typeof src === 'string' && src.trim()) {
    const parsedWidth = parseWidthFromImageUrl(src)
    if (parsedWidth) {
      width = width ?? parsedWidth
      height = height ?? Math.round((parsedWidth * 2) / 3)
    }
    if (!width || !height) {
      const dims = fallbackDimensionsFor(fallbackContext ?? 'product')
      width = width ?? dims.width
      height = height ?? dims.height
    }
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? (height ?? undefined) : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      quality={90}
      sizes={sizes}
      src={src}
      unoptimized={unoptimized}
      width={!fill ? (width ?? undefined) : undefined}
    />
  )
}
