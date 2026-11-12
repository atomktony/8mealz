"use server"

import { z } from "zod"
import { getExtra, getNeighborhood, getPackage } from "@/lib/data"
import { computeTotals } from "@/lib/pricing"
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

// Shared honeypot: real users leave this empty. Bots fill it.
const honeypot = z.string().optional()

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const email = z.string().trim().email("Enter a valid email")
const required = z.string().trim().min(1, "This field is required")

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of err.issues) {
    const key = issue.path[0]
    if (typeof key === "string" && !out[key]) out[key] = issue.message
  }
  return out
}

const pilotSchema = z.object({
  name: required,
  email,
  phone: required,
  city: required,
  website: honeypot,
})

export async function submitPilot(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = pilotSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: "Please check the form", fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: true } // silently drop bots
  const { website, ...data } = parsed.data
  try {
    await createPilotSignupRecord(data)
  } catch (err) {
    console.error("Pilot signup failed to reach Airtable:", err)
    return { ok: false, error: "Something went wrong. Please try again." }
  }
  createSignup(data)
  return { ok: true }
}

const partnerSchema = z.object({
  business: required,
  contact: required,
  email,
  phone: required,
  neighborhood: required,
  message: z.string().trim().optional().default(""),
  website: honeypot,
})

export async function submitPartner(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = partnerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: "Please check the form", fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: true }
  const { website, ...data } = parsed.data
  const partner = createPartner(data)
  try {
    await sendPartnerNotification(partner)
  } catch (err) {
    console.error("Partner application email failed:", err)
    return { ok: false, error: "Something went wrong. Please try again." }
  }
  return { ok: true }
}

const voteSchema = z.object({ countryId: required })

export async function submitVote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = voteSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: "Pick a country" }
  addVote(parsed.data.countryId)
  return { ok: true }
}

const whatsapp = z
  .string()
  .trim()
  .regex(/^\+?[\d\s().-]{7,20}$/, "Enter a valid WhatsApp number")
  .refine((value) => value.replace(/\D/g, "").length >= 7, "Enter a valid WhatsApp number")

const orderSchema = z.object({
  packageId: required,
  extraIds: z.array(z.string()).max(10).default([]),
  senderName: required,
  senderPhone: whatsapp,
  recipientName: required,
  recipientPhone: whatsapp,
  neighborhoodId: required,
  notes: z.string().trim().optional().default(""),
  website: honeypot,
})

export type PlaceOrderInput = z.infer<typeof orderSchema>

export async function placeOrder(input: PlaceOrderInput): Promise<ActionResult<{ code: string }>> {
  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Please check the form", fieldErrors: fieldErrors(parsed.error) }
  if (parsed.data.website) return { ok: false, error: "Rejected" }

  const data = parsed.data
  const pkg = getPackage(data.packageId)
  if (!pkg) return { ok: false, error: "Unknown package" }
  if (!getNeighborhood(data.neighborhoodId)) return { ok: false, error: "Unknown neighborhood" }

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
    return { ok: false, error: "We couldn't submit your order. Please try again." }
  }

  await rememberOrder(order)
  return { ok: true, data: { code: order.code } }
}

const statusValues = ["reserved", "confirmed", "ready", "collected"] as const
const statusSchema = z.object({
  code: required,
  status: z.enum(statusValues),
})

export async function setOrderStatus(formData: FormData): Promise<void> {
  const parsed = statusSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  updateOrderStatus(parsed.data.code, parsed.data.status as OrderStatus)
  revalidatePath("/admin")
}
