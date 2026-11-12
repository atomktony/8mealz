"use client"

import { useActionState } from "react"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Button } from "../ui/button"
import { Field, Honeypot, Input } from "../ui/field"
import { useLang } from "@/lib/i18n"
import { submitPilot, type ActionResult } from "@/app/actions"

const initial: ActionResult = { ok: false, error: "" }

export function PilotSignup() {
  const { t, lang } = useLang()
  const [state, action, pending] = useActionState(submitPilot, initial)
  const submitted = state.ok

  return (
    <section id="pilot" aria-labelledby="pilot-title" className="scroll-mt-20">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
            <div className="flex flex-col bg-teal-950 p-8 text-teal-100 md:p-12">
              <SectionHeading id="pilot-title" tone="text-surface">
                {t.pilot.title}
              </SectionHeading>
              <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-teal-100">{t.pilot.body}</p>
              <ul className="mt-8 flex flex-col gap-3.5">
                {t.pilot.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-[15px] text-teal-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Image src="/images/logo-mark.svg" alt="" width={104} height={215} unoptimized className="h-10 w-auto" />
              </div>
            </div>

            <div className="p-8 md:p-12">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-teal-600" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-xl font-800">{t.pilot.successTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.pilot.successBody}</p>
                </div>
              ) : (
                <form action={action} className="relative flex flex-col gap-4">
                  <Honeypot />
                  <input type="hidden" name="lang" value={lang} />
                  <Field label={t.pilot.name} htmlFor="p-name" error={state.fieldErrors?.name}>
                    <Input id="p-name" name="name" autoComplete="name" required />
                  </Field>
                  <Field label={t.pilot.email} htmlFor="p-email" error={state.fieldErrors?.email}>
                    <Input id="p-email" name="email" type="email" autoComplete="email" required />
                  </Field>
                  <Field label={t.pilot.phone} htmlFor="p-phone" error={state.fieldErrors?.phone}>
                    <Input id="p-phone" name="phone" type="tel" autoComplete="tel" required />
                  </Field>
                  <Field label={t.pilot.city} htmlFor="p-city" error={state.fieldErrors?.city}>
                    <Input id="p-city" name="city" required />
                  </Field>
                  {!state.ok && state.error && !state.fieldErrors && (
                    <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                      {state.error}
                    </p>
                  )}
                  <Button type="submit" variant="brand" size="pill" className="mt-2 w-full" disabled={pending}>
                    {pending ? t.common.sending : t.pilot.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
