"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const { cartCount, setCartOpen, setPilotOpen } = useStore();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#how-it-works", label: t.nav.how },
    { href: "/#packages", label: t.nav.packages },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/partners", label: t.nav.partners },
  ];

  const LangToggle = (
    <div className="flex rounded-full border border-slate-200 p-0.5 text-xs font-bold" role="group" aria-label="Language">
      {(["en", "pt"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition ${lang === l ? "bg-brand-deep text-white" : "text-brand-deep hover:bg-brand-cream"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" aria-label="8Mealz home" onClick={() => setOpen(false)}>
          <Logo className="h-10 w-auto" priority />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-semibold text-brand-deep hover:text-brand-red transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">{LangToggle}</div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full p-2.5 text-brand-deep hover:bg-brand-cream transition"
            aria-label={`${t.nav.basket} (${cartCount})`}
          >
            <ShoppingBasket className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setPilotOpen(true)} className="btn-red hidden !px-5 !py-2.5 !text-xs sm:inline-flex">
            {t.nav.join}
          </button>
          <button
            className="rounded-full p-2.5 text-brand-deep hover:bg-brand-cream lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t.nav.menu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-100 bg-white px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-slate-100 py-3.5 text-base font-semibold text-brand-deep"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between gap-3">
            {LangToggle}
            <Link href="/pilot" onClick={() => setOpen(false)} className="btn-red !py-2.5">
              {t.nav.join}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
