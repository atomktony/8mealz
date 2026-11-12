"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { ButtonLink } from "../ui/button"
import { useLang } from "@/lib/i18n"

export function FinalCta() {
  const { t } = useLang()
  return (
    <section aria-labelledby="final-cta-title" className="bg-teal-950">
      <Container>
        <div className="flex flex-col items-center py-16 text-center lg:py-24">
          <SectionHeading id="final-cta-title" align="center" tone="text-teal-100">
            {t.home.finalCta}
          </SectionHeading>
          <ButtonLink href="/send" variant="light" size="pill" className="mt-8">
            {t.hero.ctaPrimary}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
