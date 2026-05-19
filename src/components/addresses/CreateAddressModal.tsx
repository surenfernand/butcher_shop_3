'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddressForm } from '@/components/forms/AddressForm'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  /** Merged into the open trigger `Button` (e.g. full width in a dialog). */
  triggerClassName?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
  triggerClassName,
  callback,
  skipSubmission,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleCallback = (data: Partial<Address>) => {
    closeModal()

    if (callback) {
      callback(data)
    }
  }

  const isEditTrigger = buttonText === 'Edit'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          variant={isEditTrigger ? 'outline' : 'default'}
          className={cn(
            isEditTrigger
              ? 'h-9 border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              : 'border-transparent bg-[#e53935] font-sans font-semibold uppercase tracking-[0.12em] text-white shadow-xs hover:bg-[#c62828] hover:text-white',
            triggerClassName,
          )}
        >
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="box-border w-[calc(100vw-2rem)] max-w-3xl overflow-x-hidden rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-[0_16px_48px_rgba(0,0,0,0.1)] sm:max-w-3xl">
        <div className="box-border px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <DialogHeader className="mb-8">
            <DialogTitle className="font-sans text-2xl font-black uppercase tracking-tight text-neutral-900 md:text-3xl">
              {modalTitle}
            </DialogTitle>
            <DialogDescription className="mt-2 font-sans text-sm text-neutral-600">
              This address will be connected to your account.
            </DialogDescription>
          </DialogHeader>

          <AddressForm
            addressID={addressID}
            initialData={initialData}
            callback={handleCallback}
            skipSubmission={skipSubmission}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
