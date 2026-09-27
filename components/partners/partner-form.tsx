"use client"

import { useActionState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"
import { Field, Honeypot, Input, Select, Textarea } from "../ui/field"
import { useLang } from "@/lib/i18n"
import { neighborhoods } from "@/lib/data"
import { submitPartner, type ActionResult } from "@/app/actions"

const initial: ActionResult = { ok: false, error: "" }

export function PartnerForm() {
  const { t } = useLang()
  const [state, action, pending] = useActionState(submitPartner, initial)

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h2 className="mt-4 font-heading text-xl font-700">{t.partners.successTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.partners.successBody}</p>
      </div>
    )
  }

  return (
    <form action={action} className="relative space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.partners.business} htmlFor="business" error={state.fieldErrors?.business}>
          <Input id="business" name="business" required />
        </Field>
        <Field label={t.partners.contact} htmlFor="contact" error={state.fieldErrors?.contact}>
          <Input id="contact" name="contact" autoComplete="name" required />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.partners.email} htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={t.partners.phone} htmlFor="phone" error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </Field>
      </div>
      <Field label={t.partners.neighborhood} htmlFor="neighborhood" error={state.fieldErrors?.neighborhood}>
        <Select id="neighborhood" name="neighborhood" defaultValue="" required>
          <option value="" disabled>
            {t.partners.selectNeighborhood}
          </option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.name}>
              {n.name}, {n.city}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t.partners.message} htmlFor="message" hint={t.partners.messageHint}>
        <Textarea id="message" name="message" />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t.common.sending : t.partners.submit}
      </Button>
    </form>
  )
}
