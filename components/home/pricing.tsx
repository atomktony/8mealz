"use client"

import { Container } from "../container"
import { useLang } from "@/lib/i18n"
import { MEMBERSHIP_FEE, formatMoney } from "@/lib/pricing"

export function Pricing() {
  const { t } = useLang()
  const cards = [
    { title: t.pricing.membership, value: formatMoney(MEMBERSHIP_FEE), note: t.pricing.membershipNote },
    { title: t.pricing.service, value: "8%", note: t.pricing.serviceNote },
    { title: t.pricing.markup, value: "8%", note: t.pricing.markupNote },
  ]
  return (
    <section id="pricing" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.pricing.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.pricing.subtitle}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {cards.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-7 text-center">
                <p className="text-sm font-600 uppercase tracking-wide text-muted-foreground">{c.title}</p>
                <p className="mt-3 font-heading text-4xl font-700 text-primary">{c.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
