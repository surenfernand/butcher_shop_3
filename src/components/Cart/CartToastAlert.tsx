// src/components/Cart/CartToastAlert.tsx
'use client'

import { Check, X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

function CartToastAlert({ type, title, description }: any) {
  const isSuccess = type === 'success'

  return (
    <div className={`relative flex w-[420px] gap-5 overflow-hidden border bg-[#070b0a]/95 px-7 py-6 shadow-xl ${isSuccess ? 'border-[#6f5420]' : 'border-[#742710]'
      }`}>
      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${isSuccess ? 'bg-[#f3c75d]' : 'bg-[#ffb6a8]'
        }`}>
        {isSuccess ? <Check size={16} /> : <AlertTriangle size={16} />}
      </div>

      <div className="flex-1 pr-5">
        <p className={`font-serif text-2xl font-bold ${isSuccess ? 'text-[#f3c75d]' : 'text-[#ffb6a8]'
          }`}>
          {title}
        </p>
        <p className="mt-3 text-base leading-7 text-[#ddd2bf]">
          {description}
        </p>
      </div>

      <button
        onClick={() => toast.dismiss()}
        className="absolute right-5 top-5 text-[#8c877e] hover:text-white"
      >
        <X size={20} />
      </button>

      <div className={`cart-toast-progress absolute bottom-0 left-0 h-[3px] w-full origin-left ${isSuccess ? 'bg-[#f3c75d]' : 'bg-[#c43a1c]'
        }`} />
    </div>
  )
}

export function showCartSuccessToast(productName?: string) {
  toast.custom(() => (
    <CartToastAlert
      type="success"
      title="Added To Cart"
      description={`"${productName}" added to your cart.`}
    />
  ), { duration: 4000 })
}

export function showCartErrorToast() {
  toast.custom(() => (
    <CartToastAlert
      type="error"
      title="Refinement Required"
      description="There was a slight hitch in processing your request. Please try again."
    />
  ), { duration: 4000 })
}