"use client"

import { Check } from "lucide-react"
import { packages } from "@/lib/data"
import { packageCopy } from "@/lib/catalog-copy"
import { Price } from "../ui/price"
import { useLang } from "@/lib/i18n"

export function PackagePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { t } = useLang()

  return (
    <fieldset>
      <legend className="font-heading text-xl font-700">{t.order.choosePackage}</legend>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {packages.map((pkg) => {
          const selected = pkg.id === value
          return (
            <label
              key={pkg.id}
              className={[
                "relative flex cursor-pointer flex-col rounded-2xl border-2 bg-card p-5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              ].join(" ")}
            >
              <input
                type="radio"
                name="package"
                value={pkg.id}
                checked={selected}
                onChange={() => onChange(pkg.id)}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="font-heading text-lg font-700 leading-tight">{pkg.name}</span>
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  ].join(" ")}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                </span>
              </div>
              {pkg.popular && (
                <span className="mt-2 w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-600 text-accent-foreground">
                  {t.order.popular}
                </span>
              )}
              <p className="mt-3 font-heading text-3xl font-700 text-primary">
                <Price amount={pkg.price} />
              </p>
              <dl className="mt-3 flex gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t.order.serves}</dt>
                  <dd className="font-600">
                    {pkg.serves} {t.order.people}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.order.feeds}</dt>
                  <dd className="font-600">{packageCopy(t, pkg).feeds}</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-border pt-3 text-xs font-600 uppercase tracking-wide text-muted-foreground">
                {t.order.included}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed">
                {packageCopy(t, pkg).items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
