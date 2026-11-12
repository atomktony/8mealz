"use client"

import type { Extra, Pkg } from "@/lib/data"
import { formatMoney, type OrderTotals } from "@/lib/pricing"
import { Price } from "../ui/price"
import { extraCopy } from "@/lib/catalog-copy"
import { useLang } from "@/lib/i18n"

export function OrderSummary({
  pkg,
  selectedExtras,
  totals,
}: {
  pkg: Pkg
  selectedExtras: Extra[]
  totals: OrderTotals
}) {
  const { t } = useLang()

  return (
    <section aria-labelledby="order-summary-title" className="rounded-2xl border border-border bg-card p-5">
      <h2 id="order-summary-title" className="font-heading text-lg font-700">
        {t.order.summary}
      </h2>
      <dl className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted-foreground">{t.order.package}</dt>
          <dd className="text-right">
            <span className="font-600">{pkg.name}</span>
            <Price amount={pkg.price} className="ml-2 font-600" />
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted-foreground">{t.order.extras}</dt>
          <dd className="flex flex-col items-end gap-1 text-right">
            {selectedExtras.length === 0 && <span className="text-muted-foreground">{t.order.noExtras}</span>}
            {selectedExtras.map((extra) => (
              <span key={extra.id}>
                {extraCopy(t, extra).name}
                <Price amount={extra.price} className="ml-2 font-600" />
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.order.subtotal}</dt>
          <dd className="font-600">
            <Price amount={totals.subtotal} />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.order.serviceFee}</dt>
          <dd className="font-600">{formatMoney(totals.serviceFee)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
          <dt className="font-heading font-700">{t.order.total}</dt>
          <dd className="font-heading text-2xl font-700 text-primary">
            <Price amount={totals.total} />
          </dd>
        </div>
      </dl>
    </section>
  )
}
