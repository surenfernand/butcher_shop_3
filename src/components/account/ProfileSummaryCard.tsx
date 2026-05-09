import type { User } from '@/payload-types'

import { UserCircle2 } from 'lucide-react'

type Props = {
  user: User
}

export function ProfileSummaryCard({ user }: Props) {
  return (
    <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-[#e31e24]/10 p-2.5 text-[#e31e24]">
          <UserCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Account Holder</p>
          <p className="mt-2 truncate text-xl font-semibold text-neutral-900">
            {user.name || 'Valued Customer'}
          </p>
          <p className="mt-1 truncate text-sm text-neutral-600">{user.email}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-neutral-500">
            Member Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
