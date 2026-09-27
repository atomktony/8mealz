"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { checkMembership, createOrder } from "@/app/actions";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { EXTRAS, NEIGHBORHOODS, PACKAGES, findExtra, findPackage } from "@/lib/data";
import { formatMoney, quote } from "@/lib/pricing";
import { ExtraIcon } from "./ExtraIcon";
import { FieldError } from "./forms/Field";

type Details = {
  sender_name: string;
  sender_email: string;
  sender_whatsapp: string;
  recipient_name: string;
  recipient_whatsapp: string;
  neighborhood: string;
  pickup_date: string;
  dietary_notes: string;
};

const EMPTY: Details = {
  sender_name: "",
  sender_email: "",
  sender_whatsapp: "",
  recipient_name: "",
  recipient_whatsapp: "+238 ",
  neighborhood: NEIGHBORHOODS[0],
  pickup_date: "",
  dietary_notes: "",
};

const PHONE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SendFlow() {
  const { t, lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const { cart, addExtra, setQty, clearCart } = useStore();

  const [step, setStep] = useState(0);
  const [pkgId, setPkgId] = useState(() => {
    const q = params.get("package");
    return q && findPackage(q) ? q : PACKAGES[0].id;
  });
  const [d, setD] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [member, setMember] = useState(false);
  const [pending, start] = useTransition();

  const pkg = findPackage(pkgId)!;
  const extrasTotal = cart.reduce((s, l) => s + (findExtra(l.id)?.price ?? 0) * l.qty, 0);
  const q = useMemo(() => quote(pkg.price + extrasTotal, !member), [pkg.price, extrasTotal, member]);

  const minDate = useMemo(() => {
    const x = new Date();
    x.setDate(x.getDate() + 1);
    return x.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (step === 3 && EMAIL.test(d.sender_email)) checkMembership(d.sender_email).then(setMember);
  }, [step, d.sender_email]);

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setD((p) => ({ ...p, [k]: e.target.value }));

  function validateDetails() {
    const er: Record<string, string> = {};
    if (!d.sender_name.trim()) er.sender_name = "required";
    if (!EMAIL.test(d.sender_email.trim())) er.sender_email = d.sender_email ? "invalid" : "required";
    if (!PHONE.test(d.sender_whatsapp.trim())) er.sender_whatsapp = d.sender_whatsapp ? "invalid" : "required";
    if (!d.recipient_name.trim()) er.recipient_name = "required";
    if (!PHONE.test(d.recipient_whatsapp.trim()) || d.recipient_whatsapp.trim() === "+238") er.recipient_whatsapp = "invalid";
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  function next() {
    if (step === 2 && !validateDetails()) return;
    setStep((s) => Math.min(3, s + 1));
  }

  function submit() {
    start(async () => {
      const res = await createOrder({
        package_id: pkgId,
        extras: cart.map((l) => ({ id: l.id, qty: l.qty })),
        ...d,
        lang,
      });
      if (res.ok) {
        clearCart();
        router.push(`/order/${res.code}`);
      } else {
        setErrors(res.errors);
        if (Object.keys(res.errors).some((k) => k in EMPTY)) setStep(2);
      }
    });
  }

  const field = (k: keyof Details, label: string, type = "text", extra: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`f-${k}`} className="label">{label}</label>
      <input id={`f-${k}`} type={type} value={d[k]} onChange={set(k)} className="input" aria-invalid={!!errors[k]} {...extra} />
      <FieldError error={errors[k]} />
    </div>
  );

  return (
    <div className="bg-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep hover:text-brand-red">
          <ArrowLeft className="h-4 w-4" /> {t.send.back}
        </Link>
        <h1 className="h-display mt-4 text-3xl text-brand-deep sm:text-4xl">{t.send.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{t.send.sub}</p>

        <ol className="mt-8 flex gap-2 text-xs font-semibold sm:gap-4" aria-label="Steps">
          {t.send.steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  i < step ? "bg-brand-teal-dark text-white" : i === step ? "bg-brand-red text-white" : "bg-white text-slate-400"
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`hidden sm:inline ${i === step ? "text-brand-deep" : "text-slate-500"}`}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            {step === 0 && (
              <fieldset>
                <legend className="h-display text-xl text-brand-deep">{t.send.choosePkg}</legend>
                <div className="mt-5 space-y-3">
                  {PACKAGES.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer gap-4 rounded-2xl border-2 p-4 transition ${
                        pkgId === p.id ? "border-brand-red bg-red-50/40" : "border-slate-200 hover:border-brand-teal"
                      }`}
                    >
                      <input type="radio" name="pkg" value={p.id} checked={pkgId === p.id} onChange={() => setPkgId(p.id)} className="mt-1 accent-[#a5182d]" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-bold text-brand-deep">{p.name[lang]}</span>
                          <span className="font-extrabold text-brand-deep">{formatMoney(p.price)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{p.description[lang]}</p>
                        <p className="mt-2 text-xs text-slate-500">{p.items.join(" · ")}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div>
                <h2 className="h-display text-xl text-brand-deep">{t.packages.extrasTitle}</h2>
                <p className="mt-1 text-sm text-slate-600">{t.send.extrasHint}</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {EXTRAS.map((e) => {
                    const qty = cart.find((l) => l.id === e.id)?.qty ?? 0;
                    return (
                      <li key={e.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-teal-dark">
                          <ExtraIcon icon={e.icon} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-brand-deep">{e.name[lang]}</p>
                          <p className="text-xs text-slate-500">{e.unit[lang]} · {formatMoney(e.price)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setQty(e.id, qty - 1)} disabled={qty === 0} className="rounded-full p-1.5 hover:bg-brand-cream disabled:opacity-30" aria-label={`- ${e.name[lang]}`}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold" aria-live="polite">{qty}</span>
                          <button type="button" onClick={() => addExtra(e.id)} className="rounded-full p-1.5 hover:bg-brand-cream" aria-label={`+ ${e.name[lang]}`}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="h-display text-xl text-brand-deep">{t.send.you}</legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {field("sender_name", `${t.send.senderName} *`, "text", { autoComplete: "name" })}
                    {field("sender_email", `${t.send.senderEmail} *`, "email", { autoComplete: "email" })}
                    {field("sender_whatsapp", `${t.send.senderWhatsapp} *`, "tel", { placeholder: "+351 912 345 678", autoComplete: "tel" })}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="h-display text-xl text-brand-deep">{t.send.family}</legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {field("recipient_name", `${t.send.recipientName} *`)}
                    {field("recipient_whatsapp", `${t.send.recipientWhatsapp} *`, "tel", { placeholder: "+238 991 23 45" })}
                    <div>
                      <label htmlFor="f-neighborhood" className="label">{t.send.neighborhood} *</label>
                      <select id="f-neighborhood" value={d.neighborhood} onChange={set("neighborhood")} className="input">
                        {NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    {field("pickup_date", t.send.pickupDate, "date", { min: minDate })}
                    <div className="sm:col-span-2">
                      <label htmlFor="f-notes" className="label">{t.send.notes}</label>
                      <textarea id="f-notes" rows={3} value={d.dietary_notes} onChange={set("dietary_notes")} placeholder={t.send.notesPh} className="input" />
                    </div>
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="h-display text-xl text-brand-deep">{t.send.steps[3]}</h2>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-brand-cream p-4">
                    <dt className="text-xs font-semibold uppercase text-slate-500">{t.send.you}</dt>
                    <dd className="mt-1 font-semibold text-brand-deep">{d.sender_name}</dd>
                    <dd className="text-slate-600">{d.sender_email}</dd>
                    <dd className="text-slate-600">{d.sender_whatsapp}</dd>
                  </div>
                  <div className="rounded-2xl bg-brand-cream p-4">
                    <dt className="text-xs font-semibold uppercase text-slate-500">{t.send.family}</dt>
                    <dd className="mt-1 font-semibold text-brand-deep">{d.recipient_name}</dd>
                    <dd className="text-slate-600">{d.recipient_whatsapp}</dd>
                    <dd className="text-slate-600">{d.neighborhood}{d.pickup_date ? ` · ${d.pickup_date}` : ""}</dd>
                  </div>
                  {d.dietary_notes && (
                    <div className="rounded-2xl bg-brand-cream p-4 sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase text-slate-500">{t.send.notes}</dt>
                      <dd className="mt-1 text-slate-700">{d.dietary_notes}</dd>
                    </div>
                  )}
                </dl>
                {errors._form && <p className="field-error mt-4">{t.common.error}</p>}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-white !normal-case ring-1 ring-slate-200">
                  {t.send.prev}
                </button>
              ) : <span />}
              {step < 3 ? (
                <button type="button" onClick={next} className="btn-red">{t.send.next}</button>
              ) : (
                <button type="button" onClick={submit} disabled={pending} className="btn-red">
                  {pending ? t.send.reserving : t.send.reserve}
                </button>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-28" aria-label={t.send.summary}>
            <h2 className="h-display text-lg text-brand-deep">{t.send.summary}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between gap-3">
                <span>{pkg.name[lang]}</span>
                <span className="font-semibold">{formatMoney(pkg.price)}</span>
              </li>
              {cart.map((l) => {
                const e = findExtra(l.id)!;
                return (
                  <li key={l.id} className="flex justify-between gap-3 text-slate-600">
                    <span>{l.qty} × {e.name[lang]}</span>
                    <span>{formatMoney(e.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><dt>{t.send.groceries}</dt><dd>{formatMoney(q.groceries)}</dd></div>
              <div className="flex justify-between"><dt>{t.send.serviceFee}</dt><dd>{formatMoney(q.serviceFee)}</dd></div>
              <div className="flex justify-between">
                <dt>{member ? t.send.membershipActive : t.send.membership}</dt>
                <dd>{formatMoney(q.membershipFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-brand-deep">
                <dt>{t.send.total}</dt><dd>{formatMoney(q.total)}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{t.send.payNote}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
