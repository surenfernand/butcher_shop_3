// src/components/Cart/CartToastAlert.tsx
'use client'

import { Check, X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/utilities/cn'

function CartToastAlert({ type, title, description }: { type: string; title: string; description: string }) {
  const isSuccess = type === 'success'

  return (
    <div
      className={cn(
        'relative flex w-[420px] gap-5 overflow-hidden border border-border bg-card px-7 py-6 text-card-foreground shadow-xl',
        !isSuccess && 'border-destructive/40',
      )}
    >
      <div
        className={cn(
          'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isSuccess ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive',
        )}
      >
        {isSuccess ? <Check size={16} strokeWidth={2.5} /> : <AlertTriangle size={16} />}
      </div>

      <div className="flex-1 pr-5">
        <p
          className={cn(
            'font-serif text-2xl font-bold',
            isSuccess ? 'text-primary' : 'text-destructive',
          )}
        >
          {title}
        </p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss()}
        className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={20} />
      </button>

      <div
        className={cn(
          'cart-toast-progress absolute bottom-0 left-0 h-[3px] w-full origin-left',
          isSuccess ? 'bg-primary' : 'bg-destructive',
        )}
      />
    </div>
  )
}

export function showCartSuccessToast(productName?: string) {
  toast.custom(
    () => (
      <CartToastAlert
        type="success"
        title="Added To Cart"
        description={`"${productName}" added to your cart.`}
      />
    ),
    { duration: 4000 },
  )
}

export function showCartErrorToast() {
  toast.custom(
    () => (
      <CartToastAlert
        type="error"
        title="Refinement Required"
        description="There was a slight hitch in processing your request. Please try again."
      />
    ),
    { duration: 4000 },
  )
}
