import 'payload'

import type { Auth } from 'better-auth'

declare module 'payload' {
  export interface BasePayload {
    /** Populated by `@payload-auth/better-auth-plugin` in `onInit`. */
    betterAuth?: Auth
  }
}
