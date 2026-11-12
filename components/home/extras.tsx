"use client"

import { Flame, Apple, Smartphone, SprayCan } from "lucide-react"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Price } from "../ui/price"
import { useLang } from "@/lib/i18n"
import { extras } from "@/lib/data"
import { extraCopy } from "@/lib/catalog-copy"

const icons: Record<string, typeof Flame> = {
  gas: Flame,
  produce: Apple,
  topup: Smartphone,
  hygiene: SprayCan,
}

export function Extras() {
  const { t } = useLang()
  return (
    <section aria-labelledby="extras-title">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="extras-title">{t.extras.title}</SectionHeading>
          <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.extras.subtitle}
          </p>
          {/* Mobile: horizontal snap scroll. sm and up: grid. */}
          <ul
            tabIndex={0}
            aria-label={t.extras.title}
            className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
          >
            {extras.map((extra) => {
              const Icon = icons[extra.id] ?? Apple
              const copy = extraCopy(t, extra)
              return (
                <li
                  key={extra.id}
                  className="w-[78%] shrink-0 snap-start rounded-2xl border border-border bg-card p-5 sm:w-auto"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                      <Icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                    </span>
                    <Price amount={extra.price} className="font-heading text-base font-800 text-gold-600" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-800 text-foreground">{copy.name}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground" title={copy.note}>
                    {copy.note}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
