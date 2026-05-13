export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const g = globalThis as typeof globalThis & { _payload?: unknown }
  const slot = g._payload
  if (slot != null && typeof (slot as { get?: unknown }).get !== 'function') {
    delete g._payload
  }
}
