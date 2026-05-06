import React from 'react'
import type { DefaultDocumentIDType } from 'payload'

type TestimonialsBlockProps = {
  id?: DefaultDocumentIDType
  className?: string
  title?: string | null
  items?: { quote: string; name: string; role?: string | null }[] | null
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ title, items }) => {
  if (!items?.length) return null
  return (
    <section className="container">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <blockquote key={index} className="rounded-2xl border bg-card p-6">
            <p className="text-base leading-7">“{item.quote}”</p>
            <footer className="mt-4 border-t pt-4">
              <p className="font-medium">{item.name}</p>
              {item.role ? <p className="text-sm text-muted-foreground">{item.role}</p> : null}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
