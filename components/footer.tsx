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
    <footer className="mt-24 bg-teal-950 text-teal-100">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-teal-100">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-800 text-teal-200 transition-colors hover:bg-teal-900 hover:text-teal-50"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.social.whatsapp}
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-800 text-teal-200 transition-colors hover:bg-teal-900 hover:text-teal-50"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-800 text-teal-200 transition-colors hover:bg-teal-900 hover:text-teal-50"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-700 uppercase tracking-wide text-teal-50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-teal-200 transition-colors hover:text-teal-50">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-teal-800 py-6 text-xs text-teal-100 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.credit.year} <span className="font-600 text-teal-50">{site.credit.label}</span>. {t.footer.rights}
          </p>
          <p className="max-w-md text-pretty sm:text-right">{t.footer.beta}</p>
        </div>
      </Container>
    </footer>
  )
}
