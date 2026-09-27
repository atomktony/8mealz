import "server-only"
import type { OrderTotals } from "./pricing"

// Demo-mode store. When Supabase is connected, swap these functions for real
// queries. Without it, data lives in server memory and resets on redeploy.
// A single module-level object survives across requests in a warm server.

export type OrderStatus = "reserved" | "confirmed" | "ready" | "collected"

export type Order = {
  id: string
  code: string
  packageId: string
  extraIds: string[]
  senderName: string
  senderEmail: string
  recipientName: string
  recipientPhone: string
  neighborhoodId: string
  notes: string
  totals: OrderTotals
  status: OrderStatus
  createdAt: string
}

export type Signup = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  createdAt: string
}

export type Partner = {
  id: string
  business: string
  contact: string
  email: string
  phone: string
  neighborhood: string
  message: string
  createdAt: string
}

type DB = {
  orders: Map<string, Order>
  signups: Signup[]
  partners: Partner[]
  votes: Map<string, number>
  membershipByEmail: Map<string, number> // email -> year membership was charged
}

// Persist across hot reloads / warm invocations via globalThis.
const g = globalThis as unknown as { __mealzDB?: DB }
const db: DB =
  g.__mealzDB ??
  (g.__mealzDB = {
    orders: new Map(),
    signups: [],
    partners: [],
    votes: new Map(),
    membershipByEmail: new Map(),
  })

export function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY
}

function id(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function generatePickupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `8M-${out}`
}

// Membership is charged once per sender email per calendar year.
export function membershipApplies(email: string): boolean {
  const year = new Date().getFullYear()
  return db.membershipByEmail.get(email.toLowerCase()) !== year
}

export function markMembershipCharged(email: string): void {
  db.membershipByEmail.set(email.toLowerCase(), new Date().getFullYear())
}

export function createOrder(input: Omit<Order, "id" | "code" | "status" | "createdAt">): Order {
  const order: Order = {
    ...input,
    id: id(),
    code: generatePickupCode(),
    status: "reserved",
    createdAt: new Date().toISOString(),
  }
  db.orders.set(order.code, order)
  if (order.totals.membership > 0) markMembershipCharged(order.senderEmail)
  return order
}

export function getOrderByCode(code: string): Order | undefined {
  return db.orders.get(code.toUpperCase())
}

export function listOrders(): Order[] {
  return [...db.orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function updateOrderStatus(code: string, status: OrderStatus): Order | undefined {
  const order = db.orders.get(code.toUpperCase())
  if (!order) return undefined
  order.status = status
  return order
}

export function createSignup(input: Omit<Signup, "id" | "createdAt">): Signup {
  const s: Signup = { ...input, id: id(), createdAt: new Date().toISOString() }
  db.signups.unshift(s)
  return s
}

export function listSignups(): Signup[] {
  return db.signups
}

export function createPartner(input: Omit<Partner, "id" | "createdAt">): Partner {
  const p: Partner = { ...input, id: id(), createdAt: new Date().toISOString() }
  db.partners.unshift(p)
  return p
}

export function listPartners(): Partner[] {
  return db.partners
}

export function addVote(countryId: string): void {
  db.votes.set(countryId, (db.votes.get(countryId) ?? 0) + 1)
}

export function getVotes(): Record<string, number> {
  return Object.fromEntries(db.votes)
}
