'use client'

import React, { useState } from 'react'

type Branch = { id: string; name: string; address?: string }

type Props = {
  onBranchSelected?: (branch: Branch) => void
}

export function BranchSelector({ onBranchSelected }: Props) {
  const [postalCode, setPostalCode] = useState('')
  const [branch, setBranch] = useState<Branch | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const findBranch = async () => {
    setLoading(true)
    setError('')
    setBranch(null)

    const res = await fetch('/api/multi-location/find-branch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postalCode: postalCode.trim().toUpperCase().replace(/\s+/g, ''),
      }),
    })

    const json = await res.json()
    setLoading(false)

    if (!res.ok || !json.branch) {
      setError('No branch found for this postal code.')
      return
    }

    setBranch(json.branch)
    onBranchSelected?.(json.branch)
    localStorage.setItem('selectedBranchID', json.branch.id)
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <label className="block text-sm font-medium">Enter your postal code</label>
      <div className="flex gap-2">
        <input
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
          placeholder="M5V 2T6"
        />
        <button onClick={findBranch} disabled={loading} className="rounded-md border px-4 py-2">
          {loading ? 'Checking...' : 'Find branch'}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {branch ? (
        <div className="rounded-md bg-muted p-3 text-sm">
          <strong>{branch.name}</strong>
          {branch.address ? <p>{branch.address}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
