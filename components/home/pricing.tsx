"use client"

import { Container } from "../container"
import { useLang } from "@/lib/i18n"
import { getPackage } from "@/lib/data"
import { SERVICE_FEE_RATE, formatMoney } from "@/lib/pricing"

const EXAMPLE_PACKAGE_ID = "family-feast"

export function Pricing() {
  const { t } = useLang()
  const examplePrice = getPackage(EXAMPLE_PACKAGE_ID)?.price ?? 0
  const exampleFee = Math.round(examplePrice * SERVICE_FEE_RATE * 100) / 100
  const exampleTotal = Math.round((examplePrice + exampleFee) * 100) / 100

  return (
    <section id="pricing" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.pricing.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.pricing.subtitle}</p>
            <p className="mt-8 text-balance font-heading text-2xl font-700 text-primary sm:text-3xl">
              {t.pricing.statement}
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-primary/20 bg-primary/10 p-7">
            <h3 className="font-heading text-lg font-700 text-foreground">{t.pricing.exampleTitle}</h3>
            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted-foreground">{t.pricing.packagePrice}</dt>
                <dd className="font-600 text-foreground">{formatMoney(examplePrice)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted-foreground">{t.pricing.serviceFee}</dt>
                <dd className="font-600 text-foreground">+ {formatMoney(exampleFee)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-primary/20 pt-3">
                <dt className="font-600 text-foreground">{t.pricing.youPay}</dt>
                <dd className="font-heading text-base font-700 text-foreground">{formatMoney(exampleTotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-600 text-foreground">{t.pricing.familyGets}</dt>
                <dd className="text-right font-heading text-base font-700 text-primary">
                  {formatMoney(examplePrice)}{" "}
                  <span className="font-sans text-sm font-400 text-muted-foreground">{t.pricing.worthOfFood}</span>
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.pricing.exampleNote}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
