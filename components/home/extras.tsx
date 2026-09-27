"use client"

import { Flame, Apple, Smartphone, SprayCan } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"
import { extras } from "@/lib/data"
import { formatMoney } from "@/lib/pricing"

const icons: Record<string, typeof Flame> = {
  gas: Flame,
  produce: Apple,
  topup: Smartphone,
  hygiene: SprayCan,
}

export function Extras() {
  const { t } = useLang()
  return (
    <section className="bg-secondary/40">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.extras.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.extras.subtitle}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {extras.map((extra) => {
              const Icon = icons[extra.id] ?? Apple
              return (
                <div key={extra.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-heading text-sm font-700 text-primary">{formatMoney(extra.price)}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-600">{extra.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{extra.note}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
