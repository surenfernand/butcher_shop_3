'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { getClientSideURL } from '@/utilities/getURL'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL =
    (typeof window !== 'undefined' ? getClientSideURL() : '') ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    ''

  return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />
}
