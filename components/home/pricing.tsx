"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Price } from "../ui/price"
import { useLang } from "@/lib/i18n"
import { getPackage } from "@/lib/data"
import { SERVICE_FEE_RATE, formatMoney } from "@/lib/pricing"

const EXAMPLE_PACKAGE_ID = "family-feast"

export function Pricing() {
  const { t } = useLang()
  const examplePrice = getPackage(EXAMPLE_PACKAGE_ID)?.price ?? 0
  const exampleFee = Math.round(examplePrice * SERVICE_FEE_RATE * 100) / 100
  const exampleTotal = Math.round((examplePrice + exampleFee) * 100) / 100

  const rows = [
    { label: t.pricing.packagePrice, value: <Price amount={examplePrice} /> },
    { label: t.pricing.serviceFee, value: formatMoney(exampleFee) },
    { label: t.pricing.youPay, value: <Price amount={exampleTotal} /> },
  ]

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20">
      <Container>
        <div className="flex flex-col items-center py-16 text-center lg:py-24">
          <p className="text-xs font-600 uppercase tracking-wide text-gold-600">{t.pricing.title}</p>
          <SectionHeading id="pricing-title" align="center" className="mt-4">
            {t.home.pricingHeadline}
          </SectionHeading>
          <p className="mt-4 text-[17px] text-muted-foreground">{t.home.noMembership}</p>
          <p className="mt-2 max-w-[540px] text-pretty text-sm leading-relaxed text-muted-foreground">
            {t.pricing.subtitle}
          </p>

          <div className="mt-12 w-full max-w-[480px] rounded-2xl border border-border bg-card p-7 text-left">
            <h3 className="font-heading text-lg font-800 text-foreground">{t.pricing.exampleTitle}</h3>
            <dl className="mt-4 text-[15px]">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 border-b border-dashed border-border py-3.5"
                >
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-600 text-foreground">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 pt-4">
                <dt className="font-700 text-foreground">{t.pricing.familyGets}</dt>
                <dd className="text-right font-heading text-lg font-800 text-teal-700">
                  <Price amount={examplePrice} />{" "}
                  <span className="font-sans text-sm font-400 text-muted-foreground">{t.pricing.worthOfFood}</span>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t.pricing.exampleNote}</p>
          </div>
          <p className="mt-4 max-w-[480px] text-pretty text-xs leading-relaxed text-muted-foreground">{t.currency.note}</p>
        </div>
      </Container>
    </section>
  )
}
