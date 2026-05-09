import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 2)()
  const footer = await getCachedGlobal('footer', 1)()

  return (
    <HeaderClient
      header={header}
      contact={{
        address: footer.address,
        email: footer.contactEmail,
        phone: footer.contactPhone,
      }}
    />
  )
}
