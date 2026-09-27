"use client"

import { ShoppingBasket, CreditCard, PackageCheck } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"

const icons = [ShoppingBasket, CreditCard, PackageCheck]

export function HowItWorks() {
  const { t } = useLang()
  return (
    <section id="how" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.how.title}</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {t.how.steps.map((s, i) => {
              const Icon = icons[i]
              return (
                <div key={s.title} className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-heading text-sm font-700 text-accent">{`0${i + 1}`}</span>
                    <h3 className="font-heading text-lg font-600">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
