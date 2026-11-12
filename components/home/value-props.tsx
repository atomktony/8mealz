"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { ListRows } from "./list-rows"
import { useLang } from "@/lib/i18n"

export function ValueProps() {
  const { t } = useLang()
  return (
    <section aria-labelledby="value-title">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="value-title">{t.value.title}</SectionHeading>
          <ListRows items={t.value.items} />
        </div>
      </Container>
    </section>
  )
}
