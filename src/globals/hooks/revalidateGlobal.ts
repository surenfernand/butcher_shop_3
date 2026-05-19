import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Bust `getCachedGlobal` and layout shell when a Payload global changes (header logo, footer, etc.).
 */
export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  global,
  req: { context, payload },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const tag = `global_${global.slug}`
  payload.logger.info(`Revalidating global tag: ${tag}`)

  revalidateTag(tag, 'max')
  revalidatePath('/', 'layout')

  return doc
}
