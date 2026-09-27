"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Container } from "./container"
import { Logo } from "./logo"
import { LanguageToggle } from "./language-toggle"
import { ButtonLink } from "./ui/button"
import { useLang } from "@/lib/i18n"

export function Navbar() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/#how", label: t.nav.how },
    { href: "/#packages", label: t.nav.packages },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/partners", label: t.nav.partners },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-500 text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />
            <ButtonLink href="/send" size="sm">
              {t.nav.send}
            </ButtonLink>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container>
            <div className="flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-sm font-500 text-foreground hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between gap-3">
                <LanguageToggle />
                <ButtonLink href="/send" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  {t.nav.send}
                </ButtonLink>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
