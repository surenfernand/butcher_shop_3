/**
 * Payload's getPayload() caches instances on globalThis._payload (a Map).
 * If another runtime sets globalThis._payload to a truthy non-Map first,
 * getPayload throws: _cached.get is not a function.
 * Clear invalid values before Payload's module scope captures globalThis._payload.
 */
const g = globalThis as typeof globalThis & { _payload?: unknown }
const slot = g._payload
if (slot != null && typeof (slot as { get?: unknown }).get !== 'function') {
  delete g._payload
}
