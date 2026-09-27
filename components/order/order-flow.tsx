"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Field, Honeypot, Input, Select, Textarea } from "../ui/field"
import { useLang } from "@/lib/i18n"
import { packages, extras, neighborhoods, getPackage, getExtra } from "@/lib/data"
import { computeTotals, formatMoney } from "@/lib/pricing"
import { placeOrder, type ActionResult } from "@/app/actions"

type Step = 0 | 1 | 2

export function OrderFlow() {
  const { t } = useLang()
  const router = useRouter()
  const params = useSearchParams()
  const initialPkg = params.get("pkg")

  const [step, setStep] = useState<Step>(0)
  const [packageId, setPackageId] = useState(
    initialPkg && getPackage(initialPkg) ? initialPkg : packages[1].id,
  )
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientPhone: "",
    neighborhoodId: "",
    notes: "",
    website: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const totals = useMemo(() => {
    const pkg = getPackage(packageId)
    const items = pkg ? [{ label: pkg.name, price: pkg.price }] : []
    for (const id of extraIds) {
      const extra = getExtra(id)
      if (extra) items.push({ label: extra.name, price: extra.price })
    }
    return computeTotals(items, true)
  }, [packageId, extraIds])

  function toggleExtra(id: string) {
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validateDetails(): boolean {
    const errs: Record<string, string> = {}
    if (!form.senderName.trim()) errs.senderName = t.order.errRequired
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.senderEmail)) errs.senderEmail = t.order.errEmail
    if (!form.recipientName.trim()) errs.recipientName = t.order.errRequired
    if (!form.recipientPhone.trim()) errs.recipientPhone = t.order.errRequired
    if (!form.neighborhoodId) errs.neighborhoodId = t.order.errRequired
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function submit() {
    setError("")
    startTransition(async () => {
      const res: ActionResult<{ code: string }> = await placeOrder({
        packageId,
        extraIds,
        ...form,
      })
      if (res.ok && res.data) {
        router.push(`/order/${res.data.code}`)
      } else if (!res.ok) {
        setError(res.error)
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors)
          setStep(1)
        }
      }
    })
  }

  const steps = [t.order.step1, t.order.step2, t.order.step3]

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-8 flex items-center gap-2 text-sm">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-700",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={i === step ? "font-600 text-foreground" : "text-muted-foreground"}>{label}</span>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-lg font-700">{t.order.choosePackage}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {packages.map((pkg) => {
                  const active = pkg.id === packageId
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setPackageId(pkg.id)}
                      className={[
                        "rounded-xl border p-4 text-left transition-colors",
                        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-700">{pkg.name}</span>
                        <span className="font-heading font-700 text-primary">{formatMoney(pkg.price)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.order.serves} {pkg.serves} · {pkg.feeds}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-lg font-700">{t.order.addExtras}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {extras.map((extra) => {
                  const active = extraIds.includes(extra.id)
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra.id)}
                      className={[
                        "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
                        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <span>
                        <span className="block text-sm font-600">{extra.name}</span>
                        <span className="block text-xs text-muted-foreground">{extra.note}</span>
                      </span>
                      <span className="ml-3 flex items-center gap-2">
                        <span className="font-heading text-sm font-700 text-primary">{formatMoney(extra.price)}</span>
                        <span
                          className={[
                            "flex h-5 w-5 items-center justify-center rounded-md border",
                            active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                          ].join(" ")}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <Button onClick={() => setStep(1)} size="lg">
              {t.order.continue}
            </Button>
          </div>
        )}

        {step === 1 && (
          <form
            className="relative space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (validateDetails()) setStep(2)
            }}
          >
            <Honeypot />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.order.senderName} htmlFor="senderName" error={fieldErrors.senderName}>
                <Input id="senderName" value={form.senderName} onChange={(e) => set("senderName", e.target.value)} autoComplete="name" />
              </Field>
              <Field label={t.order.senderEmail} htmlFor="senderEmail" error={fieldErrors.senderEmail}>
                <Input id="senderEmail" type="email" value={form.senderEmail} onChange={(e) => set("senderEmail", e.target.value)} autoComplete="email" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.order.recipientName} htmlFor="recipientName" error={fieldErrors.recipientName}>
                <Input id="recipientName" value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)} />
              </Field>
              <Field label={t.order.recipientPhone} htmlFor="recipientPhone" error={fieldErrors.recipientPhone}>
                <Input id="recipientPhone" type="tel" value={form.recipientPhone} onChange={(e) => set("recipientPhone", e.target.value)} />
              </Field>
            </div>
            <Field label={t.order.neighborhood} htmlFor="neighborhoodId" error={fieldErrors.neighborhoodId}>
              <Select
                id="neighborhoodId"
                value={form.neighborhoodId}
                onChange={(e) => set("neighborhoodId", e.target.value)}
              >
                <option value="" disabled>
                  {t.order.selectNeighborhood}
                </option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}, {n.city}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.order.notes} htmlFor="notes" hint={t.order.notesHint}>
              <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </Field>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                {t.order.back}
              </Button>
              <Button type="submit">{t.order.review}</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-700">{t.order.deliverTo}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t.order.recipientName}</dt>
                  <dd className="font-600">{form.recipientName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.order.recipientPhone}</dt>
                  <dd className="font-600">{form.recipientPhone}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.order.neighborhood}</dt>
                  <dd className="font-600">{neighborhoods.find((n) => n.id === form.neighborhoodId)?.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.order.senderEmail}</dt>
                  <dd className="font-600">{form.senderEmail}</dd>
                </div>
              </dl>
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={pending}>
                {t.order.back}
              </Button>
              <Button type="button" onClick={submit} size="lg" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                {pending ? t.common.sending : t.order.placeOrder}
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg font-700">{t.order.summary}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {totals.lines.map((line) => (
              <li key={line.label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{line.label}</span>
                <span className="font-600">{formatMoney(line.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.order.subtotal}</span>
              <span className="font-600">{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.order.serviceFee}</span>
              <span className="font-600">{formatMoney(totals.serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.order.membership}</span>
              <span className="font-600">{formatMoney(totals.membership)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading font-700">{t.order.total}</span>
            <span className="font-heading text-xl font-700 text-primary">{formatMoney(totals.total)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t.order.membershipHint}</p>
        </div>
      </aside>
    </div>
  )
}
