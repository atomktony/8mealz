"use client"

import Image from "next/image"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"

export function FounderNote() {
  const { t } = useLang()
  return (
    <section aria-labelledby="founder-title">
      <Container>
        <div className="flex flex-col items-center gap-10 py-16 md:flex-row md:items-start md:gap-14 lg:py-20">
          <div className="relative h-60 w-60 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
            <Image
              src="/images/founder.png"
              alt={t.founder.photoAlt}
              fill
              sizes="240px"
              quality={75}
              className="object-cover"
            />
          </div>
          <div className="flex max-w-2xl flex-col gap-5">
            <h2 id="founder-title" className="text-balance text-3xl text-primary sm:text-4xl">
              {t.founder.title}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-foreground">{t.founder.p1}</p>
            <p className="text-pretty text-lg leading-relaxed text-foreground">{t.founder.p2}</p>
            <p className="text-sm font-400 leading-relaxed text-muted-foreground">{t.founder.signature}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
