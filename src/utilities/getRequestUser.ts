import type { User } from '@/payload-types'
import configPromise from '@payload-config'
import type { BasePayload, Payload } from 'payload'
import { getPayload } from 'payload'

/**
 * Payload HMR `reload()` updates config/db but does not re-run `config.onInit`, so `betterAuth` may be missing until process restart.
 * (Same pattern as `src/app/api/auth/[...all]/route.ts`.)
 */
const betterAuthOnInitRecovery = Symbol('betterAuthOnInitRecovery')

export async function getPayloadWithBetterAuth(): Promise<Payload> {
  const payload = await getPayload({ config: configPromise })
  let betterAuth = payload.betterAuth

  if (!betterAuth && typeof payload.config.onInit === 'function') {
    const p = payload as BasePayload & { [betterAuthOnInitRecovery]?: boolean }
    if (!p[betterAuthOnInitRecovery]) {
      p[betterAuthOnInitRecovery] = true
      await payload.config.onInit(payload)
      betterAuth = payload.betterAuth
    }
  }

  return payload
}

type SessionPayload = {
  session?: { userId?: string | number }
  user?: { id?: string }
}

/**
 * Resolves the logged-in Payload `users` doc for the current request.
 *
 * `payload.auth({ headers })` uses the Better Auth plugin strategy, which (as of
 * `@payload-auth/better-auth-plugin@1.1.8`) rejects any user whose singular `role` is not
 * in `adminRoles`, so storefront customers with a valid Better Auth session still get
 * `user: null`. This helper reads the session via `betterAuth.api.getSession` and loads
 * the user by id instead.
 *
 * Next `headers()` is cast to `Headers` at runtime for Better Auth / Payload APIs.
 */
export async function getRequestUser(headers: Pick<Headers, 'get'>): Promise<{ user: User | null }> {
  const payload = await getPayloadWithBetterAuth()
  const h = headers as Headers

  if (!payload.betterAuth) {
    const { user } = await payload.auth({ headers: h })
    return { user: (user as User | null) ?? null }
  }

  const sessionResponse = (await payload.betterAuth.api.getSession({
    headers: h,
  })) as SessionPayload | null

  if (!sessionResponse) {
    return { user: null }
  }

  const fromSession = sessionResponse.session?.userId
  const userId =
    typeof fromSession === 'string'
      ? fromSession
      : typeof fromSession === 'number'
        ? String(fromSession)
        : typeof sessionResponse.user?.id === 'string'
          ? sessionResponse.user.id
          : null

  if (!userId) {
    return { user: null }
  }

  try {
    const user = await payload.findByID({
      collection: 'users',
      depth: 0,
      id: userId,
    })
    return { user: user as User }
  } catch {
    return { user: null }
  }
}
