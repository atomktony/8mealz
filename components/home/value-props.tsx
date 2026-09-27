"use client"

import { CheckCircle2, Leaf, Receipt, BellRing } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"

const icons = [CheckCircle2, Leaf, Receipt, BellRing]

export function ValueProps() {
  const { t } = useLang()
  return (
    <section className="bg-secondary/40">
      <Container>
        <div className="py-16 lg:py-20">
          <h2 className="max-w-xl text-balance text-3xl sm:text-4xl">{t.value.title}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.value.items.map((item, i) => {
              const Icon = icons[i]
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-heading text-base font-600">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
