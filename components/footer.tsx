"use client"

import Link from "next/link"
import { Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Container } from "./container"
import { Logo } from "./logo"
import { useLang } from "@/lib/i18n"
import { site } from "@/lib/site"

export function Footer() {
  const { t } = useLang()

  const cols = [
    {
      title: t.footer.product,
      links: [
        { href: "/#packages", label: t.nav.packages },
        { href: "/#pricing", label: t.nav.pricing },
        { href: "/send", label: t.nav.send },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: "/partners", label: t.nav.partners },
        { href: "/#how", label: t.nav.how },
      ],
    },
  ]

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.social.whatsapp}
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-700 uppercase tracking-wide text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.credit.year} <span className="font-600 text-foreground">{site.credit.label}</span>. {t.footer.rights}
          </p>
          <p className="max-w-md text-pretty sm:text-right">{t.footer.beta}</p>
        </div>
      </Container>
    </footer>
  )
}
