'use client'

import { Hourglass } from 'lucide-react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  secondsLeft: number
  title: string
  message: string
  confirmLabel: string
  extendLabel: string
  footerText?: string
  onConfirm: () => void
  onExtend: () => void
}

export function CartTimerModal({
  open,
  secondsLeft,
  title,
  message,
  confirmLabel,
  extendLabel,
  footerText,
  onConfirm,
  onExtend,
}: Props) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-[560px] border border-neutral-700 bg-neutral-950 px-10 py-12 text-center text-neutral-50 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
          <Hourglass size={34} />
        </div>

        <h2 className="mt-8 font-serif text-3xl font-bold uppercase text-[#e31e24]">{title}</h2>

        <div className="mx-auto mt-5 h-px w-14 bg-[#e31e24]/50" />

        <p className="mx-auto mt-7 max-w-[420px] text-lg leading-8 text-neutral-400">
          {secondsLeft} seconds remaining. {message}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            className="h-14 bg-[#e31e24] text-sm font-black uppercase tracking-[0.18em] text-white transition-opacity hover:brightness-110"
          >
            {confirmLabel}
          </button>

          <button
            type="button"
            onClick={onExtend}
            className="h-14 border-2 border-[#e31e24] bg-transparent text-sm font-black uppercase tracking-[0.18em] text-[#e31e24] transition-colors hover:bg-[#e31e24]/10"
          >
            {extendLabel}
          </button>
        </div>

        {footerText && (
          <p className="mt-10 text-xs uppercase tracking-[0.35em] text-neutral-500">{footerText}</p>
        )}
      </div>
    </div>,
    document.body,
  )
}
