"use server"

import { z } from "zod"
import { getExtra, getNeighborhood, getPackage } from "@/lib/data"
import { computeTotals } from "@/lib/pricing"
import {
  addVote,
  createOrder,
  createPartner,
  createSignup,
  membershipApplies,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/store"
import { revalidatePath } from "next/cache"

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
  createPartner(data)
  return { ok: true }
}

const voteSchema = z.object({ countryId: required })

export async function submitVote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = voteSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: "Pick a country" }
  addVote(parsed.data.countryId)
  return { ok: true }
}

const orderSchema = z.object({
  packageId: required,
  extraIds: z.array(z.string()).default([]),
  senderName: required,
  senderEmail: email,
  recipientName: required,
  recipientPhone: required,
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
  const items = [{ label: pkg.name, price: pkg.price }]
  for (const id of data.extraIds) {
    const extra = getExtra(id)
    if (extra) items.push({ label: extra.name, price: extra.price })
  }
  const includeMembership = membershipApplies(data.senderEmail)
  const totals = computeTotals(items, includeMembership)

  const order = createOrder({
    packageId: data.packageId,
    extraIds: data.extraIds.filter((id) => getExtra(id)),
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    recipientName: data.recipientName,
    recipientPhone: data.recipientPhone,
    neighborhoodId: data.neighborhoodId,
    notes: data.notes,
    totals,
  })

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
