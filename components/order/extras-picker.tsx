"use client"

import { extras } from "@/lib/data"
import { formatMoney } from "@/lib/pricing"
import { useLang } from "@/lib/i18n"

export function ExtrasPicker({ value, onToggle }: { value: string[]; onToggle: (id: string) => void }) {
  const { t } = useLang()

  return (
    <fieldset>
      <legend className="flex items-baseline gap-2 font-heading text-xl font-700">
        {t.order.addExtras}
        <span className="font-sans text-sm font-400 text-muted-foreground">{t.order.optional}</span>
      </legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {extras.map((extra) => {
          const checked = value.includes(extra.id)
          return (
            <label
              key={extra.id}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-4 transition-colors",
                checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(extra.id)}
                className="h-5 w-5 shrink-0 accent-primary"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-600">{extra.name}</span>
                <span className="text-xs text-muted-foreground">{extra.note}</span>
              </span>
              <span className="font-heading text-sm font-700 text-primary">{formatMoney(extra.price)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
