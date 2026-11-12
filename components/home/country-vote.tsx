"use client"

import { useActionState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Button } from "../ui/button"
import { useLang } from "@/lib/i18n"
import { voteCountries } from "@/lib/data"
import { countryName } from "@/lib/catalog-copy"
import { submitVote, type ActionResult } from "@/app/actions"

const initial: ActionResult = { ok: false, error: "" }

const flags: Record<string, string> = {
  angola: "🇦🇴",
  mozambique: "🇲🇿",
  "guinea-bissau": "🇬🇼",
  "sao-tome": "🇸🇹",
  senegal: "🇸🇳",
  brazil: "🇧🇷",
}

export function CountryVote() {
  const { t, lang } = useLang()
  const [state, action, pending] = useActionState(submitVote, initial)

  return (
    <section aria-labelledby="vote-title">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="vote-title">{t.vote.title}</SectionHeading>
          <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.vote.subtitle}
          </p>

          {state.ok ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-50 px-5 py-3 text-sm font-600 text-teal-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              {t.vote.success}
            </p>
          ) : (
            <form action={action} className="mt-8 flex flex-col items-start gap-6">
              <input type="hidden" name="lang" value={lang} />
              <fieldset>
                <legend className="sr-only">{t.home.voteLabel}</legend>
                <div className="flex flex-wrap gap-3">
                  {voteCountries.map((c) => (
                    <label key={c.id} className="cursor-pointer">
                      <input type="radio" name="countryId" value={c.id} required className="peer sr-only" />
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-600 text-foreground transition-colors duration-200 hover:border-teal-600 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
                        <span aria-hidden="true">{flags[c.id]}</span>
                        {countryName(t, c)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <Button type="submit" variant="brand" size="pill" disabled={pending}>
                {pending ? t.common.sending : t.vote.submit}
              </Button>
            </form>
          )}
          {!state.ok && state.error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}
