"use client"

import { useActionState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Container } from "../container"
import { Button } from "../ui/button"
import { Field, Honeypot, Input } from "../ui/field"
import { useLang } from "@/lib/i18n"
import { submitPilot, type ActionResult } from "@/app/actions"

const initial: ActionResult = { ok: false, error: "" }

export function PilotSignup() {
  const { t } = useLang()
  const [state, action, pending] = useActionState(submitPilot, initial)
  const submitted = state.ok

  return (
    <section id="pilot" className="scroll-mt-20">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground">
          <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12 lg:p-14">
            <div>
              <h2 className="text-balance text-3xl sm:text-4xl">{t.pilot.title}</h2>
              <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">{t.pilot.body}</p>
              <ul className="mt-6 space-y-2.5">
                {t.pilot.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-primary-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card p-6 text-foreground">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-heading text-xl font-700">{t.pilot.successTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.pilot.successBody}</p>
                </div>
              ) : (
                <form action={action} className="relative space-y-4">
                  <Honeypot />
                  <Field label={t.pilot.name} htmlFor="p-name" error={state.fieldErrors?.name}>
                    <Input id="p-name" name="name" autoComplete="name" required />
                  </Field>
                  <Field label={t.pilot.email} htmlFor="p-email" error={state.fieldErrors?.email}>
                    <Input id="p-email" name="email" type="email" autoComplete="email" required />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t.pilot.phone} htmlFor="p-phone" error={state.fieldErrors?.phone}>
                      <Input id="p-phone" name="phone" type="tel" autoComplete="tel" required />
                    </Field>
                    <Field label={t.pilot.city} htmlFor="p-city" error={state.fieldErrors?.city}>
                      <Input id="p-city" name="city" required />
                    </Field>
                  </div>
                  <Button type="submit" variant="accent" className="w-full" disabled={pending}>
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
