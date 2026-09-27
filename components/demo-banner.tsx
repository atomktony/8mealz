"use client"

import { useLang } from "@/lib/i18n"

// Demo mode = no Supabase connected. NEXT_PUBLIC_ vars are safe to read here.
const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function DemoBanner() {
  const { t } = useLang()
  if (!isDemo) return null
  return (
    <div className="bg-accent/15 text-center text-xs text-accent-foreground">
      <p className="mx-auto max-w-6xl px-4 py-2 font-500">{t.common.demoBanner}</p>
    </div>
  )
}
