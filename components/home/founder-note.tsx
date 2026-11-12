"use client"

import Image from "next/image"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { useLang } from "@/lib/i18n"

export function FounderNote() {
  const { t } = useLang()
  return (
    <section aria-labelledby="founder-title">
      <Container>
        <div className="flex flex-col gap-10 py-16 md:flex-row md:items-center md:gap-16 lg:py-24">
          <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded-full bg-secondary">
            <Image
              src="/images/founder.jpg"
              alt={t.founder.photoAlt}
              fill
              sizes="200px"
              quality={75}
              className="object-cover object-[50%_20%]"
            />
          </div>
          <figure className="max-w-[640px]">
            <SectionHeading id="founder-title">{t.founder.title}</SectionHeading>
            <blockquote className="mt-6 border-l-2 border-gold-400 pl-6 text-[17px] leading-relaxed text-foreground">
              <p>{t.founder.p1}</p>
              <p className="mt-4">{t.founder.p2}</p>
            </blockquote>
            <figcaption className="mt-6 pl-6 text-sm text-muted-foreground">
              <span className="font-600">{t.home.founderName}</span>, {t.home.founderRole}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}
