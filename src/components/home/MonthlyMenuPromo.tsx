'use client'

import Image from 'next/image'
import React, { useState } from 'react'

export const MonthlyMenuPromo: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="overflow-hidden bg-[#1a1a1a]">
      <div className="grid md:min-h-[440px] md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-14 md:order-none md:px-12 md:py-16 lg:px-16 lg:py-20">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
            Mastery In Your Inbox.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#a0a0a0] md:text-[17px] md:leading-8">
            Join our inner circle for exclusive access to vintage reserves, masterclass invites, and
            seasonal provenance reports.
          </p>

          {submitted ? (
            <p className="mt-10 text-sm font-medium text-[#d4af5f]">
              Thank you — you&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 max-w-md">
              <label className="block">
                <span className="sr-only">Your email address</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b border-[#5a5a5a] bg-transparent pb-3 pt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white placeholder:text-[#a0a0a0] focus:border-[#a0a0a0] focus:outline-none focus:ring-0"
                />
              </label>
              <button
                type="submit"
                className="mt-9 w-full bg-[#d4af5f] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a] transition hover:brightness-105 md:inline-block md:w-auto md:min-w-[300px]"
              >
                SUBSCRIBE TO CRAFT
              </button>
            </form>
          )}
        </div>

        <div className="relative flex items-center justify-center px-10 pb-14 pt-2 md:order-none md:px-12 md:pb-16 md:pt-16">
          <div className="relative h-[min(72vw,340px)] w-[min(72vw,340px)] md:h-[min(36vw,380px)] md:w-[min(36vw,380px)] lg:h-[400px] lg:w-[400px]">
            <div className="absolute inset-0 rotate-[-5deg] overflow-hidden rounded-[2px] shadow-[0_24px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]">
              <Image
                src="/images/newsletter-cleaver.png"
                alt="Butcher's cleaver and sharpening steel on a wooden surface"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 72vw, 380px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
