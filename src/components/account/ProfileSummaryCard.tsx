import type { User } from '@/payload-types'

import { UserCircle2 } from 'lucide-react'

type Props = {
  user: User
}

export function ProfileSummaryCard({ user }: Props) {
  return (
    <div className="rounded-lg border border-[#efe6d8] bg-[#fdfbf7] p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-[#f2e7d3] p-2.5 text-[#8f7442]">
          <UserCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8f7a58]">Account Holder</p>
          <p className="mt-2 truncate text-xl font-semibold text-[#2f2a24]">
            {user.name || 'Valued Customer'}
          </p>
          <p className="mt-1 truncate text-sm text-[#746a5a]">{user.email}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#8f7a58]">
            Member Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
