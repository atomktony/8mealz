"use client"

import { ShoppingBasket, CreditCard, PackageCheck } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"
import { kriol } from "@/lib/dictionary"

const icons = [ShoppingBasket, CreditCard, PackageCheck]

export function HowItWorks() {
  const { t } = useLang()
  const lastStep = t.how.steps.length - 1
  return (
    <section id="how" className="scroll-mt-20 bg-teal-950 text-teal-100">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl text-teal-50 sm:text-4xl">{t.how.title}</h2>
            <p lang="kea" className="mt-4 text-pretty text-lg font-500 italic leading-relaxed text-teal-200">
              {kriol.how}
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {t.how.steps.map((s, i) => {
              const Icon = icons[i]
              const isLast = i === lastStep
              return (
                <div key={s.title} className="relative">
                  <div
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-teal-900 text-teal-200 ring-1 ring-teal-800",
                      // The final step, where the family collects, gets the crimson glow.
                      isLast ? "shadow-[0_0_28px_4px_rgb(159_38_58/0.55)] ring-crimson-500" : "",
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-heading text-sm font-700 text-gold-300">{`0${i + 1}`}</span>
                    <h3 className="font-heading text-lg font-600 text-teal-50">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100">{s.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
