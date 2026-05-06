import type { Config, Plugin } from 'payload'

export type MultiLocationPluginOptions = {
  enabled?: boolean
  productSlug?: string
  orderSlug?: string
  userSlug?: string
  adminGroup?: string
}

export type PayloadPlugin = Plugin
export type PayloadConfig = Config
