import { getRequestUser } from '@/utilities/getRequestUser'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

/** Ecommerce client calls `GET /api/users/me` for the current session user. */
export async function GET() {
  const { user: sessionUser } = await getRequestUser(await headers())
  if (!sessionUser?.id) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
  const payload = await getPayload({ config: configPromise })
  const user = await payload.findByID({
    collection: 'users',
    id: sessionUser.id,
    depth: 1,
    overrideAccess: true,
  })
  return NextResponse.json({ user })
}
