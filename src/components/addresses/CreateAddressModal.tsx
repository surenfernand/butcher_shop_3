'use client'
import { Button } from '@/components/ui/button'
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
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}  >
      <DialogTrigger asChild disabled={disabled}>
        <Button variant={'outline'}>{buttonText}</Button>
      </DialogTrigger>
 
      <DialogContent className="box-border w-[calc(100vw-2rem)] max-w-3xl overflow-x-hidden border border-[#4b4235] bg-[#080b0a] p-0 text-[#efe4cf] shadow-2xl sm:max-w-3xl">
        <div className="box-border px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <DialogHeader className="mb-10">
            <DialogTitle className="text-4xl font-semibold tracking-tight text-[#f5c85b]">
              {modalTitle}
            </DialogTitle>
            <DialogDescription className="mt-3 text-base text-[#d8cbb7]">
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
