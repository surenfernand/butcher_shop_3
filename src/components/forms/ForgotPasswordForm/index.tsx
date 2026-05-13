'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'There was a problem while attempting to send you a password reset email. Please try again.',
      )
    }
  }, [])

  return (
    <Fragment>
      {!success && (
        <React.Fragment>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Forgot password</h1>
          <div className="mb-8 text-sm leading-relaxed text-neutral-600">
            <p>
              Enter your email and we will send instructions to reset your password. Store staff can manage users in the{' '}
              <Link href="/admin/collections/users" className="font-semibold text-[#D32F2F] hover:text-[#B71C1C] hover:underline">
                admin dashboard
              </Link>
              .
            </p>
          </div>
          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <Message className="my-0 mb-6 border-red-200 bg-red-50" error={error} />

            <FormItem className="mb-8">
              <Label htmlFor="email" className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Email address
              </Label>
              <Input
                id="email"
                {...register('email', { required: 'Please provide your email.' })}
                type="email"
                className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <Button
              type="submit"
              variant="default"
              className="h-12 rounded-lg bg-[#D32F2F] px-8 text-sm font-semibold text-white hover:bg-[#B71C1C]"
            >
              Send reset link
            </Button>
          </form>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Request submitted</h1>
          <div className="text-sm leading-relaxed text-neutral-600">
            <p>Check your email for a link that will allow you to securely reset your password.</p>
          </div>
        </React.Fragment>
      )}
    </Fragment>
  )
}
