import type { CollectionBeforeChangeHook } from 'payload'

import type { User } from '@/payload-types'

/** First registered user becomes admin when no users exist yet. */
export const beforeChangeUserBootstrap: CollectionBeforeChangeHook<User> = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!data) return data

  let roles = data.roles ?? originalDoc?.roles
  if (operation === 'create' && Array.isArray(roles)) {
    const { totalDocs } = await req.payload.find({ collection: 'users', depth: 0, limit: 0 })
    if (totalDocs === 0 && !roles.includes('admin')) {
      data.roles = [...roles, 'admin']
    }
  }

  return data
}
