import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

import { checkRole } from '@/access/utilities'

/**
 * `roles` is normally admin-only. Allow the same first-admin bootstrap as
 * `adminOrSelfOrBootstrapAdminRole` when the patch sets `roles` to include `admin`.
 */
export const rolesFieldBootstrapOrAdmin: FieldAccess<User> = async ({ req, data, id }) => {
  if (req.user) {
    return checkRole(['admin'], req.user)
  }

  if (id === undefined || id === null) return false
  if (!data || !Array.isArray(data.roles) || !data.roles.includes('admin')) return false

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { roles: { contains: 'admin' } },
  })
  return totalDocs === 0
}
