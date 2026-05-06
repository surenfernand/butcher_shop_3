import type { Access } from 'payload'

export const publicRead: Access = () => true

export const adminOnly: Access = ({ req }) => {
  const user = req.user as { roles?: string[] } | null | undefined
  return Boolean(user?.roles?.includes('admin'))
}
