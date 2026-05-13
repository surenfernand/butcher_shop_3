'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect)
        else router.push(`/account?success=${encodeURIComponent('Account created successfully')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
 

      <Message className="my-0 mb-6 border-red-200 bg-red-50" error={error} />

      <div className="mb-10 flex flex-col gap-8">
        <FormItem>
          <Label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600"
          >
            Email address
          </Label>
          <Input
            id="email"
            {...register('email', { required: 'Email is required.' })}
            type="email"
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600"
          >
            New password
          </Label>
          <Input
            id="password"
            {...register('password', { required: 'Password is required.' })}
            type="password"
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label
            htmlFor="passwordConfirm"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600"
          >
            Confirm password
          </Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            type="password"
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button
        disabled={loading}
        type="submit"
        variant="default"
        className="h-12 w-full rounded-lg bg-[#D32F2F] text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-[#B71C1C] hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <div className="mt-8 text-center text-sm text-neutral-600">
        {'Already have an account? '}
        <Link
          href={`/login${allParams}`}
          className="font-semibold text-[#D32F2F] underline underline-offset-4 hover:text-[#B71C1C]"
        >
          Sign in
        </Link>
      </div>
    </form>
  )
}
