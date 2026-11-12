"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { useLang } from "@/lib/i18n"
import { whatsappLink } from "@/lib/site"

export function Faq() {
  const { t } = useLang()
  const [before, after] = t.faq.subtitle.split("WhatsApp")
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="faq-title">{t.faq.title}</SectionHeading>
          <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {before}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-600 text-teal-700 underline underline-offset-4 transition-colors duration-200 hover:text-teal-800"
            >
              WhatsApp
            </a>
            {after}
          </p>
          <Accordion type="single" collapsible className="mt-10 max-w-[860px] border-t border-border">
            {t.faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
