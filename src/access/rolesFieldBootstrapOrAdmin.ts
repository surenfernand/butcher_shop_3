import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

import { checkRole } from '@/access/utilities'

/**
 * `roles` is normally admin-only. Allow the same first-admin bootstrap as
 * `adminOrSelfOrBootstrapAdminRole` when the top-level patch sets `role: 'admin'`.
 */
export const rolesFieldBootstrapOrAdmin: FieldAccess<User> = async ({ req, data, id }) => {
  if (req.user) {
    return checkRole(['admin'], req.user)
  }

  if (id === undefined || id === null) return false
  if (!data || data.role !== 'admin') return false

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { role: { equals: 'admin' } },
  })
  return totalDocs === 0
}
