import type { User } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Resolves the logged-in Payload `users` doc for the current request (JWT / auth cookie).
 */
export async function getRequestUser(headers: Pick<Headers, 'get'>): Promise<{ user: User | null }> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: headers as Headers })
  return { user: (user as User | null) ?? null }
}
