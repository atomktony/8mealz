"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { BadgeCheck, CheckCircle2, LayoutDashboard, Users, Wallet } from "lucide-react";
import { submitPartner, type FormState } from "@/app/actions";
import { useLang } from "@/lib/i18n";
import { dictionaries } from "@/lib/dictionary";
import { NEIGHBORHOODS } from "@/lib/data";
import { FEES, formatWhole } from "@/lib/pricing";
import { Honeypot } from "./forms/Honeypot";
import { FieldError } from "./forms/Field";

const initial: FormState = { status: "idle" };
const ICONS = [Users, BadgeCheck, Wallet];

export function PartnersView() {
  const { t } = useLang();
  const en = dictionaries.en.partners;
  const [state, action, pending] = useActionState(submitPartner, initial);
  const e = state.errors ?? {};

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <Image src="/images/strip-fruit-market.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-brand-deep/80" />
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="eyebrow text-brand-gold">{t.partners.eyebrow}</p>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">{t.partners.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{t.partners.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#apply" className="btn-red">{t.partners.formTitle}</a>
            <Link href="/partners/demo" className="btn-outline text-white">
              <LayoutDashboard className="h-4 w-4" /> {t.partners.demo}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <ul className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {t.partners.benefits.map((b, i) => {
            const I = ICONS[i];
            return (
              <li key={b.t} className="rounded-3xl bg-brand-cream p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-dark text-white">
                  <I className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-brand-deep">{b.t}</h2>
                <p className="mt-2 text-sm text-slate-600">{b.d}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-brand-red text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="h-display text-2xl">{t.partners.fees}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { v: formatWhole(FEES.growerMonthly), l: t.pricing.grower },
              { v: formatWhole(FEES.supermarketMonthly), l: t.pricing.supermarket },
              { v: `${Math.round(FEES.platformMarkupRate * 100)}%`, l: `${t.pricing.markup} (${t.pricing.onPrices})` },
            ].map((f) => (
              <li key={f.l} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/20">
                <p className="h-display text-4xl">{f.v}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide">{f.l}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="bg-brand-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
            <h2 className="h-display text-2xl text-brand-deep">{t.partners.formTitle}</h2>
            {state.status === "ok" ? (
              <div className="py-10 text-center" role="status">
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand-teal-dark" />
                <h3 className="h-display mt-3 text-xl text-brand-deep">{t.partners.successTitle}</h3>
                <p className="mt-2 text-sm text-slate-600">{t.partners.successText}</p>
              </div>
            ) : (
              <form action={action} className="relative mt-6 space-y-4" noValidate>
                <Honeypot />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="p-store" className="label">{t.partners.storeName} *</label>
                    <input id="p-store" name="store_name" className="input" aria-invalid={!!e.store_name} />
                    <FieldError error={e.store_name} />
                  </div>
                  <div>
                    <label htmlFor="p-owner" className="label">{t.partners.ownerName} *</label>
                    <input id="p-owner" name="owner_name" className="input" autoComplete="name" aria-invalid={!!e.owner_name} />
                    <FieldError error={e.owner_name} />
                  </div>
                  <div>
                    <label htmlFor="p-hood" className="label">{t.partners.neighborhood} *</label>
                    <select id="p-hood" name="neighborhood" className="input">
                      {NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="p-type" className="label">{t.partners.storeType} *</label>
                    <select id="p-type" name="store_type" className="input">
                      {en.types.map((v, i) => <option key={v} value={v}>{t.partners.types[i]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="p-wa" className="label">{t.partners.whatsapp} *</label>
                    <input id="p-wa" name="whatsapp" type="tel" placeholder="+238 991 23 45" className="input" aria-invalid={!!e.whatsapp} />
                    <FieldError error={e.whatsapp} />
                  </div>
                  <label className="flex items-center gap-3 self-end rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm">
                    <input type="checkbox" name="has_refrigeration" className="h-4 w-4 accent-[#367e7b]" />
                    {t.partners.fridge}
                  </label>
                  <div className="sm:col-span-2">
                    <label htmlFor="p-notes" className="label">{t.partners.notes}</label>
                    <textarea id="p-notes" name="notes" rows={3} className="input" />
                  </div>
                </div>
                {e._form && <p className="field-error">{t.common.error}</p>}
                <button type="submit" disabled={pending} className="btn-red w-full">
                  {pending ? "..." : t.partners.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
