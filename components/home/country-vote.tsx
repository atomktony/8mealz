"use client"

import { useActionState } from "react"
import { Globe2, CheckCircle2 } from "lucide-react"
import { Container } from "../container"
import { Button } from "../ui/button"
import { Select } from "../ui/field"
import { useLang } from "@/lib/i18n"
import { voteCountries } from "@/lib/data"
import { submitVote, type ActionResult } from "@/app/actions"

const initial: ActionResult = { ok: false, error: "" }

export function CountryVote() {
  const { t } = useLang()
  const [state, action, pending] = useActionState(submitVote, initial)

  return (
    <section className="bg-secondary/40">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Globe2 className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-balance text-3xl sm:text-4xl">{t.vote.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.vote.subtitle}</p>

            {state.ok ? (
              <div className="mt-8 flex items-center gap-2 rounded-lg bg-card px-5 py-3 text-sm font-600 text-primary ring-1 ring-primary/20">
                <CheckCircle2 className="h-5 w-5" />
                {t.vote.success}
              </div>
            ) : (
              <form action={action} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <label htmlFor="vote-country" className="sr-only">
                  {t.vote.title}
                </label>
                <Select id="vote-country" name="countryId" defaultValue="" required className="flex-1">
                  <option value="" disabled>
                    {t.vote.placeholder}
                  </option>
                  {voteCountries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <Button type="submit" disabled={pending}>
                  {pending ? t.common.sending : t.vote.submit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
