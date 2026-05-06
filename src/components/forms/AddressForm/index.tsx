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

        if (callback) {
          callback(newData)
        }
      }
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="box-border min-w-0 text-[#efe4cf]">
      <div className="mb-8 grid gap-6 sm:mb-12">
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,8.75rem)_minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <FormItem className="min-w-0">
            <Label htmlFor="title" className="text-sm font-semibold text-[#e7dac4]">
              Title
            </Label>
            <Select
              {...register('title')}
              onValueChange={(value) => setValue('title', value, { shouldValidate: true })}
              defaultValue={initialData?.title || ''}
            >
              <SelectTrigger
                id="title"
                className="mb-0 h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf]"
              >
                <SelectValue placeholder="Mr." />
              </SelectTrigger>
              <SelectContent className="border-[#5d5445] bg-[#252827] text-[#efe4cf]">
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.title && <FormError message={errors.title.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="firstName" className="text-sm font-semibold text-[#e7dac4]">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
              {...register('firstName', { required: 'First name is required.' })}
            />
            {errors.firstName && <FormError message={errors.firstName.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="lastName" className="text-sm font-semibold text-[#e7dac4]">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
              {...register('lastName', { required: 'Last name is required.' })}
            />
            {errors.lastName && <FormError message={errors.lastName.message} />}
          </FormItem>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          <FormItem className="min-w-0">
            <Label htmlFor="phone" className="text-sm font-semibold text-[#e7dac4]">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="mobile tel"
              className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
              {...register('phone')}
            />
            {errors.phone && <FormError message={errors.phone.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="company" className="text-sm font-semibold text-[#e7dac4]">
              Company Optional
            </Label>
            <Input
              id="company"
              placeholder="Atelier Inc."
              autoComplete="organization"
              className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
              {...register('company')}
            />
            {errors.company && <FormError message={errors.company.message} />}
          </FormItem>
        </div>

        <FormItem className="min-w-0">
          <Label htmlFor="addressLine1" className="text-sm font-semibold text-[#e7dac4]">
            Address Line 1
          </Label>
          <Input
            id="addressLine1"
            placeholder="Street address, P.O. box"
            autoComplete="address-line1"
            className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
            {...register('addressLine1', { required: 'Address line 1 is required.' })}
          />
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </FormItem>

        <FormItem className="min-w-0">
          <Label htmlFor="addressLine2" className="text-sm font-semibold text-[#e7dac4]">
            Address Line 2 Optional
          </Label>
          <Input
            id="addressLine2"
            placeholder="Apartment, suite, unit, floor"
            autoComplete="address-line2"
            className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]"
            {...register('addressLine2')}
          />
          {errors.addressLine2 && <FormError message={errors.addressLine2.message} />}
        </FormItem>

        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
          <FormItem className="min-w-0">
            <Label htmlFor="city" className="text-sm font-semibold text-[#e7dac4]">City</Label>
            <Input id="city" placeholder="New York" className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]" {...register('city', { required: 'City is required.' })} />
            {errors.city && <FormError message={errors.city.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="state" className="text-sm font-semibold text-[#e7dac4]">State / Province</Label>
            <Input id="state" placeholder="NY" className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]" {...register('state')} />
            {errors.state && <FormError message={errors.state.message} />}
          </FormItem>

          <FormItem className="min-w-0">
            <Label htmlFor="postalCode" className="text-sm font-semibold text-[#e7dac4]">Zip Code</Label>
            <Input id="postalCode" placeholder="10001" className="h-11 min-h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf] placeholder:text-[#6f6a60]" {...register('postalCode', { required: 'Postal code is required.' })} />
            {errors.postalCode && <FormError message={errors.postalCode.message} />}
          </FormItem>
        </div>

        <FormItem className="min-w-0">
          <Label htmlFor="country" className="text-sm font-semibold text-[#e7dac4]">
            Country
          </Label>
          <Select
            {...register('country', { required: 'Country is required.' })}
            onValueChange={(value) => setValue('country', value, { shouldValidate: true })}
            required
            defaultValue={initialData?.country || ''}
          >
            <SelectTrigger
              id="country"
              className="mb-0 h-11 w-full min-w-0 rounded-none border-[#5d5445] bg-[#252827] text-[#efe4cf]"
            >
              <SelectValue placeholder="United States" />
            </SelectTrigger>
            <SelectContent className="border-[#5d5445] bg-[#252827] text-[#efe4cf]">
              {supportedCountries.map((country) => {
                const value = typeof country === 'string' ? country : country.value
                const label =
                  typeof country === 'string'
                    ? country
                    : typeof country.label === 'string'
                      ? country.label
                      : value

                return <SelectItem key={value} value={value}>{label}</SelectItem>
              })}
            </SelectContent>
          </Select>
          {errors.country && <FormError message={errors.country.message} />}
        </FormItem>
      </div>

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="rounded-none text-[#efe4cf] hover:bg-transparent hover:text-[#f5c85b]"
        >
          ✕ Cancel
        </Button>

        <Button
          type="submit"
          className="h-14 w-full max-w-full rounded-none bg-[#f3c65f] text-sm font-medium uppercase tracking-[0.18em] text-[#1a1308] hover:bg-[#ffd778] sm:w-auto sm:min-w-[240px] sm:max-w-[300px]"
        >
          Save Address
        </Button>
      </div>
    </form>
  )
}
