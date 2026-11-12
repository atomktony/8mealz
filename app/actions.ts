"use server"

import { z } from "zod"
import { getExtra, getNeighborhood, getPackage } from "@/lib/data"
import { computeTotals } from "@/lib/pricing"
import { dictionary, type Lang } from "@/lib/dictionary"
import {
  addVote,
  createOrder,
  createPartner,
  createSignup,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/store"
import { revalidatePath } from "next/cache"
import { createPilotSignupRecord } from "@/lib/airtable"
import { sendOrderNotification, sendPartnerNotification } from "@/lib/email"
import { rememberOrder } from "@/lib/order-session"

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

type Messages = (typeof dictionary)["en"]["errors"]

// Forms send the visitor's current language so errors come back in it.
function messagesFor(lang: unknown): Messages {
  return dictionary[(lang === "pt" ? "pt" : "en") as Lang].errors
}

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of err.issues) {
    const key = issue.path[0]
    if (typeof key === "string" && !out[key]) out[key] = issue.message
  }
  return out
}

function fields(m: Messages) {
  // An unselected <select> omits the field entirely, so cover "missing" too.
  const text = () => z.string({ required_error: m.required, invalid_type_error: m.required })
  const required = text().trim().min(1, m.required)
  return {
    // Shared honeypot: real users leave this empty. Bots fill it.
    honeypot: z.string().optional(),
    required,
    email: text().trim().min(1, m.required).email(m.invalidEmail),
    whatsapp: text()
      .trim()
      .min(1, m.required)
      .regex(/^\+?[\d\s().-]{7,20}$/, m.invalidPhone)
      .refine((value) => value.replace(/\D/g, "").length >= 7, m.invalidPhone),
  }
}

export async function submitPilot(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const m = messagesFor(formData.get("lang"))
  const f = fields(m)
  const parsed = z
    .object({ name: f.required, email: f.email, phone: f.required, city: f.required, website: f.honeypot })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: m.checkForm, fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: true } // silently drop bots
  const { website, ...data } = parsed.data
  try {
    await createPilotSignupRecord(data)
  } catch (err) {
    console.error("Pilot signup failed to reach Airtable:", err)
    return { ok: false, error: m.somethingWrong }
  }
  createSignup(data)
  return { ok: true }
}

export async function submitPartner(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const m = messagesFor(formData.get("lang"))
  const f = fields(m)
  const parsed = z
    .object({
      business: f.required,
      contact: f.required,
      email: f.email,
      phone: f.required,
      neighborhood: f.required,
      message: z.string().trim().optional().default(""),
      website: f.honeypot,
    })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: m.checkForm, fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: true }
  const { website, ...data } = parsed.data
  const partner = createPartner(data)
  try {
    await sendPartnerNotification(partner)
  } catch (err) {
    console.error("Partner application email failed:", err)
    return { ok: false, error: m.somethingWrong }
  }
  return { ok: true }
}

export async function submitVote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const m = messagesFor(formData.get("lang"))
  const parsed = z.object({ countryId: fields(m).required }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: m.pickCountry }
  addVote(parsed.data.countryId)
  return { ok: true }
}

function orderSchema(m: Messages) {
  const f = fields(m)
  return z.object({
    packageId: f.required,
    extraIds: z.array(z.string()).max(10).default([]),
    senderName: f.required,
    senderPhone: f.whatsapp,
    recipientName: f.required,
    recipientPhone: f.whatsapp,
    neighborhoodId: f.required,
    notes: z.string().trim().optional().default(""),
    website: f.honeypot,
  })
}

export type PlaceOrderInput = z.input<ReturnType<typeof orderSchema>>

export async function placeOrder(input: PlaceOrderInput, lang?: Lang): Promise<ActionResult<{ code: string }>> {
  const m = messagesFor(lang)
  const parsed = orderSchema(m).safeParse(input)
  if (!parsed.success) return { ok: false, error: m.checkForm, fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: false, error: m.somethingWrong }

  const data = parsed.data
  const pkg = getPackage(data.packageId)
  if (!pkg) return { ok: false, error: m.unknownPackage }
  if (!getNeighborhood(data.neighborhoodId))
    return { ok: false, error: m.unknownNeighborhood, fieldErrors: { neighborhoodId: m.unknownNeighborhood } }

  // Recompute the price on the server from trusted data. Never trust the client.
  const extraIds = [...new Set(data.extraIds)].filter((id) => getExtra(id))
  const items = [{ label: pkg.name, price: pkg.price }]
  for (const id of extraIds) {
    const extra = getExtra(id)
    if (extra) items.push({ label: extra.name, price: extra.price })
  }
  const totals = computeTotals(items, false)

  const order = createOrder({
    packageId: data.packageId,
    extraIds,
    senderName: data.senderName,
    senderPhone: data.senderPhone,
    recipientName: data.recipientName,
    recipientPhone: data.recipientPhone,
    neighborhoodId: data.neighborhoodId,
    notes: data.notes,
    totals,
  })

  // The ops notification is the system of record for the pilot, so a failure
  // here must surface to the user instead of silently dropping the order.
  try {
    await sendOrderNotification(order)
  } catch (err) {
    console.error("Order notification email failed:", err)
    return { ok: false, error: m.orderFailed }
  }

  await rememberOrder(order)
  return { ok: true, data: { code: order.code } }
}

const statusValues = ["reserved", "confirmed", "ready", "collected"] as const
const statusSchema = z.object({
  code: z.string().trim().min(1),
  status: z.enum(statusValues),
})

export async function setOrderStatus(formData: FormData): Promise<void> {
  const parsed = statusSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  updateOrderStatus(parsed.data.code, parsed.data.status as OrderStatus)
  revalidatePath("/admin")
}
