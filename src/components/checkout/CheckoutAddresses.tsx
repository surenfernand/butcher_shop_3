'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmit?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddress,
  heading = 'Addresses',
  description = 'Please select or add your shipping and billing addresses.',
}) => {
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-sm border border-neutral-200 bg-white p-6 text-neutral-700 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <p className="mb-4 text-sm text-neutral-600">No addresses found. Please add an address.</p>

        <CreateAddressModal />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900">{heading}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
      <AddressesModal setAddress={setAddress} />
    </div>
  )
}

const AddressesModal: React.FC<Props> = ({ setAddress }) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p className="text-sm text-neutral-600">No addresses found. Please add an address.</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-neutral-300 bg-white font-semibold uppercase tracking-[0.14em] text-neutral-900 hover:bg-neutral-100"
        >
          Select an address
        </Button>
      </DialogTrigger>
      <DialogContent className="border-neutral-200 bg-white text-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-neutral-900">Select an address</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-6">
            {addresses.map((address) => (
              <li key={address.id} className="border-b border-neutral-200 pb-6 last:border-none">
                <AddressItem
                  address={address}
                  beforeActions={
                    <Button
                      className={cn(
                        'min-h-9 shrink-0 px-4 font-semibold uppercase tracking-[0.12em]',
                        'bg-[#e53935] text-white hover:bg-[#c62828]',
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        setAddress(address)
                        closeModal()
                      }}
                    >
                      Select
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <CreateAddressModal
            triggerClassName="w-full border-transparent bg-[#e53935] font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#c62828] hover:text-white"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
