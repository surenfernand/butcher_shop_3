import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Normal updates: admin or own document (Payload session).
 *
 * The Better Auth plugin’s create-first-admin UI PATCHes `/api/users/:id` with `{ role: 'admin' }`
 * from the browser after email sign-up. That request only has Better Auth cookies, so `req.user`
 * is unset. Allow that single bootstrap while no user has `role: 'admin'` yet (same window as
 * the plugin’s create-first-admin screen).
 */
export const adminOrSelfOrBootstrapAdminRole: Access = async ({ req, id, data }) => {
  if (req.user) {
    if (checkRole(['admin'], req.user)) return true
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  if (id === undefined || id === null) return false
  if (!data || typeof data !== 'object') return false

  const patch = data as Record<string, unknown>
  if (patch.role !== 'admin') return false
  for (const key of Object.keys(patch)) {
    if (patch[key] !== undefined && key !== 'role') return false
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { role: { equals: 'admin' } },
  })
  if (totalDocs > 0) return false

  return {
    id: { equals: id },
  }
}
