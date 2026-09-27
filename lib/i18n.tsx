"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { dictionary, type Lang, type Dictionary } from "./dictionary"

type I18nValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dictionary
}

const I18nContext = createContext<I18nValue | null>(null)

const STORAGE_KEY = "8mealz-lang"

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to EN on the server so markup is stable; adjust on the client.
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null
    if (stored === "en" || stored === "pt") {
      setLangState(stored)
      return
    }
    // Portuguese browsers get PT by default.
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pt")) {
      setLangState("pt")
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l)
    if (typeof document !== "undefined") document.documentElement.lang = l
  }

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang
  }, [lang])

  return <I18nContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>{children}</I18nContext.Provider>
}

export function useLang(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useLang must be used within LanguageProvider")
  return ctx
}
