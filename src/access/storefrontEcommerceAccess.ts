import type { User } from '@/payload-types'
import type { Access, FieldAccess, PayloadRequest } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { checkRole } from '@/access/utilities'
import { getRequestUser } from '@/utilities/getRequestUser'

async function attachStorefrontUser(req: PayloadRequest): Promise<void> {
  if (req.user) return
  const h = req.headers
  if (!h || typeof (h as Headers).get !== 'function') return
  const { user } = await getRequestUser(h as Headers)
  if (user) {
    ;(req as PayloadRequest & { user: User }).user = user
  }
}

/** Resolves storefront session onto `req.user` so ecommerce REST matches cookie auth. */
export const storefrontIsAuthenticated: Access = async ({ req }) => {
  await attachStorefrontUser(req)
  return Boolean(req.user)
}

export const storefrontIsAdmin: Access = async (args) => {
  await attachStorefrontUser(args.req)
  return isAdmin(args)
}

export const storefrontIsDocumentOwner: Access = async (args) => {
  await attachStorefrontUser(args.req)
  return isDocumentOwner(args)
}

/**
 * Used by ecommerce address `beforeChange` to auto-set `customer`.
 */
export const storefrontIsCustomer: FieldAccess = async ({ req }) => {
  await attachStorefrontUser(req)
  const user = req.user as User | undefined
  if (!user) return false
  if (checkRole(['admin'], user)) return false
  return checkRole(['customer'], user)
}
