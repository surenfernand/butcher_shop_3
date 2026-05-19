'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

const labelClass = 'mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'

const inputClass =
  'h-11 rounded-md border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-[#e53935]/35'

const helperLinkClass =
  'h-auto px-0 font-normal text-[#e53935] underline underline-offset-4 hover:text-[#c62828]'

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          // Make sure to include cookies with fetch
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success('Successfully updated account.')
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error('There was a problem updating your account.')
        }
      }
    },
    [user, setUser, reset],
  )

  // Sync form when client auth user is available. Do not redirect here: `/account` is
  // already guarded by server `payload.auth()`. A client-only `user === null` (e.g. /me
  // fetch lag or failure) was causing /login ↔ /account redirect loops.
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, reset, changePassword])

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <div className="mb-8 text-sm text-neutral-600">
            <p>
              {'Change your account details below, or '}
              <Button
                className={helperLinkClass}
                onClick={() => setChangePassword(!changePassword)}
                type="button"
                variant="link"
              >
                click here
              </Button>
              {' to change your password.'}
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="email" className={labelClass}>
                Email Address
              </Label>
              <Input
                className={inputClass}
                id="email"
                {...register('email', { required: 'Please provide an email.' })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="name" className={labelClass}>
                Name
              </Label>
              <Input
                className={inputClass}
                id="name"
                {...register('name', { required: 'Please provide a name.' })}
                type="text"
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="mb-8 text-sm text-neutral-600">
            <p>
              {'Change your password below, or '}
              <Button
                className={helperLinkClass}
                onClick={() => setChangePassword(!changePassword)}
                type="button"
                variant="link"
              >
                cancel
              </Button>
              .
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="password" className={labelClass}>
                New password
              </Label>
              <Input
                className={inputClass}
                id="password"
                {...register('password', { required: 'Please provide a new password.' })}
                type="password"
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm" className={labelClass}>
                Confirm password
              </Label>
              <Input
                className={inputClass}
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: 'Please confirm your new password.',
                  validate: (value) => value === password.current || 'The passwords do not match',
                })}
                type="password"
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>
        </Fragment>
      )}
      <Button
        className="bg-[#e53935] font-sans font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#c62828] disabled:bg-neutral-200 disabled:text-neutral-500"
        disabled={isLoading || isSubmitting || !isDirty}
        type="submit"
        variant="default"
      >
        {isLoading || isSubmitting
          ? 'Processing'
          : changePassword
            ? 'Change Password'
            : 'Update Account'}
      </Button>
    </form>
  )
}
