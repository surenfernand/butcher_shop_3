import { getPayloadWithBetterAuth } from '@/utilities/getRequestUser'

async function proxy(request: Request): Promise<Response> {
  const payload = await getPayloadWithBetterAuth()
  const betterAuth = payload.betterAuth

  if (!betterAuth) {
    return new Response('Better Auth is not initialized.', { status: 503 })
  }
  return betterAuth.handler(request)
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const PUT = proxy
export const DELETE = proxy
