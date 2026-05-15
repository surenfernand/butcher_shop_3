import { getRequestUser, getPayloadWithBetterAuth } from '@/utilities/getRequestUser'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/** Ecommerce client calls `GET /api/users/me`; Better Auth sessions need this bridge (see getRequestUser). */
export async function GET() {
  const { user: sessionUser } = await getRequestUser(await headers())
  if (!sessionUser?.id) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
  const payload = await getPayloadWithBetterAuth()
  const user = await payload.findByID({
    collection: 'users',
    id: sessionUser.id,
    depth: 1,
    overrideAccess: true,
  })
  return NextResponse.json({ user })
}
