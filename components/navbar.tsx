"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { Menu, X } from "lucide-react"
import { Container } from "./container"
import { Logo } from "./logo"
import { LanguageToggle } from "./language-toggle"
import { ButtonLink } from "./ui/button"
import { useLang } from "@/lib/i18n"

export function Navbar() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "/#how", label: t.nav.how },
    { href: "/#packages", label: t.nav.packages },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/#faq", label: t.nav.faq },
    { href: "/partners", label: t.nav.partners },
  ]

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled ? "border-border bg-surface/80 backdrop-blur-md" : "border-transparent bg-surface",
      ].join(" ")}
    >
      <Container>
        <div className="relative flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo />

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
            aria-label={t.a11y.primaryNav}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-500 text-foreground transition-colors duration-200 hover:text-teal-700"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ButtonLink href="/send" variant="brand" size="pill" className="py-2.5 text-sm">
              {t.nav.send}
            </ButtonLink>
            <LanguageToggle />
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary lg:hidden"
              aria-label={t.a11y.menu}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden">
                <Dialog.Title className="sr-only">{t.a11y.menu}</Dialog.Title>
                <Dialog.Description className="sr-only">{t.a11y.primaryNav}</Dialog.Description>
                <Container>
                  <div className="flex h-16 items-center justify-between">
                    <Logo />
                    <Dialog.Close
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary"
                      aria-label={t.a11y.closeMenu}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                </Container>
                <Container className="flex flex-1 flex-col pb-8 pt-6">
                  <nav aria-label={t.a11y.primaryNav} className="flex flex-col">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-border py-4 font-heading text-2xl font-800 text-foreground transition-colors duration-200 hover:text-teal-700"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4 pt-8">
                    <LanguageToggle />
                    <ButtonLink
                      href="/send"
                      variant="brand"
                      size="pill"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    >
                      {t.nav.send}
                    </ButtonLink>
                  </div>
                </Container>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Container>
    </header>
  )
}
