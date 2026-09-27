"use client"

import Image from "next/image"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Container } from "../container"
import { ButtonLink } from "../ui/button"
import { useLang } from "@/lib/i18n"

export function Hero() {
  const { t } = useLang()
  return (
    <section className="relative overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-600 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t.hero.eyebrow}
            </span>
            <h1 className="mt-5 text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/send" size="lg">
                {t.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/#how" size="lg" variant="outline">
                {t.hero.ctaSecondary}
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <dt className="font-heading text-2xl font-700 text-primary">92%</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{t.hero.stat1}</dd>
              </div>
              <div>
                <dt className="font-heading text-2xl font-700 text-primary">100+</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{t.hero.stat2}</dd>
              </div>
              <div>
                <dt className="font-heading text-2xl font-700 text-primary">24h</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{t.hero.stat3}</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-border shadow-xl sm:aspect-square lg:aspect-4/5">
              <Image
                src="/images/hero-market.png"
                alt="A market vendor handing fresh food across a stall to a customer in Praia, Cabo Verde"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
              <p className="font-script text-2xl text-primary">Food, delivered home</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
