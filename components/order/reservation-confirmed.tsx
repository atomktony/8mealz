"use client"

import { CheckCircle2, MessageCircle, UsersRound } from "lucide-react"
import { Button, buttonClasses } from "../ui/button"
import { whatsappLink } from "@/lib/site"
import { useLang } from "@/lib/i18n"

export function ReservationConfirmed({
  code,
  onReset,
  onSecondFamily,
}: {
  code: string
  onReset: () => void
  onSecondFamily: () => void
}) {
  const { t } = useLang()
  const message = `Olá, acabei de reservar a encomenda ${code} para a minha família em Cabo Verde.`

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <section
        aria-live="polite"
        className="flex flex-col items-center rounded-2xl border-2 border-primary bg-card px-6 py-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-3xl font-700">{t.order.confirmedTitle}</h2>
        <p className="mt-2 text-pretty text-lg leading-relaxed text-muted-foreground">{t.order.confirmedBody}</p>
        <p className="mt-6 text-xs font-600 uppercase tracking-wide text-muted-foreground">{t.order.reference}</p>
        <p className="mt-1 font-heading text-2xl font-700 tracking-widest">{code}</p>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", "lg", "mt-8 w-full sm:w-auto")}
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {t.order.whatsapp}
        </a>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.order.noPayment}</p>
      </section>

      <section
        aria-labelledby="second-family-title"
        className="flex flex-col gap-4 rounded-2xl border border-accent bg-accent/15 p-6 sm:flex-row sm:items-center"
      >
        <UsersRound className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex-1">
          <h3 id="second-family-title" className="font-heading text-lg font-700">
            {t.order.secondTitle}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.order.secondBody}</p>
        </div>
        <Button type="button" variant="accent" className="shrink-0" onClick={onSecondFamily}>
          {t.order.secondCta}
        </Button>
      </section>

      <Button type="button" variant="ghost" className="self-center" onClick={onReset}>
        {t.order.another}
      </Button>
    </div>
  )
}
