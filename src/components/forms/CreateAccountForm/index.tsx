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
    <form className="w-full max-w-md py-4 text-[#d8d0c2]" onSubmit={handleSubmit(onSubmit)}>
      <div className="prose prose-invert mb-8 text-[#b8ad9a]">
        <p>
          {`This is where new customers can signup and create a new account. To manage all users, `}
          <Link
            href="/admin/collections/users"
            className="text-[#d8aa3f] underline-offset-4 hover:text-[#f0c86a]"
          >
            login to the admin dashboard
          </Link>
          .
        </p>
      </div>

      <Message error={error} />

      <div className="flex flex-col gap-8 mb-10">
        <FormItem>
          <Label htmlFor="email" className="mb-2 text-[#9f9584]">
            Email Address
          </Label>
          <Input
            id="email"
            {...register('email', { required: 'Email is required.' })}
            type="email"
            className="border-0 border-b border-[#5f5546] rounded-none bg-transparent px-0 text-[#eee6d8] placeholder:text-[#7f7463] focus-visible:ring-0 focus-visible:border-[#d8aa3f]"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password" className="mb-2 text-[#9f9584]">
            New password
          </Label>
          <Input
            id="password"
            {...register('password', { required: 'Password is required.' })}
            type="password"
            className="border-0 border-b border-[#5f5546] rounded-none bg-transparent px-0 text-[#eee6d8] placeholder:text-[#7f7463] focus-visible:ring-0 focus-visible:border-[#d8aa3f]"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm" className="mb-2 text-[#9f9584]">
            Confirm Password
          </Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            type="password"
            className="border-0 border-b border-[#5f5546] rounded-none bg-transparent px-0 text-[#eee6d8] placeholder:text-[#7f7463] focus-visible:ring-0 focus-visible:border-[#d8aa3f]"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button
        disabled={loading}
        type="submit"
        variant="default"
        className="w-full rounded-none border border-[#c8a24d] bg-[#c8a24d] px-5 py-6 text-center text-[11px] font-extrabold uppercase tracking-[0.28em] text-black transition-all duration-300 ease-out hover:bg-transparent hover:text-[#c8a24d] hover:scale-[1.03] active:scale-[0.97]"
      >
        {loading ? 'Processing' : 'Create Account'}
      </Button>

      <div className="prose prose-invert mt-8 text-[#b8ad9a]">
        <p>
          {'Already have an account? '}
          <Link href={`/login${allParams}`} className="text-[#d8aa3f] underline-offset-4 hover:text-[#f0c86a]">
            Login
          </Link>
        </p>
      </div>
    </form>
  )
}
