"use client"

import { languages } from "@/lib/dictionary"
import { useLang } from "@/lib/i18n"

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5" role="group" aria-label="Language">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={[
            "rounded-md px-2.5 py-1 text-xs font-heading font-600 transition-colors",
            lang === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
