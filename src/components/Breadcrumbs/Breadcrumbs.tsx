import Link from 'next/link'

type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#8a8374]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-[#4a4439]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[#3f3a31]' : ''}>{item.label}</span>
              )}

              {!isLast && <span className="text-[#b2a999]">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}