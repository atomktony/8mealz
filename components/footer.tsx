"use client"

import Link from "next/link"
import { Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Container } from "./container"
import { Logo } from "./logo"
import { useLang } from "@/lib/i18n"
import { site } from "@/lib/site"

/** `flush` drops the top margin, for pages that end in a dark band (the homepage's final CTA). */
export function Footer({ flush = false }: { flush?: boolean }) {
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
        { href: "/#how", label: t.nav.how },
        { href: "/#faq", label: t.nav.faq },
        { href: "/partners", label: t.nav.partners },
      ],
    },
    {
      title: t.home.contact,
      links: [
        { href: site.social.whatsapp, label: site.whatsapp },
        { href: `mailto:${site.email}`, label: site.email },
      ],
    },
  ]

  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.whatsapp, label: "WhatsApp", Icon: MessageCircle },
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ]

  return (
    <footer className={["bg-teal-950 text-teal-100", flush ? "border-t border-teal-800" : "mt-24"].join(" ")}>
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:py-16">
          <div className="sm:col-span-3 lg:col-span-1">
            <Logo size="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-teal-100">{t.footer.tagline}</p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-950 transition-colors duration-200 hover:bg-teal-200"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-800 uppercase tracking-wide text-teal-50">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-teal-200 transition-colors duration-200 hover:text-teal-50">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-teal-800 py-6 text-xs text-teal-100 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.credit.year} <span className="font-600 text-teal-50">{site.credit.label}</span>. {t.footer.rights}
          </p>
          <p className="w-fit max-w-2xl text-pretty rounded-2xl bg-gold-100 px-4 py-1.5 text-teal-950 sm:rounded-full">{t.footer.beta}</p>
        </div>
      </Container>
    </footer>
  )
}
