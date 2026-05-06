import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'

import type { Page } from '@/payload-types'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    depth: 0,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return pages.docs
    .filter((doc) => doc.slug && doc.slug !== 'home')
    .map((doc) => ({
      slug: doc.slug,
    }))
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<SearchParams>
}


export default async function Page({ params, searchParams }: Args) {
  const { slug = 'home' } = await params
  const resolvedSearchParams = await searchParams

  const url = '/' + slug

  let page = await queryPageBySlug({
    slug,
  })

  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  const headerGlobal = await getCachedGlobal('header', 1)()
  const { hero, layout } = page

  return (
    <article>
      <div className="pt-20">
        <RenderHero {...hero} brandLogo={headerGlobal.logo} pageSlug={slug} />
        <RenderBlocks blocks={layout} searchParams={resolvedSearchParams} slug={slug} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = 'home' } = await params

  let page = await queryPageBySlug({
    slug,
  })

  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}
