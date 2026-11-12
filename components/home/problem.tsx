"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { ListRows } from "./list-rows"
import { useLang } from "@/lib/i18n"

export function Problem() {
  const { t } = useLang()
  return (
    <section aria-labelledby="problem-title">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="problem-title" className="max-w-[720px]">
            {t.problem.title}
          </SectionHeading>
          <p className="mt-5 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.problem.body}
          </p>
          <ListRows items={t.problem.points} />
        </div>
      </Container>
    </section>
  )
}
