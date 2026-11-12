"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { ButtonLink } from "../ui/button"
import { Price } from "../ui/price"
import { useLang } from "@/lib/i18n"
import { getExtra, getNeighborhood, getPackage } from "@/lib/data"
import { extraCopy } from "@/lib/catalog-copy"
import { formatMoney } from "@/lib/pricing"
import type { Order } from "@/lib/store"

export function OrderDetails({ order }: { order: Order }) {
  const { t } = useLang()
  const pkg = getPackage(order.packageId)
  const neighborhood = getNeighborhood(order.neighborhoodId)
  const extraLines = order.extraIds
    .map((id) => getExtra(id))
    .filter((extra): extra is NonNullable<typeof extra> => Boolean(extra))

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-balance text-3xl sm:text-4xl">{t.orderPage.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.orderPage.body.replace("{name}", order.recipientName)}</p>
        <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-8 py-5">
          <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground">{t.orderPage.pickupCode}</p>
          <p className="font-heading text-4xl font-700 tracking-wider text-primary">{order.code}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-700">{pkg?.name}</h2>
        {neighborhood && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t.orderPage.pickupAt} {neighborhood.name}, {neighborhood.city}
          </p>
        )}
        <ul className="mt-5 flex flex-col gap-2 text-sm">
          {pkg && (
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{pkg.name}</span>
              <Price amount={pkg.price} className="font-600" />
            </li>
          )}
          {extraLines.map((extra) => (
            <li key={extra.id} className="flex items-center justify-between">
              <span className="text-muted-foreground">{extraCopy(t, extra).name}</span>
              <Price amount={extra.price} className="font-600" />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.order.subtotal}</span>
            <Price amount={order.totals.subtotal} className="font-600" />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.order.serviceFee}</span>
            <span className="font-600">{formatMoney(order.totals.serviceFee)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-heading font-700">{t.order.total}</span>
          <Price amount={order.totals.total} className="font-heading text-xl font-700 text-primary" />
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/send">{t.orderPage.sendAnother}</ButtonLink>
        <ButtonLink href="/" variant="outline">
          {t.orderPage.backHome}
        </ButtonLink>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t.orderPage.demoNote}</p>
    </div>
  )
}
