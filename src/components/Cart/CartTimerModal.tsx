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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-[560px] border border-border bg-card px-10 py-12 text-center text-card-foreground shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-[#6f5620]/70 text-[#d4a63c]">
                    <Hourglass size={34} />
                </div>

                <h2 className="mt-8 text-3xl font-black uppercase text-[#d4a63c]">
                    {title}
                </h2>

                <div className="mx-auto mt-5 h-px w-14 bg-[#d4a63c]" />

                <p className="mx-auto mt-7 max-w-[420px] text-lg leading-8 text-foreground">
                    {secondsLeft} seconds remaining. {message}
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="h-14 bg-[#d4a63c] text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
                    >
                        {confirmLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onExtend}
                        className="h-14 border border-[#d4a63c] bg-transparent text-sm font-black uppercase tracking-[0.18em] text-[#d4a63c] transition-colors hover:bg-[#d4a63c]/10"
                    >
                        {extendLabel}
                    </button>
                </div>

                {footerText && (
                    <p className="mt-10 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                        {footerText}
                    </p>
                )}
            </div>
        </div>,
    document.body
    )
}