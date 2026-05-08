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
          className="rounded-lg border border-border bg-muted/40 p-4 transition-colors hover:bg-muted"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em]">
            {shortcut.label}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{shortcut.description}</p>
        </Link>
      ))}
    </div>
  )
}
