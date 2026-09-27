"use client"

import { Check, Users, CalendarClock } from "lucide-react"
import { Container } from "../container"
import { ButtonLink } from "../ui/button"
import { useLang } from "@/lib/i18n"
import { packages } from "@/lib/data"
import { formatMoney } from "@/lib/pricing"

export function Packages() {
  const { t } = useLang()
  return (
    <section id="packages" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.packages.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.packages.subtitle}</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={[
                  "relative flex flex-col rounded-2xl border bg-card p-6",
                  pkg.popular ? "border-primary shadow-lg lg:-translate-y-2" : "border-border",
                ].join(" ")}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-700 text-accent-foreground">
                    {t.packages.popular}
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-heading text-xl font-700">{pkg.name}</h3>
                  <span className="font-heading text-2xl font-700 text-primary">{formatMoney(pkg.price)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {t.packages.serves} {pkg.serves}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" /> {t.packages.feeds} {pkg.feeds}
                  </span>
                </div>
                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground">{t.packages.includes}</p>
                  <ul className="mt-3 space-y-2">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ButtonLink
                  href={`/send?pkg=${pkg.id}`}
                  variant={pkg.popular ? "primary" : "outline"}
                  className="mt-6 w-full"
                >
                  {t.packages.choose}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
