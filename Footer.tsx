"use client";

import Link from "next/link";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const socials = [
    { href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
    { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
  ].filter((s) => s.href);

  return (
    <footer className="bg-brand-teal-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo className="h-16 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-white/85">{t.footer.mission}</p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full bg-white/10 p-2.5 hover:bg-white/20 transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs text-white/80 underline-offset-4 hover:underline"
          >
            www.linkedin.com/company/8mealz/
          </a>
        </div>
        <div>
          <h2 className="eyebrow mb-4 text-white/70">{t.footer.explore}</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:underline" href="/#how-it-works">{t.nav.how}</Link></li>
            <li><Link className="hover:underline" href="/#packages">{t.nav.packages}</Link></li>
            <li><Link className="hover:underline" href="/send">{t.hero.ctaSend}</Link></li>
            <li><Link className="hover:underline" href="/#pricing">{t.nav.pricing}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4 text-white/70">{t.footer.company}</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:underline" href="/pilot">{t.nav.join}</Link></li>
            <li><Link className="hover:underline" href="/partners">{t.hero.ctaPartner}</Link></li>
            <li><Link className="hover:underline" href="/privacy">{t.footer.privacy}</Link></li>
            <li><Link className="hover:underline" href="/terms">{t.footer.terms}</Link></li>
            <li><Link className="hover:underline" href="/pilot-disclosure">{t.footer.disclosure}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/75 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>© {year} 8Mealz. {t.footer.rights}</span>
          {SITE.showFoundationCredit && <span>A Foundation For Fogo initiative</span>}
        </div>
      </div>
    </footer>
  );
}
