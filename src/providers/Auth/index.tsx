'use client'

import type { User } from '@/payload-types'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string; remember?: boolean }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type AuthContext = {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

/** Same-origin in the browser so auth cookies match Payload (`/api/users/*`). */
function authFetchBase(): string {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_SERVER_URL ?? ''
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()
  const create = useCallback<Create>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/create`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus('loggedIn')
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const login = useCallback<Login>(async (args) => {
    const base = authFetchBase()
    const jsonHeaders = { 'Content-Type': 'application/json' } as const

    const res = await fetch(`${base}/api/users/login`, {
      body: JSON.stringify({
        email: args.email,
        password: args.password,
      }),
      credentials: 'include',
      headers: jsonHeaders,
      method: 'POST',
    })

    let body: { message?: string; user?: User; errors?: { message?: string }[] } = {}
    try {
      body = (await res.json()) as typeof body
    } catch {
      // non-JSON body
    }

    if (!res.ok) {
      const msg =
        body.message ||
        body.errors?.[0]?.message ||
        (res.status === 403 ? 'Sign-in is not allowed. Check auth configuration.' : res.statusText)
      throw new Error(msg || 'Invalid login')
    }

    const signedInUser = body.user
    if (!signedInUser) {
      throw new Error('Invalid login')
    }

    setUser(signedInUser)
    setStatus('loggedIn')
    return signedInUser
  }, [])

  const logout = useCallback<Logout>(async () => {
    const base = authFetchBase()

    const jsonHeaders = { 'Content-Type': 'application/json' } as const

    try {
      const res = await fetch(`${base}/api/users/logout`, {
        credentials: 'include',
        headers: jsonHeaders,
        method: 'POST',
      })

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
        return
      }

      throw new Error('An error occurred while attempting to logout.')
    } catch {
      throw new Error('An error occurred while attempting to logout.')
    }
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      const base = authFetchBase()
      try {
        const res = await fetch(`${base}/api/users/me`, {
          credentials: 'include',
          method: 'GET',
        })

        if (!res.ok) {
          throw new Error('Session request failed')
        }

        const data = (await res.json()) as { user?: User | null } | null
        const meUser = data?.user

        if (meUser) {
          setUser(meUser)
          setStatus('loggedIn')
        } else {
          setUser(null)
          setStatus(undefined)
        }
      } catch {
        setUser(null)
        setStatus('loggedOut')
      }
    }

    void fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        body: JSON.stringify({
          email: args.email,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        body: JSON.stringify({
          password: args.password,
          passwordConfirm: args.passwordConfirm,
          token: args.token,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
