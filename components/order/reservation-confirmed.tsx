"use client"

import { CheckCircle2, MessageCircle } from "lucide-react"
import { Button, buttonClasses } from "../ui/button"
import { site } from "@/lib/site"
import { useLang } from "@/lib/i18n"

export function ReservationConfirmed({ code, onReset }: { code: string; onReset: () => void }) {
  const { t } = useLang()

  return (
    <section
      aria-live="polite"
      className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border-2 border-primary bg-card px-6 py-10 text-center"
    >
      <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-3xl font-700">{t.order.confirmedTitle}</h2>
      <p className="mt-2 text-pretty text-lg leading-relaxed text-muted-foreground">{t.order.confirmedBody}</p>
      <p className="mt-6 text-xs font-600 uppercase tracking-wide text-muted-foreground">{t.order.reference}</p>
      <p className="mt-1 font-heading text-2xl font-700 tracking-widest">{code}</p>
      <a
        href={site.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("primary", "lg", "mt-8 w-full sm:w-auto")}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        {t.order.whatsapp}
      </a>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.order.noPayment}</p>
      <Button type="button" variant="ghost" className="mt-4" onClick={onReset}>
        {t.order.another}
      </Button>
    </section>
  )
}
