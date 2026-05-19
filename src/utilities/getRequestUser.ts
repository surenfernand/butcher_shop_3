import { AsyncLocalStorage } from 'node:async_hooks'

import type { User } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** Guards against re-entrant `payload.auth()` (e.g. ecommerce `isAdmin` during auth). */
const payloadAuthDepth = new AsyncLocalStorage<number>()

export function isPayloadAuthInProgress(): boolean {
  return (payloadAuthDepth.getStore() ?? 0) > 0
}

/**
 * Resolves the logged-in Payload `users` doc for the current request (JWT / auth cookie).
 */
export async function getRequestUser(headers: Pick<Headers, 'get'>): Promise<{ user: User | null }> {
  if (isPayloadAuthInProgress()) {
    return { user: null }
  }

  return payloadAuthDepth.run(1, async () => {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: headers as Headers })
    return { user: (user as User | null) ?? null }
  })
}
