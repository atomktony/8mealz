"use client"

import { Coins, MapPinOff, TrendingDown } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"

const icons = [Coins, MapPinOff, TrendingDown]

export function Problem() {
  const { t } = useLang()
  return (
    <section className="bg-teal-950 text-teal-100">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl text-teal-50 sm:text-4xl">{t.problem.title}</h2>
            <p className="mt-4 text-pretty leading-relaxed text-teal-100">{t.problem.body}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {t.problem.points.map((p, i) => {
              const Icon = icons[i]
              return (
                <div key={p.title} className="rounded-xl bg-teal-900 p-6 ring-1 ring-teal-800">
                  <Icon className="h-6 w-6 text-gold-300" />
                  <h3 className="mt-4 font-heading text-lg font-600 text-teal-50">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100">{p.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
