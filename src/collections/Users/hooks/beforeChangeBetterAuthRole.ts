import type { CollectionBeforeChangeHook } from 'payload'

import type { User } from '@/payload-types'

/**
 * Better Auth + Payload admin strategy use the singular `role` field.
 * This project still uses the legacy `roles` array (admin / customer).
 * Keep them aligned and preserve “first user is admin” behavior.
 */
export const beforeChangeBetterAuthRole: CollectionBeforeChangeHook<User> = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!data) return data

  // Better Auth create-first-admin PATCH sends only singular `role`; keep legacy `roles` in sync for Payload admin checks.
  if (data.role === 'admin') {
    data.roles = ['admin']
  }

  let roles = data.roles ?? originalDoc?.roles
  if (operation === 'create' && Array.isArray(roles)) {
    const { totalDocs } = await req.payload.find({ collection: 'users', depth: 0, limit: 0 })
    if (totalDocs === 0 && !roles.includes('admin')) {
      roles = [...roles, 'admin']
      data.roles = roles
    }
  }

  if (Array.isArray(roles) && roles.includes('admin')) {
    data.role = 'admin'
  } else if (Array.isArray(roles)) {
    data.role = 'customer'
  }

  return data
}
