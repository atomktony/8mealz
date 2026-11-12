"use client"

import Image from "next/image"
import { Container } from "../container"
import { ButtonLink } from "../ui/button"
import { useLang } from "@/lib/i18n"

export function Stats() {
  const { t } = useLang()
  const stats = [
    { value: "100%", label: t.hero.stat1 },
    { value: "Praia", label: t.hero.stat2 },
    { value: "24h", label: t.hero.stat3 },
  ]

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        {t.home.statsHeading}
      </h2>
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:items-center lg:gap-16 lg:py-24">
          <ul className="flex flex-col gap-8">
            {stats.map((s) => (
              <li key={s.value} className="flex items-center gap-4 sm:gap-5">
                <span className="w-[136px] shrink-0 font-heading text-[44px] font-800 leading-none tracking-[-0.02em] text-foreground sm:w-[176px] sm:text-[56px]">
                  {s.value}
                </span>
                <span aria-hidden="true" className="h-px w-10 shrink-0 bg-muted-foreground/40 sm:w-[60px]" />
                <span className="text-sm leading-snug text-muted-foreground">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/market-1.png"
                alt={t.home.statsImageAlt}
                fill
                quality={75}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-balance font-heading text-xl font-800 leading-snug text-foreground lg:text-2xl">
                {t.home.pitchTitle}
              </p>
              <p className="mt-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">{t.home.pitchBody}</p>
              <ButtonLink href="/#packages" variant="brand" size="pill" className="mt-7">
                {t.home.explore}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
