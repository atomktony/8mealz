"use client"

import { useLang } from "@/lib/i18n"

export function SendHeader() {
  const { t } = useLang()
  return (
    <header className="max-w-2xl">
      <h1 className="text-balance text-3xl sm:text-4xl">{t.sendPage.title}</h1>
      <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{t.sendPage.subtitle}</p>
    </header>
  )
}
