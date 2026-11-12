"use client"

import { Check } from "lucide-react"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { ButtonLink } from "../ui/button"
import { Price } from "../ui/price"
import { useLang } from "@/lib/i18n"
import { packages } from "@/lib/data"
import { packageCopy } from "@/lib/catalog-copy"

export function Packages() {
  const { t } = useLang()
  return (
    <section id="packages" aria-labelledby="packages-title" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="packages-title">{t.packages.title}</SectionHeading>
          <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.packages.subtitle}
          </p>

          <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
            {packages.map((pkg) => {
              const copy = packageCopy(t, pkg)
              return (
                <article
                  key={pkg.id}
                  className={[
                    "relative flex h-full flex-col rounded-2xl bg-card p-7",
                    pkg.popular ? "border-2 border-brand" : "border border-border",
                  ].join(" ")}
                >
                  {pkg.popular && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 text-xs font-700 text-accent-foreground">
                      {t.packages.popular}
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-800 text-foreground">{pkg.name}</h3>
                  <Price
                    amount={pkg.price}
                    className="mt-4 block font-heading text-[44px] font-800 leading-none tracking-[-0.02em] text-foreground"
                  />
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-600 text-teal-800">
                      {t.packages.serves} {pkg.serves}
                    </span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-600 text-teal-800">
                      {t.packages.feeds} {copy.feeds}
                    </span>
                  </div>
                  <p className="mt-6 border-t border-border pt-5 text-xs font-600 uppercase tracking-wide text-muted-foreground">
                    {t.packages.includes}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {copy.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <ButtonLink
                      href={`/send?pkg=${pkg.id}`}
                      variant={pkg.popular ? "brand" : "pillOutline"}
                      size="pill"
                      className="w-full"
                    >
                      {t.packages.choose}
                    </ButtonLink>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
