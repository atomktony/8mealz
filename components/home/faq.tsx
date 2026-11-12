"use client"

import { ChevronDown } from "lucide-react"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"
import { whatsappLink } from "@/lib/site"

export function Faq() {
  const { t } = useLang()
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-10 py-16 lg:flex-row lg:gap-16 lg:py-20">
          <div className="lg:w-80 lg:shrink-0">
            <h2 id="faq-title" className="text-balance text-3xl sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {t.faq.subtitle.split("WhatsApp")[0]}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-600 text-primary underline underline-offset-4"
              >
                WhatsApp
              </a>
              {t.faq.subtitle.split("WhatsApp")[1]}
            </p>
          </div>
          <div className="flex flex-1 flex-col border-t border-border">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading text-base font-600 text-foreground [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 pr-9 leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
