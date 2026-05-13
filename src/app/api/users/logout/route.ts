import { NextResponse } from 'next/server'

/**
 * Payload's default `POST /api/users/logout` calls `logoutOperation`, which throws
 * "No User" when there is no Payload auth cookie — common with Better Auth–only sessions.
 * This route runs first (same pattern as `/api/users/me`) and clears the Better Auth session,
 * then responds success so the admin UI and storefront logout flows do not see a 400.
 */
export async function POST(request: Request) {
  const url = new URL(request.url)
  const cookie = request.headers.get('cookie') ?? ''

  try {
    await fetch(`${url.origin}/api/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify({}),
    })
  } catch {
    // Still return 200: logout should be idempotent for the client.
  }

  return NextResponse.json({ message: 'Logged out' })
}
