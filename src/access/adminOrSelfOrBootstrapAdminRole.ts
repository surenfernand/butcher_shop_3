import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Normal updates: admin or own document (Payload session).
 *
 * Bootstrap: allow a one-field `roles: ['admin']` PATCH on your own user id while no admin
 * exists yet (same pattern as first-admin flows that run without `req.user`).
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
  const roles = patch.roles
  if (!Array.isArray(roles) || !roles.includes('admin')) return false
  for (const key of Object.keys(patch)) {
    if (patch[key] !== undefined && key !== 'roles') return false
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { roles: { contains: 'admin' } },
  })
  if (totalDocs > 0) return false

  return {
    id: { equals: id },
  }
}
