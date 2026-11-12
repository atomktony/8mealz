"use client"

import { Store, TrendingUp, HandCoins } from "lucide-react"
import { Container } from "../container"
import { PartnerForm } from "./partner-form"
import { useLang } from "@/lib/i18n"

const icons = [TrendingUp, HandCoins, Store]

export function PartnersContent() {
  const { t } = useLang()
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <Container>
          <div className="py-16 lg:py-20">
            <div className="max-w-2xl">
              <span className="text-sm font-600 text-accent">{t.partnersPage.eyebrow}</span>
              <h1 className="mt-3 text-balance text-4xl sm:text-5xl">{t.partnersPage.title}</h1>
              <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">{t.partnersPage.body}</p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="py-16 lg:py-20">
            <div className="grid gap-6 sm:grid-cols-3">
              {t.partnersPage.benefits.map((b, i) => {
                const Icon = icons[i] ?? Store
                return (
                  <div key={b.title} className="rounded-xl border border-border bg-card p-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-heading text-lg font-600">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                )
              })}
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <h2 className="text-balance text-3xl">{t.partnersPage.applyTitle}</h2>
              <p className="mt-2 text-muted-foreground">{t.partnersPage.applyBody}</p>
              <div className="mt-8">
                <PartnerForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
