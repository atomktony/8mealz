import "server-only"
import { cookies } from "next/headers"
import type { Order } from "./store"

// Serverless instances do not share the in-memory store, so the order placed
// on one instance would 404 on the confirmation page served by another. The
// placing browser keeps a copy of its own recent orders in an httpOnly cookie
// so the confirmation page can always render them.

const COOKIE = "mealz_orders"
const MAX_ORDERS = 3
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

function decode(raw: string | undefined): Order[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"))
    return Array.isArray(parsed) ? (parsed as Order[]) : []
  } catch {
    return []
  }
}

export async function rememberOrder(order: Order): Promise<void> {
  const store = await cookies()
  const existing = decode(store.get(COOKIE)?.value).filter((o) => o.code !== order.code)
  const next = [order, ...existing].slice(0, MAX_ORDERS)
  store.set(COOKIE, Buffer.from(JSON.stringify(next)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/order",
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function recallOrder(code: string): Promise<Order | undefined> {
  const store = await cookies()
  return decode(store.get(COOKIE)?.value).find((o) => o.code === code)
}
