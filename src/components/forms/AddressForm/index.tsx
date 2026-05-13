'use client'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { Address, Config } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { titles } from './constants'
import { Button } from '@/components/ui/button'
import { deepMergeSimple } from 'payload/shared'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { DialogClose } from '@/components/ui/dialog'
import { toast } from 'sonner'

const labelClass = 'font-sans text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'

const inputClass =
  'h-11 min-h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-[#e53935]/35'

const selectTriggerClass =
  'mb-0 h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white text-neutral-900 focus:ring-2 focus:ring-[#e53935]/35'

const selectContentClass = 'rounded-md border border-neutral-200 bg-white text-neutral-900'

type AddressFormValues = {
  title?: string | null
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  callback?: (data: Partial<Address>) => void
  /**
   * If true, the form will not submit to the API.
   */
  skipSubmission?: boolean
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: initialData,
  })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, data)

      try {
        if (!skipSubmission) {
          if (addressID) {
            await updateAddress(addressID, newData)
          } else {
            await createAddress(newData)
          }
        }

        if (callback) {
          callback(newData)
        }
      } catch (error) {
        console.error('Address form submit failed:', error)
        const message =
          error instanceof Error ? error.message : 'Could not save address. Please try again.'
        if (!callback) {
          toast.error(message)
        }

        if (callback) {
          callback(newData)
        }
      }
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="box-border min-w-0 text-neutral-900">
      <div className="mb-8 grid gap-6 sm:mb-10">
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,8.75rem)_minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <FormItem className="min-w-0">
            <Label htmlFor="title" className={labelClass}>
              Title
            </Label>
            <Select
              {...register('title')}
              onValueChange={(value) => setValue('title', value, { shouldValidate: true })}
              defaultValue={initialData?.title || ''}
            >
              <SelectTrigger id="title" className={selectTriggerClass}>
                <SelectValue placeholder="Mr." />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.title && <FormError message={errors.title.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="firstName" className={labelClass}>
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              className={inputClass}
              {...register('firstName', { required: 'First name is required.' })}
            />
            {errors.firstName && <FormError message={errors.firstName.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="lastName" className={labelClass}>
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              className={inputClass}
              {...register('lastName', { required: 'Last name is required.' })}
            />
            {errors.lastName && <FormError message={errors.lastName.message} />}
          </FormItem>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          <FormItem className="min-w-0">
            <Label htmlFor="phone" className={labelClass}>
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="mobile tel"
              className={inputClass}
              {...register('phone')}
            />
            {errors.phone && <FormError message={errors.phone.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="company" className={labelClass}>
              Company Optional
            </Label>
            <Input
              id="company"
              placeholder="Atelier Inc."
              autoComplete="organization"
              className={inputClass}
              {...register('company')}
            />
            {errors.company && <FormError message={errors.company.message} />}
          </FormItem>
        </div>

        <FormItem className="min-w-0">
          <Label htmlFor="addressLine1" className={labelClass}>
            Address Line 1
          </Label>
          <Input
            id="addressLine1"
            placeholder="Street address, P.O. box"
            autoComplete="address-line1"
            className={inputClass}
            {...register('addressLine1', { required: 'Address line 1 is required.' })}
          />
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </FormItem>

        <FormItem className="min-w-0">
          <Label htmlFor="addressLine2" className={labelClass}>
            Address Line 2 Optional
          </Label>
          <Input
            id="addressLine2"
            placeholder="Apartment, suite, unit, floor"
            autoComplete="address-line2"
            className={inputClass}
            {...register('addressLine2')}
          />
          {errors.addressLine2 && <FormError message={errors.addressLine2.message} />}
        </FormItem>

        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
          <FormItem className="min-w-0">
            <Label htmlFor="city" className={labelClass}>
              City
            </Label>
            <Input
              id="city"
              placeholder="New York"
              className={inputClass}
              {...register('city', { required: 'City is required.' })}
            />
            {errors.city && <FormError message={errors.city.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="state" className={labelClass}>
              State / Province
            </Label>
            <Input
              id="state"
              placeholder="NY"
              className={inputClass}
              {...register('state')}
            />
            {errors.state && <FormError message={errors.state.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="postalCode" className={labelClass}>
              Zip Code
            </Label>
            <Input
              id="postalCode"
              placeholder="10001"
              className={inputClass}
              {...register('postalCode', { required: 'Postal code is required.' })}
            />
            {errors.postalCode && <FormError message={errors.postalCode.message} />}
          </FormItem>
        </div>

        <FormItem className="min-w-0">
          <Label htmlFor="country" className={labelClass}>
            Country
          </Label>
          <Select
            {...register('country', { required: 'Country is required.' })}
            onValueChange={(value) => setValue('country', value, { shouldValidate: true })}
            required
            defaultValue={initialData?.country || ''}
          >
            <SelectTrigger id="country" className={selectTriggerClass}>
              <SelectValue placeholder="United States" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {supportedCountries.map((country) => {
                const value = typeof country === 'string' ? country : country.value
                const label =
                  typeof country === 'string'
                    ? country
                    : typeof country.label === 'string'
                      ? country.label
                      : value

                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {errors.country && <FormError message={errors.country.message} />}
        </FormItem>
      </div>

      <div className="flex min-w-0 flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="rounded-md border-neutral-200 font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          className="h-12 w-full rounded-md bg-[#e53935] px-8 font-sans font-black uppercase tracking-[0.18em] text-white hover:bg-[#c62828] sm:w-auto sm:min-w-[220px]"
        >
          Save Address
        </Button>
      </div>
    </form>
  )
}
