"use client"

import Image from "next/image"
import { Container } from "../container"
import { ButtonLink } from "../ui/button"
import { Blobs } from "./blobs"
import { useLang } from "@/lib/i18n"
import { kriol } from "@/lib/dictionary"

export function Hero() {
  const { t } = useLang()
  // "Send food home, not just money" -> two lines, broken after the comma.
  const commaAt = t.hero.title.indexOf(",")
  const line1 = commaAt > 0 ? t.hero.title.slice(0, commaAt + 1) : t.hero.title
  const line2 = commaAt > 0 ? t.hero.title.slice(commaAt + 1).trim() : ""

  return (
    <section className="relative isolate overflow-hidden">
      <Blobs />
      <Container>
        <div className="flex flex-col items-center pb-16 pt-12 text-center lg:pb-24 lg:pt-20">
          <p className="text-xs font-600 uppercase tracking-wide text-gold-600">{t.hero.eyebrow}</p>
          <h1 className="mt-5 text-balance text-[40px] font-800 leading-[1.05] tracking-[-0.02em] text-foreground lg:text-[64px]">
            <span className="block">{line1}</span>
            {line2 && <span className="block">{line2}</span>}
          </h1>
          <p lang="kea" className="mt-4 font-heading text-lg font-600 italic text-teal-700 lg:text-xl">
            {kriol.hero}
          </p>
          <p className="mt-5 max-w-[640px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/send" variant="brand" size="pill" className="w-full whitespace-nowrap sm:w-auto">
              {t.hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href="/#how" variant="pillOutline" size="pill" className="w-full whitespace-nowrap sm:w-auto">
              {t.hero.ctaSecondary}
            </ButtonLink>
          </div>

          <div className="relative mt-12 aspect-4/3 w-full max-w-[1100px] overflow-hidden rounded-3xl md:aspect-video lg:mt-16">
            <Image
              src="/images/hero-market.jpg"
              alt={t.media.heroAlt}
              fill
              priority={true}
              quality={75}
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover"
            />
            {/* Illustrative status card, not live data. */}
            <div
              aria-hidden="true"
              className="absolute right-3 top-3 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left shadow-lg sm:right-5 sm:top-5"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-crimson-500" />
              <span className="flex flex-col">
                <span className="text-sm font-700 text-foreground">{t.home.pickupTitle}</span>
                <span className="text-xs text-muted-foreground">{t.home.pickupDetail}</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
