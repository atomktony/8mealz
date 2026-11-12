"use client"

import { useMemo, useState, useTransition, type FormEvent } from "react"
import { ArrowDown, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Field, Input, Select, Textarea } from "../ui/field"
import { PackagePicker } from "./package-picker"
import { ExtrasPicker } from "./extras-picker"
import { OrderSummary } from "./order-summary"
import { ReservationConfirmed } from "./reservation-confirmed"
import { useLang } from "@/lib/i18n"
import { extras, getExtra, getPackage, neighborhoods, packages, type Extra } from "@/lib/data"
import { computeTotals } from "@/lib/pricing"
import { Price } from "../ui/price"
import { placeOrder } from "@/app/actions"

const emptyForm = {
  senderName: "",
  senderPhone: "",
  recipientName: "",
  recipientPhone: "",
  neighborhoodId: "",
  notes: "",
  website: "",
}

type FormState = typeof emptyForm

function isValidPhone(value: string): boolean {
  return /^\+?[\d\s().-]{7,20}$/.test(value.trim()) && value.replace(/\D/g, "").length >= 7
}

export function SendFlow({ initialPackageId }: { initialPackageId: string }) {
  const { t, lang } = useLang()
  const [packageId, setPackageId] = useState(initialPackageId)
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const pkg = getPackage(packageId) ?? packages[0]
  const selectedExtras = useMemo(
    () => extras.filter((extra) => extraIds.includes(extra.id)),
    [extraIds],
  )
  const totals = useMemo(
    () =>
      computeTotals(
        [{ label: pkg.name, price: pkg.price }, ...selectedExtras.map((e: Extra) => ({ label: e.name, price: e.price }))],
        false,
      ),
    [pkg, selectedExtras],
  )

  function toggleExtra(id: string) {
    if (!getExtra(id)) return
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }))
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (!form.senderName.trim()) errs.senderName = t.order.errRequired
    if (!isValidPhone(form.senderPhone)) errs.senderPhone = form.senderPhone.trim() ? t.order.errPhone : t.order.errRequired
    if (!form.recipientName.trim()) errs.recipientName = t.order.errRequired
    if (!isValidPhone(form.recipientPhone))
      errs.recipientPhone = form.recipientPhone.trim() ? t.order.errPhone : t.order.errRequired
    if (!form.neighborhoodId) errs.neighborhoodId = t.order.errRequired
    return errs
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const errs = validate()
    setFieldErrors(errs)
    const firstInvalid = Object.keys(errs)[0]
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    startTransition(async () => {
      const res = await placeOrder({ packageId: pkg.id, extraIds, ...form }, lang)
      if (res.ok && res.data) {
        setConfirmedCode(res.data.code)
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      if (!res.ok) {
        setError(res.error)
        if (res.fieldErrors) setFieldErrors(res.fieldErrors)
      }
    })
  }

  function reset() {
    setConfirmedCode(null)
    setForm(emptyForm)
    setExtraIds([])
    setFieldErrors({})
    setError("")
  }

  // Keep the sender's details so they only enter the second household's.
  function startSecondFamily() {
    setConfirmedCode(null)
    setForm((prev) => ({ ...emptyForm, senderName: prev.senderName, senderPhone: prev.senderPhone }))
    setExtraIds([])
    setFieldErrors({})
    setError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (confirmedCode)
    return <ReservationConfirmed code={confirmedCode} onReset={reset} onSecondFamily={startSecondFamily} />

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-10">
          <PackagePicker value={pkg.id} onChange={setPackageId} />
          <ExtrasPicker value={extraIds} onToggle={toggleExtra} />
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <OrderSummary pkg={pkg} selectedExtras={selectedExtras} totals={totals} />

          <form
            id="reserve-details"
            onSubmit={handleSubmit}
            noValidate
            className="relative flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="font-heading text-lg font-700">{t.order.detailsTitle}</h2>
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </label>
            </div>
            <Field label={t.order.senderName} htmlFor="senderName" error={fieldErrors.senderName}>
              <Input
                id="senderName"
                value={form.senderName}
                onChange={(e) => update("senderName", e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.senderName)}
              />
            </Field>
            <Field label={t.order.senderPhone} htmlFor="senderPhone" error={fieldErrors.senderPhone}>
              <Input
                id="senderPhone"
                type="tel"
                inputMode="tel"
                placeholder="+351 912 345 678"
                value={form.senderPhone}
                onChange={(e) => update("senderPhone", e.target.value)}
                autoComplete="tel"
                aria-invalid={Boolean(fieldErrors.senderPhone)}
              />
            </Field>
            <Field label={t.order.recipientName} htmlFor="recipientName" error={fieldErrors.recipientName}>
              <Input
                id="recipientName"
                value={form.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
                aria-invalid={Boolean(fieldErrors.recipientName)}
              />
            </Field>
            <Field label={t.order.recipientPhone} htmlFor="recipientPhone" error={fieldErrors.recipientPhone}>
              <Input
                id="recipientPhone"
                type="tel"
                inputMode="tel"
                placeholder="+238 591 2345"
                value={form.recipientPhone}
                onChange={(e) => update("recipientPhone", e.target.value)}
                aria-invalid={Boolean(fieldErrors.recipientPhone)}
              />
            </Field>
            <Field label={t.order.neighborhood} htmlFor="neighborhoodId" error={fieldErrors.neighborhoodId}>
              <Select
                id="neighborhoodId"
                value={form.neighborhoodId}
                onChange={(e) => update("neighborhoodId", e.target.value)}
                aria-invalid={Boolean(fieldErrors.neighborhoodId)}
              >
                <option value="" disabled>
                  {t.order.selectNeighborhood}
                </option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.order.notes} htmlFor="notes" hint={t.order.notesHint}>
              <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </Field>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {pending ? t.common.sending : t.order.submit}
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">{t.order.noPayment}</p>
          </form>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-600">
              {pkg.name}
              {selectedExtras.length > 0 && ` + ${selectedExtras.length}`}
            </p>
            <p className="font-heading text-lg font-700 text-primary">
              <Price amount={totals.total} />
            </p>
          </div>
          <a
            href="#reserve-details"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 font-heading text-sm font-600 text-primary-foreground"
          >
            {t.order.toDetails}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  )
}
