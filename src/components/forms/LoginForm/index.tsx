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
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  remember?: boolean
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login({
          email: data.email,
          password: data.password,
          remember: data.remember,
        })

        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Message className="my-0 mb-6 border-red-200 bg-red-50" error={error} />

      <div className="flex flex-col gap-8">
        <FormItem>
          <Label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600"
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#D32F2F] focus-visible:ring-2 focus-visible:ring-[#D32F2F]/25"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="size-4 rounded border-neutral-300 text-[#D32F2F] focus:ring-[#D32F2F]/30"
              {...register('remember')}
            />
            <span>Remember me</span>
          </label>

          <Link
            href={`/forgot-password${allParams}`}
            className="font-semibold text-[#D32F2F] hover:text-[#B71C1C] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <Button
        className="mt-6 h-12 w-full rounded-lg bg-[#D32F2F] text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-[#B71C1C] hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
        disabled={isLoading}
        size="lg"
        type="submit"
        variant="default"
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}