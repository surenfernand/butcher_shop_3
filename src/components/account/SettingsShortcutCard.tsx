import Link from 'next/link'

type Shortcut = {
  href: string
  label: string
  description: string
}

type Props = {
  shortcuts: Shortcut[]
}

export function SettingsShortcutCard({ shortcuts }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.href}
          href={shortcut.href}
          className="rounded-sm border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-[#e31e24]/35 hover:bg-white"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900">{shortcut.label}</p>
          <p className="mt-2 text-sm text-neutral-600">{shortcut.description}</p>
        </Link>
      ))}
    </div>
  )
}
