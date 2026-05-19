'use client'

import { cn } from '@/utilities/cn'
import { normalizeCmsMediaUrl } from '@/utilities/mediaDisplay'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

function resolveVideoSrc(resource: { filename?: string | null; url?: string | null }): string | null {
  const raw = resource.url?.trim()
  if (raw) {
    return normalizeCmsMediaUrl(raw)
  }
  const filename = resource.filename?.trim()
  if (filename) {
    return normalizeCmsMediaUrl(`/api/media/file/${filename}`)
  }
  return null
}

export const Video: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const src = resolveVideoSrc(resource)
    if (!src) return null

    const mimeType =
      'mimeType' in resource && typeof resource.mimeType === 'string'
        ? resource.mimeType
        : 'video/mp4'

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={src} type={mimeType} />
      </video>
    )
  }

  return null
}
