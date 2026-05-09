'use client'

import { ChevronUp } from 'lucide-react'

export function FooterBackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e53935] text-white shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
    </button>
  )
}
