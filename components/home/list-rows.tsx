/** Reference-style feature rows: bold label left, description right, thin dividers. */
export function ListRows({ items }: { items: { title: string; body: string }[] }) {
  return (
    <dl className="mt-10 divide-y divide-border border-y border-border lg:mt-14">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-2 py-6 md:grid md:grid-cols-[280px_minmax(0,1fr)] md:gap-10 md:py-7">
          <dt className="font-heading text-lg font-800 text-foreground">{item.title}:</dt>
          <dd className="max-w-[640px] text-pretty text-[17px] leading-relaxed text-muted-foreground">{item.body}</dd>
        </div>
      ))}
    </dl>
  )
}
